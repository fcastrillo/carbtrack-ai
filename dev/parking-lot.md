---
title: "Parking Lot — carbtrack-ai"
created: "2026-02-13"
last_updated: "2026-02-13"
origin: "E0 (Documentation Homologation) / F0.6"
---

# Parking Lot

> **Purpose:** Track deferred items, framework improvements, and process enhancements discovered during development.
>
> **When to review:** At epic start (for prioritization), at epic close (for validation), or when adding new items.
>
> **How to use:** Scan by category, prioritize by timeline/impact, assign to future epic planning.

---

## Framework Improvements

### 1. Readability Metrics for Documentation

**Origin:** F0.5 (Go-Forward Convention) — Word count exceeded target, integration test validated navigation but not readability.

**Issue:** Documentation quality gates (acceptance criteria) focus on structure, not readability. A document can be technically correct but dense/hard to understand.

**Proposal:** Add Flesch-Kincaid readability score measurement to documentation tasks. Target range: 60-70 (high school level, appropriate for technical docs).

**Impact:** Improves usability of governance docs, conventions, guides for future contributors.

**Timeline:** E1-E3 (2-3 months) — Evaluate after more documentation-heavy epics

**Effort estimate:** <5 min per documentation task (automated check + optional revision)

**Assignee:** Open (framework enhancement)

**Status:** Backlog

---

### 2. Separate Builder and Verifier Roles

**Origin:** `/rai-story-design` skill — Known limitation: "The builder verifying their own work is a form of muda (waste). Lean principles suggest separation of production and inspection."

**Issue:** Self-review is inherently biased. Specs written by builder tend to miss gaps that independent reviewer would catch immediately.

**Proposal:** Create `/quality-review` skill that takes a spec (design.md) and validates:
- Completeness (all required sections present)
- Clarity (no vague examples, testable criteria)
- Alignment (examples consistent with acceptance criteria)
- Independent reviewer perspective

**Impact:** Catches spec issues early, prevents cascading implementation rework, improves overall quality.

**Timeline:** Framework evolution (3-6 months out, depends on other priorities)

**Effort estimate:** 2-3 hours (skill design + implementation + testing)

**Assignee:** Open (framework enhancement)

**Status:** Backlog

---

### 3. Documentation Feature Task Decomposition Patterns

**Origin:** F0.5-F0.6 learnings — `/rai-story-plan` assumes code-like decomposition (Unit → Integration → Test), but documentation has different pattern (Extract → Write → Verify).

**Issue:** Code features and documentation features have fundamentally different task structure. Current template forces code-thinking onto docs, resulting in awkward tasks.

**Proposal:** Update `/rai-story-plan` guidance with exemplar task decomposition patterns for:
- **Code features:** Unit implementation → Integration → Testing
- **Documentation features:** Extract/structure → Write/synthesize → Verify/validate
- **Infrastructure features:** Setup → Configuration → Validation

**Impact:** Clearer planning for non-code epics, better estimation, faster execution.

**Timeline:** E1 (before next documentation-heavy epic)

**Effort estimate:** 1-2 hours (documentation + examples)

**Assignee:** Open (framework documentation)

**Status:** Backlog

---

### 4. Word Count Differentiation for Documentation

**Origin:** F0.5 retrospective — Plan specified <500 words, actual ~1100 words. Both were justified: comprehensive guides need completeness over brevity.

**Issue:** Planning assumes single word-count target. But "quick reference" and "comprehensive guide" serve different needs and have different length targets.

**Proposal:** Update `/rai-story-design` and `/rai-story-plan` to differentiate:
- **Quick reference** (<500 words): Checklists, lookup tables, concise summaries
- **Comprehensive guide** (800-1200 words): Conventions, patterns, detailed walkthroughs

Allow plan estimates to vary based on documentation type.

**Impact:** More accurate estimation, less scope creep surprise, clearer expectations.

**Timeline:** E1 planning (immediate)

**Effort estimate:** <30 min (guidance update + examples)

**Assignee:** Open (planning enhancement)

**Status:** Ready for E1

---

## Process Improvements (Already Captured)

### ✅ 5. Outline-Driven Development Pattern

**Status:** COMPLETE — Captured as **PAT-F-015** in memory

**Evidence:** F0.5 Task 1 (extract/outline) → Task 2 (write) achieved 2.3x velocity

**Pattern:** For documentation features, create extraction/outline phase before writing. Dramatically improves writing efficiency and downstream velocity.

**Usage:** Apply to F0.6+, all documentation epics

---

### ✅ 6. Integration Testing Model for Non-Code Artifacts

**Status:** COMPLETE — Captured as **PAT-F-016** in memory

**Evidence:** F0.5 Task 3 (4-question user scenario test) validated usability without traditional code tests

**Pattern:** For non-code deliverables (docs, guides, specs), use user-scenario integration test (4 key questions) to validate both correctness AND usability.

**Usage:** Apply to F0.6+, all documentation deliverables

---

## E0-Specific Deferrals

### 7. SDD→RaiSE Homologation Pattern Evaluation

**Origin:** E0 scope — Secondary value: "The homologation process itself becomes a reusable pattern for projects migrating from other SDD frameworks to RaiSE."

**Issue:** E0 documents the homologation *approach* (archive, index, canonicalize) but doesn't evaluate if it's generalizable or what the pattern should be called/documented.

**Proposal:** After E0 close, conduct 1-2 hour retrospective to extract the pattern:
- What worked (archive with traceability, indexing from RaiSE, canonicalization)?
- What was E0-specific vs universally applicable?
- How should this be documented for other projects?

**Impact:** Framework knowledge, reusable pattern for SDD→RaiSE migrations

**Timeline:** E0 epic retrospective (immediately after F0.6)

**Effort estimate:** 1-2 hours (focused retrospective)

**Assignee:** Open (epic retrospective)

**Status:** Pending E0 closure

---

### 8. CLAUDE.md Update for E0 Changes

**Origin:** E0 scope — Explicitly out of scope: "Updating `CLAUDE.md` → separate maintenance task"

**Issue:** E0 introduces RaiSE, homologates to `work/epics/eN/` structure, changes branch model. CLAUDE.md (project instructions) may need updates to reflect this.

**Proposal:** After E0 closes, review CLAUDE.md for outdated references:
- Still references `specs/` as primary location?
- Should mention hybrid branching model?
- Should reference new conventions (work/CONVENTION-design.md)?

**Impact:** Keeps project instructions accurate, reduces confusion for future contributors

**Timeline:** Post-E0 (before E1 full sprint)

**Effort estimate:** 30 min - 1 hour

**Assignee:** Open (maintenance task)

**Status:** Ready for E0 closure

---

## Summary by Category

| Category | Count | Status | Timeline |
|----------|-------|--------|----------|
| Framework Improvements | 4 | Backlog | E1-E3+ |
| Process Improvements | 2 | ✅ Complete | Immediate |
| E0-Specific | 2 | Pending | E0 closure |
| **Total** | **8** | **6 active** | **Varying** |

---

## How to Use This Parking Lot

**For epic owners starting E1+:**
1. Review "Framework Improvements" — Pick 1-2 to incorporate into your epic
2. Check "Process Improvements" — These are already captured in memory (PAT-F-015, PAT-F-016)
3. Update any items based on your learnings

**For framework evolution:**
- Readability metrics and separate reviewer role are high-value items
- Documentation decomposition patterns should be done before next doc-heavy epic

**For post-E0 cleanup:**
- Conduct E0 epic retrospective (evaluate homologation pattern)
- Update CLAUDE.md with E0 changes
- Then close E0 officially

---

*Parking lot initialized: 2026-02-13 (E0 / F0.6)*
*Next review: E0 epic retrospective (immediately after F0.6)*
