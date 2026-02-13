# Implementation Plan: T047 — Quickstart Validation

## Overview
- **Feature:** T047 — Run quickstart validation from `specs/001-mvp-asistente-ch/quickstart.md`
- **Story Points:** 3 SP (validation, not feature build)
- **Feature Size:** S
- **Created:** 2026-02-13

## Tasks

### Task 1: Code Audit — All 8 Quickstart Sections
- **Description:** Systematically verify each quickstart.md checklist item against the actual codebase. Read the relevant source files and confirm implementation matches the expected behavior. Document findings (PASS/FAIL/PARTIAL) per item.
- **Sections & Files to inspect:**
  - **S1 Navigation/Theme:** `BottomNav.tsx`, `App.tsx`, all pages — 5 tabs, routes, `#0a0a0a`/`#18181b`, no login
  - **S2 Capture/CH:** `CaptureMeal.tsx`, `mealService.ts`, `analyze-meal/index.ts` — camera/picker, Edge Function call (not direct OpenAI), suggestion display, confirm/edit, meal_history save
  - **S3 Hoy:** `HoyPage.tsx` — total CH header, meal cards, sum consistency, FAB, empty state
  - **S4 Bitácora:** `BitacoraPage.tsx`, `FilterBar.tsx` — 5 filters, custom date range, list update, empty state
  - **S5 CSV Upload:** `CargaDatosPage.tsx`, `csvUploadService.ts`, `import-carelink-csv/index.ts` — file select, Edge Function call, counts display, error handling
  - **S6 Laboratorio:** `LaboratorioPage.tsx` — recommendations with data, empty state without
  - **S7 Perfil:** `PerfilPage.tsx`, `profileService.ts` — ISF/I:C display, manual entry, save to pump_profile
  - **S8 Security:** Grep for `OPENAI_API_KEY`/`NIGHTSCOUT` in `frontend/src/`, verify `.env.local` only has `VITE_SUPABASE_*`
- **Verification:** All items documented as PASS/FAIL/PARTIAL with evidence
- **Size:** M
- **Dependencies:** None

### Task 2: Fix Issues Found
- **Description:** For each FAIL/PARTIAL item from Task 1, implement the minimal fix. If no issues found, skip this task.
- **Files:** Determined by Task 1 findings
- **Verification:** Re-check failed items; `npm run lint && npm run build && npm test`
- **Size:** S-M (depends on findings; 0 if all pass)
- **Dependencies:** Task 1

### Task 3: Update Quickstart Checklist + Validation Gates
- **Description:** Tick off verified items in `specs/001-mvp-asistente-ch/quickstart.md`. Run full validation gates: lint, build, tests.
- **Files:** `specs/001-mvp-asistente-ch/quickstart.md`
- **Verification:** `cd frontend && npm run lint && npm run build && npm test`
- **Size:** XS
- **Dependencies:** Task 2 (or Task 1 if no fixes needed)

### Task 4 (Final): Manual Integration Test
- **Description:** Start dev server (`npm run dev`), walk through quickstart sections 1-7 visually in browser. Confirm navigation, theme, capture flow (with mock), page content, empty states. Section 8 already verified by code audit.
- **Verification:** Dev server starts without errors; all pages render correctly
- **Size:** XS
- **Dependencies:** Task 3

## Execution Order
1. Task 1 — Code audit (foundation, determines scope of remaining work)
2. Task 2 — Fix issues (conditional, depends on Task 1 findings)
3. Task 3 — Update checklist + gates (depends on fixes being complete)
4. Task 4 — Manual integration test (final validation)

## Risks
- **Risk:** Audit reveals significant gaps requiring new feature work → **Mitigation:** T047 scope is "fix blocking issues only"; larger gaps become backlog items, not T047 scope creep
- **Risk:** Dev server requires Supabase connection for full flow → **Mitigation:** Validate code paths exist; runtime behavior confirmed by existing tests + code structure

## Duration Tracking
| Task | Size | Actual | Notes |
|------|------|--------|-------|
| 1 | M | -- | Code audit, 8 sections |
| 2 | S-M | -- | Conditional on findings |
| 3 | XS | -- | Checklist + gates |
| 4 | XS | -- | Dev server walkthrough |
