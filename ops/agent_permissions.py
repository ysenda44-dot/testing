#!/usr/bin/env python3
"""Report changes to what scheduled agents are allowed to invoke.

An agent can edit `.claude/agents/*.md` -- including its own `tools:` line.
That is sometimes correct: the executor legitimately needed
`resolve_review_thread` on 2026-09-05 to do the job it was given, and said so
in its outcome note. But a change to what an *unattended* agent may invoke
must never reach a reviewer as one more line in a large diff.

    python3 ops/agent_permissions.py <base-ref>

Prints a markdown report and exits 0 (this informs review; it does not block).
Exits 2 only if the repository cannot be read.
"""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path

AGENT_DIR = Path(".claude/agents")


def tools_of(text: str) -> set[str]:
    """The `tools:` set from the frontmatter block, empty if absent.

    Only the frontmatter counts: a `tools:` line in the prose below it is
    documentation, not a grant.
    """
    lines = text.splitlines()
    if not lines or lines[0].strip() != "---":
        return set()
    for line in lines[1:]:
        if line.strip() == "---":
            break  # end of frontmatter
        if line.startswith("tools:"):
            return {t.strip() for t in line[len("tools:"):].split(",") if t.strip()}
    return set()


def at_ref(ref: str, path: str) -> str | None:
    """File content at a git ref, or None if it did not exist there."""
    result = subprocess.run(["git", "show", f"{ref}:{path}"],
                            capture_output=True, text=True)
    return result.stdout if result.returncode == 0 else None


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print(__doc__, file=sys.stderr)
        return 2
    base = argv[1]

    lines: list[str] = []
    any_change = False

    for path in sorted(AGENT_DIR.glob("*.md")):
        agent = path.stem
        after = tools_of(path.read_text(encoding="utf-8"))
        before_text = at_ref(base, str(path))

        if before_text is None:
            if after:
                any_change = True
                lines.append(f"### New agent: `{agent}`\n")
                lines.append("Introduced with these tool grants:\n")
                lines += [f"- `{t}`" for t in sorted(after)]
                lines.append("")
            continue

        before = tools_of(before_text)
        added, removed = sorted(after - before), sorted(before - after)
        if not added and not removed:
            continue

        any_change = True
        lines.append(f"### Tool grants changed: `{agent}`\n")
        if added:
            lines.append("**Added** — this agent can now invoke these unattended:\n")
            lines += [f"- `{t}`" for t in added]
            lines.append("")
        if removed:
            lines.append("**Removed:**\n")
            lines += [f"- `{t}`" for t in removed]
            lines.append("")

    if not any_change:
        print("No agent tool grants changed in this PR.")
        return 0

    print("\n".join(lines))
    # A warning annotation per changed agent, so it shows on the PR itself.
    for line in lines:
        if line.startswith("### "):
            print(f"::warning::{line[4:].strip()} — review before merging",
                  file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
