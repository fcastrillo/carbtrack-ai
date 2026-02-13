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
| F0.1 | Archive Genesis | XS | Done | Move root `PRD.md` and `spec.md` to `specs/000-genesis/` with SUPERSEDED banners |
| F0.2 | Index E1/E2 Design | S | Done | Create `work/epics/e1-mvp-asistente-ch/design.md` indexing all spec-kit artifacts with `_origin: spec-kit` marker |
| F0.3 | Canonicalize Requirements | XS | Done | Add FR→RF mapping table to `specs/001-mvp-asistente-ch/spec.md`, declare RF-NN canonical in `governance/prd.md` |
| F0.4 | Document ADRs | S | Done | Create ADR-001 (index vs move), ADR-002 (canonical nomenclature), ADR-003 (RaiSE-native design for E3+) |
| F0.5 | Go-Forward Convention | S | Done | Document design convention for future epics: where artifacts live, which skills generate what |
| F0.6 | Initialize Parking Lot | XS | Done | Create `dev/parking-lot.md` with deferred items from E0 and known pending items |

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

## Implementation Plan

> Added by `/rai-epic-plan` - 2026-02-13

### Feature Sequence

| Order | Feature | Size | Dependencies | Milestone | Rationale |
|:-----:|---------|:----:|--------------|-----------|-----------|
| 1 | F0.1 Archive Genesis | XS | None | M1 | Foundation — shows homologation pattern; can run parallel with F0.2, F0.3 |
| 1 | F0.2 Index E1/E2 Design | S | None | M1 | Foundation — establishes RaiSE navigation; can run parallel with F0.1, F0.3 |
| 1 | F0.3 Canonicalize Requirements | XS | None | M1 | Foundation — declares canonical nomenclature; can run parallel with F0.1, F0.2 |
| 2 | F0.4 Document ADRs | S | F0.1, F0.2, F0.3 | M2 | Core — captures decisions from first batch; sequential after M1 |
| 3 | F0.5 Go-Forward Convention | S | F0.4 | M3 | Integration — builds on ADR patterns; sequential after F0.4 |
| * | F0.6 Initialize Parking Lot | XS | None | M3 | Flexible — can run anytime; good closing task |

**Notes:**
- Features 1-3 run **in parallel** (first batch, ~2h)
- Features 4-5 run **sequentially** after first batch (~2h)
- Feature 6 is **flexible** — can run with any batch or at close (~30min)

### Milestones

| Milestone | Features | Target | Success Criteria | Demo |
|-----------|----------|--------|------------------|------|
| **M1: Walking Skeleton** | F0.1, F0.2, F0.3 | Session 1 (~2h) | - Legacy files archived with SUPERSEDED banners<br>- E1 navigable from `work/epics/e1/design.md`<br>- RF-NN declared canonical with FR mapping<br>- Zero broken internal links | Show homologation pattern working (archive + index + canonicalize) |
| **M2: Core MVP** | +F0.4 | Session 2 (~1h) | - 3 ADRs written (001: index vs move, 002: nomenclature, 003: RaiSE-native)<br>- Decisions traceable to context | Explain restructuring decisions via ADRs |
| **M3: Feature Complete** | +F0.5, F0.6 | Session 3 (~1h) | - Go-forward convention documented<br>- Parking lot initialized<br>- All 6 features done | Full convention reference for E3+ |
| **M4: Epic Complete** | - | Session 4 (~30min) | - Done criteria met<br>- Epic retrospective completed<br>- Branch merged to `main` | Ready for `/rai-epic-close` |

### Parallel Work Streams

```
Time →
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Session 1 (parallel foundation):
  Stream 1: F0.1 Archive Genesis ────────┐
  Stream 2: F0.2 Index E1/E2 Design ─────┤ → M1 (2h)
  Stream 3: F0.3 Canonicalize Req ───────┘
                                           ↓
Session 2 (sequential):
  Stream 1: F0.4 Document ADRs ──────────► M2 (1h)
                                           ↓
Session 3 (sequential + flexible):
  Stream 1: F0.5 Go-Forward Convention ─┐
  Stream 2: F0.6 Initialize Parking Lot ┤ → M3 (1h)
                                         └► (can be parallel)
                                           ↓
Session 4 (close):
  Epic retrospective + merge ────────────► M4 (30min)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Merge points:**
- After Session 1: Merge F0.1-F0.3 (foundation batch)
- After Session 2: Merge F0.4 (ADR documentation)
- After Session 3: Merge F0.5-F0.6 (final features)

### Progress Tracking

| Feature | Size | Status | Actual | Velocity | Notes |
|---------|:----:|:------:|:------:|:--------:|-------|
| F0.1 | XS | Done | 20 min | 2.0x | First parallel batch — Archive with traceability pattern |
| F0.2 | S | Done | 18 min | 2.2x | First parallel batch — E1 index created |
| F0.3 | XS | Done | 15 min | 1.67x | First parallel batch — FR→RF mapping established |
| F0.4 | S | Done | 25 min | 1.2x | 3 ADRs documented (529 lines total) — 2 patterns captured |
| F0.5 | S | Done | 34 min | 1.9x | Design + implementation + review (concurrent) |
| F0.6 | XS | Done | 19 min | 1.42x | Parking lot creation (meta-work) |

**Milestone Progress:**
- [x] M1: Walking Skeleton (Session 1, ~53 min actual vs ~2h estimated, 2.0x avg velocity)
- [x] M2: Core MVP (Session 2, ~25 min actual vs ~1h estimated, 2.4x velocity)
- [x] M3: Feature Complete (Session 3, ~53 min actual vs ~1h estimated, 1.9x avg velocity) — F0.5 (34 min, 1.9x) + F0.6 (19 min, 1.42x)
- [ ] M4: Epic Complete (Session 4, ~30min) — Epic retrospective + merge to main

**Total estimated effort:** 4.5-5 hours (execution + retro)
**Calendar time:** 1 day (with parallel execution)

### Sequencing Risks

| Risk | Likelihood | Impact | Mitigation |
|------|:----------:|:------:|------------|
| **Over-engineering documental** — Adding unnecessary complexity to simple restructuring | Medium | Medium | Apply RAI-VAL-2 (Simplicity over Cleverness) — restructure only, no rewrites; timebox M1 to 2h max |
| **Breaking CLAUDE.md references** — Moving files breaks existing instructions | Low | Medium | Verify all paths in CLAUDE.md after F0.1-F0.3; add to M1 success criteria |
| **Scope creep into content rewrites** — "Improving" existing specs instead of restructuring | Medium | Low | Rule: index/move/document only — no content changes; flag during review |
| **F0.4 blocked by F0.1-F0.3 delays** — ADRs need context from first batch | Low | Low | Timebox first batch to 2h; if delayed, proceed with F0.6 instead |

### Velocity Assumptions

- **Baseline:** No calibration data yet (first RaiSE epic) — will establish baseline
- **Assumptions:**
  - XS features: 20-40 min each (~30min average)
  - S features: 40-90 min each (~60min average)
  - Parallel execution reduces wall time by ~40% vs sequential
- **Buffer:** 20% for integration, validation, and retro
- **Post-epic:** Capture actual times in calibration for future epics

---

## Sequencing Rationale

### F0.1: Archive Genesis
- **Position:** First batch (parallel)
- **Rationale:** Quick win (XS), establishes homologation pattern (archive with traceability), independent of other features
- **Dependencies:** None
- **Enables:** F0.4 (ADR needs archiving decision as context)
- **Risk:** Low (file move + banner)
- **Parallel:** Yes (with F0.2, F0.3)

### F0.2: Index E1/E2 Design
- **Position:** First batch (parallel)
- **Rationale:** Core navigation capability, independent work (different files than F0.1/F0.3)
- **Dependencies:** None
- **Enables:** F0.4 (ADR needs indexing decision as context)
- **Risk:** Low (create index file)
- **Parallel:** Yes (with F0.1, F0.3)

### F0.3: Canonicalize Requirements
- **Position:** First batch (parallel)
- **Rationale:** Establishes nomenclature foundation, independent work (different files)
- **Dependencies:** None
- **Enables:** F0.4 (ADR needs nomenclature decision as context)
- **Risk:** Low (mapping table + declaration)
- **Parallel:** Yes (with F0.1, F0.2)

### F0.4: Document ADRs
- **Position:** Second (sequential after M1)
- **Rationale:** Captures decisions from F0.1-F0.3; needs all three for complete context
- **Dependencies:** F0.1, F0.2, F0.3
- **Enables:** F0.5 (convention references ADR patterns)
- **Risk:** Medium (synthesis task, needs clarity)
- **Parallel:** No (sequential after foundation)

### F0.5: Go-Forward Convention
- **Position:** Third (sequential after F0.4)
- **Rationale:** Integration feature — synthesizes patterns from ADRs into actionable convention for E3+
- **Dependencies:** F0.4 (references ADR-003 for RaiSE-native design)
- **Enables:** E3+ epic design (consumers of this convention)
- **Risk:** Medium (prescriptive guidance, must be clear)
- **Parallel:** Could run with F0.6, but keep sequential for focus

### F0.6: Initialize Parking Lot
- **Position:** Flexible (anytime)
- **Rationale:** Independent task, good closing activity, captures deferred items
- **Dependencies:** None (can reference any completed features)
- **Enables:** Future session management
- **Risk:** Low (simple file creation)
- **Parallel:** Yes (with any feature, or as closing task)

---

*Plan created: 2026-02-13*
*Next: `/rai-story-design` for F0.1 (or parallel batch F0.1-F0.3)*
