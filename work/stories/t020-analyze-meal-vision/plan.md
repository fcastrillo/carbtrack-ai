# Implementation Plan: T020 — analyze-meal Vision Integration

## Overview
- **Story:** T020 (Epic E1 — MVP Asistente CH)
- **Feature Size:** M (moderate)
- **Created:** 2026-02-12
- **Design:** `work/stories/t020-analyze-meal-vision/design.md`

## Tasks

### Task 1: Env validation + Supabase client + catalog fetch
- **Description:** Add environment variable validation for `OPENAI_API_KEY` (502 if missing). Create Supabase client using `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`. Implement `fetchCatalog()` to query `master_food_list` (columns: `alimento`, `ch_por_racion`, `medida`). Wire into handler after existing image validation.
- **Files:** `supabase/functions/analyze-meal/index.ts`
- **TDD Cycle:** N/A (Deno Edge Function — no local test runner). Verify via code review + type correctness.
- **Verification:** Missing `OPENAI_API_KEY` returns `{ error: "Servicio de análisis no configurado. Contacte al administrador." }` with status 502. Supabase client created with service role. Catalog fetched as array.
- **Size:** S
- **Dependencies:** None

### Task 2: OpenAI Vision prompt builder + API call
- **Description:** Implement `callVision(image, catalog)` — builds Spanish prompt with catalog food names for matching (per design.md prompt template). Constructs OpenAI Chat Completions request with `gpt-4o` model and `image_url` content type. Supports both `image_url` and `image_base64` (as data URI). Parses structured JSON from `response.choices[0].message.content`. Handles API errors (network, non-200 status) returning 502 with `"Error del servidor de análisis. Intente más tarde."`. Guardrail `must-arch-001`: Vision call is isolated in a single function — model name is a constant, easy to swap provider.
- **Files:** `supabase/functions/analyze-meal/index.ts`
- **TDD Cycle:** N/A. Verify via code review of prompt structure, API call, and error paths.
- **Verification:** Prompt includes catalog names. API call uses `gpt-4o`. Image passed correctly for both URL and base64 cases. JSON parse handles malformed responses gracefully.
- **Size:** M
- **Dependencies:** Task 1 (needs catalog for prompt)

### Task 3: Source tagging + response assembly
- **Description:** Implement source tagging logic: compare Vision item names (case-insensitive) against `catalog[].alimento`. Matched items get `source: "educadies"` + catalog's `ch_por_racion` and `medida` (override Vision estimates). Unmatched items get `source: "vision_only"`. Compute `total_carbs` as sum of all `items[].carbs_grams`. Return `{ items, total_carbs }` per contract. Wire complete flow into main handler: validate image → check env → fetch catalog → call Vision → tag → respond.
- **Files:** `supabase/functions/analyze-meal/index.ts`
- **TDD Cycle:** N/A. Verify via code review of matching logic and response shape.
- **Verification:** Response matches `AnalyzeItem[]` contract (`name`, `carbs_grams`, `measure`, `source`). `total_carbs` equals sum. Catalog matches use catalog values (not Vision estimates).
- **Size:** S
- **Dependencies:** Task 2 (needs Vision response to tag)

### Task 4: Build + test verification
- **Description:** Run existing frontend tests (`npm test`) to confirm contract compatibility — `mealService.ts` types haven't changed and no regressions. Run `npm run build` to verify TypeScript compilation. Run `npm run lint` for code quality.
- **Files:** (no modifications — verification only)
- **Verification:** `npm test` → 0 failures. `npm run build` → clean. `npm run lint` → 0 errors.
- **Size:** XS
- **Dependencies:** Task 3

### Task 5 (Final): Manual integration test
- **Description:** Review the complete Edge Function implementation against the design spec examples and acceptance criteria. Verify all 8 MUST criteria from design.md are met. Confirm the response shape matches the contract in `specs/001-mvp-asistente-ch/contracts/edge-functions.md`.
- **Verification:** All MUST acceptance criteria checked off. Code matches design examples.
- **Size:** XS
- **Dependencies:** Task 4

## Execution Order
1. Task 1 — foundation (env + DB client + catalog)
2. Task 2 — core (Vision API integration) — depends on Task 1
3. Task 3 — assembly (tagging + response) — depends on Task 2
4. Task 4 — gate (tests + build + lint)
5. Task 5 — final validation (manual review against acceptance criteria)

## Risks
- **OpenAI response format unpredictable:** Mitigation — robust JSON parsing with fallback, clear prompt with SOLO JSON instruction
- **Catalog empty or DB connection fails:** Mitigation — graceful degradation (proceed with empty catalog, all items get `vision_only`)
- **Deno import compatibility for @supabase/supabase-js:** Mitigation — use esm.sh CDN import (standard pattern for Supabase Edge Functions)

## Guardrails Addressed
| Guardrail | How |
|-----------|-----|
| `must-arch-001` | Vision call isolated in `callVision()` function, model name as constant |
| `must-sec-001` | `OPENAI_API_KEY` read from `Deno.env.get()`, never in response/logs |
| `must-test-002` | No real patient data in implementation or tests |

## Duration Tracking
| Task | Size | Actual | Notes |
|------|------|--------|-------|
| 1 | S | -- | |
| 2 | M | -- | |
| 3 | S | -- | |
| 4 | XS | -- | |
| 5 | XS | -- | |
