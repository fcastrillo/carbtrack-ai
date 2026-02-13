# Implementation Plan: F0.3 Canonicalize Requirements

## Overview
- **Feature:** F0.3 (Canonicalize Requirements)
- **Epic:** E0 (Documentation Homologation)
- **Story Points:** XS
- **Feature Size:** XS
- **Created:** 2026-02-13
- **Design:** Skipped (Simple documentation feature, applying F0.1 learning)

## Tasks

### Task 1: Establish Canonical Nomenclature
- **Description:** Add FR→RF mapping table to `specs/001-mvp-asistente-ch/spec.md` and declare RF-NN as canonical nomenclature in `governance/prd.md`
- **Files:**
  - MODIFY: `specs/001-mvp-asistente-ch/spec.md` (add FR→RF mapping table)
  - MODIFY: `governance/prd.md` (declare RF-NN canonical)
- **TDD Cycle:** N/A (documentation)
- **Verification:**
  - [ ] FR→RF mapping table added to spec.md (shows legacy FR-N maps to canonical RF-NN)
  - [ ] Table is complete (all FR items from spec-kit have RF equivalents)
  - [ ] Canonical declaration added to governance/prd.md (RF-NN is the standard)
  - [ ] Context explains why RF-NN (governance) supersedes FR-N (spec-kit)
  - [ ] No broken references to FR-N in active docs (or marked as legacy with RF mapping)
- **Size:** S (~20 min)
- **Dependencies:** None

### Task 2: Manual Integration Test
- **Description:** Validate nomenclature is clear, mapping is complete, canonical declaration is unambiguous
- **Verification:**
  - [ ] Open `specs/001-mvp-asistente-ch/spec.md` — FR→RF table is present and readable
  - [ ] Open `governance/prd.md` — RF-NN canonical declaration is clear
  - [ ] Cross-check: all FR items have RF mappings (no orphans)
  - [ ] Future clarity: anyone using the project knows RF-NN is canonical
  - [ ] Demo: Explain nomenclature bridge (spec-kit FR → RaiSE RF)
- **Size:** XS (~5 min)
- **Dependencies:** Task 1

## Execution Order

1. **Task 1** — Establish nomenclature (foundation)
2. **Task 2** — Manual Integration Test (final validation)

**Parallelism:** None (sequential, Task 2 depends on Task 1)

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|:----------:|:------:|------------|
| **Incomplete FR→RF mapping** | Low | Medium | Scan spec.md for all FR references before creating table |
| **Ambiguous canonical declaration** | Low | Medium | Use clear, unambiguous language in governance/prd.md (e.g., "RF-NN is canonical; FR-N is legacy") |
| **Confusion about which to use** | Low | Low | Explicit statement: "Use RF-NN for all future work; FR-N is for historical reference only" |

## Duration Tracking

| Task | Size | Actual | Notes |
|------|:----:|:------:|-------|
| Task 1 | S | -- | Add mapping + canonical declaration |
| Task 2 | XS | -- | Integration test |
| **Total** | **~25 min** | -- | XS feature estimate (applying 2.0x doc velocity from F0.1) |

---

## Notes

- **Design skipped:** Applied F0.1 learning — XS/S doc features skip design, go straight to plan
- **Nomenclature context:**
  - **FR-N** (legacy): Functional Requirements from spec-kit (e.g., FR1, FR2, FR3)
  - **RF-NN** (canonical): Requerimientos Funcionales from RaiSE governance (e.g., RF-01, RF-02, RF-03)
- **Mapping table format:** Simple 2-column table (Legacy FR | Canonical RF | Description)
- **Canonical declaration:** Add to governance/prd.md introduction or definitions section

---

*Plan created: 2026-02-13*
*Next: `/rai-story-implement F0.3` (or implement F0.2 + F0.3 in parallel)*
