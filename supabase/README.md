# Supabase – CarbTrack MVP

- **Migrations**: `supabase/migrations/` (tablas `master_food_list`, `meal_history`, `pump_profile`, bucket `meal-images`, seed mínimo).
- **Functions**: `supabase/functions/` — `analyze-meal` (Vision + catálogo), `import-carelink-csv` (CSV → Nightscout).
- **Poblar catálogo**: La migración `20250204000004_seed_master_food_list.sql` inserta 3 ítems de ejemplo.

---

## ¿Dónde corren las Edge Functions?

**No tienen por qué correr en tu máquina.** Depende de cómo trabajes:

| Modo | Dónde corren las functions | Cuándo usarlo |
|------|----------------------------|----------------|
| **Supabase en la nube** | En los servidores de Supabase (Deno Deploy). Tú solo **despliegas** el código. | Producción y desarrollo normal: tu frontend (local o desplegado) llama a la URL de tu proyecto y las functions se ejecutan en la nube. |
| **Desarrollo local** | En tu PC con `supabase functions serve`. | Opcional: para probar cambios en las functions sin desplegar cada vez. |

Si tu **proyecto de Supabase está en la nube**, lo habitual es **desplegar** las Edge Functions ahí. Así tu app (desde localhost o desde producción) invoca `analyze-meal` y esa función corre **en la nube**, no en tu ordenador.

---

## Supabase en la nube (tu caso)

1. **CLI** (si no lo tienes): en macOS usa Homebrew: `brew install supabase/tap/supabase`. O en el proyecto: `npm i supabase --save-dev` y luego `npx supabase ...`.
2. **Login**: `supabase login`.
3. **Vincular proyecto**: desde la raíz del repo:
   ```bash
   supabase link --project-ref <project-ref>
   ```
   El `<project-ref>` lo ves en la URL del Dashboard: `https://app.supabase.com/project/<project-ref>`.
4. **Desplegar las functions** (se suben y ejecutan en Supabase):
   ```bash
   supabase functions deploy analyze-meal
   supabase functions deploy import-carelink-csv
   ```
5. **Secrets** (API keys que solo ven las functions, no el frontend):
   ```bash
   supabase secrets set OPENAI_API_KEY=sk-...
   ```
   Para Nightscout más adelante: `NIGHTSCOUT_URL`, `NIGHTSCOUT_API_SECRET`.

Tras el deploy, el frontend que use `VITE_SUPABASE_URL` de ese proyecto ya puede llamar a las Edge Functions; correrán en la nube.

---

## Desarrollo local (opcional)

- **Solo DB/Storage local**: `supabase start` y `supabase db reset` (usa la DB local).
- **Functions locales** (para no desplegar en cada cambio): `supabase functions serve`. El frontend tendría que apuntar al proyecto local o usar el flag para que las invocaciones vayan a tu máquina.

Resumen: con Supabase en la nube, las Edge Functions **no tienen que correr en tu local**; las despliegas y corren en la nube.
