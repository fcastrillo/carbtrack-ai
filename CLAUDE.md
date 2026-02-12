# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CarbTrack AI is a PWA for carbohydrate counting assistance for diabetes management. It uses AI vision to analyze meal photos, integrates with Nightscout/CareLink for glucose data, and provides a food catalog (Educadies). The app is in Spanish (UI text, variable names in spec docs).

## Commands

All frontend commands run from `frontend/`:

```bash
cd frontend
npm run dev          # Vite dev server (port 5173)
npm run build        # TypeScript check + Vite production build
npm run lint         # ESLint
npm test             # Vitest (single run)
npm run test:watch   # Vitest (watch mode)
```

Run a single test file:
```bash
cd frontend && npx vitest run src/services/__tests__/profileService.test.ts
```

Supabase local dev (requires Supabase CLI):
```bash
supabase start       # API :54321, DB :54322, Studio :54323
supabase functions serve  # Edge Functions local server
```

## Architecture

```
frontend/           React 19 + Vite + TypeScript + Tailwind CSS 4 (PWA)
supabase/
  migrations/       PostgreSQL schema (master_food_list, meal_history, pump_profile)
  functions/        Deno Edge Functions (analyze-meal, import-carelink-csv)
specs/              Feature specs, plans, tasks, contracts, data model
```

### Frontend Layers

**Pages** (`frontend/src/pages/`) — One per tab: HoyPage, BitacoraPage, LaboratorioPage, CargaDatosPage, PerfilPage. Routed via React Router with a fixed `BottomNav` component (5 tabs).

**Services** (`frontend/src/services/`) — Each domain has a service that wraps Supabase client calls:
- `mealService.ts` — Image upload to Storage, Edge Function invocation for analysis, meal CRUD on `meal_history`
- `csvUploadService.ts` — Sends CSV content to `import-carelink-csv` Edge Function
- `profileService.ts` — ISF/I:C ratio CRUD on `pump_profile`
- `catalogService.ts` — Inserts user-suggested foods into `master_food_list`

**Supabase client** initialized in `frontend/src/lib/supabase.ts` using `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from `.env.local`.

### Edge Functions (Deno)

- `analyze-meal/` — Receives `{ image_url | image_base64 }`, returns `{ items: AnalyzeItem[], total_carbs }`. Currently a placeholder; will integrate GPT-4o Vision + master_food_list matching.
- `import-carelink-csv/` — Parses CareLink CSV (detects two blocks by `Index,Date,Time,...` header), extracts Treatments (BWZ Carb Input) and Entries (Sensor Glucose), returns counts.

### Database Tables

- `master_food_list` — Educadies food catalog (alimento, ch_por_racion, medida, categoria)
- `meal_history` — Meal records with image_url, ai_analysis (jsonb), user_confirmed_carbs, timestamp
- `pump_profile` — Manual ISF and I:C ratio entry

### Key Types

```typescript
// From analyze-meal response
AnalyzeItem { name: string; carbs_grams: number; measure: string; source: 'educadies' | 'vision_only' }

// meal_history row
MealEntry { id: string; image_url: string; ai_analysis: { items?: AnalyzeItem[]; total_carbs?: number } | null; user_confirmed_carbs: number; timestamp: string }
```

## Development Conventions

- **Dark theme**: Background `#0a0a0a`, cards `#18181b`. All pages must use these colors.
- **No authentication in MVP**: JWT verification is disabled in Edge Functions. No login flow.
- **No offline support in MVP**: All data persists directly to Supabase.
- **State management**: Local React state (`useState`/`useEffect`), no global store.
- **Styling**: Tailwind CSS utility classes only. Icons from `lucide-react`.
- **Image uploads**: 5MB max, JPEG/PNG/WebP only, stored in `meal-images` Storage bucket with UUID filenames.

## Testing Rules

- All tests use **mock Supabase** (see `frontend/src/test-utils/mockSupabase.ts`). No real API calls.
- Test data must be **synthetic** — never use real patient health data (Constitution II requirement).
- Test setup file: `frontend/src/test-utils/setup.ts` (configured in vite.config.ts).
- Test environment: jsdom with Vitest globals enabled.

## Spec-Driven Development

Implementation follows `specs/001-mvp-asistente-ch/tasks.md` phase by phase. Key reference docs:
- `specs/001-mvp-asistente-ch/spec.md` — Feature acceptance scenarios
- `specs/001-mvp-asistente-ch/data-model.md` — DB schema and data contracts
- `specs/001-mvp-asistente-ch/contracts/edge-functions.md` — Edge Function API contracts
- `specs/001-mvp-asistente-ch/ACCEPTED_DEBT.md` — Known limitations accepted for MVP

## Environment Variables

Frontend (`.env.local`):
```
VITE_SUPABASE_URL=https://<project>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
```

Backend secrets (Supabase dashboard, never in client code):
`OPENAI_API_KEY`, `NIGHTSCOUT_URL`, `NIGHTSCOUT_API_SECRET`
