---
type: module
name: pages
purpose: "Top-level page components — one per tab in BottomNav"
status: current
depends_on: [services, components]
depended_by: [app]
components: 6
---

# Module: pages

## Purpose

Contains one page component per tab in the bottom navigation. Each page is a route target in React Router, responsible for layout, data fetching, and composing components. Pages call services for data and render components for display.

## Architecture

Five pages matching the five tabs defined in Constitution Principle III:

- **HoyPage** (`/`) — Today's dashboard. Shows daily carb total (sum of `user_confirmed_carbs`), list of today's meals via MealCard, and a FAB (floating action button) to open CaptureMeal.
- **BitacoraPage** (`/bitacora`) — Meal history with FilterBar for time ranges. Contains helper function `getRangeForFilter` to convert filter selection to Date range.
- **LaboratorioPage** (`/laboratorio`) — Weekly meal count and placeholder for future CareLink glucose cross-analysis recommendations.
- **CargaDatosPage** (`/carga-datos`) — CareLink CSV file upload. Reads file content, sends to Edge Function, displays entry/treatment counts.
- **PerfilPage** (`/perfil`) — Manual ISF and I:C ratio entry form. Loads existing pump_profile and allows save/update.

## Key Files

| File | Description |
|------|-------------|
| `HoyPage.tsx` | Today dashboard — carb total, meal list, capture FAB |
| `BitacoraPage.tsx` | Meal history with date filtering |
| `LaboratorioPage.tsx` | Recommendations placeholder |
| `CargaDatosPage.tsx` | CareLink CSV upload |
| `PerfilPage.tsx` | ISF/I:C ratio management |

## Dependencies

| Dependency | Why |
|------------|-----|
| `services/mealService` | Meal queries (getTodayMeals, getMealsByRange) |
| `services/csvUploadService` | CareLink CSV upload |
| `services/profileService` | Pump profile read/write |
| `components/CaptureMeal` | Meal capture flow |
| `components/MealCard` | Meal display |
| `components/FilterBar` | Date range filtering |

## Conventions

- One page per tab, one file per page
- Data fetching via `useEffect` + `useCallback` pattern
- Error and loading states handled locally per page
- Empty states follow UX spec: clear message explaining what to do
- Tab order: Hoy, Bitacora, Laboratorio, Carga de Datos, Perfil (Constitution III)
