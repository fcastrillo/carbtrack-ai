---
type: architecture_domain_model
project: carbtrack-ai
status: current
bounded_contexts:
  - name: meal-tracking
    modules: [services/mealService, components/CaptureMeal, components/MealCard, pages/HoyPage, pages/BitacoraPage]
    description: "Core domain — meal capture, AI analysis, carb confirmation, history"
  - name: glucose-import
    modules: [services/csvUploadService, edge-functions/import-carelink-csv, pages/CargaDatosPage]
    description: "CareLink CSV parsing and Nightscout synchronization"
  - name: food-catalog
    modules: [services/catalogService]
    description: "Educadies food reference catalog management"
  - name: pump-profile
    modules: [services/profileService, pages/PerfilPage]
    description: "ISF and I:C ratio configuration"
  - name: recommendations
    modules: [pages/LaboratorioPage]
    description: "Cross-analysis of meals + glucose for insights (placeholder)"
shared_kernel:
  modules: [lib/supabase, components/BottomNav, components/FilterBar, test-utils/mockSupabase]
application_layer:
  modules: [app/App]
---

# Domain Model: carbtrack-ai

> Bounded contexts, context map, and design decision guidance

## Bounded Contexts

```
┌─────────────────────────────────────────────────────────────────┐
│                        CarbTrack AI                             │
│                                                                 │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │  Meal Tracking    │  │  Glucose Import  │  │  Food Catalog │  │
│  │                   │  │                  │  │              │  │
│  │  mealService      │  │  csvUploadSvc    │  │  catalogSvc  │  │
│  │  CaptureMeal      │  │  import-carelink │  │              │  │
│  │  MealCard         │  │  CargaDatosPage  │  └──────────────┘  │
│  │  HoyPage          │  └──────────────────┘                    │
│  │  BitacoraPage     │                                          │
│  └──────────────────┘  ┌──────────────────┐  ┌──────────────┐  │
│                        │  Pump Profile     │  │ Recommendations│  │
│                        │  profileService   │  │ LaboratorioPage│  │
│                        │  PerfilPage       │  │ (placeholder)  │  │
│                        └──────────────────┘  └──────────────┘  │
│                                                                 │
│  ── Shared Kernel: supabase client, BottomNav, FilterBar ──     │
└─────────────────────────────────────────────────────────────────┘
```

### Meal Tracking (Core Domain)

**Owns:** meal_history table, meal-images Storage bucket, analyze-meal Edge Function
**Does NOT own:** master_food_list (owned by Food Catalog), glucose data (owned by Nightscout via Glucose Import)

**Aggregate root:** `mealService.uploadAndAnalyze()` — orchestrates the full capture flow

**Domain vocabulary:**

| Term | Meaning |
|------|---------|
| MealEntry | A persisted meal record with image, AI analysis, and user-confirmed carbs |
| AnalyzeItem | A single food item detected by AI with carb estimate and source |
| user_confirmed_carbs | The carb value the user accepts (may differ from AI total_carbs) |
| vision_only | An AI-detected item not found in Educadies catalog |

**Invariants:**
- Every meal must have `user_confirmed_carbs` (even if 0)
- Images must pass validation before upload (type + size)
- AI analysis results are suggestions — user always confirms

### Glucose Import

**Owns:** import-carelink-csv Edge Function, CareLink CSV parsing logic
**Does NOT own:** Nightscout data (pushes to it, doesn't read from it in MVP)

**Aggregate root:** `uploadCareLinkCsv()` — sends CSV to Edge Function

**Domain vocabulary:**

| Term | Meaning |
|------|---------|
| treatments | Nightscout entries for meal bolus events (BWZ Carb Input from CareLink) |
| entries | Nightscout entries for sensor glucose values (SGV) |
| two-block CSV | CareLink export format with two `Index,Date,Time,...` header rows |

**Invariants:**
- CSV must contain at least one `Index,Date,Time,...` header
- Glucose values must be 1-500 mg/dL to be valid
- Nightscout API-SECRET is always SHA-1 hashed before sending

### Food Catalog

**Owns:** master_food_list table (Educadies catalog)
**Does NOT own:** meal_history (owned by Meal Tracking)

**Aggregate root:** `addToCatalog()` — inserts user-suggested foods

**Invariants:**
- Every food item has alimento, ch_por_racion, medida, categoria
- Default categoria is 'Otros' for user-suggested items

### Pump Profile

**Owns:** pump_profile table
**Does NOT own:** insulin dosing logic (future feature)

**Aggregate root:** `saveProfile()` — upserts ISF/I:C values

**Invariants:**
- Single row in MVP (one implicit user)
- ISF >= 0, I:C ratio > 0

### Recommendations (Placeholder)

**Owns:** Nothing yet — currently shows meal count only
**Will own:** Cross-analysis logic between meals and glucose data

## Context Map

```
Meal Tracking ───uses───► Food Catalog  (addToCatalog for vision_only items)
Meal Tracking ───uses───► Supabase Storage  (image upload)
Glucose Import ──posts──► Nightscout API  (entries + treatments)
Recommendations ─reads─► Meal Tracking  (getMealsByRange)
All contexts ────use────► Shared Kernel (supabase client)
```

| Relationship | Pattern | Notes |
|-------------|---------|-------|
| Meal Tracking → Food Catalog | Supplier-Consumer | CaptureMeal calls addToCatalog for vision_only items |
| Meal Tracking → Edge Functions | Fire-and-forget | analyzeMeal invokes Edge Function, waits for response |
| Glucose Import → Nightscout | Fire-and-forget | Batched POST, no read-back |
| Recommendations → Meal Tracking | Supplier-Consumer | Reads meal data via getMealsByRange |

## Design Decision Guidance

| If you're adding... | It belongs in... | Because... |
|--------------------|------------------|------------|
| A new meal-related query or mutation | services/mealService | Meal Tracking owns meal_history |
| A new food item operation | services/catalogService | Food Catalog owns master_food_list |
| A new glucose data source | edge-functions/ (new function) | Glucose Import handles external data |
| A new UI component used by multiple pages | components/ | Shared UI layer |
| A new page/tab | pages/ + update App.tsx routes + BottomNav | Pages module + app routing |
| A new Edge Function | supabase/functions/{name}/index.ts | Server-side processing with secrets |
| A new recommendation algorithm | pages/LaboratorioPage (MVP) or new service | Recommendations context |

## Domain Boundaries to Protect

| Boundary | What crossing it prevents |
|----------|--------------------------|
| Components never call Supabase directly | Service layer stays as single point of data access |
| Edge Functions own backend secrets | Client never sees API keys (guardrail must-sec-001) |
| AI analysis is a suggestion, not truth | User always confirms carbs — avoids dangerous auto-dosing |
| Each service owns one DB table | Prevents cross-domain coupling |
