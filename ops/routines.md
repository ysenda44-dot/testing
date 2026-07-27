# Schedule

The four agents run as **Routines** (Claude Code scheduled triggers). Each
firing starts a fresh session in this repo's environment, so every prompt is
written to stand alone.

Times are UTC in the stored cron; the local column is JST (UTC+9).

| agent | local (JST) | cron (UTC) | why this slot |
|---|---|---|---|
| `harvester` | 07:10 daily | `10 22 * * *` | before the day starts, so the list is current when the user looks |
| `prioritizer` | 07:40 daily | `40 22 * * *` | after capture, so it triages the same morning's intake |
| `executor` | 09:20, 14:20 daily | `20 0,5 * * *` | two passes; one item each, not a batch |
| `distiller` | 23:30 daily | `30 14 * * *` | end of day, while that day's session logs still exist |

## Ordering matters

`harvester` → `prioritizer` → `executor` is a pipeline, not three
independent jobs. Capture before triage before execution; otherwise the
executor works from yesterday's ordering and the morning's urgent item waits
a full day.

The 30-minute gap is deliberate — a harvester run that sweeps six sources can
take a while, and the prioritiser reading a half-written backlog produces a
worse order than no reordering at all.

## Why the distiller runs daily and last

The container is ephemeral: `~/.claude/projects/**/*.jsonl` does not survive
into the next session. Whatever the distiller does not read before the day
closes is gone permanently. This is the one job that cannot be made weekly.

## Changing the schedule

Routines are managed through the `claude-code-remote` MCP tools, not a file
in this repo — this table is documentation, not configuration. Editing it
changes nothing on its own.

```
list_triggers                                  # ids and current state
update_trigger --trigger_id trig_... --cron_expression "..."
update_trigger --trigger_id trig_... --enabled false    # pause
delete_trigger --trigger_id trig_...
```

Keep this table in sync when you change one.

## Turning it off

Pause rather than delete — `update_trigger --enabled false` keeps the run
history, which is what tells you whether the thing was working.

To stop only the part that writes code, pause `executor`; `harvester` and
`prioritizer` are read-only against the outside world and cost little.

## Failure behaviour

A Routine firing into a fresh session has no memory of the previous run. The
handoff is entirely through committed state:

- `backlog/wishlist.jsonl` — what is wanted
- `backlog/journal.jsonl` — what happened and when each agent last ran

So **an agent that does not commit has not run**, no matter what it did. If
an agent's work seems to vanish between firings, that is the first thing to
check.

Concurrency: two firings could in principle overlap. `wl update <id>
--status in_progress` is the claim, and the executor takes only items that
are `ready` — so a second run picks the next item rather than colliding. It
is a soft lock, not a real one; if overlap becomes common, widen the gaps
rather than adding locking.

## Cost shape

`harvester` and `prioritizer` are cheap and run on Sonnet. `executor` and
`distiller` run on Opus because they produce work that a human will read and
merge. If cost matters more than throughput, drop the executor to one firing
a day before touching anything else.
