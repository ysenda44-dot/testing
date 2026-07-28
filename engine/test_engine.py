#!/usr/bin/env python3
"""Tests for the backlog engine.  Run: python3 engine/test_engine.py

The scoring function decides what the machine works on next, unattended.
These tests pin the properties that make that safe -- mainly that nothing can
starve forever and nothing can loop forever.
"""

from __future__ import annotations

import json
import subprocess
import sys
import tempfile
import unittest
from datetime import datetime, timedelta, timezone
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
sys.path.insert(0, str(HERE))

from schema import (  # noqa: E402
    ValidationError,
    dedupe_key,
    make_item,
    parse_intake_line,
    similarity,
    split_intake,
    validate,
)
from score import explain, rank, score  # noqa: E402

NOW = datetime(2026, 7, 27, tzinfo=timezone.utc)


def item(**kw):
    """An item at a fixed reference time, so tests don't drift with the clock."""
    created = kw.pop("created_at", NOW.isoformat())
    it = make_item(kw.pop("title", "t"), **kw)
    it["created_at"] = created
    it["updated_at"] = created
    return it


class TestDedupe(unittest.TestCase):
    def test_japanese_spacing_ignored(self):
        # The bug that motivated bigram tokenising: Japanese has no word
        # boundaries, so whitespace-based tokens made these look distinct.
        self.assertEqual(
            dedupe_key("AGENTS.md を実績に基づいて磨き上げる"),
            dedupe_key("AGENTS.mdを実績に基づいて磨き上げる"),
        )

    def test_word_order_ignored(self):
        self.assertEqual(dedupe_key("fix the login bug"), dedupe_key("bug login fix"))

    def test_distinct_titles_differ(self):
        self.assertNotEqual(dedupe_key("経費精算を出す"), dedupe_key("PR をマージする"))

    def test_similarity_separates_near_from_unrelated(self):
        near = similarity("会話ログから毎日スキルを蒸留する",
                          "会話ログから日次でスキルを蒸留する")
        far = similarity("PR をマージする", "経費精算を提出する")
        self.assertGreater(near, 0.5)
        self.assertLess(far, 0.2)
        self.assertGreater(near, far)

    def test_empty_title_does_not_crash(self):
        self.assertTrue(dedupe_key("!!!"))


class TestIntakeParsing(unittest.TestCase):
    """INBOX.md is the surface a human types into, so it must forgive."""

    def test_bare_line_works(self):
        got = parse_intake_line("- 領収書をまとめて経費精算する")
        self.assertEqual(got["title"], "領収書をまとめて経費精算する")
        self.assertNotIn("value", got)  # unannotated means "use the default"

    def test_bangs_raise_value(self):
        self.assertEqual(parse_intake_line("- ! いそぎ")["value"], 4)
        self.assertEqual(parse_intake_line("- !! もっといそぎ")["value"], 5)

    def test_question_mark_means_investigate_only(self):
        self.assertEqual(parse_intake_line("- ? 上げるべきか調べて")["autonomy"], "ask")

    def test_tags_and_effort_and_due(self):
        got = parse_intake_line("- 掃除する #家事 #週末 (effort:1) (due:2026-08-31)")
        self.assertEqual(got["title"], "掃除する")
        self.assertEqual(got["tags"], ["家事", "週末"])
        self.assertEqual(got["effort"], 1)
        self.assertTrue(got["due"].startswith("2026-08-31"))

    def test_issue_reference_is_not_a_tag(self):
        # "#1" is part of what the user wrote, not a label. Eating it changed
        # the title enough to defeat duplicate detection.
        got = parse_intake_line("- 停滞中の PR #1 を仕上げる")
        self.assertEqual(got["title"], "停滞中の PR #1 を仕上げる")
        self.assertNotIn("tags", got)

    def test_non_bullets_are_ignored(self):
        for line in ("", "   ", "見出しのような行", "<!-- comment -->", "- "):
            self.assertIsNone(parse_intake_line(line))

    def test_annotations_only_line_is_dropped(self):
        self.assertIsNone(parse_intake_line("- #tagonly"))

    def test_split_intake_requires_the_marker(self):
        head, lines = split_intake("no marker here\n")
        self.assertEqual(lines, [])


class TestValidation(unittest.TestCase):
    def test_rejects_out_of_range_value(self):
        with self.assertRaises(ValidationError):
            validate(item(value=9))

    def test_rejects_bad_autonomy(self):
        it = item()
        it["autonomy"] = "yolo"
        with self.assertRaises(ValidationError):
            validate(it)

    def test_blocked_requires_a_reason(self):
        it = item()
        it["status"] = "blocked"
        with self.assertRaises(ValidationError):
            validate(it)
        it["blocked_by"] = "waiting on Sato's reply"
        self.assertTrue(validate(it))


class TestScore(unittest.TestCase):
    def test_bang_for_buck(self):
        cheap = item(value=4, effort=1)
        dear = item(value=4, effort=5)
        self.assertGreater(score(cheap, ref=NOW), score(dear, ref=NOW))

    def test_low_confidence_sinks(self):
        sure = item(value=3, confidence=0.9)
        vague = item(value=3, confidence=0.2)
        self.assertGreater(score(sure, ref=NOW), score(vague, ref=NOW))

    def test_age_lifts_but_does_not_dominate(self):
        """Anti-starvation must not let a trivial old item outrank real work."""
        old_trivial = item(value=1, effort=5, confidence=0.5,
                           created_at=(NOW - timedelta(days=365)).isoformat())
        fresh_important = item(value=5, effort=1, confidence=0.9)
        self.assertGreater(score(fresh_important, ref=NOW), score(old_trivial, ref=NOW))

        young = item(value=3)
        old = item(value=3, created_at=(NOW - timedelta(days=60)).isoformat())
        self.assertGreater(score(old, ref=NOW), score(young, ref=NOW))

    def test_repeated_failure_decays(self):
        """The anti-infinite-loop property: a thrashing item must sink."""
        it = item(value=5, effort=1)
        before = score(it, ref=NOW)
        it["outcomes"] = [{"result": "failed"}, {"result": "failed"},
                          {"result": "failed"}]
        after = score(it, ref=NOW)
        self.assertLess(after, before * 0.4)

    def test_progress_resets_the_decay(self):
        it = item(value=4)
        it["outcomes"] = [{"result": "failed"}, {"result": "failed"}]
        stuck = score(it, ref=NOW)
        it["outcomes"].append({"result": "partial"})
        recovered = score(it, ref=NOW)
        self.assertGreater(recovered, stuck)

    def test_blocked_sinks_but_stays_visible(self):
        it = item(value=5, effort=1)
        open_score = score(it, ref=NOW)
        it["status"] = "blocked"
        it["blocked_by"] = "waiting on a decision"
        blocked_score = score(it, ref=NOW)
        self.assertLess(blocked_score, open_score)
        self.assertGreater(blocked_score, 0)

    def test_in_progress_is_favoured(self):
        a, b = item(value=3), item(value=3)
        b["status"] = "in_progress"
        self.assertGreater(score(b, ref=NOW), score(a, ref=NOW))

    def test_due_date_pulls_forward(self):
        no_due = item(value=3)
        due_soon = item(value=3, due=(NOW + timedelta(days=2)).isoformat())
        overdue = item(value=3, due=(NOW - timedelta(days=5)).isoformat())
        self.assertGreater(score(due_soon, ref=NOW), score(no_due, ref=NOW))
        self.assertGreater(score(overdue, ref=NOW), score(due_soon, ref=NOW))

    def test_far_future_due_date_is_neutral(self):
        neutral = item(value=3, due=(NOW + timedelta(days=200)).isoformat())
        self.assertAlmostEqual(score(neutral, ref=NOW), score(item(value=3), ref=NOW))

    def test_deterministic(self):
        """Two agents scoring the same backlog must agree, or the top churns."""
        it = item(value=4, effort=2)
        self.assertEqual(score(it, ref=NOW), score(it, ref=NOW))

    def test_explain_terms_reconstruct_the_score(self):
        it = item(value=4, effort=2, confidence=0.8, pin=0.5,
                  created_at=(NOW - timedelta(days=10)).isoformat())
        e = explain(it, ref=NOW)
        t = e["terms"]
        rebuilt = (t["base"] * t["age_boost"] * t["attempt_decay"]
                   * t["due_pressure"] * t["status_mult"]) + t["pin"]
        self.assertAlmostEqual(e["score"], rebuilt, places=3)

    def test_rank_excludes_terminal_items(self):
        a, b, c = item(title="a"), item(title="b"), item(title="c")
        b["status"] = "done"
        c["status"] = "dropped"
        ids = [i["id"] for i in rank([a, b, c], ref=NOW)]
        self.assertEqual(ids, [a["id"]])


class TestCli(unittest.TestCase):
    """End-to-end through the CLI, against a throwaway backlog directory."""

    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.repo = Path(self.tmp.name)
        (self.repo / "engine").mkdir()
        for f in ("wl.py", "score.py", "schema.py"):
            (self.repo / "engine" / f).write_bytes((HERE / f).read_bytes())
        self.addCleanup(self.tmp.cleanup)

    def wl(self, *args):
        return subprocess.run(
            [sys.executable, "engine/wl.py", *args],
            cwd=self.repo, capture_output=True, text=True,
        )

    def test_add_list_outcome_roundtrip(self):
        add = self.wl("add", "テスト項目", "--value", "4", "--effort", "2")
        self.assertEqual(add.returncode, 0, add.stderr)
        item_id = add.stdout.strip()

        self.assertEqual(self.wl("validate").returncode, 0)

        out = self.wl("outcome", item_id, "--result", "success", "--note", "done")
        self.assertEqual(out.returncode, 0, out.stderr)

        listed = json.loads(self.wl("list", "--all", "--json").stdout)
        self.assertEqual(listed[0]["status"], "done")
        self.assertEqual(listed[0]["attempts"], 1)

        # done items drop out of the queue
        self.assertEqual(json.loads(self.wl("next", "--json").stdout), [])

    def test_duplicate_is_refused(self):
        self.assertEqual(self.wl("add", "同じことを二回書く").returncode, 0)
        dupe = self.wl("add", "同じことを二回書く")
        self.assertNotEqual(dupe.returncode, 0)
        self.assertIn("skip:", dupe.stderr)
        self.assertEqual(len(json.loads(self.wl("list", "--json").stdout)), 1)

    def test_force_overrides_the_duplicate_guard(self):
        self.wl("add", "重複テスト")
        self.assertEqual(self.wl("add", "重複テスト", "--force").returncode, 0)
        self.assertEqual(len(json.loads(self.wl("list", "--json").stdout)), 2)

    def test_blocked_outcome_sets_reason(self):
        item_id = self.wl("add", "ブロックされる作業").stdout.strip()
        self.wl("outcome", item_id, "--result", "blocked", "--note", "APIキー待ち")
        rec = json.loads(self.wl("show", item_id).stdout)
        self.assertEqual(rec["status"], "blocked")
        self.assertEqual(rec["blocked_by"], "APIキー待ち")
        self.assertEqual(self.wl("validate").returncode, 0)

    def test_failed_attempt_returns_item_to_the_queue(self):
        item_id = self.wl("add", "失敗する作業").stdout.strip()
        self.wl("update", item_id, "--status", "in_progress")
        self.wl("outcome", item_id, "--result", "failed", "--note", "テスト失敗")
        rec = json.loads(self.wl("show", item_id).stdout)
        self.assertEqual(rec["status"], "ready")  # picked up again, but decayed

    def test_journal_records_every_mutation(self):
        item_id = self.wl("add", "履歴テスト").stdout.strip()
        self.wl("update", item_id, "--value", "5", "--note", "重要度を上げた")
        self.wl("outcome", item_id, "--result", "partial", "--note", "途中まで")
        events = [
            json.loads(l)
            for l in (self.repo / "backlog" / "journal.jsonl")
            .read_text(encoding="utf-8").splitlines() if l.strip()
        ]
        self.assertEqual([e["event"] for e in events], ["add", "update", "outcome"])
        self.assertEqual(events[1]["changed"]["value"], [3, 5])

    def test_stats_reports_thrashing(self):
        item_id = self.wl("add", "何度も失敗する").stdout.strip()
        for _ in range(3):
            self.wl("outcome", item_id, "--result", "failed", "--note", "x")
        stats = json.loads(self.wl("stats").stdout)
        self.assertEqual(len(stats["thrashing"]), 1)
        self.assertEqual(stats["thrashing"][0]["attempts"], 3)

    def test_dedupe_reports_near_duplicates(self):
        self.wl("add", "会話ログから毎日スキルを蒸留する")
        self.wl("add", "会話ログから日次でスキルを蒸留する")
        report = json.loads(self.wl("dedupe").stdout)
        self.assertTrue(any(g["kind"] == "near" for g in report["groups"]))

    def test_gc_archives_only_old_terminal_items(self):
        keep = self.wl("add", "残る作業").stdout.strip()
        gone = self.wl("add", "終わった作業").stdout.strip()
        self.wl("outcome", gone, "--result", "success")
        self.assertIn("nothing to archive", self.wl("gc", "--older-than", "60").stdout)
        self.wl("gc", "--older-than", "0")
        remaining = [i["id"] for i in json.loads(self.wl("list", "--all", "--json").stdout)]
        self.assertEqual(remaining, [keep])

    def test_intake_dry_run_does_not_mutate(self):
        inbox = self.repo / "backlog"
        inbox.mkdir(exist_ok=True)
        (inbox / "INBOX.md").write_text(
            "## 受付欄\n- ドライランのテスト\n", encoding="utf-8")

        dry = json.loads(self.wl("intake", "--dry-run").stdout)
        self.assertEqual(len(dry["added"]), 1)
        # nothing may have been written -- the bug this pins let dry-run
        # populate the store, so the real run then saw its own duplicates
        self.assertEqual(json.loads(self.wl("list", "--all", "--json").stdout), [])
        self.assertIn("ドライランのテスト", (inbox / "INBOX.md").read_text(encoding="utf-8"))

        real = json.loads(self.wl("intake").stdout)
        self.assertEqual(len(real["added"]), 1)
        self.assertEqual(real["skipped_as_duplicate"], [])
        self.assertNotIn("ドライランのテスト", (inbox / "INBOX.md").read_text(encoding="utf-8"))

    def test_intake_leaves_unparsed_prose_in_place(self):
        inbox = self.repo / "backlog"
        inbox.mkdir(exist_ok=True)
        (inbox / "INBOX.md").write_text(
            "## 受付欄\nこれは箇条書きではない\n- 取り込まれる項目\n", encoding="utf-8")
        self.wl("intake")
        after = (inbox / "INBOX.md").read_text(encoding="utf-8")
        self.assertIn("これは箇条書きではない", after)  # not silently eaten
        self.assertNotIn("取り込まれる項目", after)

    def test_next_excludes_untriaged_and_blocked(self):
        ready = self.wl("add", "триaged work", "--status", "ready").stdout.strip()
        self.wl("add", "untriaged work")  # defaults to inbox
        blocked = self.wl("add", "blocked work", "--status", "ready").stdout.strip()
        self.wl("outcome", blocked, "--result", "blocked", "--note", "waiting")

        queue = [i["id"] for i in json.loads(self.wl("next", "--json").stdout)]
        self.assertEqual(queue, [ready])  # inbox is not the executor's to take

        with_inbox = json.loads(self.wl("next", "--status", "inbox", "--json").stdout)
        self.assertEqual(len(with_inbox), 1)

    def test_heartbeat_makes_a_silent_run_visible(self):
        self.wl("heartbeat", "executor", "--note", "fired")
        report = json.loads(self.wl("runs", "--days", "1").stdout)
        self.assertEqual(len(report["runs"]), 1)
        self.assertEqual(report["silent_runs"][0]["agent"], "executor")

        # once the run produces something, it is no longer silent
        self.wl("add", "work the run produced")
        report = json.loads(self.wl("runs", "--days", "1").stdout)
        self.assertEqual(report["silent_runs"], [])
        self.assertEqual(len(report["unfinished_runs"]), 1)

        self.wl("heartbeat", "executor", "--phase", "end")
        report = json.loads(self.wl("runs", "--days", "1").stdout)
        self.assertEqual(report["unfinished_runs"], [])

    def test_can_add_a_blocked_item_in_one_command(self):
        # Validation requires blocked_by, so `add --status blocked` without a
        # way to supply it was simply impossible.
        bad = self.wl("add", "止まってる作業", "--status", "blocked")
        self.assertNotEqual(bad.returncode, 0)

        ok = self.wl("add", "止まってる作業", "--status", "blocked",
                     "--blocked-by", "PR #2 のマージ待ち")
        self.assertEqual(ok.returncode, 0, ok.stderr)
        rec = json.loads(self.wl("show", ok.stdout.strip()).stdout)
        self.assertEqual(rec["blocked_by"], "PR #2 のマージ待ち")
        self.assertEqual(self.wl("validate").returncode, 0)

    def test_corrupt_store_fails_loudly(self):
        (self.repo / "backlog").mkdir(exist_ok=True)
        (self.repo / "backlog" / "wishlist.jsonl").write_text("{not json\n")
        result = self.wl("list")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("corrupt JSON", result.stderr)


if __name__ == "__main__":
    unittest.main(verbosity=2)
