# Implementation Plan: F0.1 Archive Genesis

## Overview
- **Feature:** F0.1 (Archive Genesis)
- **Epic:** E0 (Documentation Homologation)
- **Story Points:** XS
- **Feature Size:** XS
- **Created:** 2026-02-13

## Tasks

### Task 1: Archive Genesis Files
- **Description:** Create archive directory, move legacy genesis files with git history preservation, and add SUPERSEDED banners linking to current governance
- **Files:**
  - CREATE: `specs/000-genesis/` (directory)
  - MOVE: `PRD.md` → `specs/000-genesis/PRD.md`
  - MOVE: `spec.md` → `specs/000-genesis/spec.md`
  - MODIFY: Both files (add SUPERSEDED banner at top)
- **TDD Cycle:** N/A (file operations — verification is structural)
- **Verification:**
  - [ ] Directory `specs/000-genesis/` exists
  - [ ] `PRD.md` and `spec.md` moved to new location (use `git mv` for history)
  - [ ] Both files have SUPERSEDED banner at top with link to `governance/prd.md`
  - [ ] Original root locations are empty (files removed)
  - [ ] No broken references in `CLAUDE.md` (verify paths still valid)
  - [ ] `git log --follow specs/000-genesis/PRD.md` shows full history
- **Size:** S (~30 min)
- **Dependencies:** None

### Task 2: Manual Integration Test
- **Description:** Validate archive is navigable, banners are clear, and pattern is reusable
- **Verification:**
  - [ ] Navigate to `specs/000-genesis/` — directory structure is clean
  - [ ] Open both archived files — SUPERSEDED banners are prominent
  - [ ] Click banner links — references to `governance/prd.md` are valid
  - [ ] Run `git log --follow specs/000-genesis/PRD.md` — git history preserved
  - [ ] Verify CLAUDE.md still references correct paths (no breaks)
  - [ ] Demo: Explain archive pattern to external reviewer (clear provenance)
- **Size:** XS (~10 min)
- **Dependencies:** Task 1

## Execution Order

1. **Task 1** — Archive files (foundation)
2. **Task 2** — Manual Integration Test (final validation)

**Parallelism:** None (sequential, Task 2 depends on Task 1)

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|:----------:|:------:|------------|
| **Git history lost on move** | Low | Medium | Use `git mv` instead of move+delete; verify with `git log --follow` |
| **Broken CLAUDE.md references** | Low | Medium | Explicitly check CLAUDE.md in Task 1 verification |
| **Banner format unclear** | Low | Low | Follow exact format from design.md; verify readability in Task 2 |

## Duration Tracking

| Task | Size | Actual | Notes |
|------|:----:|:------:|-------|
| Task 1 | S | -- | Archive files + banners |
| Task 2 | XS | -- | Integration test |
| **Total** | **~40 min** | -- | XS feature estimate |

---

## Notes

- **Git history preservation:** Use `git mv` to maintain file history across the move
- **SUPERSEDED banner format:** Copy exact format from `design.md` for consistency
- **Pattern validation:** Task 2 validates this archive pattern is reusable for future homologations
- **Simplicity:** 2 tasks for XS feature — avoid over-decomposition

---

*Plan created: 2026-02-13*
*Next: `/rai-story-implement F0.1`*
