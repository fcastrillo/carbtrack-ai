---
title: "F0.5 — Go-Forward Convention"
epic: "E0"
feature: "F0.5"
phase: "design"
created: "2026-02-13"
status: "active"
---

# Design: Go-Forward Convention for E3+ Epics

## Problem & Value

**Problem:** E3+ epic owners need clarity on where design artifacts live, which RaiSE skills generate them, and how to navigate the active project tree.

**Value:** Clear convention reduces onboarding friction, enables consistent structure across all future epics, and prevents ambiguity between legacy (`specs/`) and active (`work/`) architectures.

---

## Approach

**What:** Document the canonical artifact structure and skill lifecycle for RaiSE-native epics, based on ADR-003 patterns.

**Scope:**
- Artifact location conventions (directory tree)
- Lifecycle stage → skill mapping (scope → design → plan → implement → review → close)
- Navigation guide: how to find what
- Examples: realistic epic directory structure

**This synthesizes ADR-003 into an actionable reference that future epic owners can consume in <5 minutes.**

---

## Examples

### Example: E3 Epic Structure

```
work/epics/e3-{name}/
  scope.md                    ← /rai-epic-design output
                                 (features, dependencies, milestones, ADRs)

  plan.md                     ← /rai-epic-plan output
                                 (sequencing, risks, velocity assumptions)

  stories/
    f3.1-{name}/
      scope.md                ← /rai-story-start output
                                 (in/out scope, done criteria)

      design.md               ← /rai-story-design output (THIS FILE)
                                 (approach, examples, acceptance criteria)

      plan.md                 ← /rai-story-plan output
                                 (tasks, verification gates, execution order)

      progress.md             ← /rai-story-implement output
                                 (task log, completion checklist)

      retrospective.md        ← /rai-story-review output
                                 (learnings, patterns, improvements)

    f3.2-{name}/
      [same structure]

    f3.3-{name}/
      [same structure]

  research.md                 ← /rai-research output (if applicable)

  retrospective.md            ← /rai-epic-close output
                                 (epic-level learnings, metrics)

  contracts/                  ← API contracts, schemas (if needed)
```

### Example: Lifecycle Mapping

| Phase | Skill | Artifact | Output |
|-------|-------|----------|--------|
| Epic Design | `/rai-epic-design` | `scope.md` | Features, dependencies, 3+ ADRs |
| Epic Plan | `/rai-epic-plan` | `plan.md` | Sequencing, milestones, velocity |
| Story Start | `/rai-story-start` | `scope.md` | In/out scope, done criteria, scope commit |
| **Story Design** | **`/rai-story-design`** | **`design.md`** | **Approach, examples, acceptance criteria** |
| Story Plan | `/rai-story-plan` | `plan.md` | Atomic tasks, execution order |
| Implement | `/rai-story-implement` | `progress.md` | Task log, completion gates |
| Review | `/rai-story-review` | `retrospective.md` | Learnings, patterns, improvements |
| Epic Close | `/rai-epic-close` | `retrospective.md` | Epic metrics, retro, merge to main |

### Example: Navigation for E3 Owner

**"Where do I find the feature requirements?"**
→ `work/epics/e3-{name}/stories/f3.1-{name}/design.md` (approach, examples, acceptance criteria)

**"What are the architectural decisions?"**
→ `work/epics/e3-{name}/scope.md` (ADRs section at bottom)

**"How do I know if a feature is done?"**
→ `work/epics/e3-{name}/stories/f3.1-{name}/design.md` (acceptance criteria section)

**"What tasks make up this feature?"**
→ `work/epics/e3-{name}/stories/f3.1-{name}/plan.md` (task breakdown with dependencies)

**"What did we learn from E3?"**
→ `work/epics/e3-{name}/retrospective.md` (epic-level lessons)

---

## Acceptance Criteria

### MUST

- [ ] Convention document created at `work/CONVENTION-design.md`
- [ ] Directory structure documented with concrete example (E3 epic)
- [ ] Skill → Artifact lifecycle mapping clear (table format)
- [ ] Navigation examples answer 4 key questions (above)
- [ ] All paths reference real ADRs (ADR-001, ADR-002, ADR-003)
- [ ] No broken internal links

### SHOULD

- [ ] Include a "migration checklist" for E1 → E3 mental model shift
- [ ] Add brief "why this structure" explanation referencing simplicity guardrail
- [ ] Mention that E1 (`specs/001-mvp-asistente-ch/`) remains historical

---

## Key Constraints

**From ADR-003:**
- `specs/` becomes historical after E0 (no new content)
- `work/epics/eN/` is the canonical location for E3+ artifacts
- All artifacts use YAML frontmatter + markdown structure
- RaiSE skills are the source of truth for artifact generation

**Simplicity Principle (RAI-VAL-2):**
- One system (RaiSE), one location (`work/`), one set of conventions
- Document only what's essential; avoid over-specification

---

## References

- **ADR-003: RaiSE-Native Design** — `dev/decisions/ADR-003-raise-native-design.md`
  - Establishes artifact locations and lifecycle
  - Go-Forward Structure diagram (lines 178-204)

- **ADR-001: Index vs Move** — `dev/decisions/ADR-001-index-vs-move.md`
  - Why E1 artifacts stay in `specs/001/`

- **ADR-002: Canonical Nomenclature** — `dev/decisions/ADR-002-canonical-nomenclature.md`
  - Requirement naming (RF-NN vs FR-NNN)

---

**Design created:** 2026-02-13
**Next:** `/rai-story-plan` → Decompose into implementation tasks
