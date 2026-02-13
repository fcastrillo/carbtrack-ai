# Tasks: MVP del Asistente de Conteo de Carbohidratos

**Input**: Design documents from `specs/001-mvp-asistente-ch/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests (Constitución II — obligatorio)**: Las funcionalidades que afecten datos de salud (captura, meal_history, CSV→Nightscout, Perfil) MUST tener cobertura de pruebas. Los datos de prueba MUST ser **sintéticos o anonimizados** (nunca datos reales de pacientes). Las integraciones con Supabase, Nightscout y OpenAI MUST probarse mediante **mocks**. Ver fase explícita "Phase 10: Tests (Constitution II)" más abajo; implementar esas tareas para cumplir el principio.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story (US1–US7)
- Include exact file paths in descriptions

## Path Conventions

- **Frontend**: `frontend/src/`, `frontend/public/`
- **Backend**: `supabase/functions/`, `supabase/migrations/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and structure per plan.md

- [x] T001 Create repository structure: `frontend/` and `supabase/` directories at repo root per plan.md
- [x] T002 Initialize React + Vite + TypeScript project in `frontend/` with Tailwind CSS (e.g. `npm create vite@latest frontend -- --template react-ts`, then add tailwindcss)
- [x] T003 [P] Add Supabase JS client dependency in `frontend/package.json` and configure env (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY only; no secrets)
- [x] T004 [P] Initialize Supabase project layout: `supabase/config.toml`, `supabase/migrations/`, `supabase/functions/` per plan.md
- [x] T005 [P] Configure PWA for frontend (e.g. vite-plugin-pwa in `frontend/vite.config.ts`, manifest in `frontend/public/manifest.webmanifest`)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Database, Storage, and Edge Function stubs so user stories can implement against them

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 Create Supabase migration for `master_food_list` table in `supabase/migrations/` (id uuid PK, alimento text NOT NULL, ch_por_racion numeric(6,2) NOT NULL, medida text, categoria text, created_at timestamptz) per data-model.md
- [x] T007 Create Supabase migration for `meal_history` table in `supabase/migrations/` (id uuid PK, image_url text NOT NULL, ai_analysis jsonb, user_confirmed_carbs int NOT NULL, glucose_at_meal int, timestamp timestamptz NOT NULL, user_id uuid optional) per data-model.md
- [x] T008 Create Supabase migration for `pump_profile` table in `supabase/migrations/` (id uuid PK, isf numeric(5,2), ratio_ic numeric(5,2), updated_at timestamptz) per data-model.md for manual profile fallback
- [x] T009 Create Supabase Storage bucket `meal-images` (or configured name) and policy for public read/upload in MVP per data-model.md
- [x] T010 Create Edge Function skeleton `supabase/functions/analyze-meal/index.ts`: accept POST body (image_url or image_base64), return placeholder JSON { items: [], total_carbs: 0 } until US2 implements Vision
- [x] T011 Create Edge Function skeleton `supabase/functions/import-carelink-csv/index.ts`: accept POST body (csv_content or csv_base64), return placeholder JSON { entries_count: 0, treatments_count: 0, success: true } until US5 implements CSV logic
- [x] T012 Seed or document how to populate `master_food_list` (e.g. seed migration or CSV import script) so Educadies data exists for US2

**Checkpoint**: Foundation ready — migrations, bucket, and two Edge Function stubs exist; user story implementation can begin

---

## Phase 3: User Story 1 - Navegación e infraestructura (Priority: P1) 🎯 MVP

**Goal**: App shell with bottom nav (Hoy, Bitácora, Laboratorio, Carga de Datos, Perfil), dark theme #0a0a0a / #18181b, no login.

**Independent Test**: Open app → see five tabs → tap each → correct screen; background and cards use reference colors.

### Implementation for User Story 1

- [x] T013 [US1] Add routing (e.g. react-router-dom) in `frontend/src/App.tsx` with routes for Hoy, Bitácora, Laboratorio, CargaDatos, Perfil
- [x] T014 [P] [US1] Create BottomNav component in `frontend/src/components/BottomNav.tsx` with five items (Hoy, Bitácora, Laboratorio, Carga de Datos, Perfil) and icons (e.g. Lucide-React) per docs/screenshots/UI_REFERENCE.md
- [x] T015 [P] [US1] Create global dark theme in `frontend/src/styles/` (background #0a0a0a, cards #18181b) and apply in root layout
- [x] T016 [US1] Create placeholder page components in `frontend/src/pages/`: `HoyPage.tsx`, `BitacoraPage.tsx`, `LaboratorioPage.tsx`, `CargaDatosPage.tsx`, `PerfilPage.tsx` (minimal content: title only) and wire to routes
- [x] T017 [US1] Compose App layout in `frontend/src/App.tsx`: main content area + BottomNav; ensure no login screen and direct access

**Checkpoint**: User Story 1 complete — navigation and theme work; all five screens reachable

---

## Phase 4: User Story 2 - Captura inteligente de comidas (Priority: P1)

**Goal**: Camera/image capture → send to Edge Function analyze-meal → show CH suggestion → confirm → persist to meal_history + Storage.

**Independent Test**: Capture or select image → see suggestion (from Vision + Educadies); confirm → record appears in DB with image_url and user_confirmed_carbs.

### Implementation for User Story 2

- [x] T018 [US2] Implement camera or file input for meal image in `frontend/src/pages/` or `frontend/src/components/CaptureMeal.tsx` (and validate size/format before upload per spec edge case)
- [x] T019 [US2] Add service in `frontend/src/services/mealService.ts`: upload image to Supabase Storage bucket `meal-images`, get public URL; call Edge Function `analyze-meal` with image_url (or image_base64), parse response (items, total_carbs)
- [ ] T020 [US2] Implement Edge Function `supabase/functions/analyze-meal/index.ts`: read OPENAI_API_KEY from env; receive image (url or base64); call GPT-4o Vision; query Supabase `master_food_list` and match/cross foods; return { items, total_carbs } per contracts/edge-functions.md
- [x] T021 [US2] Add UI in frontend to display suggestion (items + total CH), allow user to confirm or edit total; on confirm insert row into `meal_history` (image_url, ai_analysis, user_confirmed_carbs, timestamp) via Supabase client in `frontend/src/services/mealService.ts`
- [x] T022 [US2] Handle errors from analyze-meal (400, 413, 502) with clear user message in `frontend/src/components/CaptureMeal.tsx` or equivalent
- [x] T023 [US2] When an item has no match in `master_food_list` (e.g. source vision_only from analyze-meal): show UI suggestion "Especifique manualmente los CH y puede agregar al catálogo"; allow manual CH input for that item; offer "Agregar al catálogo" to insert into `master_food_list` (alimento, ch_por_racion, medida, categoria) via Supabase from capture/confirmation flow in `frontend/src/components/CaptureMeal.tsx` and `frontend/src/services/mealService.ts` (o `catalogService.ts`)

**Checkpoint**: User Story 2 complete — full capture → suggest → persist flow works; sin match → manual + opción agregar al catálogo

---

## Phase 5: User Story 3 - Pantalla "Hoy" (Priority: P1)

**Goal**: Header with total CH for today; vertical list of meal cards (Foto, Alimento, CH confirmados); FAB to open capture.

**Independent Test**: With at least one meal today, header total equals sum of cards; FAB opens capture; empty state when no meals.

### Implementation for User Story 3

- [x] T024 [US3] Implement HoyPage in `frontend/src/pages/HoyPage.tsx`: query `meal_history` for today (timestamp in local day range), sum user_confirmed_carbs for header total
- [x] T025 [P] [US3] Create MealCard component in `frontend/src/components/MealCard.tsx` showing image (from image_url), food summary from ai_analysis, and user_confirmed_carbs
- [x] T026 [US3] Render list of MealCards in HoyPage; add FAB (e.g. central bottom or floating) that navigates to or opens capture flow (same as US2)
- [x] T027 [US3] Add empty state in HoyPage when no meals today (total 0, message or empty list) per spec

**Checkpoint**: User Story 3 complete — Hoy shows daily total and cards; FAB opens capture

---

## Phase 6: User Story 4 - Pantalla "Bitácora" (Priority: P2)

**Goal**: Full history with filters (Todas, Hoy, Última semana, Último mes, Rango personalizado); empty state text; custom range = date picker start/end, no persistence.

**Independent Test**: Change filter → list updates; empty state "Sin historial. Tus comidas registradas aparecerán aquí" when no data; custom range shows date picker.

### Implementation for User Story 4

- [x] T028 [P] [US4] Create FilterBar (or equivalent) in `frontend/src/components/FilterBar.tsx` with options: Todas, Hoy, Última semana, Último mes, Rango personalizado; for Rango personalizado show date-from and date-to inputs/pickers (no persist between sessions)
- [x] T029 [US4] Implement BitacoraPage in `frontend/src/pages/BitacoraPage.tsx`: map filter to date range, query `meal_history` with timestamp between start/end; render list of MealCards (reuse from US3)
- [x] T030 [US4] Show empty state in BitacoraPage with exact text "Sin historial. Tus comidas registradas aparecerán aquí" when no records in selected range per spec
- [x] T031 [US4] Style Bitácora filters and cards to match docs/screenshots/ (e.g. 02_bitacora.png) per UI_REFERENCE.md

**Checkpoint**: User Story 4 complete — Bitácora filters and empty state work

---

## Phase 7: User Story 5 - Pantalla "Carga de Datos" (Priority: P2)

**Goal**: User selects CSV file → frontend sends content to Edge Function import-carelink-csv → backend parses two blocks (Treatments/Entries) per importar_ns_v2.py and posts to Nightscout (SHA1); show result or error.

**Independent Test**: Upload valid CareLink CSV → entries and treatments appear in Nightscout (or mock); invalid CSV shows clear error.

### Implementation for User Story 5

- [x] T032 [US5] Add file input in `frontend/src/pages/CargaDatosPage.tsx` for CSV; read file as text (UTF-8) and call Edge Function `import-carelink-csv` with body { csv_content } (or csv_base64)
- [x] T033 [US5] Implement Edge Function `supabase/functions/import-carelink-csv/index.ts`: read NIGHTSCOUT_URL and NIGHTSCOUT_API_SECRET from env; compute SHA1 of secret for header; detect blocks by header "Index,Date,Time,..."; parse Treatments (BWZ Carb Input) and Entries (Sensor Glucose) per docs/cvs_upload/importar_ns_v2.py; POST to Nightscout entries and treatments in batches of 100; return { entries_count, treatments_count, success, errors } per contracts/edge-functions.md
- [x] T034 [US5] Handle single-block CSV (only treatments or only entries) per spec edge case in `supabase/functions/import-carelink-csv/index.ts`
- [x] T035 [US5] Display success (counts) or error message in CargaDatosPage after upload; do not corrupt already-synced data on partial failure

**Checkpoint**: User Story 5 complete — CSV upload syncs to Nightscout; errors shown clearly

---

## Phase 8: User Story 6 - Pantalla "Laboratorio" (Priority: P3)

**Goal**: Summary of significant recommendations for last week from CSV + meal CH data (e.g. underestimated foods or patterns).

**Independent Test**: With CSV loaded and meals in last week, show at least one summary or "recommendations available"; otherwise empty state message.

### Implementation for User Story 6

- [x] T036 [US6] Implement LaboratorioPage in `frontend/src/pages/LaboratorioPage.tsx`: define data source (e.g. meal_history last 7 days + Nightscout data if available, or backend aggregation); display summary of recommendations (e.g. list of "alimentos subestimados" or simple message)
- [x] T037 [US6] Add empty state in LaboratorioPage when insufficient data: message like "Carga un CSV y registra comidas para ver recomendaciones" per spec
- [x] T038 [US6] If recommendations require server logic (e.g. compare CH vs glucose delta), add optional Edge Function or use existing data; minimal MVP can show "Recomendaciones (última semana)" section with placeholder or simple heuristic

**Checkpoint**: User Story 6 complete — Laboratorio shows recommendations or explanatory empty state

---

## Phase 9: User Story 7 - Pantalla "Perfil" (Priority: P3)

**Goal**: Display ISF and ratio I:C; source: Nightscout profile API if available, else manual entry persisted in Supabase (pump_profile).

**Independent Test**: Open Perfil → see ISF and I:C (from Nightscout or manual); if none, message on how to configure.

### Implementation for User Story 7

- [x] T039 [US7] Implement PerfilPage in `frontend/src/pages/PerfilPage.tsx`: try to fetch profile from Nightscout (if API available and documented) or read from `pump_profile` table in Supabase; display ISF and ratio_ic
- [x] T040 [US7] Add manual entry form in PerfilPage for ISF and ratio I:C when Nightscout profile not used; on save upsert into `pump_profile` (single row for MVP) via Supabase client
- [x] T041 [US7] Show empty state or message in PerfilPage when no profile: "Configura sensibilidad y ratio (entrada manual o desde Nightscout cuando esté integrado)" per spec

**Checkpoint**: User Story 7 complete — Perfil shows or allows setting ISF and I:C

---

## Phase 10: Tests (Constitución II — mocks y datos sintéticos)

**Purpose**: Cobertura de pruebas para flujos con datos de salud; solo datos sintéticos y mocks (Supabase, Nightscout, OpenAI). Repetible y determinista.

**Independent Test**: Ejecutar `npm run test` (o equivalente) en frontend y que pasen los tests sin llamar a APIs reales.

- [x] T042 [P] Add Vitest to `frontend/` and test setup in `frontend/src/test-utils/` or `frontend/tests/`: mock de Supabase client (`from()`, `invoke()` para Edge Functions); helpers para datos sintéticos (ej. `meal_history` fake, `pump_profile` fake) sin datos reales de salud
- [x] T043 [P] Add unit tests for `frontend/src/services/mealService.ts`: mock Supabase Storage upload y Edge Function `analyze-meal`; verificar que con respuesta mock (items + total_carbs) se construye y persiste registro en `meal_history`; usar solo datos sintéticos (ej. total_carbs: 25, items genéricos) en `frontend/tests/` o `frontend/src/services/__tests__/mealService.test.ts`
- [x] T044 [P] Add tests for CSV upload flow: mock Edge Function `import-carelink-csv`; verificar que `CargaDatosPage` (o servicio) envía `csv_content` y maneja respuesta success/error; usar CSV sintético (encabezado Index,Date,Time,... y filas falsas) en `frontend/tests/` o similar
- [x] T045 [P] Add tests for Perfil: mock Supabase `pump_profile` (select/upsert); verificar que PerfilPage muestra ISF y ratio o estado vacío según datos mock; usar solo valores sintéticos (ej. isf: 50, ratio_ic: 1.2) en `frontend/tests/` o `frontend/src/pages/__tests__/PerfilPage.test.ts`

**Checkpoint**: Tests de flujos con datos de salud pasan con mocks; ningún dato real en tests

---

## Phase 11: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and consistency

- [x] T046 [P] Ensure no API keys or Nightscout secrets in frontend code or frontend env; only VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in client
- [x] T047 Run quickstart validation from `specs/001-mvp-asistente-ch/quickstart.md`: tick off checklist (navigation, capture, Hoy, Bitácora, CSV upload, Laboratorio, Perfil, security)
- [x] T048 [P] Add or adjust PWA manifest and meta for installability and mobile use in `frontend/public/`
- [x] T049 Verify dark mode #0a0a0a / #18181b applied across all pages per docs/screenshots/UI_REFERENCE.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 — blocks all user stories
- **Phase 3 (US1)**: Depends on Phase 2 — shell and theme
- **Phase 4 (US2)**: Depends on Phase 2 and US1 (navigation to capture)
- **Phase 5 (US3)**: Depends on Phase 2 and US1; benefits from US2 (meals to display)
- **Phase 6 (US4)**: Depends on Phase 2 and US1; uses same meal_history as US3
- **Phase 7 (US5)**: Depends on Phase 2 and US1
- **Phase 8 (US6)**: Depends on US2 (meals) and US5 (CSV) for full value; can show placeholder without
- **Phase 9 (US7)**: Depends on Phase 2 and US1; independent of US5/US6
- **Phase 10 (Tests)**: Depends on implementation of US2, US5, US7 (o al menos servicios/páginas a testear); puede ejecutarse en paralelo con Polish una vez existan
- **Phase 11 (Polish)**: Depends on completion of desired user stories

### User Story Dependencies

- **US1**: No story dependencies — do first
- **US2, US3**: Can proceed after US1; US3 uses data from US2
- **US4**: After US1 (and ideally US2 for data)
- **US5**: After US1
- **US6**: Best after US2 + US5 for real recommendations
- **US7**: After US1

### Parallel Opportunities

- Within Phase 1: T003, T004, T005 can run in parallel
- Within Phase 2: T006, T007, T008 can run in parallel; T010, T011 can run in parallel
- US1: T014, T015 can run in parallel; T016 (placeholder pages) can be split [P]
- US3: T024 [P] with T023
- US4: T027 [P]
- Phase 10 (Tests): T042–T045 can run in parallel (distintos archivos de test)
- Phase 11 (Polish): T046, T048 can run in parallel

---

## Implementation Strategy

### MVP First (minimal shippable)

1. Complete Phase 1 (Setup)
2. Complete Phase 2 (Foundational)
3. Complete Phase 3 (US1 — navigation and theme)
4. Complete Phase 4 (US2 — capture + analyze-meal + persist)
5. Complete Phase 5 (US3 — Hoy with total and cards)
6. **STOP and VALIDATE**: User can open app, capture a meal, see suggestion, confirm, and see it on Hoy
7. Then add US4 (Bitácora), US5 (Carga CSV), US6, US7 as needed

### Incremental Delivery

- After US1: Deploy shell + theme
- After US2+US3: Deploy capture and Hoy (core value)
- After US4: Deploy Bitácora
- After US5: Deploy CSV → Nightscout (indispensable for pump data)
- After US6+US7: Deploy Laboratorio and Perfil

---

## Notes

- [P] = different files, no dependencies; safe to parallelize
- [Story] links task to spec for traceability
- Each user story should be independently testable per spec
- Commit after each task or logical group
- Run quickstart.md (T047) before considering feature complete
- Phase 10 (Tests) cumple Constitución II: mocks + datos sintéticos únicamente
