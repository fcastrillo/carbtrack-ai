# Data Model: 001-mvp-asistente-ch

Entidades y reglas derivadas del spec y clarificaciones. Implementación en Supabase (PostgreSQL + Storage).

## Tablas

### master_food_list (Catálogo Educadies)

Catálogo de alimentos para cruce con la salida de GPT-4o Vision y sugerencia de CH por ración.

| Campo | Tipo | Notas |
|-------|------|--------|
| id | uuid | PK, default gen_random_uuid() |
| alimento | text | NOT NULL; nombre para búsqueda/cruce |
| ch_por_racion | numeric(6,2) | NOT NULL; gramos de carbohidratos por ración |
| medida | text | e.g. "1 pieza", "100g", "1 taza" |
| categoria | text | e.g. "Legumbres", "Frutas" |
| created_at | timestamptz | opcional |

**Reglas**: Sin unicidad estricta por nombre (puede haber varias entradas similares). Usado en backend para cruce con items detectados por Vision.

---

### meal_history (Registro de comidas)

Registro por comida: imagen, análisis IA, CH confirmados por el usuario. Alimenta Hoy, Bitácora y futura auditoría.

| Campo | Tipo | Notas |
|-------|------|--------|
| id | uuid | PK, default gen_random_uuid() |
| image_url | text | NOT NULL; path o URL en Supabase Storage |
| ai_analysis | jsonb | Objeto con alimentos detectados y gramos sugeridos por Vision + cruce Educadies |
| user_confirmed_carbs | int | NOT NULL; valor final de CH que el usuario confirma o edita |
| glucose_at_meal | int | Opcional; SGV de Nightscout en el momento de la comida (si se integra) |
| timestamp | timestamptz | NOT NULL; momento del registro (local/UTC según política) |
| user_id | uuid | Opcional en MVP (sin login); FK a auth.users si más adelante hay auth |

**Reglas**: image_url debe ser path válido en el bucket configurado. ai_analysis es opaco para la app (solo lectura/display); el backend lo genera. Para Bitácora se filtran por timestamp (Todas, Hoy, Última semana, Último mes, Rango personalizado).

---

### pump_profile (Perfil de bomba – entrada manual)

Solo si se usa fallback de entrada manual para ISF y ratio I:C (cuando Nightscout profile no está disponible o no se integra).

| Campo | Tipo | Notas |
|-------|------|--------|
| id | uuid | PK |
| isf | numeric(5,2) | Sensibilidad (unidades por mg/dL o mmol/L según preferencia) |
| ratio_ic | numeric(5,2) | Ratio insulina/CH (unidades por ración) |
| updated_at | timestamptz | Última actualización |
| user_id / session_id | text o uuid | En MVP sin login puede ser un único registro global o por dispositivo |

**Reglas**: Un registro activo por “usuario” implícito en MVP. Si más adelante hay Nightscout profile, esta tabla puede quedar como override o no usarse.

---

## Storage (Supabase Storage)

- **Bucket**: p. ej. `meal-images` (o nombre configurado).
- **Políticas**: En MVP sin auth puede ser público con nombres únicos (uuid) para evitar colisiones; cuando haya auth, RLS por user_id.
- **Uso**: La app sube la foto tras captura; se guarda la path/URL en `meal_history.image_url`. La Edge Function `analyze-meal` puede recibir la URL o el body (base64) según el contrato elegido.

---

## Integraciones externas (no tablas)

- **Nightscout**: Fuente de verdad para SGV e insulina; no se replica en Supabase. La carga de CSV escribe en Nightscout (entries + treatments). Perfil (ISF, I:C) se lee desde Nightscout si está disponible.
- **CSV CareLink**: No se persiste el CSV en Supabase; se procesa en memoria en la Edge Function y solo se envían los datos derivados a Nightscout.
