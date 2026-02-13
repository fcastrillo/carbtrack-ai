# Feature Scope: F0.4 Document ADRs

> **Epic:** E0 (Documentation Homologation)
> **Size:** S (~60 min estimated, ~30 min with 2.0x velocity)
> **Dependencies:** F0.1, F0.2, F0.3 (all complete ✓)
> **Branch:** `epic/e0/doc-homologation` (S-sized, no separate story branch)

---

## In Scope

**MUST:**
- Create ADR-001: Index vs Move
  - Decision: Index E1 artifacts from RaiSE structure instead of relocating them
  - Rationale: Preserve git history, avoid breaking existing references
  - Context from F0.1 (archive pattern) and F0.2 (index pattern)

- Create ADR-002: Canonical Nomenclature
  - Decision: RF-NN (governance) is canonical, FR-NNN (spec-kit) is legacy
  - Rationale: Single source of truth for requirements across documentation layers
  - Context from F0.3 (FR→RF mapping)

- Create ADR-003: RaiSE-Native Design
  - Decision: E3+ design artifacts live in `work/epics/eN/`, `specs/` becomes historical
  - Rationale: Forward-looking convention, clear separation of active vs archived
  - Context from F0.1-F0.3 (homologation pattern established)

**SHOULD:**
- Use standard ADR template (if exists) or create minimal format
- Cross-reference F0.1-F0.3 commits/decisions where applicable
- Include "Consequences" section for each ADR (tradeoffs)

---

## Out of Scope

**Deferred:**
- ADRs for technical implementation decisions (those belong in code ADRs)
- Updating CLAUDE.md to reference ADRs (separate maintenance task)
- Creating formal ADR index/catalog (only 3 ADRs, not needed yet)
- Rewriting existing documentation based on ADRs (E0 is restructure only)

**Explicitly excluded:**
- Code changes (E0 is purely documental)
- Process ADRs (e.g., "why RaiSE over spec-kit" — that's in epic retro)
- Project-wide ADR governance system (premature for 3 ADRs)

---

## Done Criteria

### Per-ADR Verification
- [ ] ADR-001 created in `dev/decisions/` with clear decision, rationale, context
- [ ] ADR-002 created with clear decision, rationale, context
- [ ] ADR-003 created with clear decision, rationale, context
- [ ] Each ADR references relevant F0.1-F0.3 work (traceability)
- [ ] Each ADR includes "Consequences" section (pros/cons)

### Integration Verification
- [ ] ADRs are readable and well-structured
- [ ] Cross-references between ADRs are valid (no broken links)
- [ ] F0.5 (Go-Forward Convention) can reference these ADRs clearly

### Story Complete
- [ ] All 3 ADRs written and reviewed
- [ ] Manual integration test passed
- [ ] Retrospective completed (`progress.md`, `retrospective.md`)
- [ ] Committed and ready for F0.5

---

## Context

### Why This Feature

After completing F0.1-F0.3 (M1 Walking Skeleton), we made several architectural decisions:
1. **Archive vs move** (F0.1) — Keep legacy files in place with SUPERSEDED banners
2. **Index vs relocate** (F0.2) — Create RaiSE index pointing to spec-kit artifacts
3. **Canonical nomenclature** (F0.3) — RF-NN supersedes FR-NNN

These decisions need formal documentation as ADRs so:
- Future contributors understand the rationale
- E3+ epics have clear conventions to follow
- The homologation pattern is reusable for other projects

### Key Decisions to Document

From epic scope.md "Architecture References":

| Decision | Document | Key Insight |
|----------|----------|-------------|
| Index vs Move | ADR-001 | Preserve git history; index from RaiSE, don't relocate spec-kit artifacts |
| Canonical Nomenclature | ADR-002 | RF-NN (governance) is canonical; specs add FR→RF mapping table |
| RaiSE-Native Design | ADR-003 | E3+ design artifacts live in `work/epics/eN/`; `specs/` becomes historical archive |

### Success Looks Like

Three clear, concise ADRs in `dev/decisions/` that:
- Document the decision and its rationale
- Reference the context from F0.1-F0.3 work
- Explain consequences (tradeoffs)
- Are consumable by F0.5 (Go-Forward Convention)

---

## Notes

- ADR format: Use lightweight format (decision + rationale + context + consequences)
- Location: `dev/decisions/ADR-NNN-{title}.md`
- Numbering: Start at 001 (first ADRs for this project)
- Cross-refs: Link to F0.1-F0.3 commits where decisions were made

---

*Scope defined: 2026-02-13*
*Next: `/rai-story-design`*
