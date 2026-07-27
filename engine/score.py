"""The prioritisation model.

Deliberately a plain function rather than a judgement call the model re-makes
each run. Two agents scoring the same backlog on different days must get the
same order, otherwise the "top of the list" churns and nothing ever finishes.

The model reads:

    base            value x confidence / effort   -- classic bang-for-buck
    age_boost       old items drift upward        -- anti-starvation
    attempt_decay   repeatedly-failed items sink  -- anti-infinite-loop
    due_pressure    deadlines pull forward
    pin             manual override, flat additive

`explain()` returns the term-by-term breakdown so the prioritiser agent can
say *why* something moved instead of asserting a new order.
"""

from __future__ import annotations

from datetime import datetime, timezone

from schema import ACTIVE_STATUSES, age_days, parse_iso

# Tunables. Changing these changes the machine's taste; keep the diff small
# and note the reasoning in ops/routines.md.
AGE_FULL_BOOST_DAYS = 30.0   # an item this old gets the full age boost
MAX_AGE_BOOST = 0.60         # +60% at most, so age never outranks real value
ATTEMPT_DECAY = 0.65         # multiplier per prior failed attempt
BLOCKED_MULTIPLIER = 0.15    # blocked work stays visible but well down
IN_PROGRESS_BOOST = 1.25     # finish what you started
DUE_HORIZON_DAYS = 14.0      # deadlines inside this window start pulling
MAX_DUE_BOOST = 1.50


def _failed_attempts(item: dict) -> int:
    """Attempts that ended badly. A partial success resets the decay."""
    failures = 0
    for outcome in item.get("outcomes", []):
        result = outcome.get("result")
        if result in ("failed", "blocked"):
            failures += 1
        elif result in ("success", "partial"):
            failures = 0
    return failures


def _due_pressure(item: dict, ref: datetime) -> float:
    due = parse_iso(item.get("due"))
    if due is None:
        return 1.0
    days_left = (due - ref).total_seconds() / 86400.0
    if days_left >= DUE_HORIZON_DAYS:
        return 1.0
    if days_left <= 0:
        return MAX_DUE_BOOST
    closeness = 1.0 - (days_left / DUE_HORIZON_DAYS)
    return 1.0 + (MAX_DUE_BOOST - 1.0) * closeness


def explain(item: dict, *, ref: datetime | None = None) -> dict:
    ref = ref or datetime.now(timezone.utc)

    value = item.get("value", 3)
    effort = max(1, item.get("effort", 3))
    confidence = item.get("confidence", 0.6)

    base = (value * confidence) / effort

    age = age_days(item.get("created_at"), ref=ref)
    age_boost = 1.0 + MAX_AGE_BOOST * min(age / AGE_FULL_BOOST_DAYS, 1.0)

    failures = _failed_attempts(item)
    attempt_decay = ATTEMPT_DECAY ** failures

    due_pressure = _due_pressure(item, ref)

    status = item.get("status", "inbox")
    if status == "blocked":
        status_mult = BLOCKED_MULTIPLIER
    elif status == "in_progress":
        status_mult = IN_PROGRESS_BOOST
    else:
        status_mult = 1.0

    score = base * age_boost * attempt_decay * due_pressure * status_mult
    score += item.get("pin", 0.0)

    return {
        "id": item.get("id"),
        "title": item.get("title"),
        "score": round(score, 4),
        "terms": {
            "base": round(base, 4),
            "age_boost": round(age_boost, 4),
            "attempt_decay": round(attempt_decay, 4),
            "due_pressure": round(due_pressure, 4),
            "status_mult": round(status_mult, 4),
            "pin": item.get("pin", 0.0),
        },
        "inputs": {
            "value": value,
            "effort": effort,
            "confidence": confidence,
            "age_days": round(age, 1),
            "failed_attempts": failures,
            "status": status,
        },
    }


def score(item: dict, *, ref: datetime | None = None) -> float:
    return explain(item, ref=ref)["score"]


def rank(items: list[dict], *, ref: datetime | None = None) -> list[dict]:
    """Active items, highest score first. Terminal items are excluded."""
    ref = ref or datetime.now(timezone.utc)
    active = [i for i in items if i.get("status") in ACTIVE_STATUSES]
    return sorted(active, key=lambda i: (-score(i, ref=ref), i.get("created_at", "")))
