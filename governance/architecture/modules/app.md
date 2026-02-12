---
type: module
name: app
purpose: "Application root — routing and layout shell"
status: current
depends_on: [pages, components]
depended_by: []
components: 1
---

# Module: app

## Purpose

The application root that wires React Router routes to page components and provides the persistent layout shell (dark background + BottomNav). This is the entry point rendered by `main.tsx`.

## Architecture

`App.tsx` sets up `BrowserRouter` with five routes mapping URL paths to page components. The layout wraps all routes in the dark theme container (`bg-[#0a0a0a]`) with BottomNav fixed at the bottom. No authentication routing exists in the MVP.

## Key Files

| File | Description |
|------|-------------|
| `App.tsx` | Router setup, route definitions, layout shell |
| `main.tsx` | React DOM render entry point |

## Dependencies

| Dependency | Why |
|------------|-----|
| `react-router-dom` | Client-side routing |
| `pages/*` | All five page components |
| `components/BottomNav` | Persistent navigation |

## Conventions

- Route paths match tab labels: `/`, `/bitacora`, `/laboratorio`, `/carga-datos`, `/perfil`
- Dark theme wrapper applied at this level for all pages
- No lazy loading in MVP — all pages bundled
