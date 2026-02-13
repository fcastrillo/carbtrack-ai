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

work/epics/         RaiSE-native design for E3+ epics (active)
specs/              E1 (MVP) spec-kit artifacts (historical archive)
dev/decisions/      Architectural decisions (ADRs)
dev/parking-lot.md  Deferred items and framework improvements
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

## Design & Development Framework

### E1 (MVP Asistente CH) — Historical Reference

E1 was designed using spec-kit framework (pre-RaiSE). Reference docs are archived in `specs/001-mvp-asistente-ch/`:
- `specs/001-mvp-asistente-ch/spec.md` — Feature acceptance scenarios
- `specs/001-mvp-asistente-ch/data-model.md` — DB schema and data contracts
- `specs/001-mvp-asistente-ch/contracts/edge-functions.md` — Edge Function API contracts
- `specs/001-mvp-asistente-ch/ACCEPTED_DEBT.md` — Known limitations accepted for MVP

**Status:** E1 complete and frozen. `specs/` directory is historical archive only.

### E3+ Development — RaiSE-Native Design

E3+ and future epics use **RaiSE** (Rapid Adoption for Software Engineering) framework:

**Design artifacts live in `work/epics/eN-{name}/`:**
```
work/epics/e3-{epic-name}/
  scope.md                    ← Epic overview, features, ADRs, milestones
  plan.md                     ← Feature sequencing and dependencies

  stories/fN.M-{story-name}/
    design.md                 ← Story specification (approach, examples, acceptance)
    plan.md                   ← Task breakdown and execution order
    progress.md               ← Implementation tracking
    retrospective.md          ← Learnings and improvements
```

**Key references:**
- **Design Convention:** `work/CONVENTION-design.md` — Where artifacts live, which skills generate what
- **Architectural Decisions:** `dev/decisions/ADR-*.md` — Key decisions (RaiSE-native design, canonical nomenclature, etc.)
- **Deferred Items:** `dev/parking-lot.md` — Framework improvements and future work
- **Branching Policy:** `dev/BRANCHING-POLICY.md` — Hybrid model (push per feature, merge at epic close)

## Environment Variables

Frontend (`.env.local`):
```
VITE_SUPABASE_URL=https://<project>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
```

Backend secrets (Supabase dashboard, never in client code):
`OPENAI_API_KEY`, `NIGHTSCOUT_URL`, `NIGHTSCOUT_API_SECRET`

## Git Branching Model

**Hybrid RaiSE model:** Push frequently for visibility, merge at epic closure for main stability.

**Branch structure:**
- `main` — Stable, merged epics only
- `epic/eN-{name}` — WIP epic with all features
- Feature branches (optional, nested under epic branch for S/XS features)

**Workflow:**
1. Create epic branch for new epic (`epic/eN/...`)
2. Work on features within epic branch or create story branches
3. Push epic branch to remote after each feature completion (hybrid model)
4. Run `/rai-epic-close` to merge epic → main and cleanup branches

**For details:** See `dev/BRANCHING-POLICY.md`

## Recent Changes (E0 — Documentation Homologation)

**Epic E0 unified the documentation architecture** (completed 2026-02-13):
- Archived legacy root files (PRD.md, spec.md) to `specs/000-genesis/`
- Established RaiSE-native design for E3+ (no more spec-kit for new epics)
- Created canonical design convention in `work/CONVENTION-design.md`
- Documented 3 ADRs: index vs move, canonical nomenclature, RaiSE-native design
- Implemented hybrid branching model for GitHub visibility + main stability

**All E1 references remain valid** — specs/ is frozen historical archive.

**For E3+ development:** Use `work/epics/e3-{name}/` structure with RaiSE framework.
