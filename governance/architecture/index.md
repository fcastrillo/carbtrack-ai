---
type: architecture_index
project: carbtrack-ai
status: current
generated_at: "2026-02-12"
---

# Architecture Index: carbtrack-ai

PWA for carbohydrate counting assistance for T1D diabetes management. AI vision analyzes meal photos, CareLink CSV import syncs glucose data to Nightscout, Educadies food catalog provides carb reference. Single-user MVP, no auth, no offline.

## Module Map

| Module | Purpose | Depends On | Components |
|--------|---------|------------|------------|
| lib | Supabase client singleton | — | 1 |
| services | Domain services (meal, CSV, catalog, profile) | lib | 18 |
| components | Reusable UI (CaptureMeal, MealCard, FilterBar, BottomNav) | services | 8 |
| pages | Page per tab (Hoy, Bitacora, Lab, CargaDatos, Perfil) | services, components | 6 |
| app | Router + layout shell | pages, components | 1 |
| edge-functions | Deno Edge Functions (analyze-meal, import-carelink-csv) | — | 7 |
| test-utils | Mock Supabase for tests | — | 1 |

## Data Flow

```
User → [CaptureMeal] → mealService.uploadAndAnalyze()
  → Supabase Storage (image)
  → Edge Function analyze-meal → (future: OpenAI Vision + Educadies match)
  → User confirms/edits carbs
  → mealService.saveMeal() → meal_history table

User → [CargaDatosPage] → csvUploadService.uploadCareLinkCsv()
  → Edge Function import-carelink-csv
  → Nightscout API (entries + treatments)

User → [PerfilPage] → profileService.getProfile/saveProfile()
  → pump_profile table
```

## Key Constraints

- Service layer pattern: components/pages never call Supabase directly
- Dark theme: `#0a0a0a` bg, `#18181b` cards — all pages
- Backend secrets only in Edge Functions (never in client)
- Tests use mock Supabase, synthetic data only
- No global state — local React state (useState/useEffect)
- Model-agnostic AI: analyze-meal abstracts vision provider
