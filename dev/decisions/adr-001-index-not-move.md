# ADR-001: Index spec-kit artifacts from RaiSE instead of moving them

> **Status:** Proposed
> **Date:** 2026-02-13
> **Epic:** E0 (Documentation Homologation)
> **Deciders:** Francisco Castrillo, Rai

---

## Context

Epic E1 (MVP Asistente CH) was designed using spec-kit before the project adopted RaiSE. Seven design artifacts exist in `specs/001-mvp-asistente-ch/` (spec.md, tasks.md, plan.md, data-model.md, contracts/, quickstart.md, research.md, ACCEPTED_DEBT.md). These need to be navigable from RaiSE's `work/` structure without losing their historical context.

Two approaches were considered: physically moving the files into `work/epics/e1/`, or creating an index document that references them in place.

## Decision

**Create `work/epics/e1-mvp-asistente-ch/design.md` as an index that references each spec-kit artifact with its purpose and path.** Artifacts remain in `specs/001-mvp-asistente-ch/` untouched.

The index includes an `_origin: spec-kit (pre-RaiSE)` marker to make it explicit that E1 predates RaiSE adoption.

## Consequences

**Positive:**
- Preserves git history — all commits referencing `specs/001/` paths remain valid
- Honest about the process — E1 *was* designed with spec-kit, not RaiSE
- Non-destructive — no risk of breaking existing references (CLAUDE.md, commit messages)
- Aligns with RAI-VAL-1 (Honesty) and RAI-VAL-3 (Observability)

**Negative:**
- Two locations for E1 design: `specs/001/` (content) and `work/epics/e1/` (index)
- Mitigated by explicit cross-references in both directions

**Neutral:**
- Future epics (E3+) won't have this duality — they use RaiSE-native design (ADR-003)

## Alternatives Considered

### Move files to `work/epics/e1/`
- **Rejected because:** Rewrites history, breaks git references, violates RAI-VAL-1
- Would create the illusion that E1 was designed under RaiSE, which is false
