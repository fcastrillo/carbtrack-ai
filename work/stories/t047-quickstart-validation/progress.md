# Progress: T047 — Quickstart Validation

## Status
- **Started:** 2026-02-13
- **Current Task:** 1 of 4
- **Status:** In Progress

## Task 1: Code Audit — All 8 Quickstart Sections

### S1: Navigation & Theme
| # | Checklist Item | Result | Evidence |
|---|---------------|--------|----------|
| 1.1 | 5 tabs: Hoy, Bitácora, Laboratorio, Carga de Datos, Perfil | PASS | BottomNav.tsx:4-9 |
| 1.2 | Each tab shows correct screen | PASS | App.tsx:14-19 routes match BottomNav destinations |
| 1.3 | Background #0a0a0a, cards #18181b | PASS | App.tsx:12, all pages use bg-[#18181b], MealCard uses ct-card class |
| 1.4 | No login screen | PASS | No auth components, BrowserRouter routes directly |

### S2: Capture & CH Suggestion
| # | Checklist Item | Result | Evidence |
|---|---------------|--------|----------|
| 2.1 | Camera/image picker opens | PASS | CaptureMeal.tsx:97 file input accept="image/jpeg,image/png,image/webp" |
| 2.2 | Image sent to Edge Function (not direct OpenAI) | PASS | mealService.ts:52 calls supabase.functions.invoke('analyze-meal') |
| 2.3 | CH suggestion shown (items + total) | PASS | CaptureMeal.tsx:146-175 renders items list with source tags |
| 2.4 | User can confirm/edit total | PASS | CaptureMeal.tsx:178-183 number input + Confirmar button |
| 2.5 | Creates meal_history record with correct fields | PASS | mealService.ts:78-91 inserts image_url, ai_analysis, user_confirmed_carbs, timestamp |
| 2.6 | <30s flow (SC-001) | N/A | Runtime-dependent, code path is efficient |

### S3: Hoy
| # | Checklist Item | Result | Evidence |
|---|---------------|--------|----------|
| 3.1 | Header shows total CH | PASS | HoyPage.tsx:36,55-58 totalCarbs computed + displayed |
| 3.2 | Meal cards with photo, food, confirmed CH | PASS | MealCard.tsx:13-26 renders image, summary, CH |
| 3.3 | Total = sum of confirmed CH (SC-002) | PASS | HoyPage.tsx:36 reduce over user_confirmed_carbs |
| 3.4 | FAB opens capture | PASS | HoyPage.tsx:76-83 Plus button → setShowCapture(true) |
| 3.5 | Empty state (total 0, message) | PASS | HoyPage.tsx:64-65 "Sin comidas registradas hoy.", totalCarbs shows 0 g |

### S4: Bitácora
| # | Checklist Item | Result | Evidence |
|---|---------------|--------|----------|
| 4.1 | Filters: Todas, Hoy, Última semana, Último mes, Rango personalizado | PASS | FilterBar.tsx:12-17 labels match exactly |
| 4.2 | Custom range: date pickers, not persisted | PASS | FilterBar.tsx:44-65 date inputs, state in BitacoraPage (useState, not persisted) |
| 4.3 | Filter change updates list | PASS | BitacoraPage.tsx:54-71 useCallback + useEffect on [filter, customStart, customEnd] |
| 4.4 | Empty state text | PASS | BitacoraPage.tsx:6 "Sin historial. Tus comidas registradas aparecerán aquí" |
| 4.5 | Cards consistent with reference | PASS | Same MealCard component used as HoyPage |

### S5: CSV Upload
| # | Checklist Item | Result | Evidence |
|---|---------------|--------|----------|
| 5.1 | File select for CSV | PASS | CargaDatosPage.tsx:49 input type="file" accept=".csv" |
| 5.2 | CSV sent to Edge Function (no credentials from client) | PASS | csvUploadService.ts:13 calls supabase.functions.invoke('import-carelink-csv') |
| 5.3 | Edge Function detects two blocks, extracts treatments + entries | PASS | import-carelink-csv/index.ts:13-21 findBlocks, processTreatments, processEntries |
| 5.4 | Semantics match importar_ns_v2.py (columns, batches) | PASS | Batches of 100, BWZ Carb Input, Sensor Glucose columns, SHA-1 API-SECRET hash |
| 5.5 | Error handling with clear message | PASS | CargaDatosPage.tsx:16-24 error states, Edge Function returns structured errors |

### S6: Laboratorio
| # | Checklist Item | Result | Evidence |
|---|---------------|--------|----------|
| 6.1 | With data: summary/recommendations | PASS | LaboratorioPage.tsx:37-43 shows meal count + recommendation message |
| 6.2 | Without data: empty state | PASS | LaboratorioPage.tsx:4,35 "Carga un CSV y registra comidas para ver recomendaciones." |

### S7: Perfil
| # | Checklist Item | Result | Evidence |
|---|---------------|--------|----------|
| 7.1 | Shows ISF and I:C ratio | PASS | PerfilPage.tsx:57,64-84 inputs for Sensibilidad ISF and Ratio I:C |
| 7.2 | Manual entry saved to Supabase | PASS | PerfilPage.tsx:24-41 saveProfile via profileService |
| 7.3 | Empty state with setup guidance | PASS | PerfilPage.tsx:4,59-61 EMPTY_MESSAGE shown when no values |

### S8: Security & Data Governance
| # | Checklist Item | Result | Evidence |
|---|---------------|--------|----------|
| 8.1 | No OPENAI_API_KEY in frontend code | PASS | grep of frontend/src/ found 0 matches |
| 8.2 | No NIGHTSCOUT secrets in frontend code | PASS | grep of frontend/src/ found 0 matches |
| 8.3 | Credentials only in Edge Function env | PASS | analyze-meal uses Deno.env.get("OPENAI_API_KEY"), import-carelink-csv uses Deno.env.get("NIGHTSCOUT_*") |
| 8.4 | .env.local has only VITE_SUPABASE_* active | ADVISORY | .env.local has commented-out OPENAI_API_KEY (line 6). File is gitignored + not tracked. Local-only, not a repo leak. Recommend removing the commented key. |

## Audit Summary

- **Total items:** 28
- **PASS:** 27
- **N/A:** 1 (SC-001 runtime performance)
- **ADVISORY:** 1 (commented-out API key in .env.local — local only, not blocking)
- **FAIL:** 0

## Blockers
- None

## Discoveries
- MealCard uses `ct-card` CSS class (theme.css) while other components use inline `bg-[#18181b]` — inconsistent but functional
- .env.local contains a commented-out OPENAI_API_KEY — recommend removing for hygiene
