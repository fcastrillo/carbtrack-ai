# Research: 001-mvp-asistente-ch

Decisiones y alternativas para el plan técnico del MVP.

## 1. Backend para GPT-4o Vision y CSV

**Decision**: Usar Supabase Edge Functions (Deno) para (a) análisis de imagen con GPT-4o Vision y (b) procesamiento de CSV CareLink y envío a Nightscout.

**Rationale**: Mantener toda la lógica sensible en el mismo ecosistema (Supabase); no exponer API key de OpenAI ni API secret de Nightscout en el cliente; despliegue y secrets gestionados por Supabase.

**Alternatives considered**: (1) Servidor Node/Express separado — más control pero más infra que mantener. (2) Llamar a Vision desde el cliente con key en env — rechazado por seguridad (Constitución V). (3) CSV procesado en el cliente — rechazado porque requiere exponer credenciales de Nightscout.

## 2. Lógica CSV CareLink en Edge Function

**Decision**: Portar la lógica de `docs/cvs_upload/importar_ns_v2.py` a TypeScript/Deno dentro de una Edge Function: detección de bloques por encabezado "Index,Date,Time,...", parseo Treatments (Meal Bolus, carbs) y Entries (sgv), envío a Nightscout en lotes (entries y treatments) con autenticación SHA1.

**Rationale**: El script Python es la referencia de verdad; la semántica (columnas, formatos, rangos de valores) debe replicarse para que los datos de la bomba Medtronic queden correctamente en Nightscout. Deno/TS permite leer el CSV en memoria y hacer las mismas transformaciones.

**Alternatives considered**: (1) Invocar el script Python desde una función — posible pero añade dependencia de runtime Python en el entorno de ejecución. (2) Procesar CSV solo en cliente y enviar payloads a un proxy que añade secret — sigue requiriendo que el proxy envíe a Nightscout con la misma lógica; centralizar en una sola Edge Function simplifica.

## 3. Almacenamiento de imágenes

**Decision**: Subir la foto del plato a Supabase Storage desde el cliente (tras captura); la Edge Function `analyze-meal` puede recibir la URL pública o el path del objeto; opcionalmente recibir el body en base64 si se prefiere no subir antes del análisis. Para el MVP: cliente sube imagen a Storage (o envía base64 a la función), función descarga o recibe imagen y llama a Vision, luego se guarda la referencia en `meal_history.image_url`.

**Rationale**: Supabase Storage con políticas RLS permite almacenar imágenes por usuario/anónimo; la función puede leer desde Storage o recibir el contenido; evita pasar la key de OpenAI al cliente.

**Alternatives considered**: (1) Cliente envía imagen en base64 a la función y la función sube a Storage después del análisis — válido y a veces más simple (un solo round-trip). (2) Solo base64 sin Storage — no persistiría la imagen; el spec requiere image_url en meal_history.

## 4. Perfil (ISF, ratio I:C)

**Decision**: Intentar primero obtener perfil desde Nightscout (API de profile/store si está disponible en la instancia). Si no está disponible o la integración es compleja, implementar entrada manual en la app y persistir en Supabase (tabla `pump_profile` o clave-valor por “usuario” implícito).

**Rationale**: Alineado con clarificación del spec; evita bloquear el MVP por una API de Nightscout que puede variar entre instalaciones.

**Alternatives considered**: (1) Solo placeholder sin datos — rechazado porque el spec pide al menos mostrar o configurar ISF/I:C. (2) Solo manual — aceptable como fallback ya documentado.

## 5. Testing y mocks

**Decision**: Vitest en frontend; mocks para Supabase client (storage, db) y para fetch a Edge Functions. En Edge Functions, tests unitarios que no llaman a OpenAI ni Nightscout reales; usar respuestas fixture para Vision y respuestas simuladas para Nightscout. Datos de prueba siempre sintéticos (Constitución II).

**Rationale**: Repetibilidad y no depender de APIs externas en CI; datos de salud nunca reales en tests.

**Alternatives considered**: (1) Tests E2E contra entornos de staging — complementario pero no sustitutivo de mocks para desarrollo rápido y CI.
