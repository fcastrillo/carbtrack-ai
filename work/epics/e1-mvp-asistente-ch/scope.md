# Epic Scope: E1 — MVP Asistente CH

**Status:** Complete (2026-02-13)
**Duration:** 10 days (2026-02-03 → 2026-02-13)
**PRD Requirements:** RF-01, RF-02, RF-03, RF-06, RF-07

---

## Objective

Deliver a functional PWA that replaces manual carbohydrate counting for Type 1 diabetes meal management. AI Vision analyzes meal photos, cross-references with Educadies food catalog, and the user confirms/adjusts the estimate. CareLink CSV import syncs pump data to Nightscout. Daily tracking, history, and profile management complete the MVP.

## Features (User Stories)

- [x] US1 — Navigation & Theme: 5-tab BottomNav, dark mode (#0a0a0a/#18181b), no auth
- [x] US2 — Capture & CH Suggestion: GPT-4o Vision + Educadies cross-reference via Edge Function
- [x] US3 — Pantalla Hoy: daily CH total, meal cards, FAB, empty state
- [x] US4 — Bitácora: 5 filters (Todas/Hoy/Semana/Mes/Custom), date range, empty state
- [x] US5 — Carga CSV CareLink: CSV → Edge Function → Nightscout (entries + treatments)
- [x] US6 — Laboratorio: recommendations placeholder with data/empty states
- [x] US7 — Perfil: ISF/I:C manual entry, pump_profile CRUD

## Architecture

| Layer | Technology | Components |
|-------|-----------|------------|
| Frontend | React 19 + Vite + TypeScript + Tailwind CSS 4 | 5 pages, 4 components, 4 services |
| Backend | Supabase Edge Functions (Deno) | analyze-meal, import-carelink-csv |
| Database | PostgreSQL (Supabase) | master_food_list, meal_history, pump_profile |
| Storage | Supabase Storage | meal-images bucket |
| External | OpenAI GPT-4o, Nightscout API | Vision analysis, glucose/insulin sync |

## Accepted Constraints (MVP)

- No authentication (single implicit user)
- No offline support (all persistence via Supabase)
- No real-time Nightscout integration (CSV import only)
- Laboratorio shows placeholder recommendations (full audit engine is E3)
- Continuous learning loop deferred to E4

## Success Criteria

| ID | Criterion | Status |
|----|-----------|--------|
| SC-001 | Capture → suggestion → confirmation < 30s | N/A (runtime) |
| SC-002 | Hoy total = sum of confirmed CH | Verified |
| SC-003 | Bitácora filters update correctly | Verified |
| SC-004 | Valid CareLink CSV syncs to Nightscout | Verified |
| SC-005 | Dark mode on all screens, 5-tab nav | Verified |
| SC-006 | Laboratorio/Perfil show data or empty state | Verified |

## Spec References

- Specification: `specs/001-mvp-asistente-ch/spec.md`
- Tasks (49): `specs/001-mvp-asistente-ch/tasks.md`
- Quickstart validation: `specs/001-mvp-asistente-ch/quickstart.md`
- Data model: `specs/001-mvp-asistente-ch/data-model.md`
- Edge Function contracts: `specs/001-mvp-asistente-ch/contracts/edge-functions.md`
- Accepted debt: `specs/001-mvp-asistente-ch/ACCEPTED_DEBT.md`

## Validation

- T047 quickstart validation: 27/28 PASS, 1 N/A (SC-001), 0 FAIL
- Gates: lint 0 errors, tsc build clean, 5/5 tests passing
- Retrospective: `work/epics/e1-mvp-asistente-ch/retrospective.md`
