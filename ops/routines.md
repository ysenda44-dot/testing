# Schedule

The four agents run as **Routines** (Claude Code scheduled triggers). Each
firing starts a fresh session in this repo's environment, so every prompt is
written to stand alone.

Times are UTC in the stored cron; the local column is JST (UTC+9).

| agent | state | local (JST) | cron (UTC) | why this slot |
|---|---|---|---|---|
| `harvester` | **live** | 07:10 daily | `10 22 * * *` | before the day starts, so the list is current when the user looks |
| `prioritizer` | **live** | 07:40 daily | `40 22 * * *` | after capture, so it triages the same morning's intake |
| `executor` | **live** | 09:20, 14:20 | `20 0,5 * * *` | two passes; one item each, not a batch |
| `distiller` | **live** | 23:33 daily | `33 14 * * *` | end of day, while that day's session logs still exist |

All four are scheduled as of 2026-07-27. The original plan was to run capture
and triage alone for a week first; the user chose to enable execution
immediately instead. The risk that trade accepts: an executor working from a
thin backlog produces confident, useless PRs, which is harder to notice than
an empty list. Watch the first few `executor` PRs for that specifically, and
pause the routine rather than tuning it if they are not worth reading.

Trigger ids:

| agent | trigger |
|---|---|
| harvester | `trig_0113RjvX8VkZsqM6aQecEjWB` |
| prioritizer | `trig_017Xi4QRDhuJf4gPtvnQ1TM6` |
| executor | `trig_017pZgpQ5cPHF7e6s4sKw625` |
| distiller | `trig_01HdXpdKBp6jFNGfZm3HDs4t` |

## Known limitation: the live Routines have no Google/Notion connectors

Routines created through the `claude-code-remote` MCP tool cannot be given
connectors — it refuses the `connectors` parameter in this organisation.

**But not everything is missing.** The first real harvester run (2026-09-05)
established empirically what a fired session actually has:

| tool surface | available to a firing |
|---|---|
| GitHub MCP (`mcp__github__*`) | **yes** |
| git, python, the repo | yes |
| Gmail | no |
| Google Calendar | no |
| Google Drive | no |
| Notion | no |

An earlier version of this file asserted GitHub was unavailable too. That was
wrong, and the harvester said so in its own journal entry rather than quietly
working around it — which is the behaviour the prompts ask for and the reason
the error got caught at all. Do not re-assert an unavailability without
evidence from a real run.

What this costs, concretely:

- `prioritizer` — nothing. It only reads `backlog/` and git.
- `distiller` — nothing. It reads session logs and git.
- `executor` — nothing structural. It has GitHub MCP, so it *can* open its
  own draft PR per item rather than piling every item onto PR #2.
- `harvester` — the mailbox half of its sweep. Stalled GitHub work (its
  highest-yield source), `INBOX.md`, session logs and local git all work.
  Gmail, Calendar, Notion and Drive do not.

To get the rest, re-create the harvester Routine from the **claude.ai
Routines UI**, where connectors can be granted. Same cron (`10 22 * * *`),
same prompt; then delete `trig_0113RjvX8VkZsqM6aQecEjWB`.

## The agents must exist on the branch the session clones

A scheduled firing clones the repository's **default branch**. While
`.claude/agents/` and `engine/` are not on `main`, every firing comes up
without them and must check out the feature branch first.

**The obvious way to write that fallback does not work.** A scheduled
firing gets a `--single-branch` clone, whose fetch refspec is
`+refs/heads/main:refs/remotes/origin/main` — main and nothing else. So:

```bash
git fetch origin claude/ai-driven-agent-design-lbizu5   # only updates FETCH_HEAD
git checkout claude/ai-driven-agent-design-lbizu5       # error: pathspec did not match
```

No `origin/<branch>` ref is ever created, so the checkout fails on a
pathspec error and the run dies before it can do anything — including before
it can write a heartbeat. This silently killed every executor firing on
2026-07-28 (00:20 and 05:20 UTC), which looked from the outside like the
agent running and finding nothing to do.

Widen the refspec first; after that ordinary git works, including upstream
tracking for the push. **Write it as one chained command with the branch name
spelled out literally** — see below for why:

```bash
git config remote.origin.fetch '+refs/heads/*:refs/remotes/origin/*' && git fetch origin && git checkout claude/ai-driven-agent-design-lbizu5 && git pull --ff-only
```

### Never use a shell variable across lines in a routine prompt

The first version of this fix opened with `BR=claude/ai-driven-agent-design-lbizu5`
and used `"$BR"` on the following lines. **Shell state does not persist
between Bash tool calls.** An agent that runs the block line by line — which
is the normal thing to do — loses the assignment immediately and then
executes `git checkout ""`, which fails. The run dies in setup exactly as
before, and the fix appears not to have worked.

Every command in a routine prompt must therefore be independently runnable:
literal paths and branch names, no variables carried between lines, and
anything that must happen together chained with `&&` in a single line.

Delete this fallback once the system is merged to `main` — it is
scaffolding, and leaving it in means a future breakage on `main` gets
silently papered over by an old branch.

## The stored prompts duplicate the agent files — keep them in sync

Each Routine's stored prompt inlines the commands its agent should run, and
`.claude/agents/*.md` states them too. When those disagree, the **stored
prompt wins**: the firing runs the literal command in front of it, even
though the prompt also says "follow <agent>.md exactly".

That bit on 2026-09-05. `executor.md` was fixed to query
`--autonomy auto --autonomy propose --autonomy ask`, but the stored prompt
still said `--autonomy auto --autonomy propose`, so the fix had no effect on
any firing. A repo-only fix to an agent's commands is not deployed.

After changing a command in an agent file, update the matching Routine with
`update_trigger` and note it here. The better long-term shape is for the
stored prompt to stop inlining commands and defer to the agent file, so there
is only one copy to get wrong.

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
