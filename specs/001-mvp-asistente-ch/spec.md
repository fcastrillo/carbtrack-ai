# Feature Specification: MVP del Asistente de Conteo de Carbohidratos

**Feature Branch**: `001-mvp-asistente-ch`  
**Created**: 2025-02-03  
**Status**: Draft  
**Input**: User description: "MVP del Asistente de Conteo de Carbohidratos: (1) Captura Inteligente... (2) Pantalla Hoy... (3) Bitácora... (4) Carga de Datos... (5) Laboratorio... (6) Perfil... (7) Navegación e Infraestructura. Objetivo: Sustituir el cálculo manual de CH y preparar la base para auditoría retrospectiva."

## Clarifications

### Session 2025-02-03

- Q: ¿Dónde se persisten en el MVP los registros de comidas (meal_history) y las fotos? → A: Supabase desde el MVP (tabla meal_history + bucket para imágenes). No se requiere funcionamiento offline en esta fase.
- Q: ¿Desde dónde se llama a GPT-4o Vision para analizar la foto del plato? → A: Backend/proxy (función serverless o API propia). La API key de OpenAI solo en servidor.
- Q: ¿Dónde se ejecuta el procesamiento del CSV de CareLink (detección de bloques Treatments/Entries y envío a Nightscout)? → A: Backend (función o API que aplica la lógica y llama a Nightscout con credenciales solo en servidor).
- Q: En el MVP, ¿de dónde salen los datos de Perfil (sensibilidad ISF y ratio I:C)? → A: API de Nightscout (perfil/bombas) si está disponible y la integración es viable; si se complica, fallback a entrada manual en la app (valores guardados en la app/Supabase).
- Q: Para el filtro "Rango personalizado" en Bitácora, ¿cómo debe funcionar la selección de fechas? → A: Selector de fechas inicio y fin en pantalla (date picker o campos); no persistir el rango entre sesiones en el MVP.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Navegación e infraestructura (Priority: P1)

La aplicación ofrece una barra de navegación inferior con cinco destinos: Hoy, Bitácora, Laboratorio, Carga de Datos, Perfil. No hay sistema de login en esta fase (acceso directo). El estilo visual es Dark Mode con fondo #0a0a0a y tarjetas #18181b, consistente con las capturas en `docs/screenshots/`.

**Why this priority**: Sin shell de navegación y estilo base, el resto de pantallas no tiene contenedor común ni coherencia visual.

**Independent Test**: Se puede verificar abriendo la app y comprobando que las cinco pestañas están visibles, que se puede cambiar de pantalla y que el tema oscuro se aplica.

**Acceptance Scenarios**:

1. **Given** la app abierta, **When** el usuario toca cada ítem de la barra inferior, **Then** se muestra la pantalla correspondiente (Hoy, Bitácora, Laboratorio, Carga de Datos, Perfil).
2. **Given** la app abierta, **When** se carga cualquier pantalla, **Then** el fondo usa #0a0a0a y las tarjetas #18181b según referencia en `docs/screenshots/UI_REFERENCE.md`.
3. **Given** un usuario nuevo, **When** abre la app, **Then** accede directamente sin pantalla de login.

---

### User Story 2 - Captura inteligente de comidas (Priority: P1)

El usuario dispone de una interfaz de cámara para tomar una foto del plato. La imagen se envía a GPT-4o Vision para identificar alimentos; el sistema cruza los resultados con la tabla `master_food_list` (Catálogo Educadies) y sugiere gramos de carbohidratos por ítem y total. Si no hay match del alimento con la tabla `master_food_list`, se sugiere que el usuario lo especifique manualmente y se agregue al catálogo.

**Why this priority**: Es el núcleo del valor del producto: sustituir el cálculo manual de CH.

**Independent Test**: Se puede probar tomando una foto de un plato conocido y verificando que aparece una sugerencia de CH alineada con el catálogo Educadies.

**Acceptance Scenarios**:

1. **Given** el usuario en la pantalla de captura, **When** toma una foto del plato, **Then** la imagen se envía a un servicio de análisis (GPT-4o Vision) y se muestran alimentos detectados con gramos de CH sugeridos.
2. **Given** los alimentos detectados, **When** existe coincidencia en `master_food_list`, **Then** las sugerencias de CH usan los valores del catálogo Educadies (por ración/medida).
3. **Given** la sugerencia mostrada, **When** el usuario confirma o ajusta los CH, **Then** el registro se persiste (meal_history o equivalente) con foto, análisis y CH confirmados.

---

### User Story 3 - Pantalla "Hoy" (Priority: P1)

Vista principal que muestra en el header el total acumulado de CH del día y un listado vertical de tarjetas de comida (Foto, Alimento, CH confirmados). Un botón flotante (FAB) central permite abrir la captura rápida.

**Why this priority**: Es el punto de entrada diario y donde el usuario ve el impacto de sus registros.

**Independent Test**: Con al menos un registro del día, se comprueba que el total del header coincide con la suma de las tarjetas y que el FAB abre la captura.

**Acceptance Scenarios**:

1. **Given** el usuario en la pantalla Hoy, **When** hay registros del día, **Then** el header muestra el total acumulado de CH del día y debajo un listado vertical de tarjetas (Foto, Alimento, CH confirmados).
2. **Given** el usuario en la pantalla Hoy, **When** no hay registros del día, **Then** se muestra un estado vacío coherente (ej. total 0 y mensaje o lista vacía).
3. **Given** el usuario en la pantalla Hoy, **When** pulsa el FAB central, **Then** se abre la interfaz de captura (cámara) para registrar una nueva comida.

---

### User Story 4 - Pantalla "Bitácora" (Priority: P2)

Historial completo de registros de comidas con filtros: Todas, Hoy, Última semana, Último mes, Rango personalizado. Empty state con el texto: "Sin historial. Tus comidas registradas aparecerán aquí". Diseño de filtros y tarjetas según referencia en `docs/screenshots/` (ej. 02_bitacora.png).

**Why this priority**: Permite revisar el historial y preparar datos para auditoría; depende de que existan registros (Captura + Hoy).

**Independent Test**: Con y sin registros, se verifica que los filtros cambian el listado y que el empty state se muestra cuando no hay datos.

**Acceptance Scenarios**:

1. **Given** el usuario en Bitácora, **When** no hay registros en el rango seleccionado, **Then** se muestra el empty state con el texto "Sin historial. Tus comidas registradas aparecerán aquí".
2. **Given** el usuario en Bitácora, **When** selecciona un filtro (Todas, Hoy, Última semana, Último mes, Rango personalizado con selector inicio/fin en pantalla), **Then** el listado se actualiza al rango elegido (el rango personalizado no se persiste entre sesiones en el MVP).
3. **Given** el usuario en Bitácora, **When** hay registros, **Then** se muestran como tarjetas consistentes con la referencia visual en `docs/screenshots/`.

---

### User Story 5 - Pantalla "Carga de Datos" (CSV CareLink → Nightscout) (Priority: P2)

Sección para cargar archivos CSV exportados de CareLink. La lógica de procesamiento de los dos bloques (Treatments y Entries) debe estar validada y alineada con el script de referencia `docs/cvs_upload/importar_ns_v2.py`, que detecta encabezados "Index,Date,Time,...", separa Treatments y Entries (SGV), y sincroniza con Nightscout (API con autenticación SHA1).

**Why this priority**: Necesaria para tener datos de glucosa/insulina en Nightscout y para alimentar el Laboratorio; el script existente fija el contrato de datos.

**Independent Test**: Subir un CSV de prueba y verificar que los datos aparecen en Nightscout (o en un mock) según la misma lógica que el script.

**Acceptance Scenarios**:

1. **Given** el usuario en Carga de Datos, **When** selecciona un archivo CSV de CareLink, **Then** el sistema detecta los dos bloques (Treatments / Entries) según la lógica de `docs/cvs_upload/importar_ns_v2.py` (encabezado Index,Date,Time,...).
2. **Given** un CSV válido procesado, **When** se envía a Nightscout, **Then** se usan los mismos endpoints y formato (y autenticación SHA1) que en el script de referencia.
3. **Given** un CSV con errores o formato no reconocido, **When** se intenta procesar, **Then** el usuario recibe un mensaje de error claro sin corromper datos ya sincronizados.

---

### User Story 6 - Pantalla "Laboratorio" (Priority: P3)

Resumen de recomendaciones significativas de la última semana, generadas después de cargar el CSV de Medtronic y cruzar esos datos con las sugerencias de CH registradas (p. ej. comparando estimación vs respuesta glucémica).

**Why this priority**: Valor de aprendizaje; depende de que existan Carga de Datos y registros de comidas.

**Independent Test**: Con CSV cargado y registros de comidas de la semana, se muestra al menos un resumen o mensaje indicando que hay recomendaciones (o que no hay suficientes datos).

**Acceptance Scenarios**:

1. **Given** el usuario en Laboratorio, **When** hay datos de la última semana (CSV cargado y registros de comidas), **Then** se muestra un resumen de recomendaciones significativas (ej. alimentos subestimados o patrones).
2. **Given** el usuario en Laboratorio, **When** no hay datos suficientes, **Then** se muestra un estado vacío o mensaje explicativo (ej. "Carga un CSV y registra comidas para ver recomendaciones").

---

### User Story 7 - Pantalla "Perfil" (Priority: P3)

Muestra los datos de configuración de la bomba más relevantes: sensibilidad (ISF) y ratio insulina/carbohidratos (I:C). Origen de datos: Nightscout (o configuración local si aún no está integrado el perfil desde Nightscout).

**Why this priority**: Información de referencia para el usuario; no bloquea el flujo principal de captura ni auditoría.

**Independent Test**: Abrir Perfil y verificar que se muestran al menos sensibilidad y ratio (aunque sean placeholders o valores por defecto).

**Acceptance Scenarios**:

1. **Given** el usuario en Perfil, **When** hay configuración disponible (Nightscout o local), **Then** se muestran sensibilidad (ISF) y ratio insulina/CH (I:C) como datos más relevantes.
2. **Given** el usuario en Perfil, **When** no hay configuración disponible desde Nightscout o no se ha hecho entrada manual, **Then** se muestra un estado vacío o mensaje indicando cómo configurar (entrada manual o que se obtendrán de Nightscout cuando esté integrado).

---

### Edge Cases

- **Captura sin conexión:** Fuera de alcance en este MVP. Persistencia es en Supabase desde el primer release; no se requiere flujo offline para captura.
- **CSV con un solo bloque:** El sistema debe manejar CSV con solo Treatments o solo Entries (el script de referencia contempla un bloque; el segundo puede ser None).
- **Nightscout no disponible:** Al cargar CSV o al consultar Perfil, si la API falla, mostrar mensaje claro y no perder datos locales ya capturados.
- **Imagen muy grande o formato no soportado:** Validar antes de enviar a Vision; rechazar con mensaje entendible.
- **Filtro "Rango personalizado" en Bitácora:** Selector de fechas inicio y fin en la propia pantalla (date picker o campos); no persistir el rango elegido entre sesiones en el MVP.
- **Catálogo Educadies vacío o sin coincidencias:** La sugerencia de CH puede ser solo por Vision; indicar cuando no hay match en `master_food_list`.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST ofrecer una interfaz de cámara para capturar foto del plato; la llamada a GPT-4o Vision MUST realizarse desde backend/proxy (p. ej. Supabase Edge Function o API propia), nunca desde el cliente, para no exponer la API key.
- **FR-002**: El sistema MUST cruzar los alimentos detectados con la tabla `master_food_list` (Catálogo Educadies) y sugerir gramos de CH por ítem y total.
- **FR-003**: El sistema MUST mostrar la pantalla "Hoy" con total acumulado de CH del día y listado vertical de tarjetas (Foto, Alimento, CH confirmados) y FAB para captura rápida.
- **FR-004**: El sistema MUST ofrecer la pantalla "Bitácora" con filtros: Todas, Hoy, Última semana, Último mes, Rango personalizado, y empty state "Sin historial. Tus comidas registradas aparecerán aquí".
- **FR-005**: El sistema MUST implementar la pantalla "Carga de Datos" donde el CSV se envía a un backend que procesa los dos bloques (Treatments/Entries) según la lógica de `docs/cvs_upload/importar_ns_v2.py` y sincroniza con Nightscout (API SHA1); credenciales de Nightscout solo en servidor.
- **FR-006**: El sistema MUST mostrar la pantalla "Laboratorio" con resumen de recomendaciones significativas de la última semana a partir de CSV y registros de CH.
- **FR-007**: El sistema MUST mostrar la pantalla "Perfil" con sensibilidad (ISF) y ratio insulina/CH (I:C); origen preferido: API de perfil/bombas de Nightscout si está disponible y la integración es viable; si no, entrada manual en la app (valores persistidos en Supabase o equivalente).
- **FR-008**: El sistema MUST proporcionar navegación inferior con cinco destinos: Hoy, Bitácora, Laboratorio, Carga de Datos, Perfil, sin login en esta fase.
- **FR-009**: El sistema MUST aplicar estilo Dark Mode (fondo #0a0a0a, tarjetas #18181b) consistente con `docs/screenshots/`.
- **FR-010**: El sistema MUST persistir registros de comidas (foto, análisis IA, CH confirmados) en Supabase (tabla meal_history, imágenes en Storage) para alimentar Hoy, Bitácora y futura auditoría; sin requisito de modo offline en el MVP.

### Key Entities

- **master_food_list**: Catálogo Educadies; alimento, ch_por_racion, medida, categoria; usado para cruce con salida de Vision.
- **meal_history**: Registro por comida en Supabase; image_url (Supabase Storage), ai_analysis, user_confirmed_carbs, timestamp; opcionalmente glucose_at_meal desde Nightscout. Persistencia en Supabase desde el MVP; sin requisito de modo offline.
- **CSV CareLink**: Dos bloques (Treatments, Entries) con encabezado Index,Date,Time,...; procesamiento según `importar_ns_v2.py`.
- **Nightscout**: Fuente de verdad para glucosa/insulina; API con autenticación SHA1; instancia de referencia documentada en Constitución.
- **Perfil de bomba**: Sensibilidad (ISF), ratio insulina/CH (I:C); origen preferido API Nightscout (perfil/bombas); fallback entrada manual en la app (persistida en Supabase o local).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El usuario puede registrar una comida con foto y obtener una sugerencia de CH en menos de 30 segundos (flujo captura → confirmación).
- **SC-002**: El total de CH del día en "Hoy" coincide con la suma de los CH confirmados de las tarjetas del día.
- **SC-003**: Los filtros de Bitácora actualizan correctamente el conjunto de registros mostrados (Todas, Hoy, Última semana, Último mes, Rango personalizado).
- **SC-004**: Un CSV de CareLink válido se procesa y sincroniza con Nightscout sin errores, con la misma semántica que `importar_ns_v2.py`.
- **SC-005**: La aplicación se muestra en Dark Mode (#0a0a0a / #18181b) en todas las pantallas y la navegación inferior permite alcanzar las cinco secciones.
- **SC-006**: Con datos suficientes (CSV + comidas), Laboratorio muestra al menos un resumen de recomendaciones; Perfil muestra sensibilidad y ratio cuando están disponibles.

## Assumptions

- El catálogo Educadies (`master_food_list`) estará disponible (poblado o importado) antes o durante el MVP.
- La instancia de Nightscout y las credenciales (API secret para SHA1) se configuran por entorno (variables); no se hardcodean en el cliente.
- El script `docs/cvs_upload/importar_ns_v2.py` es la referencia de verdad para el formato CSV y la API Nightscout; la lógica se ejecuta en backend (portada o invocando el script); la PWA solo sube el archivo y recibe el resultado.
- Sin login: un único “usuario” implícito por dispositivo o sesión; multi-usuario queda fuera del MVP.
- Las capturas en `docs/screenshots/` (incl. 02_bitacora.png) definen la referencia visual para Bitácora, filtros y tarjetas; Laboratorio y Perfil pueden seguir el mismo sistema de diseño.
- Registros de comidas y fotos se persisten en Supabase (tabla meal_history + Storage) desde el MVP; no se requiere funcionamiento offline en esta fase.
- El análisis de imagen (GPT-4o Vision) se invoca desde backend/proxy; la API key de OpenAI solo reside en servidor.
