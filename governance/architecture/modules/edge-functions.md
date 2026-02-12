---
type: module
name: edge-functions
purpose: "Server-side Deno Edge Functions for AI analysis and CareLink import"
status: current
depends_on: []
depended_by: [services]
components: 7
---

# Module: edge-functions

## Purpose

Contains Deno Edge Functions hosted on Supabase that handle server-side processing. These functions run outside the browser and have access to backend secrets (OpenAI API key, Nightscout credentials). The frontend invokes them via `supabase.functions.invoke()` through the service layer.

## Architecture

Two Edge Functions, each in its own directory under `supabase/functions/`:

- **analyze-meal** — Receives `{ image_url | image_base64 }`, returns `{ items: AnalyzeItem[], total_carbs }`. Currently a placeholder skeleton returning empty results. Will integrate GPT-4o Vision + master_food_list matching when US2 is implemented. The model-agnostic design (guardrail `must-arch-001`) means the AI provider can be swapped without frontend changes.

- **import-carelink-csv** — The more complex function (7 internal components). Parses CareLink CSV exports that contain two data blocks identified by `Index,Date,Time,...` headers. Block 1 produces Nightscout treatments (Meal Bolus from BWZ Carb Input). Block 2 produces Nightscout entries (SGV from Sensor Glucose). Results are batched (100 per request) and posted to the Nightscout REST API with SHA-1 hashed API-SECRET authentication.

## Key Files

| File | Description |
|------|-------------|
| `analyze-meal/index.ts` | AI meal analysis (placeholder) |
| `import-carelink-csv/index.ts` | CareLink CSV parsing + Nightscout posting |

## Dependencies

| Dependency | Why |
|------------|-----|
| Deno `std/http/server.ts` | HTTP server for Edge Function hosting |
| Nightscout REST API | Target for CareLink entries/treatments |
| OpenAI API (future) | AI vision provider for meal analysis |

## Conventions

- CORS headers on all responses (including OPTIONS preflight)
- Backend secrets via `Deno.env.get()` — never exposed to client (guardrail `must-sec-001`)
- Nightscout API-SECRET hashed with SHA-1 before sending
- Error responses use structured JSON: `{ error: string }`
- HTTP status codes: 400 for bad input, 502 for backend failures
- No JWT verification in MVP (accepted debt)
