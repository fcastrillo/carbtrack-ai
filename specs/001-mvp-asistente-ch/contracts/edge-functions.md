# Contracts: Supabase Edge Functions

Contratos de las funciones que ejecutan lógica sensible en servidor (Vision, CSV → Nightscout). La PWA invoca estas funciones vía `supabase.functions.invoke()`.

---

## 1. analyze-meal

**Propósito**: Recibir una imagen de plato (o referencia a Storage), llamar a GPT-4o Vision, cruzar resultados con `master_food_list` y devolver sugerencia de CH por ítem y total.

**Invocación**: `POST` desde cliente (Supabase client: `supabase.functions.invoke('analyze-meal', { body: {...} })`).

**Request body** (JSON):

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| image_url | string | Condicional | URL o path en Supabase Storage de la imagen (si la imagen ya está subida). |
| image_base64 | string | Condicional | Imagen en base64 (alternativa a image_url). La función puede subirla a Storage tras el análisis. |
| (uno de image_url o image_base64) | | Sí | Al menos uno debe enviarse. |

**Response** (JSON):

| Campo | Tipo | Descripción |
|-------|------|-------------|
| items | array | Lista de objetos; cada uno MUST incluir `name`, `carbs_grams`, `measure`, `source`. |
| total_carbs | number | Suma de CH sugeridos |
| raw_analysis | object | Opcional; respuesta cruda de Vision para debugging (no incluir datos sensibles en prod) |
| error | string | Solo si hubo error; mensaje entendible para el usuario |

**Cada ítem en `items`**:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| name | string | Nombre del alimento detectado |
| carbs_grams | number | Gramos de CH sugeridos para ese ítem |
| measure | string | Medida (ej. "1 pieza", "100g"); puede ser vacío si solo Vision |
| source | string | **"educadies"** = coincidencia en `master_food_list`; **"vision_only"** = sin match en catálogo (solo estimación Vision). El frontend MUST usar `source === "vision_only"` para mostrar la sugerencia "Especifique manualmente los CH y puede agregar al catálogo" y el botón "Agregar al catálogo" (spec User Story 2, task T023). |

**Errores**: 400 si no se envía imagen o formato no soportado; 413 si imagen demasiado grande; 502 si Vision falla. Validar tamaño y tipo en la función antes de llamar a OpenAI.

**Secrets (env)**: `OPENAI_API_KEY` en Supabase Edge Function secrets. No exponer en cliente.

---

## 2. import-carelink-csv

**Propósito**: Recibir el contenido del CSV de CareLink (o el archivo en base64), detectar los dos bloques (Treatments, Entries), parsear según la lógica de `docs/cvs_upload/importar_ns_v2.py`, y enviar a Nightscout (entries y treatments) con autenticación SHA1.

**Invocación**: `POST` desde cliente; body con CSV como string o base64.

**Request body** (JSON):

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| csv_content | string | Sí | Contenido del archivo CSV (UTF-8). O bien |
| csv_base64 | string | Sí* | CSV codificado en base64 (*alternativa a csv_content) |

**Response** (JSON):

| Campo | Tipo | Descripción |
|-------|------|-------------|
| entries_count | number | Cantidad de entries (SGV) enviados a Nightscout |
| treatments_count | number | Cantidad de treatments enviados |
| success | boolean | true si todo el envío fue exitoso |
| errors | array | Lista de mensajes si algún lote falló (p. ej. por HTTP 4xx/5xx de Nightscout) |
| error | string | Si la función falló antes de enviar (parseo, detección de bloques); mensaje para el usuario |

**Lógica interna**: (1) Detectar líneas con encabezado `Index,Date,Time,...`. (2) Si hay dos, bloque 1 = treatments, bloque 2 = entries; si hay uno, solo treatments. (3) Parsear fechas `Date` + `Time` formato `%Y/%m/%d %H:%M:%S`. (4) Treatments: filas con "BWZ Carb Input (grams)" → payload Meal Bolus para Nightscout. (5) Entries: "Sensor Glucose (mg/dL)" → payload sgv; validar 0 &lt; sgv ≤ 500. (6) Enviar entries en lotes de 100; treatments en lotes de 100. Headers: `API-SECRET: <SHA1 del secret>`, `Content-Type: application/json`.

**Secrets (env)**: `NIGHTSCOUT_URL`, `NIGHTSCOUT_API_SECRET` (el secret en claro; la función calcula SHA1 para el header). No exponer en cliente.

---

## 3. Frontend ↔ Supabase (directo)

La PWA usa el cliente de Supabase para:

- **Storage**: `storage.from('meal-images').upload(path, file)` y obtener URL pública o signed; guardar esa URL en `meal_history.image_url`.
- **DB**: `from('meal_history').insert(...)`, `from('meal_history').select().gte('timestamp', start).lte('timestamp', end)` para Hoy y Bitácora (filtros por tiempo); `from('master_food_list').select()` si se necesita en cliente (o solo en backend para Vision).
- **Perfil**: Si entrada manual, `from('pump_profile').upsert(...)` y `select()`. Si Nightscout profile: podría añadirse una Edge Function que lea de Nightscout y devuelva ISF/ratio, o llamar a Nightscout desde el cliente con un token de solo lectura si la instancia lo permite (en MVP suele ser más simple leer desde una función que tenga el secret).

No se definen aquí los contratos RPC de Postgres; las tablas y operaciones están en `data-model.md`.
