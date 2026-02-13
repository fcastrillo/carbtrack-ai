# Feature Design: F0.4 Document ADRs

---
epic: E0
feature: F0.4
size: S
complexity: Simple
created: 2026-02-13
---

## Problem

After completing M1 (F0.1-F0.3), we made several architectural decisions about documentation homologation:
1. Archive legacy files with SUPERSEDED banners vs moving them
2. Index E1 artifacts from RaiSE vs relocating them
3. Establish RF-NN as canonical nomenclature vs FR-NNN

These decisions are undocumented. Future contributors (human or AI) won't understand the rationale behind the structure.

## Value

Documenting these as ADRs provides:
- **Traceability** — Why was this decision made? What was the context?
- **Reusability** — The homologation pattern can be applied to other projects
- **Clarity for E3+** — Future epics have clear conventions to follow
- **Foundation for F0.5** — Go-Forward Convention can reference these ADRs

## Approach

Create 3 Architecture Decision Records (ADRs) in `dev/decisions/` using a lightweight format:

**ADR-001: Index vs Move**
- Decision: Index E1 spec-kit artifacts from RaiSE structure instead of relocating them
- Rationale: Preserve git history, avoid breaking existing spec-kit references
- Context: F0.1 (archive pattern) and F0.2 (index pattern)

**ADR-002: Canonical Nomenclature**
- Decision: RF-NN (governance) is canonical, FR-NNN (spec-kit) is legacy
- Rationale: Single source of truth for requirements across documentation layers
- Context: F0.3 (FR→RF mapping table)

**ADR-003: RaiSE-Native Design**
- Decision: E3+ design artifacts live in `work/epics/eN/`, `specs/` becomes historical archive
- Rationale: Clear separation of active vs archived documentation
- Context: F0.1-F0.3 homologation pattern

**Components affected:**
- `dev/decisions/` directory (create)
- `dev/decisions/ADR-001-index-vs-move.md` (create)
- `dev/decisions/ADR-002-canonical-nomenclature.md` (create)
- `dev/decisions/ADR-003-raise-native-design.md` (create)

## Examples

### ADR Template Structure

```markdown
# ADR-NNN: {Title}

**Status:** Accepted
**Date:** 2026-02-13
**Context:** Epic E0 (Documentation Homologation)

## Decision

[One sentence: What are we doing?]

## Rationale

[Why this decision? What alternatives were considered?]

## Context

[What was the situation? References to F0.1-F0.3 work]

## Consequences

**Positive:**
- [Benefit 1]
- [Benefit 2]

**Negative:**
- [Tradeoff 1]
- [Tradeoff 2]

## References

- [Link to related commit]
- [Link to related feature]
```

### Example: ADR-001 (Partial)

```markdown
# ADR-001: Index vs Move

**Status:** Accepted
**Date:** 2026-02-13
**Context:** Epic E0 (Documentation Homologation)

## Decision

Index E1 spec-kit artifacts from the RaiSE structure instead of relocating them to `work/epics/e1/`.

## Rationale

**Why index:**
- Preserves git history (no file moves)
- Avoids breaking existing spec-kit references in CLAUDE.md or elsewhere
- Establishes clear provenance: spec-kit artifacts remain in `specs/001/`

**Alternatives considered:**
- Move all spec-kit files to `work/epics/e1/` → Rejected (breaks history, high-risk)
- Leave unindexed → Rejected (no RaiSE navigation)

## Context

F0.1 established the archive-with-traceability pattern (legacy files kept with SUPERSEDED banners). F0.2 applied this principle to E1: index from RaiSE, preserve original location.

## Consequences

**Positive:**
- Git history intact (`git log --follow` works)
- Existing references unbroken
- RaiSE navigation established via `work/epics/e1-mvp-asistente-ch/design.md`

**Negative:**
- Documentation lives in two places (`specs/001/` and `work/epics/e1/`)
- Need to maintain index when spec-kit artifacts change (low likelihood)

## References

- F0.1: Archive Genesis (commit b6f6bd8)
- F0.2: Index E1/E2 Design (commit fb4212a)
- `work/epics/e1-mvp-asistente-ch/design.md`
```

## Acceptance Criteria

### MUST

- [ ] ADR-001 created in `dev/decisions/ADR-001-index-vs-move.md`
- [ ] ADR-002 created in `dev/decisions/ADR-002-canonical-nomenclature.md`
- [ ] ADR-003 created in `dev/decisions/ADR-003-raise-native-design.md`
- [ ] Each ADR includes: Decision, Rationale, Context, Consequences (positive + negative)
- [ ] Each ADR references relevant F0.1-F0.3 commits/work (traceability)
- [ ] ADRs are concise (100-150 lines each, not more)
- [ ] All ADRs readable and well-structured (manual review passes)

### SHOULD

- [ ] ADRs follow consistent format (use template structure above)
- [ ] Cross-references between ADRs where relevant (e.g., ADR-003 refs ADR-001)
- [ ] Date and status metadata included in each ADR

### MUST NOT

- [ ] Create ADRs for technical/code decisions (those belong in code ADRs, not doc homologation)
- [ ] Over-engineer format (keep it simple — no tooling, no index, just 3 markdown files)
- [ ] Rewrite existing documentation (ADRs document decisions, not content)

## Constraints

- **Simplicity** — No ADR index/catalog needed for 3 ADRs
- **Traceability** — Each ADR must reference F0.1-F0.3 commits (provenance)
- **Reusability** — Pattern should be clear enough for other projects to adopt

---

**Next:** `/rai-story-plan` to decompose into tasks
