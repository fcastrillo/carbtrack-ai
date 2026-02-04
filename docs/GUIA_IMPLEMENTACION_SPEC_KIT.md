# Guía de implementación Spec-Kit — CarbTrack

Guía paso a paso para sacar el máximo provecho de Spec-Kit en CarbTrack, con estructura para ejecución interactiva, identificación de gaps y complemento de información.

**Contexto:** Primera vez usando spec-kit; se prefiere ir despacio, con estructura y apoyo del asistente en cada fase.

---

## Flujo general (resumen)

```
Constitución → Specify (feature) → Clarify → Plan → Tasks → [Analyze] → Implement
     ↑                ↑                ↑         ↑        ↑              ↑
  Principios      Qué y por qué    Huecos    Cómo       Desglose     Código
  del proyecto    (historias)      resueltos  técnico    accionable
```

---

## Antes de empezar: estado actual del proyecto

| Artefacto | Ubicación | Uso en spec-kit |
|-----------|-----------|------------------|
| Visión y fases | `PRD.md`, `spec.md` | Fuente para redactar prompts de `/speckit.specify` |
| Modelo de datos y flujos | `spec.md` | Referencia para specify y plan |
| Referencia UI | `docs/screenshots/`, `docs/screenshots/UI_REFERENCE.md` | Incluir en describe de features (Bitácora, filtros, estado vacío) |
| Constitución | `.specify/memory/constitution.md` | **Plantilla sin rellenar** → Paso 1 |
| Features | Carpeta `specs/` | **Aún no existe** → se crea con `/speckit.specify` |

**Git:** Spec-kit usa ramas para asociar cada feature (ej. `001-mvp-captura`). Si no usas ramas, puedes fijar el feature con la variable de entorno `SPECIFY_FEATURE=001-nombre-feature` en el contexto del agente.

---

## Fase 0: Prerrequisitos (una sola vez)

### Objetivo
Confirmar que el entorno y la estructura spec-kit están listos.

### Qué hacer

1. **Comprobar comandos en Cursor**
   - En el chat del agente, verificar que tienes disponibles: `/speckit.constitution`, `/speckit.specify`, `/speckit.plan`, `/speckit.tasks`, `/speckit.clarify`, `/speckit.analyze`, `/speckit.implement`.
   - Si no aparecen, revisar que `.cursor/commands/speckit.*.md` existan y que el proyecto esté abierto en Cursor.

2. **Git (recomendado)**
   - Si usas ramas: `git status` desde la raíz del repo. Si el proyecto no está bajo Git, `git init` para habilitar el flujo por ramas.
   - Si no usas ramas: anotar que usarás `SPECIFY_FEATURE` cuando llegues a specify/plan/tasks.

3. **Carpeta de specs**
   - La carpeta `specs/` no existe aún; la creará el script cuando ejecutes `/speckit.specify` por primera vez.

### Checkpoint Fase 0
- [X] Comandos `/speckit.*` visibles en Cursor.
- [X] Proyecto creado en Git, con remoto en Github (https://github.com/fcastrillo/carbtrack-ai.git), con rama main
- [x] Decidido: trabajo con **ramas Git** para aprender el flujo completo de spec-kit (proyecto personal; ramas útiles para aprendizaje).

---

## Fase 1: Constitución del proyecto

### Objetivo
Sustituir la plantilla en `.specify/memory/constitution.md` por principios concretos de CarbTrack que guíen todas las especificaciones, planes y tareas.

### Qué hace el comando
- **Comando:** `/speckit.constitution`
- Lee la plantilla en `.specify/memory/constitution.md`.
- Reemplaza placeholders `[PRINCIPLE_X_NAME]`, `[PROJECT_NAME]`, etc., con valores derivados de tu input y del contexto del repo.
- Ajusta versión (MAJOR.MINOR.PATCH) y fechas.
- Opcionalmente revisa consistencia con templates (spec, plan, tasks) y escribe un Sync Impact Report en el propio archivo.
- **No** crea features ni specs; solo actualiza la constitución.

### Qué ejecutar

En el chat del agente (con el proyecto abierto):

```text
/speckit.constitution Crear principios para CarbTrack (asistente de conteo de carbohidratos con IA) enfocados en: (1) Calidad de código y mantenibilidad. (2) Estándares de pruebas, incluyendo datos sensibles de salud. (3) Consistencia de UX con la referencia de pantallas: dark mode, navegación inferior (Hoy, Bitácora, Laboratorio, Perfil), Bitácora con filtros de tiempo y estado vacío. (4) Requisitos PWA y modo offline para captura de fotos. (5) Gobierno de datos: uso de Supabase y Nightscout, privacidad de datos de glucosa e imágenes. Incluir gobernanza: cómo estos principios guían decisiones técnicas e implementación y proceso de enmienda.
```

Puedes acortar o ampliar el prompt; lo importante es mencionar: salud/datos sensibles, UX/referencia UI, PWA/offline, y gobierno de datos.

### Qué revisar después

1. Abrir `.specify/memory/constitution.md`:
   - No debe quedar ningún `[PLACEHOLDER]` sin rellenar (salvo TODOs explícitos).
   - Versión y fechas en formato coherente (ej. `Version: 1.0.0 | Ratified: YYYY-MM-DD`).
   - Principios en lenguaje declarativo (MUST/SHOULD donde aplique).
2. Si el comando generó un Sync Impact Report al inicio del archivo, revisar si marca templates “pending” y si quieres que el agente los actualice en un paso extra.

### Gaps / decisiones a anotar
*(Rellenar durante la ejecución)*

| Tema | Decisión o gap | Acción |
|------|----------------|--------|
| Ej. número de principios | 5 vs 7 | … |
| Ej. TDD obligatorio | Sí/No | … |

### Checkpoint Fase 1
- [ ] `constitution.md` sin placeholders inexplicados.
- [ ] Principios alineados con CarbTrack (salud, UX, PWA, datos).
- [ ] Versión y gobernanza coherentes.

---

## Fase 2: Especificar el primer feature (MVP)

### Objetivo
Crear la especificación ejecutable del primer feature (MVP) en `specs/001-<nombre>/spec.md`, con historias de usuario, criterios de aceptación y requisitos derivados de PRD + spec.md + UI de referencia.

### Qué hace el comando
- **Comando:** `/speckit.specify`
- Toma como input el **texto que escribes después de** `/speckit.specify` (la descripción del feature).
- Genera un short-name (ej. `mvp-captura-bitacora`), determina el número de feature (ej. 001) buscando ramas y/o carpetas `specs/NNN-*`.
- Ejecuta `.specify/scripts/bash/create-new-feature.sh`: crea rama (si hay Git) y carpeta `specs/001-<short-name>/`, y copia el spec template.
- Rellena el spec con user stories priorizadas (P1, P2, P3), escenarios Given-When-Then, requisitos funcionales, entidades, criterios de éxito, edge cases y suposiciones.
- Escribe todo en `specs/001-<short-name>/spec.md`.

Importante: el foco es **qué** se construye y **por qué**, no la pila tecnológica (eso va en Plan).

### Qué ejecutar

Primero define bien el alcance del MVP para este feature. Sugerencia (ajusta si quieres menos o más):

- Captura: foto → IA → sugerencia de CH con catálogo Educadies.
- Pantalla Hoy: total del día, acceso rápido a captura.
- Pantalla Bitácora: historial de comidas; filtros “Todas las comidas”, “Hoy”, “Última semana”, “Último mes”, “Rango personalizado”; estado vacío “Sin historial” con mensaje “Tus comidas registradas aparecerán aquí”.
- Navegación inferior: Hoy, Bitácora, Laboratorio, Perfil (Laboratorio/Perfil pueden ser placeholders en MVP).
- Sin login en esta fase; datos en Supabase (o local primero, según lo que quieras fijar en Clarify).

Ejemplo de comando (una sola línea o varias, según permita el chat):

```text
/speckit.specify MVP del asistente de conteo de carbohidratos: (1) Usuario toma foto del plato; la IA sugiere carbohidratos usando el catálogo Educadies. (2) Pantalla "Hoy" con total de CH del día y acceso rápido a captura. (3) Pantalla "Bitácora" con historial de comidas y filtros: Todas las comidas, Hoy, Última semana, Último mes, Rango personalizado; estado vacío con texto "Sin historial" y "Tus comidas registradas aparecerán aquí". (4) Navegación inferior con Hoy, Bitácora, Laboratorio, Perfil. Sin login en esta fase. Objetivo: reducir carga mental del conteo y sentar base para auditoría posterior. Usar referencia visual en docs/screenshots (Bitácora, filtros, estado vacío).
```

Si quieres historias en formato SAFe/BDD explícito, añade al final: “Historias en formato Como/Quiero/Para; criterios en Given-When-Then en español.”

### Qué revisar después

1. **Estructura**
   - Existe `specs/001-<nombre>/spec.md`.
   - Si usas Git: existe la rama correspondiente y estás en ella (o anotas `SPECIFY_FEATURE=001-<nombre>` para los siguientes comandos).
2. **Contenido del spec**
   - User stories priorizadas (P1, P2, P3) y escenarios Given-When-Then.
   - Bitácora: filtros y estado vacío reflejados.
   - Requisitos funcionales testables.
   - Sección de Edge Cases y Assumptions revisada; marcar `[NEEDS CLARIFICATION]` solo donde sea crítico (máx. 3).
3. **Consistencia**
   - Comparar con `PRD.md` y `spec.md`: nada esencial del producto faltante en el spec del feature.

### Gaps / decisiones a anotar
*(Rellenar durante la ejecución)*

| Tema | Decisión o gap | Acción |
|------|----------------|--------|
| Alcance Laboratorio/Perfil en MVP | Placeholder vs mínimo | … |
| Login / multi-usuario | Excluido en MVP | … |

### Checkpoint Fase 2
- [ ] Carpeta `specs/001-<nombre>/` y `spec.md` creados.
- [ ] Historias y criterios alineados con Bitácora y flujo de captura.
- [ ] Listo para Clarify (o para Plan si decides saltar Clarify).

---

## Fase 3: Clarificar requisitos (recomendado antes de Plan)

### Objetivo
Reducir ambigüedades y huecos del spec; registrar las respuestas en el propio spec para que Plan no tenga que adivinar.

### Qué hace el comando
- **Comando:** `/speckit.clarify`
- Ejecuta `check-prerequisites.sh` para obtener `FEATURE_DIR` y ruta del spec (según rama actual o `SPECIFY_FEATURE`).
- Analiza el spec con una taxonomía fija: alcance funcional, modelo de datos, flujos e UX, atributos no funcionales, integraciones, edge cases, terminología, etc.
- Hace hasta 5 preguntas concretas (priorizadas por impacto).
- Escribe las respuestas en una sección “Clarifications” (o equivalente) del spec.

Recomendación: ejecutar siempre antes de `/speckit.plan` en dominios sensibles (salud, datos personales).

### Qué ejecutar

Sin argumentos (el comando usa el feature activo):

```text
/speckit.clarify
```

Si el agente pide contexto adicional, puedes decir: “Usar PRD.md, spec.md y docs/screenshots/UI_REFERENCE.md como contexto del producto.”

### Qué revisar después

1. **Sección de clarificaciones**
   - En `specs/001-<nombre>/spec.md` debe existir un bloque con preguntas y respuestas.
   - Revisar que las respuestas sean las que quieres (editar a mano si hace falta).
2. **Spec actualizado**
   - A veces el comando propone cambios en otras secciones a partir de las respuestas; revisar que no contradigan PRD/spec.md.

### Gaps / decisiones a anotar
*(Rellenar durante la ejecución)*

| Pregunta del agente | Tu respuesta / decisión |
|---------------------|---------------------------|
| … | … |

### Checkpoint Fase 3
- [ ] Clarifications registradas en el spec.
- [ ] Sin contradicciones con PRD/spec.md.
- [ ] Listo para Plan.

---

## Fase 4: Plan técnico de implementación

### Objetivo
Generar el plan técnico del feature en `specs/001-<nombre>/plan.md` (y, si aplica, `data-model.md`, `contracts/`, `quickstart.md`, etc.) alineado con la constitución y el spec.

### Qué hace el comando
- **Comando:** `/speckit.plan`
- Lee el spec del feature activo (rama o `SPECIFY_FEATURE`).
- Toma tu input como **stack y decisiones de arquitectura**.
- Produce plan detallado: fases, componentes, tecnologías, y opcionalmente modelos de datos, contratos, quickstart.
- Debe respetar `.specify/memory/constitution.md`.

### Qué ejecutar

Incluye en el prompt el stack que ya tienes en `spec.md` (React, Vite, Supabase, etc.) y acota si este feature no incluye CSV ni auditoría:

```text
/speckit.plan La aplicación usa React con Vite y Tailwind CSS, configurada como PWA. Backend y base de datos en Supabase (PostgreSQL); almacenamiento de imágenes en Supabase Storage. Análisis de imágenes con OpenAI GPT-4o Vision. Integración con Nightscout API (autenticación SHA1) para SGV. Catálogo de alimentos en tabla master_food_list; registro diario en meal_history (image_url, ai_analysis, user_confirmed_carbs, glucose_at_meal, timestamp). Bitácora con filtros por tiempo y estado vacío según diseño de referencia. En este feature no incluir importador CSV ni motor de auditoría.
```

### Qué revisar después

1. **plan.md**
   - Fases y tareas técnicas coherentes con el spec.
   - Constitución respetada (pruebas, UX, datos, PWA).
2. **Otros artefactos**
   - Si existen `data-model.md`, `contracts/`, `quickstart.md`, comprobar que encajen con `spec.md` y con el modelo de datos ya descrito en la raíz.
3. **Consistencia**
   - Nombres de tablas y campos alineados con `spec.md` (master_food_list, meal_history, etc.).

### Gaps / decisiones a anotar
*(Rellenar durante la ejecución)*

| Tema | Decisión o gap | Acción |
|------|----------------|--------|
| … | … | … |

### Checkpoint Fase 4
- [ ] `plan.md` completo y alineado con spec y constitución.
- [ ] Listo para Tasks.

---

## Fase 5: Desglose en tareas

### Objetivo
Obtener una lista de tareas ejecutables en `specs/001-<nombre>/tasks.md` que un agente (o tú) pueda seguir en orden.

### Qué hace el comando
- **Comando:** `/speckit.tasks`
- Lee `plan.md` del feature activo y, si existen, `data-model.md`, `contracts/`, `research.md`.
- Genera `tasks.md`: tareas ordenadas, con dependencias; puede marcar tareas paralelizables `[P]`.

### Qué ejecutar

Sin argumentos:

```text
/speckit.tasks
```

### Qué revisar después

1. **tasks.md**
   - Cubre: UI (Hoy, Bitácora, filtros, estado vacío), captura de foto, integración con catálogo, modelo de datos y flujos del spec.
   - Orden lógico (p. ej. modelo de datos antes de pantallas que lo usan).
2. **Prioridad**
   - Si quieres implementar por historias (P1 primero), comprobar que las tareas se puedan agrupar por user story.

### Checkpoint Fase 5
- [ ] `tasks.md` generado y revisado.
- [ ] Opcional: ejecutar `/speckit.analyze` antes de implementar.

---

## Fase 6 (opcional): Analizar consistencia

### Objetivo
Detectar incoherencias entre spec, plan y tasks (y con la constitución) antes de codificar.

### Qué hace el comando
- **Comando:** `/speckit.analyze`
- Debe ejecutarse **después** de tener `tasks.md`.
- Compara `spec.md`, `plan.md` y `tasks.md`; reporta contradicciones, huecos y desalineaciones con la constitución.
- Sugiere acciones (por ejemplo: “Actualizar spec”, “Regenerar tasks”).

### Qué ejecutar

```text
/speckit.analyze
```

### Qué revisar después

- Resolver ítems CRITICAL antes de `/speckit.implement`.
- Opcional: resolver HIGH; dejar documentados los que pospongas.

### Checkpoint Fase 6
- [ ] Sin issues CRITICAL pendientes (o documentados y aceptados).

---

## Fase 7: Implementación

### Objetivo
Ejecutar las tareas de `tasks.md` en orden y generar/ajustar el código del feature.

### Qué hace el comando
- **Comando:** `/speckit.implement`
- Lee `tasks.md` del feature activo y va ejecutando las tareas (o guía al desarrollador para hacerlo).
- Asume que spec, plan y tasks están alineados.

### Qué ejecutar

```text
/speckit.implement
```

### Qué revisar después

- Código generado coherente con spec y plan.
- Constitución respetada (tests, UX, datos).
- Si algo no cuadra, corregir spec/plan/tasks y volver a generar (o ajustar código a mano y documentar).

---

## Seguimiento interactivo (uso con el asistente)

Usa esta tabla para ir marcando y anotando mientras avanzas. Puedes decir al asistente: “Estamos en Fase X; según la guía, el siguiente paso es …”.

| Fase | Comando principal | Estado | Notas / gaps |
|------|-------------------|--------|--------------|
| 0 | (prerrequisitos) | Completado | |
| 1 | `/speckit.constitution` | Completado | |
| 2 | `/speckit.specify` | Completado | |
| 3 | `/speckit.clarify` | Completado | |
| 4 | `/speckit.plan` | Completado | |
| 5 | `/speckit.tasks` | Completado | |
| 6 | `/speckit.analyze` (opcional) | Completado | |
| 7 | `/speckit.implement` | ⬜ Pendiente | |

**Cómo sacar provecho paso a paso**

1. **Una fase a la vez:** Completar checkpoint y anotar gaps antes de pasar a la siguiente.
2. **Gaps:** Si algo no está claro (alcance, formato SAFe, offline, etc.), anotarlo en la sección “Gaps / decisiones” de la fase y decidir con el asistente antes de seguir.
3. **Complementar información:** Si el agente pide más contexto, referir a `PRD.md`, `spec.md`, `docs/screenshots/UI_REFERENCE.md` o a esta guía.
4. **Repetir para más features:** Tras cerrar el MVP (001), puedes crear 002 (p. ej. CSV/Nightscout), 003 (auditoría), etc., repitiendo Specify → Clarify → Plan → Tasks → [Analyze] → Implement.

---

## Referencias rápidas

- **Spec-kit (referencia del proyecto):** `reference/README.md`, `reference/spec-driven.md`
- **Producto:** `PRD.md`, `spec.md`
- **UI:** `docs/screenshots/UI_REFERENCE.md`, capturas en `docs/screenshots/`
- **Constitución:** `.specify/memory/constitution.md`
- **Templates:** `.specify/templates/spec-template.md`, `plan-template.md`, `tasks-template.md`
