# Implementation Plan: F0.4 Document ADRs

## Overview
- **Feature:** F0.4 (Document ADRs)
- **Epic:** E0 (Documentation Homologation)
- **Milestone:** M2 (Core MVP)
- **Feature Size:** S (~60 min baseline, ~30 min with 2.0x velocity)
- **Created:** 2026-02-13

## Tasks

### Task 1: Create ADR-001 (Index vs Move)
- **Description:** Document the decision to index E1 spec-kit artifacts from RaiSE structure instead of relocating them. Captures the rationale from F0.1 (archive pattern) and F0.2 (index pattern).
- **Files:**
  - `dev/decisions/` (create directory if doesn't exist)
  - `dev/decisions/ADR-001-index-vs-move.md` (create)
- **TDD Cycle:** N/A (documentation)
- **Content Requirements:**
  - **Decision:** Index E1 artifacts from RaiSE instead of moving them
  - **Rationale:** Preserve git history, avoid breaking spec-kit references
  - **Context:** Reference F0.1 (commit b6f6bd8) and F0.2 (commit fb4212a)
  - **Consequences:**
    - Positive: Git history intact, existing references unbroken, RaiSE navigation established
    - Negative: Docs in two places (specs/001/ and work/epics/e1/), need to maintain index
  - **References:** Link to F0.1, F0.2 commits and work/epics/e1-mvp-asistente-ch/design.md
- **Verification:**
  - [ ] File exists at `dev/decisions/ADR-001-index-vs-move.md`
  - [ ] Contains all required sections (Decision, Rationale, Context, Consequences, References)
  - [ ] References F0.1 and F0.2 commits (traceability)
  - [ ] Concise (100-150 lines)
  - [ ] Readable and well-structured (manual review)
- **Size:** XS (~10-15 min)
- **Dependencies:** None

---

### Task 2: Create ADR-002 (Canonical Nomenclature)
- **Description:** Document the decision to establish RF-NN (governance) as canonical nomenclature, with FR-NNN (spec-kit) as legacy. Captures the rationale from F0.3.
- **Files:**
  - `dev/decisions/ADR-002-canonical-nomenclature.md` (create)
- **TDD Cycle:** N/A (documentation)
- **Content Requirements:**
  - **Decision:** RF-NN (governance/prd.md) is canonical, FR-NNN (spec-kit) is legacy
  - **Rationale:** Single source of truth for requirements across documentation layers
  - **Context:** Reference F0.3 (commit fb4212a), FR→RF mapping table in specs/001-mvp-asistente-ch/spec.md
  - **Consequences:**
    - Positive: Clear canonical source, governance-level requirements, E3+ uses RF-NN exclusively
    - Negative: Need to maintain FR→RF mapping for legacy spec-kit references
  - **References:** Link to F0.3 commit, governance/prd.md, specs/001-mvp-asistente-ch/spec.md
- **Verification:**
  - [ ] File exists at `dev/decisions/ADR-002-canonical-nomenclature.md`
  - [ ] Contains all required sections (Decision, Rationale, Context, Consequences, References)
  - [ ] References F0.3 commit (traceability)
  - [ ] Concise (100-150 lines)
  - [ ] Readable and well-structured (manual review)
- **Size:** XS (~10-15 min)
- **Dependencies:** None

---

### Task 3: Create ADR-003 (RaiSE-Native Design)
- **Description:** Document the decision that E3+ design artifacts live in `work/epics/eN/`, with `specs/` becoming a historical archive. Establishes forward-looking convention.
- **Files:**
  - `dev/decisions/ADR-003-raise-native-design.md` (create)
- **TDD Cycle:** N/A (documentation)
- **Content Requirements:**
  - **Decision:** E3+ design artifacts live in `work/epics/eN/` (RaiSE structure), `specs/` becomes historical
  - **Rationale:** Clear separation of active vs archived documentation, native RaiSE design from day 1
  - **Context:** Reference F0.1-F0.3 homologation pattern, ADR-001 (index pattern)
  - **Consequences:**
    - Positive: No homologation needed for E3+, clear active/archive separation, RaiSE-native from start
    - Negative: Requires discipline to not create new specs/ artifacts (enforce via convention)
  - **References:** Link to ADR-001, F0.1-F0.3 commits, work/epics/e0-doc-homologation/scope.md
- **Verification:**
  - [ ] File exists at `dev/decisions/ADR-003-raise-native-design.md`
  - [ ] Contains all required sections (Decision, Rationale, Context, Consequences, References)
  - [ ] References F0.1-F0.3 and ADR-001 (cross-reference)
  - [ ] Concise (100-150 lines)
  - [ ] Readable and well-structured (manual review)
- **Size:** XS (~10-15 min)
- **Dependencies:** None (but references ADR-001 conceptually)

---

### Task 4: Manual Integration Test
- **Description:** Validate that all 3 ADRs are complete, readable, traceable, and consumable by F0.5 (Go-Forward Convention). This is the final validation before marking F0.4 complete.
- **Verification:**
  - [ ] All 3 ADR files exist in `dev/decisions/`
  - [ ] Each ADR contains Decision, Rationale, Context, Consequences, References
  - [ ] Traceability: ADR-001 refs F0.1-F0.2, ADR-002 refs F0.3, ADR-003 refs F0.1-F0.3 + ADR-001
  - [ ] Cross-references resolve (no broken links)
  - [ ] ADRs are concise (100-150 lines each)
  - [ ] Readable and well-structured (can be reviewed in <5 min)
  - [ ] F0.5 can reference these ADRs clearly (imagine reading ADR-003 for go-forward convention)
  - [ ] Pattern validated: Decision + Rationale + Context + Consequences = reusable ADR format
- **Size:** XS (~5 min)
- **Dependencies:** Task 1, Task 2, Task 3

---

## Execution Order

```
Task 1 (ADR-001) ─┐
Task 2 (ADR-002) ─┤ parallel (independent ADRs)
Task 3 (ADR-003) ─┘
         │
         v
Task 4 (Integration Test) ← final validation
```

**Optimal sequence:**
1. Task 1 (ADR-001) — Foundation, establishes format
2. Task 2 (ADR-002) — Independent, can run parallel but keep sequential for focus
3. Task 3 (ADR-003) — Cross-refs ADR-001, so after Task 1 is cleaner
4. Task 4 (Integration Test) — Final validation

**Note:** Tasks 1-3 are independent and *could* run in parallel, but sequential execution is cleaner for documental work (maintain mental model, consistent format).

---

## Risks

| Risk | Likelihood | Mitigation |
|------|:----------:|------------|
| **Over-engineering format** — Adding unnecessary complexity to simple ADR format | Medium | Follow design template (Decision, Rationale, Context, Consequences, References). No tooling, no index for 3 ADRs. |
| **Missing traceability** — ADRs don't reference F0.1-F0.3 commits | Low | Explicit verification criteria include commit references. Use `git log --oneline` to find commit hashes. |
| **Inconsistent format** — ADRs don't match each other | Low | Task 1 establishes format, Tasks 2-3 follow. Manual integration test validates consistency. |

---

## Duration Tracking

| Task | Size | Estimated | Actual | Notes |
|------|:----:|:---------:|:------:|-------|
| 1: ADR-001 | XS | 10-15 min | -- | (filled during implementation) |
| 2: ADR-002 | XS | 10-15 min | -- | |
| 3: ADR-003 | XS | 10-15 min | -- | |
| 4: Integration Test | XS | 5 min | -- | Final validation |
| **Total** | **S** | **~35-50 min** | **--** | Baseline: 60 min, with 2.0x velocity: ~30 min |

**Baseline estimate:** 60 min (S-sized)
**With 2.0x velocity:** ~30 min actual (based on M1 calibration)
**Task-level estimate:** 35-50 min (slightly more conservative)

---

## Notes

- **Format:** Lightweight markdown (no tooling needed)
- **Traceability:** Each ADR references F0.1-F0.3 commits via git hashes
- **Cross-references:** ADR-003 references ADR-001 (index pattern)
- **Reusability:** Pattern (Decision + Rationale + Context + Consequences) is project-agnostic
- **Next feature:** F0.5 (Go-Forward Convention) will consume these ADRs

---

*Plan created: 2026-02-13*
*Next: `/rai-story-implement` to execute tasks*
