---
type: story_design
story_id: t020
epic: e1
title: "analyze-meal Edge Function — GPT-4o Vision + Educadies matching"
complexity: moderate
components:
  - modify: supabase/functions/analyze-meal/index.ts
status: draft
---

# Design: T020 — analyze-meal Vision Integration

## What & Why

**Problem:** The analyze-meal Edge Function is a placeholder returning `{ items: [], total_carbs: 0 }`. Users capture meal photos but get no AI carb suggestions — the core value proposition of CarbTrack AI is missing.

**Value:** With Vision integration, users photograph a meal and receive per-food carb estimates cross-referenced against the Educadies catalog. This is the feature that makes the app useful for daily diabetes management.

## Architectural Context

**Module:** edge-functions (Deno, Supabase-hosted)
**Guardrails:**
- `must-arch-001`: AI provider abstracted in Edge Function (model-agnostic)
- `must-sec-001`: OPENAI_API_KEY only in Edge Function env, never in client
- `must-test-002`: Test data must be synthetic

## Approach

Replace the placeholder in `analyze-meal/index.ts` with:

1. **Receive image** (URL or base64) — validation already exists in skeleton
2. **Fetch Educadies catalog** from `master_food_list` via Supabase client
3. **Call OpenAI Vision API** with the image + a prompt that includes the catalog food names for matching
4. **Parse structured response** from OpenAI into `AnalyzeItem[]`
5. **Tag source** per item: `educadies` if name matches catalog, `vision_only` if not
6. **Return** `{ items, total_carbs }` per contract

**Key decision — Catalog in prompt vs post-matching:**
Include catalog food names in the Vision prompt so OpenAI can directly reference known foods. This produces better matches than post-hoc string comparison and keeps the logic simple. The catalog is small enough (~50-200 items) to fit in the prompt.

**Key decision — Supabase client in Edge Function:**
Use `@supabase/supabase-js` to query `master_food_list` from within the Edge Function. This requires `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` env vars (service role to bypass RLS).

## Examples

### Request

```json
{
  "image_url": "https://xyz.supabase.co/storage/v1/object/public/meal-images/abc-photo.jpg"
}
```

### Successful Response

```json
{
  "items": [
    {
      "name": "Arroz cocido",
      "carbs_grams": 42,
      "measure": "150 g",
      "source": "educadies"
    },
    {
      "name": "Pollo a la plancha",
      "carbs_grams": 0,
      "measure": "1 pieza",
      "source": "vision_only"
    },
    {
      "name": "Manzana",
      "carbs_grams": 15,
      "measure": "1 unidad mediana",
      "source": "educadies"
    }
  ],
  "total_carbs": 57
}
```

### Error Response (missing API key)

```json
{
  "error": "Servicio de análisis no configurado. Contacte al administrador."
}
```

### OpenAI Vision Prompt (structured output)

```
Analiza esta foto de comida. Identifica cada alimento visible y estima los gramos de carbohidratos.

Catálogo de referencia (Educadies):
- Pan blanco: 15g CH por 1 rebanada
- Arroz cocido: 28g CH por 100g
- Manzana: 15g CH por 1 unidad mediana
[... rest of catalog]

Responde SOLO con JSON válido en este formato:
{
  "items": [
    { "name": "nombre del alimento", "carbs_grams": número, "measure": "porción estimada" }
  ]
}

Usa los nombres EXACTOS del catálogo cuando el alimento coincida. Para alimentos no encontrados en el catálogo, usa un nombre descriptivo en español.
```

### Source Tagging Logic

```typescript
// After OpenAI response, tag each item
const catalogNames = catalog.map(f => f.alimento.toLowerCase())
for (const item of items) {
  const match = catalogNames.includes(item.name.toLowerCase())
  item.source = match ? "educadies" : "vision_only"
  if (match) {
    // Use catalog carb value instead of Vision estimate
    const catalogEntry = catalog.find(f => f.alimento.toLowerCase() === item.name.toLowerCase())
    if (catalogEntry) {
      item.carbs_grams = Number(catalogEntry.ch_por_racion)
      item.measure = catalogEntry.medida || item.measure
    }
  }
}
```

## Acceptance Criteria

### MUST

1. Edge Function calls OpenAI Vision API with `gpt-4o` model and the meal image
2. Response contains `items: AnalyzeItem[]` with `name`, `carbs_grams`, `measure`, `source` per contract
3. Items matching `master_food_list.alimento` have `source: "educadies"` and use catalog `ch_por_racion`
4. Items not in catalog have `source: "vision_only"` with Vision-estimated carbs
5. `total_carbs` equals sum of all `items[].carbs_grams`
6. Missing `OPENAI_API_KEY` returns 502 with Spanish error message
7. OpenAI API failure returns 502 with `"Error del servidor de análisis. Intente más tarde."`
8. Invalid/missing image returns 400 (already handled in skeleton)

### SHOULD

1. Catalog food names included in prompt for better matching accuracy
2. When catalog match found, prefer catalog `ch_por_racion` over Vision estimate
3. Response time under 15 seconds for typical meal photos

### MUST NOT

1. Expose `OPENAI_API_KEY` in response or logs
2. Send real patient health data in the prompt (only image + catalog names)
3. Break existing frontend contract (CaptureMeal already handles this response shape)

## Environment Variables Required

| Variable | Where | Purpose |
|----------|-------|---------|
| `OPENAI_API_KEY` | Edge Function secret | OpenAI API authentication |
| `SUPABASE_URL` | Edge Function env (auto-injected) | Query master_food_list |
| `SUPABASE_SERVICE_ROLE_KEY` | Edge Function secret | Bypass RLS for DB query |
