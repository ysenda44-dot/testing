"""Wishlist item schema and validation.

The wishlist is the single source of truth for "what the AI should be doing".
Everything else in this repo reads from or writes to it through engine/wl.py --
never by hand-editing the JSONL, because free-form rewrites drift and lose
the outcome history that prioritisation depends on.
"""

from __future__ import annotations

import hashlib
import re
import time
from datetime import datetime, timezone

# --- vocabularies -----------------------------------------------------------

STATUSES = (
    "inbox",        # captured, not yet triaged by a human or the prioritiser
    "ready",        # triaged, actionable, waiting for the executor
    "in_progress",  # an executor run has claimed it
    "blocked",      # cannot proceed; blocked_by explains why
    "done",         # finished and verified
    "dropped",      # deliberately abandoned; kept for dedupe memory
)

ACTIVE_STATUSES = ("inbox", "ready", "in_progress", "blocked")
TERMINAL_STATUSES = ("done", "dropped")

SOURCE_KINDS = (
    "gmail",
    "calendar",
    "notion",
    "drive",
    "github",
    "conversation",
    "manual",
)

# Who may act on an item without a human in the loop.
AUTONOMY = (
    "auto",     # executor may complete and open a PR unattended
    "propose",  # executor may do the work but must stop at a draft/proposal
    "ask",      # executor must surface a question and not act
)

OUTCOME_RESULTS = ("success", "partial", "failed", "blocked", "skipped")


class ValidationError(ValueError):
    pass


# --- helpers ----------------------------------------------------------------


def now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def parse_iso(value: str | None) -> datetime | None:
    if not value:
        return None
    try:
        dt = datetime.fromisoformat(value)
    except ValueError:
        return None
    return dt if dt.tzinfo else dt.replace(tzinfo=timezone.utc)


def age_days(value: str | None, *, ref: datetime | None = None) -> float:
    dt = parse_iso(value)
    if dt is None:
        return 0.0
    ref = ref or datetime.now(timezone.utc)
    return max(0.0, (ref - dt).total_seconds() / 86400.0)


def new_id() -> str:
    seed = f"{time.time_ns()}".encode()
    return "wl_" + hashlib.sha1(seed).hexdigest()[:8]


_LATIN = re.compile(r"[a-z0-9]+")
_CJK = re.compile(r"[぀-ヿ㐀-䶿一-鿿]+")
_STOP = {"the", "a", "an", "to", "for", "of", "and", "or", "in", "on", "with"}


def _tokens(text: str) -> set[str]:
    """Tokenise mixed Japanese/English text without a morphological analyser.

    Latin runs are words; CJK runs are cut into character bigrams. Bigrams
    matter because Japanese has no spaces -- "AGENTS.mdを磨く" and
    "AGENTS.md を磨く" tokenise identically only if the CJK side is split
    below the whitespace level.
    """
    lowered = text.lower()
    out = {t for t in _LATIN.findall(lowered) if t not in _STOP}
    for run in _CJK.findall(lowered):
        if len(run) == 1:
            out.add(run)
        else:
            out.update(run[i:i + 2] for i in range(len(run) - 1))
    return out


def dedupe_key(title: str) -> str:
    """Order-insensitive fingerprint of a title, used to catch re-captures.

    The harvester re-reads the same inbox and the same Notion pages every day,
    so without this every run would pile up duplicates of yesterday's items.
    """
    tokens = _tokens(title)
    if not tokens:
        tokens = {title.strip().lower()}
    return hashlib.sha1(" ".join(sorted(tokens)).encode()).hexdigest()[:16]


def similarity(a: str, b: str) -> float:
    """Jaccard overlap of two titles' tokens, for near-duplicate reporting."""
    ta, tb = _tokens(a), _tokens(b)
    if not ta or not tb:
        return 0.0
    return len(ta & tb) / len(ta | tb)


# --- item construction / validation -----------------------------------------


def make_item(
    title: str,
    *,
    detail: str = "",
    source_kind: str = "manual",
    source_ref: str = "",
    status: str = "inbox",
    value: int = 3,
    effort: int = 3,
    confidence: float = 0.6,
    autonomy: str = "propose",
    pin: float = 0.0,
    tags: list[str] | None = None,
    blocked_by: str = "",
    due: str | None = None,
) -> dict:
    ts = now_iso()
    item = {
        "id": new_id(),
        "title": title.strip(),
        "detail": detail.strip(),
        "source": {
            "kind": source_kind,
            "ref": source_ref,
            "captured_at": ts,
        },
        "status": status,
        "value": value,
        "effort": effort,
        "confidence": confidence,
        "autonomy": autonomy,
        "pin": pin,
        "tags": tags or [],
        "blocked_by": blocked_by,
        "due": due,
        "attempts": 0,
        "last_attempt": None,
        "outcomes": [],
        "dedupe_key": dedupe_key(title),
        "created_at": ts,
        "updated_at": ts,
    }
    validate(item)
    return item


def validate(item: dict) -> dict:
    if not item.get("id"):
        raise ValidationError("item is missing an id")
    if not item.get("title"):
        raise ValidationError(f"{item.get('id')}: title must not be empty")
    if item.get("status") not in STATUSES:
        raise ValidationError(
            f"{item['id']}: status {item.get('status')!r} not in {STATUSES}"
        )
    if item.get("source", {}).get("kind") not in SOURCE_KINDS:
        raise ValidationError(
            f"{item['id']}: source.kind {item.get('source', {}).get('kind')!r} "
            f"not in {SOURCE_KINDS}"
        )
    if item.get("autonomy") not in AUTONOMY:
        raise ValidationError(
            f"{item['id']}: autonomy {item.get('autonomy')!r} not in {AUTONOMY}"
        )
    for field in ("value", "effort"):
        v = item.get(field)
        if not isinstance(v, int) or not 1 <= v <= 5:
            raise ValidationError(f"{item['id']}: {field} must be an int in 1..5")
    c = item.get("confidence")
    if not isinstance(c, (int, float)) or not 0.0 <= c <= 1.0:
        raise ValidationError(f"{item['id']}: confidence must be a float in 0..1")
    if item["status"] == "blocked" and not item.get("blocked_by"):
        raise ValidationError(f"{item['id']}: blocked items require blocked_by")
    return item
