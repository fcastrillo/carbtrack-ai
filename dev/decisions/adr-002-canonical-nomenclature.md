# ADR-002: RF-NN as canonical requirement nomenclature

> **Status:** Proposed
> **Date:** 2026-02-13
> **Epic:** E0 (Documentation Homologation)
> **Deciders:** Francisco Castrillo, Rai

---

## Context

Two requirement numbering schemes coexist in the project:

- `governance/prd.md` uses **RF-01 through RF-07** (product-level requirements)
- `specs/001-mvp-asistente-ch/spec.md` uses **FR-001 through FR-010** (feature-level functional requirements)

Both are valid — they operate at different levels of abstraction (product vs feature). However, the lack of explicit mapping creates ambiguity when referencing requirements across documents. Future epics need a single canonical scheme.

## Decision

**RF-NN (governance/prd.md) is the canonical requirement nomenclature.** All future requirements use RF-NN format. Feature-level specs reference RF-NN when tracing back to product requirements.

For E1 specifically: add a mapping table (FR→RF) to `specs/001-mvp-asistente-ch/spec.md` as an appendix. Do not rename FR-NNN within the spec — the document is closed and renaming would be a rewrite with no value.

## Consequences

**Positive:**
- Single source of truth at product level (`governance/prd.md`)
- Clear traceability: epic scope → RF-NN → implementation
- E3/E4 start with RF-NN from day 1 — no dual nomenclature

**Negative:**
- `specs/001/` retains FR-NNN alongside mapping — dual nomenclature in a closed document
- Mitigated: E1 is complete; the mapping table provides explicit bridge

**Neutral:**
- FR-NNN remains valid as a historical convention for spec-kit artifacts

## Alternatives Considered

### Rename FR→RF inside spec.md
- **Rejected because:** Rewrites a closed document for cosmetic consistency. No behavioral change. Violates "restructure only, no rewrites" rule for E0.

### Keep both schemes without mapping
- **Rejected because:** Creates ambiguity for future readers. A simple mapping table costs almost nothing and adds clarity.
