# Quickstart: Validación del MVP 001-mvp-asistente-ch

Escenarios clave para validar que el plan y la implementación cumplen el spec. Usar como checklist de humo tras levantar frontend y Edge Functions.

## 1. Navegación y tema

- [ ] La PWA muestra barra inferior con 5 destinos: Hoy, Bitácora, Laboratorio, Carga de Datos, Perfil.
- [ ] Al tocar cada ítem se muestra la pantalla correcta.
- [ ] Fondo #0a0a0a y tarjetas/contenedores #18181b en todas las pantallas.
- [ ] No aparece pantalla de login; acceso directo.

## 2. Captura y sugerencia de CH

- [ ] Desde Hoy (o desde un botón de captura), se abre la cámara o selector de imagen.
- [ ] Tras elegir/tomar foto, la imagen se envía a la Edge Function `analyze-meal` (no se llama a OpenAI desde el cliente).
- [ ] Se muestra una sugerencia de CH (ítems + total); si hay datos en `master_food_list`, las coincidencias usan valores del catálogo.
- [ ] El usuario puede confirmar o editar el total; al confirmar, se crea un registro en `meal_history` con `image_url`, `ai_analysis`, `user_confirmed_carbs`, `timestamp`.
- [ ] Flujo completo (captura → sugerencia → confirmación) en menos de 30 s en condiciones normales (SC-001).

## 3. Pantalla Hoy

- [ ] Header muestra total acumulado de CH del día.
- [ ] Listado vertical de tarjetas de comidas del día (Foto, Alimento, CH confirmados).
- [ ] El total del header coincide con la suma de los CH confirmados de las tarjetas (SC-002).
- [ ] FAB abre la captura.
- [ ] Estado vacío coherente cuando no hay registros del día (ej. total 0, mensaje o lista vacía).

## 4. Bitácora

- [ ] Filtros disponibles: Todas, Hoy, Última semana, Último mes, Rango personalizado.
- [ ] Rango personalizado: selector de fechas inicio y fin en pantalla; no se persiste entre sesiones.
- [ ] Al cambiar de filtro, el listado se actualiza.
- [ ] Empty state con texto "Sin historial. Tus comidas registradas aparecerán aquí" cuando no hay registros en el rango.
- [ ] Tarjetas consistentes con la referencia en `docs/screenshots/` (02_bitacora).

## 5. Carga de CSV CareLink

- [ ] Pantalla "Carga de Datos" permite seleccionar un archivo CSV.
- [ ] El CSV se envía a la Edge Function `import-carelink-csv` (no se procesa ni se envían credenciales desde el cliente).
- [ ] Con un CSV válido de CareLink (dos bloques con encabezado Index,Date,Time,...), la función devuelve entries_count y treatments_count y los datos aparecen en Nightscout (comprobar en la instancia o en mock).
- [ ] La semántica coincide con `docs/cvs_upload/importar_ns_v2.py` (columnas, formatos, lotes).
- [ ] Si el CSV es inválido o Nightscout falla, el usuario recibe un mensaje de error claro.

## 6. Laboratorio

- [ ] Con CSV cargado y registros de comidas de la última semana, se muestra un resumen de recomendaciones (o mensaje tipo "recomendaciones disponibles").
- [ ] Sin datos suficientes, se muestra estado vacío o mensaje explicativo (ej. "Carga un CSV y registra comidas para ver recomendaciones").

## 7. Perfil

- [ ] Se muestran sensibilidad (ISF) y ratio insulina/CH (I:C).
- [ ] Origen: Nightscout (si está integrado) o entrada manual guardada en Supabase.
- [ ] Si no hay datos, mensaje indicando cómo configurar (entrada manual o que se obtendrán de Nightscout).

## 8. Seguridad y gobierno de datos

- [ ] No hay API key de OpenAI ni API secret de Nightscout en el código o env del cliente.
- [ ] Credenciales solo en Supabase (secrets de Edge Functions) o en variables de entorno del backend.
- [ ] Imágenes y datos de salud sin logging de valores reales en producción.

---

**Orden sugerido para primera validación**: 1 → 2 → 3 → 4 (navegación, captura, Hoy, Bitácora); luego 5 (CSV) para tener datos de bomba; después 6 y 7 (Laboratorio, Perfil). Punto 8 verificar en revisión de código y configuración.
