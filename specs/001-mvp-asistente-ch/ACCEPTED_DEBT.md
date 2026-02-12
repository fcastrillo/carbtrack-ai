# Deuda aceptada (pre-implementación) — 001-mvp-asistente-ch

Documento para aceptar explícitamente la deuda conocida antes de comenzar la implementación. Revisado tras última ejecución de `/speckit.analyze`.

**Fecha de aceptación:** 2025-02-03  
**Estado del feature:** Spec, plan, tasks, contracts, data-model y constitution alineados; listo para implementación fase por fase.

---

## 1. Deuda ya documentada en plan/spec

| Ítem | Dónde está | Decisión |
|------|-------------|----------|
| **Principio IV (offline)** | plan.md → Complexity Tracking | MVP sin captura offline; persistencia en Supabase desde día uno. Se pospone a un feature posterior. |

---

## 2. Deuda aceptada a partir del análisis (opcional / mejora posterior)

| ID | Descripción | Severidad | Decisión |
|----|-------------|-----------|----------|
| **U1** | Edge case "Catálogo vacío / sin coincidencias": la tarea T023 ya cubre "sin match → especificar manualmente y agregar al catálogo". No se añade tarea extra explícita solo para el mensaje "Sin coincidencia en catálogo" como texto literal. | MEDIUM | Aceptada: el flujo de T023 es suficiente; refinar mensaje en implementación si hace falta. |
| **G1** | Criterio SC-001 (flujo captura → confirmación &lt; 30 s): no hay tarea de validación explícita de tiempo. | LOW | Aceptada: validar en QA o en revisión manual; no bloquea implementación. |

---

## 3. Compromiso

- La implementación se hará **fase por fase** según `tasks.md`, con **commits regulares** por fase o grupo de tareas.
- Esta deuda **no bloquea** el inicio ni el avance del MVP.
- Los ítems anteriores se podrán abordar en iteraciones posteriores (refinement o feature siguiente) si se considera prioritario.
