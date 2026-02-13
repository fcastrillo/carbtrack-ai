# ADR-002: Canonical Nomenclature

**Status:** Accepted
**Date:** 2026-02-13
**Context:** Epic E0 (Documentation Homologation)

---

## Decision

**RF-NN (from `governance/prd.md`) is the canonical requirement nomenclature** for the CarbTrack AI project. All future requirements use the RF-NN format. Feature-level specs reference RF-NN when tracing back to product-level requirements.

**FR-NNN (from spec-kit `specs/001-mvp-asistente-ch/spec.md`) is legacy nomenclature**, preserved for historical reference but superseded by RF-NN.

---

## Rationale

### Why RF-NN as Canonical

**Single source of truth at product level:**
- `governance/prd.md` defines product-level requirements (RF-01 through RF-07)
- These are governance-level decisions that shape all epics
- RF-NN provides stable anchor points for epic scope and feature design

**Clear traceability:**
- Epic scope → RF-NN (product requirement)
- Story design → RF-NN (traces back to product value)
- Implementation → RF-NN (validates product alignment)

**Future-facing:**
- E3+ epics start with RF-NN from day 1
- No dual nomenclature in new artifacts
- Consistent requirement language across the project

### Why FR-NNN is Legacy

**Historical context:**
- E1 (MVP Asistente CH) was designed using spec-kit before RaiSE adoption
- `specs/001-mvp-asistente-ch/spec.md` defined 10 feature-level requirements (FR-001 through FR-010)
- These were valid for E1 scope but operated at a different abstraction level (feature vs product)

**Coexistence creates ambiguity:**
- Two numbering schemes with unclear relationship
- No explicit mapping between FR-NNN and RF-NN
- Future readers can't determine which is authoritative

### Alternatives Considered

**Alternative 1: Rename FR→RF inside spec.md**
- **Pros:** Single nomenclature everywhere, cosmetic consistency
- **Cons:** Rewrites a closed document (E1 is complete), violates "restructure only, no rewrites" rule for E0, no behavioral change
- **Rejected:** Cosmetic rewrite with no value, breaks "no content changes" principle

**Alternative 2: Keep both schemes without mapping**
- **Pros:** Preserves both as-is, zero work
- **Cons:** Perpetuates ambiguity, future readers unclear which to reference
- **Rejected:** Lack of clarity defeats homologation purpose

**Alternative 3: FR-NNN as canonical, deprecate RF-NN**
- **Pros:** Feature-level detail might be more specific
- **Cons:** Loses product-level governance anchor, FR-NNN is spec-kit-specific (not portable to E3+)
- **Rejected:** Product-level requirements are more stable and portable

---

## Context

### What Led to This Decision

**F0.3 (Canonicalize Requirements)** established the RF-NN canonical declaration:
- Added FR→RF mapping table to `specs/001-mvp-asistente-ch/spec.md`
- Mapped 10 FR entries: 7 to governance RFs, 3 to UI/technical implementation
- Added canonical nomenclature declaration to `governance/prd.md` introduction
- Commit: `fb4212a` (2026-02-13)

The mapping revealed that FR-NNN includes both product-level requirements (map to RF-NN) and implementation details (no RF equivalent). This reinforced that FR-NNN operates at mixed abstraction levels, while RF-NN is purely product-level.

### FR→RF Mapping Summary

From `specs/001-mvp-asistente-ch/spec.md`:

| FR (spec-kit) | RF (governance) | Notes |
|---------------|-----------------|-------|
| FR-001 | RF-01 | Photo-based meal recognition |
| FR-002 | RF-02 | Daily carb tracking |
| FR-003 | RF-03 | CareLink CSV import |
| FR-004 | RF-04 | Retrospective audit engine |
| FR-005 | RF-05 | Manual profile management |
| FR-006 | RF-06 | Dual-mode operation |
| FR-007 | RF-07 | Nightscout integration |
| FR-008 | (UI/technical) | Educadies catalog display |
| FR-009 | (UI/technical) | Meal history display |
| FR-010 | (UI/technical) | Manual correction UI |

**7 of 10 FR entries map to RF-NN** (product-level). 3 are implementation details with no governance equivalent.

### Project State

- RF-01 through RF-07 defined in `governance/prd.md`
- FR-001 through FR-010 defined in `specs/001-mvp-asistente-ch/spec.md`
- Mapping table added as appendix to spec.md
- E1 complete, E3+ will use RF-NN exclusively

---

## Consequences

### Positive

✅ **Single source of truth** — `governance/prd.md` is canonical for product-level requirements

✅ **Clear traceability** — Epic scope → RF-NN → Story design → Implementation

✅ **E3+ simplicity** — Future epics use RF-NN from day 1, no dual nomenclature

✅ **Stable anchor** — Product-level requirements change less frequently than feature-level details

✅ **Governance alignment** — Requirements live in governance layer, not feature specs

### Negative

⚠️ **Dual nomenclature in closed document** — `specs/001-mvp-asistente-ch/spec.md` retains FR-NNN alongside mapping table

⚠️ **Abstraction mismatch** — RF-NN is product-level (7 requirements), FR-NNN is feature-level (10 requirements, includes implementation details)

⚠️ **Legacy references** — Existing commits/docs may reference FR-NNN, readers must consult mapping table

### Mitigation

- **Dual nomenclature:** Acceptable tradeoff — E1 is complete, document closed, mapping table provides explicit bridge
- **Abstraction mismatch:** Documented via mapping table, 3 FR entries explicitly marked as "(UI/technical)"
- **Legacy references:** Mapping table in spec.md serves as rosetta stone for FR→RF translation

---

## References

### Related Work

- **F0.3: Canonicalize Requirements** — Commit `fb4212a` (2026-02-13)
  - FR→RF mapping table added to `specs/001-mvp-asistente-ch/spec.md`
  - Canonical declaration added to `governance/prd.md`

### Impacted Files

- `governance/prd.md` (canonical nomenclature declaration added)
- `specs/001-mvp-asistente-ch/spec.md` (FR→RF mapping table added as appendix)

### Related ADRs

- **ADR-003: RaiSE-Native Design** — E3+ epics will use RF-NN from design phase (no FR-NNN)

---

## Notes

This ADR establishes a forward-looking convention: RF-NN is canonical, FR-NNN is historical. The coexistence is transitional — E1 was designed with spec-kit (FR-NNN), E3+ will use RaiSE (RF-NN).

The mapping table serves as a bridge, not a permanent fixture. Future epics won't need FR-NNN mapping because they'll use RF-NN natively.

---

*ADR-002 accepted: 2026-02-13*
*Epic: E0 (Documentation Homologation)*
*Feature: F0.4 (Document ADRs)*
