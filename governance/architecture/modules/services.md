---
type: module
name: services
purpose: "Domain-specific Supabase operations — one service per domain"
status: current
depends_on: [lib]
depended_by: [components, pages]
components: 18
---

# Module: services

## Purpose

Encapsulates all Supabase client operations behind domain-specific functions. Components and pages never call Supabase directly — they go through services. This enforces the service layer pattern (guardrail `should-code-001`) and keeps UI components free of data access logic.

## Architecture

Each service file owns one domain:

- **mealService** — The largest service (11 symbols). Handles the full meal lifecycle: image validation, Storage upload, Edge Function invocation for AI analysis, meal persistence to `meal_history`, and date-range queries. Core types `AnalyzeItem`, `AnalyzeResponse`, `MealRecord`, and `MealEntry` are defined here.
- **csvUploadService** — Sends CareLink CSV content to the `import-carelink-csv` Edge Function and returns entry/treatment counts.
- **catalogService** — Inserts user-suggested foods into `master_food_list` (Educadies catalog).
- **profileService** — CRUD for the single `pump_profile` row (ISF and I:C ratio).

All services import the singleton `supabase` client from `lib/supabase.ts`.

## Key Files

| File | Description |
|------|-------------|
| `mealService.ts` | Image upload, AI analysis, meal CRUD, date queries |
| `csvUploadService.ts` | CareLink CSV → Edge Function invocation |
| `catalogService.ts` | Food catalog inserts (master_food_list) |
| `profileService.ts` | Pump profile ISF/I:C ratio read/write |

## Dependencies

| Dependency | Why |
|------------|-----|
| `lib/supabase` | Singleton Supabase client for all operations |

## Conventions

- One file per domain, one exported type + functions per domain
- Functions return typed promises, throw on Supabase errors
- Error handling: Edge Function errors are caught and returned as structured error objects (not thrown)
- Types are co-located with their service (not in a separate types file)
- Image validation constants (MAX_FILE_SIZE_BYTES, ALLOWED_TYPES) are private to mealService
