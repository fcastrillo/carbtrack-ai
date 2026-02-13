# ADR-001: Index vs Move

**Status:** Accepted
**Date:** 2026-02-13
**Context:** Epic E0 (Documentation Homologation)

---

## Decision

**Index E1 spec-kit artifacts from the RaiSE structure** instead of relocating them to `work/epics/e1-mvp-asistente-ch/`.

The E1 epic artifacts remain in their original `specs/001-mvp-asistente-ch/` location, and a navigation index is created at `work/epics/e1-mvp-asistente-ch/design.md` that references them.

---

## Rationale

### Why Index (Not Move)

**Preserve git history:**
- Moving files breaks `git log` traceability unless using `--follow` flag
- Original file locations are visible in commit history
- Archaeology becomes harder when files are relocated

**Avoid breaking existing references:**
- `CLAUDE.md` references `specs/001-mvp-asistente-ch/spec.md`
- Spec-kit artifacts may be referenced in commits, issues, or external docs
- Moving creates risk of broken links

**Establish clear provenance:**
- Spec-kit artifacts stay in `specs/001/` with `_origin: spec-kit` marker
- RaiSE structure references them via index (bridge pattern)
- Clear separation: `specs/` = historical, `work/epics/` = active

### Alternatives Considered

**Alternative 1: Move all spec-kit files to `work/epics/e1/`**
- **Pros:** Single location for all E1 artifacts
- **Cons:** Breaks git history, high-risk operation, potential reference breakage
- **Rejected:** Too risky for marginal benefit

**Alternative 2: Leave unindexed (no RaiSE navigation)**
- **Pros:** Zero-risk (no changes)
- **Cons:** RaiSE structure doesn't acknowledge E1 existence, navigation gap
- **Rejected:** Defeats homologation purpose

**Alternative 3: Duplicate files in both locations**
- **Pros:** Preserves history, provides RaiSE navigation
- **Cons:** Content divergence risk, maintenance burden
- **Rejected:** Violates DRY, unsustainable

---

## Context

### What Led to This Decision

**F0.1 (Archive Genesis)** established the archive-with-traceability pattern:
- Legacy root files (`PRD.md`, `spec.md`) moved to `specs/000-genesis/`
- SUPERSEDED banners added linking to current governance
- Git history preserved via `git mv`
- Commit: `b6f6bd8` (2026-02-13)

**F0.2 (Index E1/E2 Design)** applied this principle to E1:
- Created `work/epics/e1-mvp-asistente-ch/design.md` index
- Indexed 8 spec-kit artifacts with `_origin: spec-kit` marker
- Established RaiSE navigation bridge to legacy artifacts
- Commit: `fb4212a` (2026-02-13)

The index approach emerged from F0.1's success with archiving: both preserve history while establishing new navigation patterns.

### Project State

- E1 (MVP Asistente CH) completed using spec-kit framework
- E0 (Documentation Homologation) migrating to RaiSE
- E3+ epics will use native RaiSE design (see ADR-003)
- CarbTrack AI project at early stage (~1 month old)

---

## Consequences

### Positive

✅ **Git history intact** — `git log specs/001-mvp-asistente-ch/spec.md` shows full history without `--follow` flag

✅ **Existing references unbroken** — `CLAUDE.md` and commit references remain valid

✅ **RaiSE navigation established** — `work/epics/e1-mvp-asistente-ch/design.md` provides structured index

✅ **Clear provenance** — `_origin: spec-kit` marker in index YAML frontmatter documents source framework

✅ **Reusable pattern** — Index-from-RaiSE approach applicable to other legacy framework migrations

### Negative

⚠️ **Documentation lives in two places** — `specs/001/` (original) and `work/epics/e1/` (index)

⚠️ **Index maintenance burden** — If spec-kit artifacts change (low likelihood, E1 is complete), index must be updated

⚠️ **Cognitive load** — Contributors must understand the bridge: `work/epics/e1/` is navigation, `specs/001/` is content

### Mitigation

- **Two-place concern:** Acceptable tradeoff — E1 is complete, changes unlikely
- **Index maintenance:** Low risk — E1 frozen, only E3+ will be active
- **Cognitive load:** Documented in ADR-002 and F0.5 (Go-Forward Convention)

---

## References

### Related Work

- **F0.1: Archive Genesis** — Commit `b6f6bd8` (2026-02-13)
  - Archive pattern: `specs/000-genesis/PRD.md`, `specs/000-genesis/spec.md`
  - SUPERSEDED banners with governance links

- **F0.2: Index E1/E2 Design** — Commit `fb4212a` (2026-02-13)
  - Index file: `work/epics/e1-mvp-asistente-ch/design.md`
  - Indexed artifacts: spec, data-model, plan, tasks, quickstart, research, contracts, ACCEPTED_DEBT

### Impacted Files

- `work/epics/e1-mvp-asistente-ch/design.md` (created)
- `specs/001-mvp-asistente-ch/*` (unchanged, referenced)

### Related ADRs

- **ADR-003: RaiSE-Native Design** — E3+ will not need indexing (native RaiSE from start)

---

## Notes

This ADR documents a transitional pattern for legacy framework homologation. Future epics (E3+) will use native RaiSE design and will not require this index-vs-move decision.

The pattern is reusable for other projects migrating from alternative SDD frameworks (e.g., Shape Up, JIRA epics) to RaiSE.

---

*ADR-001 accepted: 2026-02-13*
*Epic: E0 (Documentation Homologation)*
*Feature: F0.4 (Document ADRs)*
