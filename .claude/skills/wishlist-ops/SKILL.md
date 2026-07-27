---
name: wishlist-ops
description: Use when the user mentions something they want done later, asks what they should work on next, asks why something is or isn't getting done, or wants to check/reorder the backlog. Triggers on "やりたい", "あとで", "そのうち", "次は何", "積んである", "I want to", "remind me to", "what should I work on". Files it into the backlog instead of letting it evaporate in chat.
---

# Wishlist ops

The backlog lives at `backlog/wishlist.jsonl` and is only ever touched
through `python3 engine/wl.py` (from the repo root). Hand-editing the JSONL
destroys the outcome history that ordering depends on.

## When the user mentions wanting something

Capture it in the same turn — do not wait to be asked. An intent stated in
chat and not filed is gone the moment the container is reclaimed.

```bash
python3 engine/wl.py add "<imperative, one line, the user's language>" \
  --detail "<what done looks like>" \
  --source conversation \
  --value <1-5> --effort <1-5> --confidence <0-1> \
  --autonomy <auto|propose|ask>
```

Then tell them the id in one short line. Don't turn the capture into a
conversation — if `value`/`effort` are unclear, guess and say what you
guessed. The prioritiser corrects estimates from real outcomes later, so a
rough number now beats an interrogation.

A non-zero exit with `skip:` means it is already tracked. Say so and give the
existing id; do not pass `--force`.

## When the user asks what's next

```bash
python3 engine/wl.py next -n 5
```

Give the top few with one line each on *why* — `wl why <id>` shows which
term is carrying the score. "This is top because it's been sitting 40 days"
is a more useful answer than a bare list, and it exposes bad inputs.

## When the user asks why something isn't done

```bash
python3 engine/wl.py show <id>
```

Read `outcomes` and `attempts`. The honest answers are usually one of:

- never made it out of `inbox` — nobody triaged it
- `blocked` on something that quietly resolved
- repeated failures, so `attempt_decay` sank it — it needs splitting, not retrying
- `effort` was set too high, so it never surfaced

Say which one it is. Do not just re-pin the item to the top; that hides the
cause and it will sink again.

## When the user wants something prioritised now

```bash
python3 engine/wl.py update <id> --pin 2.0 --note "<why>"
```

Pins are a flat override and they rot silently — prefer fixing the real
input (`--value`, `--effort`, `--confidence`) and reserve `--pin` for a hard
external deadline. If you do pin, note the expiry in the detail.

## Health check

```bash
python3 engine/wl.py stats --days 7
```

If `net_change` is positive several runs running, capture is outrunning
execution. Say so and recommend specific items to cut — the user decides,
but the recommendation is yours to make.
