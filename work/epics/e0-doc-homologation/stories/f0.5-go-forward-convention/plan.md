---
title: "Implementation Plan — F0.5"
feature: "F0.5"
epic: "E0"
status: "active"
created: "2026-02-13"
---

# Implementation Plan: Go-Forward Convention for E3+ Epics

## Overview

- **Feature:** F0.5
- **Size:** Small (S)
- **Story Points:** 3-5 SP
- **Focus:** Document canonical RaiSE-native artifact structure and skill lifecycle
- **Primary Deliverable:** `work/CONVENTION-design.md`

---

## Tasks

### Task 1: Extract Conventions from ADR-003

**Description:**
Review `dev/decisions/ADR-003-raise-native-design.md` and extract the core conventions that must be documented:
- Artifact locations (directory structure)
- Skill-to-artifact mappings (which skill generates what)
- Lifecycle stages (design → plan → implement → review → close)
- Why specs/ is historical vs work/ is active

**Files:**
- Read: `dev/decisions/ADR-003-raise-native-design.md` (reference)
- Output: Outline for work/CONVENTION-design.md (notes, not yet the doc)

**Approach:**
- Map ADR-003 sections to convention doc structure
- Extract "Go-Forward Structure" diagram (lines 178-204 of ADR-003)
- Identify 3-4 key "navigation questions" that E3 owners will have
- List key constraints (specs/ frozen, work/ canonical, YAML frontmatter)

**Verification:**
```bash
# Manual: Create outline with sections, mapped lifecycle, constraints noted
# Success: Outline covers artifact locations, skill mapping, navigation examples
```

**Size:** S

**Dependencies:** None

---

### Task 2: Write work/CONVENTION-design.md

**Description:**
Create the canonical convention document for E3+ owners. This is the primary deliverable.

**Files:**
- Create: `work/CONVENTION-design.md` (new file)
- Reference: `dev/decisions/ADR-*.md` (all three ADRs)

**Structure (from design.md):**
1. **Title & Purpose** — What this document is for
2. **Artifact Locations** — work/epics/eN/ directory tree with annotations
3. **Lifecycle Mapping** — Table: Phase → Skill → Artifact → Output
4. **Navigation Guide** — Answer 4 key questions (where are requirements? architectural decisions? tasks? learnings?)
5. **Why This Structure** — Brief explanation (simplicity principle, RaiSE single pipeline)
6. **Historical Note** — E1 in specs/ (archived), E3+ in work/ (active)
7. **References** — Links to ADR-001, ADR-002, ADR-003

**Verification:**
```bash
# Manual: Read the document; verify each section is clear
# Checklist:
#   - Directory structure diagram is readable
#   - Lifecycle table shows all 7 phases (design → plan → implement → review → close)
#   - Navigation examples answer the 4 key questions
#   - All ADR links are correct paths
#   - No placeholder text or "TODO"s
```

**Size:** M

**Dependencies:** Task 1 (extracted structure & mapping)

---

### Task 3: Verify Links & Manual Integration Test

**Description:**
Validate that the convention document is complete, linked correctly, and usable by E3 owners.

**Files:**
- Verify: `work/CONVENTION-design.md`
- Verify: All referenced ADRs exist

**Verification Steps:**
```bash
# 1. Check all ADR links are valid
grep -E "dev/decisions/ADR-" work/CONVENTION-design.md | while read line; do
  path=$(echo "$line" | grep -oE "dev/decisions/ADR-[^)]*" | head -1)
  [ -f "$path" ] || echo "BROKEN: $path"
done

# 2. Check directory structure examples are readable
# Manual: Print section "Example: E3 Epic Structure" and verify it's clear

# 3. Manual integration test: Ask — "If I'm an E3 owner, can I navigate?"
#    - Can I find where feature requirements live? → design.md path
#    - Can I find where tasks are? → plan.md path
#    - Can I find epic decisions? → scope.md ADRs section
#    - Can I understand why specs/ is frozen? → Historical Note section
```

**Integration Test Scenario:**
Imagine you're starting E3 (a new epic). You read `work/CONVENTION-design.md`:
1. You find the directory structure diagram
2. You understand that your epic scope goes in `scope.md`
3. You know that story designs go in `stories/f3.N-{name}/design.md`
4. You understand that this came from `/rai-epic-design` and `/rai-story-design` skills
5. You can navigate: features → tasks → implementation without ambiguity

**Success Criteria:**
- All ADR links are valid (no 404s)
- Lifecycle table shows all 7 phases with corresponding skills
- Navigation examples are concrete (not abstract)
- Document is <500 words (concise)
- An unfamiliar E3 owner could use it as a reference

**Size:** S

**Dependencies:** Task 2 (document created)

---

## Execution Order

```
Task 1: Extract Conventions from ADR-003
         ↓
Task 2: Write work/CONVENTION-design.md
         ↓
Task 3: Verify Links & Manual Integration Test
```

**Rationale:** Sequential (each task depends on previous output).

---

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|:----------:|:------:|------------|
| **Convention too verbose** — Document becomes a retread of ADRs | Medium | Low | Keep to <500 words; focus on "how to navigate", not "why we chose RaiSE" |
| **Broken links to ADRs** — ADR paths change or links aren't updated | Low | Medium | Verify all paths in Task 3; grep check before commit |
| **Structure examples unclear for future owners** — E3 owner reads it and still confused | Low | Medium | Use concrete example (E3) not abstract; test with unfamiliar reader perspective |

---

## Duration Tracking

| Task | Size | Actual | Notes |
|------|:----:|:------:|-------|
| 1 | S | -- | Extract conventions from ADR-003 |
| 2 | M | -- | Write work/CONVENTION-design.md |
| 3 | S | -- | Verify links & integration test |
| **Total** | **4-6 SP** | **--** | **F0.5 estimate: Small (3-5 SP) with some buffer** |

---

## Next Step

Ready for `/rai-story-implement` → Execute tasks 1-3 with verification gates.

**Estimated timeline:** ~45 minutes (S-sized feature with buffer)

---

*Plan created: 2026-02-13*
*Next: `/rai-story-implement`*
