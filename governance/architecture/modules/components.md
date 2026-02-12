---
type: module
name: components
purpose: "Reusable UI components shared across pages"
status: current
depends_on: [services]
depended_by: [pages]
components: 8
---

# Module: components

## Purpose

Contains reusable React components that appear on multiple pages or encapsulate significant UI logic. Components consume services for data operations but never call Supabase directly.

## Architecture

Four components, each with a focused responsibility:

- **CaptureMeal** — The most complex component (multi-step state machine: select → analyzing → confirm → saved/error). Orchestrates photo capture, AI analysis display, carb confirmation with user edit, save to DB, and add-to-catalog for `vision_only` items. Uses `uploadAndAnalyze`, `saveMeal`, and `addToCatalog` services.
- **MealCard** — Presentational card showing meal photo, AI food summary, and confirmed carbs. Used by HoyPage and BitacoraPage.
- **FilterBar** — Time filter chip bar with presets (Todas, Hoy, Semana, Mes) and custom date range. Used by BitacoraPage.
- **BottomNav** — Fixed bottom navigation with 5 tabs using React Router NavLink for active state.

## Key Files

| File | Description |
|------|-------------|
| `CaptureMeal.tsx` | Multi-step meal capture wizard |
| `MealCard.tsx` | Meal entry display card |
| `FilterBar.tsx` | Date range filter chips + custom range |
| `BottomNav.tsx` | Fixed bottom 5-tab navigation |

## Dependencies

| Dependency | Why |
|------------|-----|
| `services/mealService` | Meal upload, analysis, save |
| `services/catalogService` | Add vision_only items to Educadies catalog |
| `react-router-dom` | NavLink for BottomNav active states |
| `lucide-react` | Navigation icons |

## Conventions

- Dark theme enforced: `bg-[#18181b]` for cards, `bg-[#0a0a0a]` for backgrounds (guardrail `should-code-002`)
- Props types are co-located in the same file (not exported)
- No global state — local `useState`/`useEffect` only (guardrail `should-arch-001`)
- Tailwind utility classes only (guardrail `should-arch-002`)
