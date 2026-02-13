---
title: "Design Convention for RaiSE-Native Epics (E3+)"
version: "1.0"
created: "2026-02-13"
epic_origin: "E0 (Documentation Homologation)"
feature_origin: "F0.5 (Go-Forward Convention)"
---

# Design Convention for RaiSE-Native Epics (E3+)

> **For E3+ epic owners:** Use this guide to understand where design artifacts live and how RaiSE skills generate them.

---

## Artifact Locations

All design artifacts for E3+ epics live in `work/epics/eN-{name}/`:

```
work/epics/eN-{name}/
  scope.md                            ← Epic-level scope, features, ADRs
  plan.md                             ← Epic-level sequencing, milestones, risks

  stories/
    fN.M-{story-name}/
      scope.md                        ← Story in/out scope, done criteria
      design.md                       ← Story approach, examples, acceptance
      plan.md                         ← Story tasks, verification, execution order
      progress.md                     ← Task log, actual times, notes
      retrospective.md                ← Story learnings, improvements

    fN.N-{another-story}/
      [same structure]

  research.md                         ← Evidence-based design research (if needed)
  retrospective.md                    ← Epic-level learnings, metrics, outcomes
  contracts/                          ← API contracts, data schemas (if needed)
```

**Key principle:** All design lives in `work/epics/eN/`. No artifacts in `specs/` for E3+.

---

## Skill-to-Artifact Lifecycle

| Phase | RaiSE Skill | Output | Contains |
|-------|-------------|--------|----------|
| **Epic Design** | `/rai-epic-design` | `scope.md` | Features, dependencies, 3+ ADRs, milestones |
| **Epic Plan** | `/rai-epic-plan` | `plan.md` | Sequencing, parallel work, velocity assumptions |
| **Story Start** | `/rai-story-start` | `scope.md` | In/out scope, done criteria, scope commit |
| **Story Design** | `/rai-story-design` | `design.md` | Approach (WHAT), examples, acceptance criteria |
| **Story Plan** | `/rai-story-plan` | `plan.md` | Atomic tasks, dependencies, verification gates |
| **Implement** | `/rai-story-implement` | `progress.md` | Task log, actual times, discoveries |
| **Story Review** | `/rai-story-review` | `retrospective.md` | Learnings, patterns, process improvements |
| **Epic Close** | `/rai-epic-close` | `retrospective.md` | Epic metrics, outcomes, ecosystem learnings |

**Single pipeline:** Design artifacts and implementation logs live in the same tree. No jumping between `specs/` and `work/`.

---

## Navigation Guide: Finding What You Need

### "Where are the feature requirements?"
→ `work/epics/eN-{name}/stories/fN.M-{name}/design.md`
- Read: **Approach** section (WHAT is being built)
- Read: **Examples** section (concrete usage)
- Read: **Acceptance Criteria** section (MUST/SHOULD done conditions)

### "What were the architectural decisions?"
→ `work/epics/eN-{name}/scope.md`
- Find: **ADRs** section at bottom of scope document
- Each ADR explains a major decision (e.g., "Why RaiSE instead of spec-kit?")

### "What tasks make up this story?"
→ `work/epics/eN-{name}/stories/fN.M-{name}/plan.md`
- Read: **Tasks** section (numbered, ordered by dependency)
- Each task is atomic and individually verifiable

### "What did we learn from this epic?"
→ `work/epics/eN-{name}/retrospective.md`
- Read: **Learnings** section (patterns discovered)
- Read: **Metrics** section (velocity, actual vs estimated)
- Read: **Process Improvements** (for next epic)

---

## Why This Structure?

### Single Pipeline (RaiSE handles design → execution)

Before E0, projects used **two systems:**
- Spec-kit (`specs/00N/`) for design
- RaiSE (`work/`) for implementation

This created **friction:** design lived in one tree, execution in another. Two conventions. Two navigation paths.

**After E0:** One system handles both. Same skills generate design AND track execution. Design feeds directly into planning without translation.

### Consistency

All design artifacts use the same structure:
- **YAML frontmatter** (metadata: title, phase, epic, created date)
- **Markdown body** (human-readable with standard sections)
- **Clear hierarchy** (headings, tables, examples)

This consistency makes automation possible — tools can reliably find and extract information.

### Simplicity (RAI-VAL-2: Simplicity over Cleverness)

One tree (`work/`) instead of two (`specs/` + `work/`)
One set of conventions instead of two (spec-kit + RaiSE)
One set of skills instead of two (RaiSE covers both systems)

Fewer decisions → clearer path → faster onboarding for new contributors.

### Continuous Improvement

Each story and epic produces a **retrospective** that captures learnings. These feed into the RaiSE memory graph, improving future designs.

Spec-kit was a static output. RaiSE is a learning system.

---

## Historical Note: Why specs/ is Frozen

**E1 (MVP Asistente CH)** was designed with **spec-kit** (a precursor framework). The E1 artifacts remain in `specs/001-mvp-asistente-ch/` for reference:

```
specs/
  000-genesis/           ← Root-level legacy docs (PRD, spec) — ARCHIVED
  001-mvp-asistente-ch/  ← E1 design artifacts — FROZEN (historical reference)
    spec.md
    data-model.md
    plan.md
    tasks.md
    contracts/
    ACCEPTED_DEBT.md
```

**Why frozen, not deleted?**
- Preserves git history (diagnostic tool for future work)
- Allows tracing decisions back to E1
- Validates that spec-kit approach was successful (it was)

**Why no new content in specs/?**
- RaiSE subsumes all spec-kit capabilities
- Maintaining both systems = cognitive load + maintenance burden
- E3+ start with native RaiSE from day 1

---

## Example: E3 Epic in Action

### Scenario: You're Starting E3 (New Epic)

**Step 1: Run `/rai-epic-design`**
Output: `work/epics/e3-{name}/scope.md`
- Contains: 5-8 features, 3+ ADRs, milestones, dependencies

**Step 2: Run `/rai-epic-plan`**
Output: `work/epics/e3-{name}/plan.md`
- Contains: Feature sequencing, parallel work streams, velocity assumptions

**Step 3: For each story, run `/rai-story-design` → `/rai-story-plan`**
Output: `work/epics/e3-{name}/stories/f3.1-{name}/design.md` and `plan.md`
- Design contains: approach, examples, acceptance criteria
- Plan contains: atomic tasks, dependencies, verification

**Step 4: Run `/rai-story-implement` for each task**
Output: `work/epics/e3-{name}/stories/f3.1-{name}/progress.md`
- Log task execution, actual times, discoveries

**Step 5: Run `/rai-story-review` after each story**
Output: `work/epics/e3-{name}/stories/f3.1-{name}/retrospective.md`
- Capture learnings, improvements for next story

**Step 6: Run `/rai-epic-close` at epic end**
Output: `work/epics/e3-{name}/retrospective.md`
- Metrics: velocity, actual vs estimated
- Epic learnings feed into RaiSE memory for next epic

**Navigation during E3:**
- "Where are my feature requirements?" → `stories/f3.1-{name}/design.md`
- "What decisions did we make?" → `scope.md` (ADRs section)
- "What's my task list?" → `stories/f3.1-{name}/plan.md`
- "What did we learn?" → `retrospective.md` (epic close)

---

## Quick Reference: File Locations by Question

| Question | File Path | Section |
|----------|-----------|---------|
| What's the epic scope? | `work/epics/eN-{name}/scope.md` | Features, Milestones |
| What's the feature approach? | `work/epics/eN-{name}/stories/fN.M-{name}/design.md` | Approach, Examples |
| What are the tasks? | `work/epics/eN-{name}/stories/fN.M-{name}/plan.md` | Tasks |
| How's implementation going? | `work/epics/eN-{name}/stories/fN.M-{name}/progress.md` | Completed Tasks, Duration Tracking |
| What did we learn? | `work/epics/eN-{name}/retrospective.md` | Learnings, Metrics |
| What were the decisions? | `work/epics/eN-{name}/scope.md` | ADRs |

---

## References

This convention is based on **ADR-003: RaiSE-Native Design**.

**Related ADRs:**
- **ADR-001: Index vs Move** — Why E1 artifacts stay in `specs/001/`, indexed from `work/epics/e1/`
- **ADR-002: Canonical Nomenclature** — Requirement naming (RF-NN canonical for E3+)
- **ADR-003: RaiSE-Native Design** — Full rationale for this structure

**See also:**
- `dev/decisions/ADR-003-raise-native-design.md` — "Go-Forward Structure" diagram (lines 178-204)

---

## For E3+ Epic Owners

**TL;DR:**
- All your design lives in `work/epics/e3-{name}/`
- Run `/rai-epic-design` → `/rai-epic-plan` → repeat for each story: `/rai-story-design` → `/rai-story-plan`
- Stories generate `scope.md` → `design.md` → `plan.md` → `progress.md` → `retrospective.md`
- Use the "Navigation Guide" above when looking for something

**Everything you need is in one tree. No jumping between systems.**

---

*Convention documented: 2026-02-13*
*Origin: E0 (Documentation Homologation) / F0.5 (Go-Forward Convention)*
*Status: Active for E3+ epics*
