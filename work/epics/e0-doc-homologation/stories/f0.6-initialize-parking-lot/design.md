---
title: "F0.6 — Initialize Parking Lot"
epic: "E0"
feature: "F0.6"
phase: "design"
created: "2026-02-13"
status: "active"
---

# Design: Initialize Parking Lot (E0 Closure)

## Problem & Value

**Problem:** E0 and RaiSE adoption generate deferred items (nice-to-haves, framework improvements, calibration work). Without a tracking location, these are lost or duplicated.

**Value:** Parking lot becomes the single source of truth for future work, enabling clear prioritization for E3+ and continuous framework improvement.

---

## Approach

**What:** Create `dev/parking-lot.md` with deferred items from E0 + framework improvements discovered during this epic.

**Format:**
- Item (descriptive title)
- Category (E0 defer, framework improvement, calibration)
- Reason (why deferred)
- Suggested timeline (next 2-3 epics, future consideration)
- Priority (optional)

**Examples of items to include:**
- Readability metrics for documentation (discovered in F0.5)
- Separation of builder and verifier (known limitation in skill design)
- Word count differentiation for documentation types (discovered in F0.5)
- ADR-based feature tracking (framework idea)
- Pattern index generator (future automation)

---

## Examples

### Example: Parking Lot Entry Format

```markdown
## Readability Metrics for Documentation

**Category:** Framework improvement
**Origin:** F0.5 retrospective (Go-Forward Convention)
**Reason:** Integration test validates navigation, not readability. Flesch-Kincaid score would add signal without significant cost.
**Suggested timeline:** E1-E3 (evaluate after more documentation epics)
**Priority:** Medium
```

### Example: Complete Structure

```markdown
# Parking Lot

## Active Items

### Readability Metrics for Documentation
- **Category:** Framework improvement
- **Origin:** F0.5 / word count mismatch
- **Suggestion:** Add Flesch-Kincaid score (target 60-70) to documentation acceptance criteria
- **Timeline:** E1-E3 + (2-3 months)
- **Effort estimate:** <5 min per doc

### Separation of Builder and Verifier
- **Category:** Process improvement
- **Origin:** `/rai-story-design` skill limitations (self-review is "muda")
- **Suggestion:** Create `/quality-review` skill for independent specification review
- **Timeline:** Future (framework evolution)
- **Effort estimate:** 2-3 hours design + implementation

### Document Feature Task Decomposition Patterns
- **Category:** Framework documentation
- **Origin:** F0.5 and F0.6 learnings
- **Suggestion:** Update `/rai-story-plan` with guidance for documentation vs code vs infrastructure decomposition
- **Timeline:** E1 (before next documentation-heavy epic)
- **Effort estimate:** 1-2 hours
```

---

## Acceptance Criteria

### MUST

- [ ] `dev/parking-lot.md` created (not deferred beyond E0 close)
- [ ] At least 5 deferred items documented (from E0 retrospectives)
- [ ] Each item has: title, category, origin, reason, timeline
- [ ] Clear format (consistent structure, scannable)
- [ ] No TODOs or incomplete sections

### SHOULD

- [ ] Include effort estimates (where known)
- [ ] Categorized by type (framework, process, documentation, calibration)
- [ ] Linked to originating feature/session when relevant

---

## Key Principle

Parking lot is a **living document**, not a static dump. It should be:
- **Scannable** — Eye can quickly find categories and priorities
- **Actionable** — Clear enough for future epic owners to evaluate
- **Traceable** — Links to feature/ADR/session that generated the item

---

**Design created:** 2026-02-13
**Next:** `/rai-story-plan` → Decompose into implementation tasks
