#!/usr/bin/env python3
"""wl -- the wishlist CLI. Every agent touches the backlog through this.

    wl add "title" --value 4 --effort 2 --source notion --ref <url>
    wl list [--status ready] [--tag x] [--json]
    wl next [-n 3]            # top-ranked actionable items
    wl show <id>
    wl update <id> --status in_progress --pin 1.5
    wl outcome <id> --result success --note "opened PR #12"
    wl stats                  # throughput / staleness, for the prioritiser
    wl why <id>               # score breakdown
    wl dedupe                 # report likely duplicates
    wl gc                     # archive terminal items older than N days

Storage is JSONL at backlog/wishlist.jsonl, rewritten atomically. Outcome
history lives on the item AND is appended to backlog/journal.jsonl, which is
never rewritten -- that is the audit trail of what the machine actually did.
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import schema  # noqa: E402
from schema import (  # noqa: E402
    ACTIVE_STATUSES,
    AUTONOMY,
    INTAKE_MARKER,
    OUTCOME_RESULTS,
    SOURCE_KINDS,
    STATUSES,
    TERMINAL_STATUSES,
    age_days,
    dedupe_key,
    make_item,
    now_iso,
    parse_intake_line,
    similarity,
    split_intake,
    validate,
)
from score import explain, rank, score  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
BACKLOG = ROOT / "backlog"
WISHLIST = BACKLOG / "wishlist.jsonl"
JOURNAL = BACKLOG / "journal.jsonl"
INBOX = BACKLOG / "INBOX.md"
ARCHIVE = BACKLOG / "archive.jsonl"


# --- storage ----------------------------------------------------------------


def load() -> list[dict]:
    if not WISHLIST.exists():
        return []
    items = []
    for lineno, line in enumerate(WISHLIST.read_text(encoding="utf-8").splitlines(), 1):
        line = line.strip()
        if not line:
            continue
        try:
            items.append(json.loads(line))
        except json.JSONDecodeError as exc:
            raise SystemExit(f"{WISHLIST}:{lineno}: corrupt JSON ({exc})") from exc
    return items


def save(items: list[dict]) -> None:
    BACKLOG.mkdir(parents=True, exist_ok=True)
    tmp = WISHLIST.with_suffix(".jsonl.tmp")
    with tmp.open("w", encoding="utf-8") as fh:
        for item in items:
            fh.write(json.dumps(item, ensure_ascii=False) + "\n")
        fh.flush()
        os.fsync(fh.fileno())
    tmp.replace(WISHLIST)


def journal(event: dict) -> None:
    BACKLOG.mkdir(parents=True, exist_ok=True)
    event = {"at": now_iso(), **event}
    with JOURNAL.open("a", encoding="utf-8") as fh:
        fh.write(json.dumps(event, ensure_ascii=False) + "\n")


def find(items: list[dict], item_id: str) -> dict:
    exact = [i for i in items if i["id"] == item_id]
    if exact:
        return exact[0]
    # allow the short hash without the wl_ prefix
    partial = [i for i in items if i["id"].endswith(item_id)]
    if len(partial) == 1:
        return partial[0]
    if len(partial) > 1:
        raise SystemExit(f"{item_id!r} is ambiguous: {[i['id'] for i in partial]}")
    raise SystemExit(f"no item matching {item_id!r}")


# --- rendering --------------------------------------------------------------


def fmt_row(item: dict) -> str:
    marks = {
        "inbox": "?", "ready": " ", "in_progress": ">",
        "blocked": "!", "done": "x", "dropped": "-",
    }
    return (
        f"{marks.get(item['status'], ' ')} {item['id']}  "
        f"{score(item):5.2f}  "
        f"{item['status']:<11} "
        f"v{item['value']}/e{item['effort']}/c{item['confidence']:.1f} "
        f"{item.get('autonomy', 'propose'):<7} "
        f"{item['title']}"
    )


def emit(items: list[dict], as_json: bool) -> None:
    if as_json:
        print(json.dumps(items, ensure_ascii=False, indent=2))
        return
    if not items:
        print("(nothing)")
        return
    for item in items:
        print(fmt_row(item))


# --- commands ---------------------------------------------------------------


def cmd_add(args) -> int:
    items = load()
    key = dedupe_key(args.title)

    if not args.force:
        for existing in items:
            if existing.get("dedupe_key") != key:
                continue
            if existing["status"] in TERMINAL_STATUSES and not args.revive:
                print(
                    f"skip: {existing['id']} is already {existing['status']} "
                    f"with the same fingerprint ({existing['title']!r}). "
                    f"--revive to reopen, --force to add anyway.",
                    file=sys.stderr,
                )
                return 3
            if existing["status"] in ACTIVE_STATUSES:
                print(
                    f"skip: duplicate of active item {existing['id']} "
                    f"({existing['title']!r}). --force to add anyway.",
                    file=sys.stderr,
                )
                return 3

    item = make_item(
        args.title,
        detail=args.detail or "",
        source_kind=args.source,
        source_ref=args.ref or "",
        status=args.status,
        value=args.value,
        effort=args.effort,
        confidence=args.confidence,
        autonomy=args.autonomy,
        tags=args.tag or [],
        due=args.due,
        blocked_by=args.blocked_by or "",
    )
    items.append(item)
    save(items)
    journal({"event": "add", "id": item["id"], "title": item["title"],
             "source": item["source"]["kind"]})
    print(item["id"])
    return 0


def cmd_intake(args) -> int:
    """Drain hand-written wishes from backlog/INBOX.md into the wishlist."""
    if not INBOX.exists():
        print("no INBOX.md; nothing to intake")
        return 0

    raw = INBOX.read_text(encoding="utf-8")
    head, body_lines = split_intake(raw)
    if not head.endswith("\n"):
        print(f"{INBOX.name}: missing the '{INTAKE_MARKER}' marker", file=sys.stderr)
        return 1

    items = load()
    added, skipped, kept = [], [], []

    for line in body_lines:
        parsed = parse_intake_line(line)
        if parsed is None:
            kept.append(line)  # blank lines, comments, prose -- leave alone
            continue

        key = dedupe_key(parsed["title"])
        clash = next(
            (i for i in items
             if dedupe_key(i["title"]) == key and i["status"] in ACTIVE_STATUSES),
            None,
        )
        if clash:
            skipped.append({"title": parsed["title"], "existing": clash["id"]})
            continue

        item = make_item(**parsed)
        items.append(item)
        added.append({"id": item["id"], "title": item["title"]})

    if added and not args.dry_run:
        save(items)
        journal({"event": "intake", "added": len(added),
                 "skipped": len(skipped), "items": added})

    if not args.dry_run and (added or skipped):
        # Consumed lines disappear; anything we could not parse stays put so
        # the user can see it was not silently eaten.
        trailing = "\n".join(kept).rstrip() + "\n" if any(k.strip() for k in kept) else ""
        INBOX.write_text(head + "\n" + trailing, encoding="utf-8")

    print(json.dumps({"added": added, "skipped_as_duplicate": skipped,
                      "dry_run": args.dry_run}, ensure_ascii=False, indent=2))
    return 0


def cmd_heartbeat(args) -> int:
    """Record that an agent run started, before it can fail.

    A scheduled firing that dies early -- bad checkout, missing tool, empty
    queue -- otherwise leaves nothing behind, and "ran and did nothing" looks
    exactly like "never fired". The heartbeat is written and pushed before any
    real work, so the journal always shows the attempt.
    """
    journal({"event": "heartbeat", "agent": args.agent, "phase": args.phase,
             "note": args.note or ""})
    print(f"heartbeat: {args.agent} {args.phase}")
    return 0


def cmd_runs(args) -> int:
    """Which agents have run lately, and did each leave any work behind."""
    if not JOURNAL.exists():
        print(json.dumps({"runs": []}, indent=2))
        return 0

    events = []
    for line in JOURNAL.read_text(encoding="utf-8").splitlines():
        if line.strip():
            try:
                events.append(json.loads(line))
            except json.JSONDecodeError:
                continue

    ref = datetime.now(timezone.utc)
    runs: list[dict] = []
    for ev in events:
        if ev.get("event") != "heartbeat" or ev.get("phase") != "start":
            continue
        if age_days(ev.get("at"), ref=ref) > args.days:
            continue
        runs.append({"agent": ev.get("agent"), "at": ev.get("at"),
                     "note": ev.get("note", ""), "produced": [], "finished": False})

    # Attribute every non-heartbeat event to the run it followed.
    for ev in events:
        at = ev.get("at", "")
        started = [r for r in runs if r["at"] <= at]
        if not started:
            continue
        current = started[-1]
        if ev.get("event") == "heartbeat":
            if ev.get("phase") == "end" and ev.get("agent") == current["agent"]:
                current["finished"] = True
        else:
            current["produced"].append(ev.get("event"))

    silent = [r for r in runs if not r["produced"]]
    print(json.dumps({
        "window_days": args.days,
        "runs": runs,
        "silent_runs": [{"agent": r["agent"], "at": r["at"]} for r in silent],
        "unfinished_runs": [{"agent": r["agent"], "at": r["at"]}
                            for r in runs if not r["finished"]],
    }, ensure_ascii=False, indent=2))
    return 0


def cmd_list(args) -> int:
    items = load()
    if args.status:
        items = [i for i in items if i["status"] in args.status]
    elif not args.all:
        items = [i for i in items if i["status"] in ACTIVE_STATUSES]
    if args.tag:
        items = [i for i in items if set(args.tag) & set(i.get("tags", []))]
    if args.source:
        items = [i for i in items if i["source"]["kind"] in args.source]
    emit(sorted(items, key=lambda i: -score(i)), args.json)
    return 0


def cmd_next(args) -> int:
    items = load()
    ranked = rank(items)
    if args.status:
        ranked = [i for i in ranked if i["status"] in args.status]
    else:
        # Default queue excludes blocked work, and excludes `inbox` -- an
        # untriaged item has not been checked by anyone for whether it is
        # wanted, well-specified, or even doable. The executor acting on one
        # is how the machine ends up confidently doing the wrong thing.
        ranked = [i for i in ranked if i["status"] in ("ready", "in_progress")]
    if args.autonomy:
        ranked = [i for i in ranked if i.get("autonomy") in args.autonomy]
    emit(ranked[: args.n], args.json)
    return 0


def cmd_show(args) -> int:
    item = find(load(), args.id)
    print(json.dumps(item, ensure_ascii=False, indent=2))
    return 0


def cmd_why(args) -> int:
    item = find(load(), args.id)
    print(json.dumps(explain(item), ensure_ascii=False, indent=2))
    return 0


def cmd_update(args) -> int:
    items = load()
    item = find(items, args.id)
    before = {k: item.get(k) for k in
              ("status", "value", "effort", "confidence", "pin", "autonomy")}

    for field in ("value", "effort", "confidence", "pin", "autonomy",
                  "status", "blocked_by", "detail", "due"):
        new = getattr(args, field, None)
        if new is not None:
            item[field] = new
    if args.title:
        item["title"] = args.title
        item["dedupe_key"] = dedupe_key(args.title)
    if args.tag:
        item["tags"] = sorted(set(item.get("tags", [])) | set(args.tag))
    if args.untag:
        item["tags"] = [t for t in item.get("tags", []) if t not in args.untag]
    if item["status"] != "blocked":
        item["blocked_by"] = ""

    item["updated_at"] = now_iso()
    validate(item)
    save(items)

    after = {k: item.get(k) for k in before}
    changed = {k: [before[k], after[k]] for k in before if before[k] != after[k]}
    journal({"event": "update", "id": item["id"], "changed": changed,
             "note": args.note or ""})
    print(fmt_row(item))
    return 0


def cmd_outcome(args) -> int:
    items = load()
    item = find(items, args.id)

    entry = {
        "at": now_iso(),
        "result": args.result,
        "note": args.note or "",
        "ref": args.ref or "",
    }
    item.setdefault("outcomes", []).append(entry)
    item["attempts"] = item.get("attempts", 0) + 1
    item["last_attempt"] = entry["at"]

    # An outcome implies a status unless one was named explicitly.
    if args.status:
        item["status"] = args.status
    elif args.result == "success":
        item["status"] = "done"
    elif args.result == "blocked":
        item["status"] = "blocked"
        item["blocked_by"] = args.note or "unspecified"
    elif args.result in ("failed", "partial") and item["status"] == "in_progress":
        item["status"] = "ready"

    item["updated_at"] = entry["at"]
    validate(item)
    save(items)
    journal({"event": "outcome", "id": item["id"], "title": item["title"], **entry})
    print(fmt_row(item))
    return 0


def cmd_stats(args) -> int:
    items = load()
    ref = datetime.now(timezone.utc)

    by_status = {s: 0 for s in STATUSES}
    for i in items:
        by_status[i["status"]] = by_status.get(i["status"], 0) + 1

    active = [i for i in items if i["status"] in ACTIVE_STATUSES]
    done = [i for i in items if i["status"] == "done"]

    window = args.days
    recent_done = [
        i for i in done
        if i.get("last_attempt") and age_days(i["last_attempt"], ref=ref) <= window
    ]
    recent_added = [i for i in items if age_days(i.get("created_at"), ref=ref) <= window]

    stale = sorted(
        (i for i in active if age_days(i.get("updated_at"), ref=ref) >= args.stale_after),
        key=lambda i: -age_days(i.get("updated_at"), ref=ref),
    )
    thrashing = [i for i in active if i.get("attempts", 0) >= 3]

    out = {
        "counts": by_status,
        "window_days": window,
        "added_in_window": len(recent_added),
        "completed_in_window": len(recent_done),
        "net_change": len(recent_added) - len(recent_done),
        "active_total": len(active),
        "stale_after_days": args.stale_after,
        "stale": [
            {"id": i["id"], "title": i["title"], "status": i["status"],
             "idle_days": round(age_days(i.get("updated_at"), ref=ref), 1)}
            for i in stale[:15]
        ],
        "thrashing": [
            {"id": i["id"], "title": i["title"], "attempts": i["attempts"]}
            for i in thrashing
        ],
        "blocked": [
            {"id": i["id"], "title": i["title"], "blocked_by": i.get("blocked_by", "")}
            for i in active if i["status"] == "blocked"
        ],
        "by_source": _count(items, lambda i: i["source"]["kind"]),
    }
    print(json.dumps(out, ensure_ascii=False, indent=2))
    return 0


def _count(items, key):
    counts: dict[str, int] = {}
    for i in items:
        counts[key(i)] = counts.get(key(i), 0) + 1
    return dict(sorted(counts.items(), key=lambda kv: -kv[1]))


def cmd_dedupe(args) -> int:
    items = load()

    # Always recompute: stored keys may predate a change to the tokeniser.
    stale_keys = 0
    for i in items:
        fresh = dedupe_key(i["title"])
        if i.get("dedupe_key") != fresh:
            stale_keys += 1
            if args.fix:
                i["dedupe_key"] = fresh
    if args.fix and stale_keys:
        save(items)
        journal({"event": "rekey", "count": stale_keys})

    groups: dict[str, list[dict]] = {}
    for i in items:
        groups.setdefault(dedupe_key(i["title"]), []).append(i)

    exact = [
        {"kind": "exact", "dedupe_key": k,
         "items": [{"id": i["id"], "status": i["status"], "title": i["title"]}
                   for i in v]}
        for k, v in groups.items() if len(v) > 1
    ]

    # Near-duplicates: different fingerprints, heavily overlapping wording.
    near = []
    reps = [v[0] for v in groups.values()]
    for a_idx, a in enumerate(reps):
        for b in reps[a_idx + 1:]:
            sim = similarity(a["title"], b["title"])
            if sim >= args.threshold:
                near.append({
                    "kind": "near", "similarity": round(sim, 3),
                    "items": [{"id": x["id"], "status": x["status"],
                               "title": x["title"]} for x in (a, b)],
                })
    near.sort(key=lambda d: -d["similarity"])

    print(json.dumps(
        {"stale_keys": stale_keys, "fixed": bool(args.fix), "groups": exact + near},
        ensure_ascii=False, indent=2))
    return 0


def cmd_gc(args) -> int:
    items = load()
    ref = datetime.now(timezone.utc)
    keep, archive = [], []
    for i in items:
        old = age_days(i.get("updated_at"), ref=ref) >= args.older_than
        if i["status"] in TERMINAL_STATUSES and old:
            archive.append(i)
        else:
            keep.append(i)

    if not archive:
        print("nothing to archive")
        return 0
    if args.dry_run:
        print(json.dumps([{"id": i["id"], "title": i["title"]} for i in archive],
                         ensure_ascii=False, indent=2))
        return 0

    with ARCHIVE.open("a", encoding="utf-8") as fh:
        for i in archive:
            fh.write(json.dumps(i, ensure_ascii=False) + "\n")
    save(keep)
    journal({"event": "gc", "archived": len(archive)})
    print(f"archived {len(archive)} item(s) to {ARCHIVE.relative_to(ROOT)}")
    return 0


def cmd_validate(args) -> int:
    items = load()
    problems = []
    seen: set[str] = set()
    for i in items:
        if i["id"] in seen:
            problems.append(f"duplicate id {i['id']}")
        seen.add(i["id"])
        try:
            validate(i)
        except schema.ValidationError as exc:
            problems.append(str(exc))
    if problems:
        for p in problems:
            print(f"INVALID: {p}", file=sys.stderr)
        return 1
    print(f"ok: {len(items)} item(s) valid")
    return 0


# --- argument plumbing ------------------------------------------------------


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(prog="wl", description=__doc__,
                                formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = p.add_subparsers(dest="cmd", required=True)

    a = sub.add_parser("add", help="capture a new wish")
    a.add_argument("title")
    a.add_argument("--detail", default="")
    a.add_argument("--source", choices=SOURCE_KINDS, default="manual")
    a.add_argument("--ref", default="", help="url or identifier of the origin")
    a.add_argument("--status", choices=STATUSES, default="inbox")
    a.add_argument("--value", type=int, default=3, help="1-5 impact if done")
    a.add_argument("--effort", type=int, default=3, help="1-5 cost to do")
    a.add_argument("--confidence", type=float, default=0.6,
                   help="0-1 certainty this is worth doing / well understood")
    a.add_argument("--autonomy", choices=AUTONOMY, default="propose")
    a.add_argument("--tag", action="append")
    a.add_argument("--due", help="ISO date/time")
    a.add_argument("--blocked-by", dest="blocked_by",
                   help="required when adding straight to --status blocked")
    a.add_argument("--force", action="store_true", help="add despite a duplicate")
    a.add_argument("--revive", action="store_true",
                   help="allow re-adding something previously done/dropped")
    a.set_defaults(fn=cmd_add)

    hb = sub.add_parser("heartbeat", help="record that an agent run started/ended")
    hb.add_argument("agent")
    hb.add_argument("--phase", choices=("start", "end"), default="start")
    hb.add_argument("--note", default="")
    hb.set_defaults(fn=cmd_heartbeat)

    r = sub.add_parser("runs", help="recent agent runs, and which produced nothing")
    r.add_argument("--days", type=float, default=7.0)
    r.set_defaults(fn=cmd_runs)

    i = sub.add_parser("intake", help="drain hand-written wishes from INBOX.md")
    i.add_argument("--dry-run", action="store_true",
                   help="show what would be added without clearing INBOX.md")
    i.set_defaults(fn=cmd_intake)

    l = sub.add_parser("list", help="list items")
    l.add_argument("--status", action="append", choices=STATUSES)
    l.add_argument("--tag", action="append")
    l.add_argument("--source", action="append", choices=SOURCE_KINDS)
    l.add_argument("--all", action="store_true", help="include done/dropped")
    l.add_argument("--json", action="store_true")
    l.set_defaults(fn=cmd_list)

    n = sub.add_parser("next", help="top-ranked actionable items")
    n.add_argument("-n", type=int, default=3)
    n.add_argument("--autonomy", action="append", choices=AUTONOMY)
    n.add_argument("--status", action="append", choices=STATUSES,
                   help="override the default ready/in_progress queue")
    n.add_argument("--json", action="store_true")
    n.set_defaults(fn=cmd_next)

    s = sub.add_parser("show", help="full record for one item")
    s.add_argument("id")
    s.set_defaults(fn=cmd_show)

    w = sub.add_parser("why", help="score breakdown for one item")
    w.add_argument("id")
    w.set_defaults(fn=cmd_why)

    u = sub.add_parser("update", help="change fields on an item")
    u.add_argument("id")
    u.add_argument("--title")
    u.add_argument("--detail")
    u.add_argument("--status", choices=STATUSES)
    u.add_argument("--value", type=int)
    u.add_argument("--effort", type=int)
    u.add_argument("--confidence", type=float)
    u.add_argument("--autonomy", choices=AUTONOMY)
    u.add_argument("--pin", type=float, help="flat score override, e.g. 2.0")
    u.add_argument("--blocked-by", dest="blocked_by")
    u.add_argument("--due")
    u.add_argument("--tag", action="append")
    u.add_argument("--untag", action="append")
    u.add_argument("--note", help="why, for the journal")
    u.set_defaults(fn=cmd_update)

    o = sub.add_parser("outcome", help="record what happened on an attempt")
    o.add_argument("id")
    o.add_argument("--result", choices=OUTCOME_RESULTS, required=True)
    o.add_argument("--note", default="")
    o.add_argument("--ref", default="", help="PR url, commit, doc link")
    o.add_argument("--status", choices=STATUSES,
                   help="override the status this outcome implies")
    o.set_defaults(fn=cmd_outcome)

    st = sub.add_parser("stats", help="throughput and staleness report")
    st.add_argument("--days", type=int, default=7)
    st.add_argument("--stale-after", type=float, default=14.0)
    st.set_defaults(fn=cmd_stats)

    d = sub.add_parser("dedupe", help="report exact and near duplicates")
    d.add_argument("--threshold", type=float, default=0.6,
                   help="token overlap at which two titles count as near-dupes")
    d.add_argument("--fix", action="store_true",
                   help="rewrite stored fingerprints that are out of date")
    d.set_defaults(fn=cmd_dedupe)

    g = sub.add_parser("gc", help="archive old terminal items")
    g.add_argument("--older-than", type=float, default=60.0)
    g.add_argument("--dry-run", action="store_true")
    g.set_defaults(fn=cmd_gc)

    v = sub.add_parser("validate", help="check the store is well-formed")
    v.set_defaults(fn=cmd_validate)

    return p


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    return args.fn(args)


if __name__ == "__main__":
    raise SystemExit(main())
