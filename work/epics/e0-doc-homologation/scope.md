# Epic E0: Documentation Homologation — Scope

> **Status:** DESIGN
> Branch: `epic/e0/doc-homologation`
> Created: 2026-02-13
> Target: N/A (no deadline — scope-based)

---

## Objective

Unify the project's documentation architecture so that all design history (spec-kit, E1) and all future governance flow through a single, traceable structure under RaiSE — with canonical nomenclature and clear conventions for E3+.

**Value proposition:** After E0, any person or AI partner entering the project knows exactly where to find what, with zero ambiguity between legacy and active systems. E3/E4 start with native RaiSE design from day 1.

**Secondary value:** The homologation process itself becomes a reusable pattern for projects migrating from other SDD frameworks to RaiSE.

---

## Features (6 features, ~1 day estimated)

| ID | Feature | Size | Status | Description |
|----|---------|:----:|:------:|-------------|
| F0.1 | Archive Genesis | XS | Pending | Move root `PRD.md` and `spec.md` to `specs/000-genesis/` with SUPERSEDED banners |
| F0.2 | Index E1/E2 Design | S | Pending | Create `work/epics/e1-mvp-asistente-ch/design.md` indexing all spec-kit artifacts with `_origin: spec-kit` marker |
| F0.3 | Canonicalize Requirements | XS | Pending | Add FR→RF mapping table to `specs/001-mvp-asistente-ch/spec.md`, declare RF-NN canonical in `governance/prd.md` |
| F0.4 | Document ADRs | S | Pending | Create ADR-001 (index vs move), ADR-002 (canonical nomenclature), ADR-003 (RaiSE-native design for E3+) |
| F0.5 | Go-Forward Convention | S | Pending | Document design convention for future epics: where artifacts live, which skills generate what |
| F0.6 | Initialize Parking Lot | XS | Pending | Create `dev/parking-lot.md` with deferred items from E0 and known pending items |

---

## In Scope

**MUST:**
- Archive legacy root files with traceability (SUPERSEDED banners)
- Index E1 spec-kit artifacts from RaiSE structure (`work/epics/e1/design.md`)
- Establish RF-NN as canonical requirement nomenclature with FR→RF mapping
- Document 3 ADRs for restructuring decisions
- Define go-forward design convention for E3+

**SHOULD:**
- Initialize `dev/parking-lot.md` and `dev/decisions/`
- Extract reusable SDD→RaiSE homologation pattern (from epic retro)

---

## Out of Scope (defer)

- Rewriting spec-kit content → we index, not move (ADR-001)
- Migrating `specs/001/` files into `work/` → preserve history
- Updating `CLAUDE.md` → separate maintenance task
- Code refactors → E0 is purely documental
- Creating a formal RaiSE homologation skill → evaluate at retro, not pre-commit

---

## Done Criteria

### Per Feature
- [ ] Files created/moved correctly
- [ ] Internal references are valid (no broken links)
- [ ] Conventions documented are clear and actionable

### Epic Complete
- [ ] Zero orphan legacy files at project root
- [ ] E1 navigable from RaiSE structure (`work/epics/e1/design.md`)
- [ ] RF-NN declared canonical with FR mapping
- [ ] 3 ADRs written and reviewed
- [ ] Go-forward convention documented
- [ ] Parking lot initialized
- [ ] Epic retrospective completed (`/rai-epic-close`)

---

## Dependencies

```
F0.1 (Archive Genesis) ─────────┐
F0.2 (Index E1/E2 Design) ──────┤ parallel
F0.3 (Canonicalize Requirements)┘
         │
         v
F0.4 (Document ADRs) ← references F0.1-F0.3 decisions
         │
         v
F0.5 (Go-Forward Convention)

F0.6 (Initialize Parking Lot) ← parallel with any
```

**External blockers:** None

---

## Architecture References

| Decision | Document | Key Insight |
|----------|----------|-------------|
| Index vs Move | ADR-001 | Preserve git history; index from RaiSE, don't relocate spec-kit artifacts |
| Canonical Nomenclature | ADR-002 | RF-NN (governance) is canonical; specs add FR→RF mapping table |
| RaiSE-Native Design | ADR-003 | E3+ design artifacts live in `work/epics/eN/`; `specs/` becomes historical archive |

---

## Notes

### Why This Epic
- Project evolved from spec-kit (E1) to RaiSE — documentation needs bridging
- E3/E4 planning requires clarity on where design lives
- Secondary: homologation pattern is valuable for RaiSE ecosystem

### Key Risks
- Over-engineering documental (Medium/Medium) → RAI-VAL-2 guardrail
- Breaking CLAUDE.md references (Low/Medium) → verify post-changes
- Scope creep into "improving" existing content (Medium/Low) → rule: restructure only, no rewrites

### Origin
- _origin: spike (session conversation 2026-02-13)
- Decisions taken collaboratively before formal epic design

---

*Created: 2026-02-13*
