# Implementation Plan: MVP del Asistente de Conteo de Carbohidratos

**Branch**: `001-mvp-asistente-ch` | **Date**: 2025-02-03 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `specs/001-mvp-asistente-ch/spec.md` + user stack and clarifications.

## Summary

MVP que sustituye el cálculo manual de CH con captura por cámara, análisis con GPT-4o Vision (backend), cruce con catálogo Educadies y persistencia en Supabase. Incluye pantallas Hoy, Bitácora (filtros de tiempo), Carga de CSV CareLink → Nightscout (indispensable para datos de bomba Medtronic), Laboratorio (recomendaciones) y Perfil (ISF/I:C desde Nightscout o entrada manual). PWA en React+Vite+Tailwind; backend vía Supabase (PostgreSQL, Storage, Edge Functions para Vision y CSV). Sin login; dark mode #0a0a0a / #18181b.

## Technical Context

**Language/Version**: TypeScript/JavaScript (frontend React 18+); Edge Functions en Deno (Supabase) o Node si se usa otro runtime.  
**Primary Dependencies**: React, Vite, Tailwind CSS, Supabase JS client; Supabase Edge Functions (Deno); OpenAI SDK (backend only).  
**Storage**: Supabase PostgreSQL (tablas `master_food_list`, `meal_history`, opcional `pump_profile`); Supabase Storage (bucket para imágenes de platos).  
**Testing**: Vitest para frontend; tests unitarios/integración con mocks para Supabase y Nightscout; datos de prueba sintéticos (Constitución II).  
**Target Platform**: Web PWA (móvil y desktop); backend en Supabase (Edge Functions o compatible).  
**Project Type**: Web application (frontend PWA + backend como Edge Functions / servicios Supabase).  
**Performance Goals**: Flujo captura → sugerencia CH &lt; 30 s (SC-001); validar tamaño/forma de imagen antes de llamar a Vision.  
**Constraints**: API key OpenAI y credenciales Nightscout solo en servidor; no exponer secretos en cliente. Sin requisito offline en MVP (desviación documentada).  
**Scale/Scope**: Un usuario implícito por instancia; ~5 pantallas principales; volumen bajo de comidas y un CSV por sesión de carga.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Calidad de código y mantenibilidad | ✅ | Plan favorece módulos claros (servicios, componentes), nombres explícitos. |
| II. Pruebas y datos sensibles | ✅ | Tests con datos sintéticos; mocks para Supabase/Nightscout/OpenAI. |
| III. Consistencia UX | ✅ | Dark mode #0a0a0a/#18181b; navegación inferior 5 destinos (Hoy, Bitácora, Laboratorio, Carga de Datos, Perfil); Bitácora con filtros y empty state según `docs/screenshots/`. |
| IV. PWA y offline | ⚠️ Desviación | MVP sin requisito de captura offline; persistencia en Supabase desde el primer release. Desviación documentada en spec (Clarifications) y en Complexity Tracking más abajo. |
| V. Gobierno de datos | ✅ | Nightscout como fuente de verdad; Supabase para comidas/imágenes; credenciales solo en servidor; Vision y CSV en backend. |

**Post–Phase 1**: Sin cambios adicionales; diseño cumple con los principios aplicables al MVP.

## Project Structure

### Documentation (this feature)

```text
specs/001-mvp-asistente-ch/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (API/contracts)
└── tasks.md             # Phase 2 output (/speckit.tasks - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
frontend/                    # PWA React + Vite + Tailwind
├── src/
│   ├── components/          # UI reutilizable (BottomNav, MealCard, FilterBar, etc.)
│   ├── pages/               # Hoy, Bitacora, Laboratorio, CargaDatos, Perfil
│   ├── services/            # Llamadas a Supabase y a Edge Functions
│   ├── hooks/
│   ├── styles/              # Dark theme #0a0a0a, #18181b
│   └── App.tsx
├── public/                  # PWA manifest, icons
└── tests/

supabase/
├── functions/               # Edge Functions (Deno)
│   ├── analyze-meal/        # Recibe imagen, llama GPT-4o Vision, cruza master_food_list, devuelve sugerencia CH
│   └── import-carelink-csv/ # Recibe CSV, detecta bloques Treatments/Entries, envía a Nightscout (SHA1)
├── migrations/              # Tablas master_food_list, meal_history, pump_profile (si manual)
└── config.toml
```

**Structure Decision**: Web app con frontend en `frontend/` y backend como Supabase Edge Functions en `supabase/functions/`. La PWA no contiene API keys ni secretos de Nightscout; toda la lógica sensible (Vision, CSV → Nightscout) corre en Edge Functions. El catálogo Educadies y los registros de comidas viven en Supabase (PostgreSQL + Storage).

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Principio IV (offline) no aplicado en MVP | Spec y clarificaciones: usuario no requiere offline; persistencia en Supabase desde día uno. | Mantener offline habría exigido capa local (IndexedDB) + sincronización y duplicar flujos; se pospone a un feature posterior. |
