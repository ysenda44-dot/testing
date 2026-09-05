# AGENTS.md

Operating rules for every agent in this repo — Claude Code, Codex, and the
scheduled agents in `.claude/agents/`. `CLAUDE.md` points here; keep one copy
of the truth.

This file is maintained by the `distiller` agent, which proposes changes as a
PR each day based on what actually happened. Rules earn their place by being
needed twice. Delete anything that stops being true.

## What this repo is

A backlog that drives itself. `backlog/wishlist.jsonl` holds the やりたいこと
リスト; four scheduled agents fill it, order it, work it, and improve the
system's own instructions. See `README.md` for the loop and
`ops/routines.md` for the schedule.

## Hard rules

- **Never commit to `main`.** Work on the branch named in the task, or in
  `ops/routines.md`. Open a draft PR; a human merges.
- **Never edit `backlog/*.jsonl` by hand or with a text editor.** Use
  `engine/wl.py`. Direct edits lose the outcome history that prioritisation
  reads, and silently corrupt the append-only journal.
- **Never merge a PR**, including your own.
- **Respect the `autonomy` field** on a wishlist item (`auto` / `propose` /
  `ask`). See "Reaching outside the repo" below for where the line is.
- **Record every outcome** with `wl outcome`. An unrecorded run teaches the
  system nothing and will be repeated.
- **Heartbeat at the start of every scheduled run** (`wl heartbeat <agent>`),
  committed before the real work. Without it a run that dies early is
  indistinguishable from one that never fired. `wl runs` shows which recent
  runs produced nothing.
- **Changing an agent's `tools:` line changes what runs unattended.** You may
  do it when the work genuinely requires it, but say so in the outcome note
  and never bury it in a larger diff. CI annotates every such change
  (`ops/agent_permissions.py`); a human approves it at merge.
- **`partial` is not `success`.** Marking half-done work as success drops the
  remainder on the floor with no trace. This is the worst failure mode in the
  system; prefer under-claiming.

## Reaching outside the repo

Decided by the user on 2026-07-27. The rule is **compose freely, deliver
never**: an agent may write something that leaves the repo, but a human
performs the act that makes it visible to anyone else.

| action | allowed unattended |
|---|---|
| Gmail **draft** created, not sent | yes |
| Gmail send / reply | no — `ask` |
| Notion comment on a page, or edit to a page the user owns | yes |
| Notion edit to a page owned or relied on by someone else | no — `ask` |
| Drive: new doc in the user's own space | yes |
| Drive: editing a shared doc, changing permissions | no — `ask` |
| Draft PR on our own branch | yes |
| Marking a PR ready for review, merging, commenting on another person's PR | no — `ask` |
| Calendar: creating or moving an event with other attendees | no — `ask` |

When in doubt about who else sees it, it is `ask`. The test is not "is this
reversible" but "does someone other than the user find out before the user
does".

Leave every draft obviously machine-made — a subject prefix, an opening line
naming what it is — so a half-finished draft is never mistaken for a
considered message.

## Conventions

- Commit messages reference the wishlist id they serve: `<summary> (wl_abc12345)`.
- Reply to the user in the language they wrote in. This user writes Japanese;
  code, identifiers, and commit messages stay English.
- Before adding a dependency, check whether the stdlib covers it. `engine/`
  is deliberately dependency-free so any agent can run it anywhere.
- Run `python3 engine/wl.py validate` after anything touches the backlog.

## Facts worth not rediscovering

- The wishlist CLI is `python3 engine/wl.py` from the repo root. `wl next`
  gives the ranked queue; `wl why <id>` explains a score term by term.
- `wl next` returns `ready` and `in_progress` only. An `inbox` item is
  untriaged -- no one has confirmed it is wanted or doable -- so no agent
  acts on one. Pass `--status inbox` explicitly if you are triaging.
- An empty executor queue is a normal state, not a fault. It means the
  prioritiser has not triaged anything yet, or everything is blocked.
- Ordering is computed in `engine/score.py`, not decided by an agent. To move
  an item, change its inputs (`value`/`effort`/`confidence`), not its
  position — there is no position to change.
- Japanese titles are fingerprinted with CJK character bigrams
  (`schema.dedupe_key`), because whitespace-based tokenising made
  「AGENTS.mdを磨く」and「AGENTS.md を磨く」look like different items.
- `wl add` exiting non-zero on a duplicate is the guard working, not an
  error. Do not reach for `--force`.
- **Shell state does not persist between Bash tool calls.** A variable set on
  one line is gone by the next call, so any multi-step shell recipe written
  for an agent must use literal values and chain with `&&` on one line. This
  broke the routine setup blocks on 2026-07-28: `BR=...` then `git checkout
  "$BR"` ran as `git checkout ""`.
- A scheduled firing gets a **`--single-branch` clone of the default branch**.
  `git fetch origin <branch>` then updates only `FETCH_HEAD` and creates no
  `origin/<branch>`, so `git checkout <branch>` fails with "pathspec did not
  match". Run `git config remote.origin.fetch '+refs/heads/*:refs/remotes/origin/*'`
  before fetching; ordinary git works after that. See `ops/routines.md`.
- A scheduled firing HAS the GitHub MCP tools; it does NOT have Gmail,
  Calendar, Drive or Notion. Established by the first real harvester run
  (2026-09-05), which contradicted this file's earlier guess. Do not assert a
  tool is unavailable without evidence from an actual run — say what you
  observed and let the next run correct you.
- **Never seed example or test items into `backlog/wishlist.jsonl`.** The
  prioritiser cannot tell fiction from fact: on 2026-09-05 it correctly
  applied its own rules to a made-up "invoice due Friday" fixture and
  promoted it to the top of the executor's queue. Demonstrate on a scratch
  copy (`TMPDIR`), never on the live backlog.
- The container is ephemeral and the repo is re-cloned each session. Anything
  not committed and pushed is gone.
- **The distiller cannot see the user's conversations at all.** Each scheduled
  firing gets a fresh container whose `~/.claude/projects/` holds only that
  firing's own log — zero user turns. Corrections, stated preferences and
  repeated procedures, which `distiller.md` names as its top three sources,
  are therefore structurally invisible to it; it can only ever mine
  `backlog/journal.jsonl` and `git log`. Running it daily does not help: the
  cadence is not the limit, the corpus is. Confirmed by the 2026-09-05T14:35
  run, which checked and said so. Fixing this needs conversation content
  persisted into the repo from interactive sessions — a privacy decision, so
  it is tracked as an `ask` item, not something an agent should just do.

## Known bottleneck

This system exists because work was stalling on human availability, not on
capability. When you find yourself waiting for a human, check first whether
the item's `autonomy` genuinely requires it. If it does, say precisely what
decision you need — a blocked item with a vague reason wastes the wait.
