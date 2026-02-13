# Retrospective: F0.3 Canonicalize Requirements

## Summary
- **Feature:** F0.3 (Canonicalize Requirements)
- **Epic:** E0 (Documentation Homologation)
- **Started:** 2026-02-13
- **Completed:** 2026-02-13
- **Estimated:** 25 min (Task 1: 20 min, Task 2: 5 min)
- **Actual:** 15 min (Task 1: 12 min, Task 2: 3 min)
- **Velocity:** **1.67x multiplier** (1.67x faster than estimate)

## What Went Well

✅ **Non-1:1 mapping handled correctly** — Discovered some FRs are UI/technical implementation details, not in governance RFs. Marked as "—" in mapping table, explained clearly.

✅ **Clear level separation** — Governance RFs are product-level (what we deliver), spec-kit FRs are implementation-level (how we build it). Mapping table makes this explicit.

✅ **Canonical declaration unambiguous** — Added to governance/prd.md introduction with clear guidance: "RF-NN is canonical, FR-NNN is legacy for E1 traceability only."

✅ **Future clarity established** — Anyone reading project docs knows: use RF-NN for E3+, FR-NNN is historical only.

✅ **Design skip validated again** — F0.3 is XS, skipped design, no quality loss. Third consecutive validation of F0.1 learning.

## What Could Improve

⚠️ **Mapping table could be bidirectional** — Current table shows FR→RF. Could add reverse mapping (RF→FR) for completeness, but may be overkill for this use case.

⚠️ **No validation of governance RF completeness** — Didn't verify all governance RFs are covered by FRs. Relied on understanding, not checklist.

## Heutagogical Checkpoint

### What did you learn?

1. **Nomenclature mapping is not always 1:1** — Requirements at different abstraction levels (product vs implementation) don't map cleanly. Some FRs are technical details (Dark Mode, bottom nav) not in product governance.

2. **Clear level separation matters** — Governance RFs answer "what value do we deliver?", spec-kit FRs answer "how do we build it?". Mapping table makes this separation explicit.

3. **Canonical declaration needs prominence** — Added to governance/prd.md introduction (top of doc), not buried in a section. Ensures everyone sees it first.

4. **Traceability across nomenclature evolution** — Projects evolve frameworks (spec-kit → RaiSE). Mapping tables preserve traceability without rewriting historical docs.

### What would you change about the process?

1. **Create mapping table template** — Pattern is clear: Legacy | Canonical | Description. Template would speed up future migrations.

2. **Bidirectional validation** — Check both directions: all FRs mapped → RFs, all RFs covered by FRs. Ensures completeness.

3. **Automate canonical declaration check** — Grep for FR/RF references in active docs, flag any using legacy nomenclature outside of historical specs.

### Are there improvements for the framework?

1. **Nomenclature migration pattern** — Generalize this to: "When migrating nomenclatures, create bidirectional mapping table + canonical declaration + future guidance." Reusable for any naming evolution.

2. **Level separation guidance** — Document product-level vs implementation-level requirements. Helps teams understand why some FRs don't map to RFs (different abstraction).

3. **Canonical declaration template** — Standard format for declaring canonical nomenclature in governance docs.

4. **Calibration insight** — XS features range from 1.67x to 2.0x velocity (F0.1: 2.0x, F0.3: 1.67x). Small variance, but worth tracking.

### What are you more capable of now?

1. **Manage nomenclature migrations** — Can create mapping tables that bridge legacy → canonical naming with clear traceability.

2. **Separate abstraction levels** — Understand product-level vs implementation-level requirements and why they don't map 1:1.

3. **Establish canonical references** — Know where to place canonical declarations (governance doc introduction) for maximum visibility.

4. **Execute batch workflows end-to-end** — Planned F0.2+F0.3 together, implemented sequentially, batch committed, now reviewing together. Full batch cycle demonstrated.

## Improvements Applied

### 1. Nomenclature Migration Pattern (New)

**Pattern:** When project nomenclature evolves:
1. Create mapping table (legacy → canonical)
2. Add canonical declaration to governance (prominent location)
3. Provide future guidance (use canonical, legacy is historical only)
4. Mark unmapped items clearly (UI/technical vs product-level)

**Reusable for:** Any naming evolution, framework migration, terminology standardization.

### 2. Calibration Data Captured

Third data point for documentation features:
- Size: XS
- Estimated: 25 min
- Actual: 15 min
- Velocity: 1.67x multiplier

**Calibration trend (3 data points):**
- F0.1 (XS): 2.0x
- F0.2 (S): 2.2x
- F0.3 (XS): 1.67x
- **Average:** ~1.96x for Simple doc features

**Insight:** 2.0x multiplier is a reasonable baseline for Simple documentation work.

## Action Items

- [ ] **Create nomenclature migration template** — Mapping table format + canonical declaration template
- [ ] **Document level separation** — Product-level vs implementation-level requirements (reference doc)
- [ ] **Canonical naming checklist** — Steps for establishing canonical nomenclature in governance
- [ ] **Validate calibration baseline** — After 5+ data points, confirm 2.0x for Simple doc features

## Blockers Encountered

None.

## Deviations from Plan

None — plan executed as written. Both tasks completed with all verification criteria passed.

---

*Retrospective completed: 2026-02-13*
*Kaizen: Nomenclature migration pattern established, batch workflow cycle complete (plan → implement → commit → review)*
