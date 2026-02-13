# F0.1: Archive Genesis — Design

```yaml
id: F0.1
title: Archive Genesis
epic: E0 (Documentation Homologation)
size: XS
complexity: Simple
status: design
created: 2026-02-13
```

---

## Problem

Legacy root files (`PRD.md`, `spec.md`) are orphaned at project root with unclear status. Project evolved from spec-kit (E1) to RaiSE — these genesis files need clear traceability and archive location.

## Value

- **Clear provenance:** Anyone entering the project knows these files are superseded
- **Establish pattern:** Archive-with-traceability becomes reusable homologation pattern
- **Clean root:** Project root focuses on active governance, not history

## Approach

Move legacy genesis files to archive location (`specs/000-genesis/`) with SUPERSEDED banners linking to current governance.

**Components affected:**
- **CREATE:** `specs/000-genesis/` directory
- **MOVE:** `PRD.md` → `specs/000-genesis/PRD.md`
- **MOVE:** `spec.md` → `specs/000-genesis/spec.md`
- **MODIFY:** Both files — add SUPERSEDED banner at top

## Examples

### File Structure (After)

```
carbtrack-ai/
├── specs/
│   └── 000-genesis/          ← NEW
│       ├── PRD.md            ← MOVED with banner
│       └── spec.md           ← MOVED with banner
├── governance/
│   └── prd.md                ← CURRENT (referenced in banner)
└── ...
```

### SUPERSEDED Banner Format

Add to top of both files:

```markdown
---
**⚠️ SUPERSEDED — GENESIS ARTIFACT**

This file is the original project genesis document (pre-RaiSE). It has been archived for historical reference.

**Current governance:** See `governance/prd.md` for active project requirements.

**Context:** This project evolved from spec-kit (Epic E1) to RaiSE framework (Epic E0+). Genesis files are preserved but superseded by RaiSE structure.

**Archived:** 2026-02-13 (Epic E0: Documentation Homologation)

---

[ORIGINAL CONTENT BELOW]
```

### References to Update

In banners:
- `PRD.md` banner → links to `governance/prd.md`
- `spec.md` banner → links to `governance/prd.md` (same, since spec.md was proto-PRD)

## Acceptance Criteria

### MUST
- [ ] `specs/000-genesis/` directory created
- [ ] `PRD.md` moved to `specs/000-genesis/PRD.md` with SUPERSEDED banner
- [ ] `spec.md` moved to `specs/000-genesis/spec.md` with SUPERSEDED banner
- [ ] Banners link to current governance (`governance/prd.md`)
- [ ] No broken references in CLAUDE.md or other docs pointing to old paths

### MUST NOT
- [ ] Rewrite or modify original content (only add banner)
- [ ] Delete files (move, don't remove)

---

## Architectural Context

**Module:** N/A (documentation work, no code modules)
**Domain:** Governance (documentation structure)
**Constraints:** None (file organization)

---

## Notes

- **Complexity rationale:** Simple (2 files, trivial logic) — minimal spec
- **Git history:** Moving files preserves git history (git mv)
- **Pattern:** This archive-with-banner pattern is reusable for future homologations

---

*Created: 2026-02-13*
*Next: `/rai-story-plan F0.1`*
