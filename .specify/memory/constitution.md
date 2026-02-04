<!--
  Sync Impact Report (2025-02-03)
  Version change: (template) → 1.0.0
  Modified principles: All five replaced with CarbTrack-specific principles
  Added sections: Technology & Data Context, Development Workflow
  Removed sections: None (template sections retained and filled)
  Templates: ✅ plan-template.md (Constitution Check aligns with principles)
            ✅ spec-template.md (no structural change required)
            ✅ tasks-template.md (task types align with testing & quality principles)
  Follow-up TODOs: None
-->

# CarbTrack Constitution

## Core Principles

### I. Calidad de código y mantenibilidad (Code Quality & Maintainability)

El código MUST ser legible, modular y mantenible. Se prefiere simplicidad sobre cleverness; nombres claros y responsabilidades bien delimitadas. La deuda técnica debe documentarse cuando se acepte de forma explícita; no se acumula sin justificación. Refactors que mejoren mantenibilidad están permitidos y se priorizan cuando el costo de no hacerlos supera el costo del cambio.

### II. Estándares de pruebas y datos sensibles de salud (Testing & Health Data)

Las funcionalidades que afecten datos de salud (glucosa, insulina, historial de comidas, imágenes de platos) MUST tener cobertura de pruebas adecuada a su impacto. Los datos de prueba MUST ser sintéticos o anonimizados; no se usan datos reales de pacientes en tests automatizados. Las pruebas MUST ser repetibles y deterministas. Cualquier integración con servicios externos (p. ej. Nightscout, Supabase) debe poder probarse mediante mocks o entornos de prueba documentados.

### III. Consistencia de UX (UX Consistency)

La interfaz MUST seguir la referencia visual definida en `docs/screenshots/` y `docs/screenshots/UI_REFERENCE.md`: dark mode, tarjetas traslúcidas, tipografía sans-serif moderna. La navegación inferior (Bottom Navigation) MUST incluir las cinco secciones, en este orden: **Hoy**, **Bitácora**, **Laboratorio**, **Carga de Datos**, **Perfil**, con iconos coherentes (p. ej. Lucide-React). La pantalla **Bitácora** MUST ofrecer filtros de tiempo (Todas las comidas, Hoy, Última semana, Último mes, Rango personalizado) y un estado vacío claro (“Sin historial”, “Tus comidas registradas aparecerán aquí”). Cualquier nueva pantalla o flujo debe alinearse con este estilo sin excepción.

### IV. PWA y modo offline (PWA & Offline)

La aplicación MUST ser una PWA instalable y usable desde el móvil. La captura de fotos de comidas MUST poder realizarse sin conexión: la imagen se guarda localmente y se sincroniza cuando haya conectividad. El usuario MUST recibir feedback claro sobre el estado de sincronización (pendiente, enviado, error). No se bloquean flujos críticos (tomar foto, ver historial local) por falta de red.

### V. Gobierno de datos (Data Governance)

Los datos de glucosa e insulina tienen como fuente de verdad **Nightscout** (ya en uso; instancia de referencia: https://p01--diabetes-app--tvj7ypwbwtj6.code.run). El almacenamiento persistente de usuarios, imágenes y catálogo de alimentos usará **Supabase** cuando se integre; hasta entonces se pueden usar soluciones locales o mock. Las imágenes de platos y los datos de salud MUST tratarse como datos sensibles: acceso mínimo, sin logging de valores reales en producción, y consideración de privacidad en cualquier exportación o terceros. La integración con Nightscout MUST respetar autenticación (p. ej. SHA1) y no exponer credenciales en el cliente.

## Technology & Data Context

- **Nightscout**: ya implementado; API como fuente de glucosa/insulina. La constitución asume que la instancia y la autenticación se configuran de forma segura (variables de entorno, no hardcode).
- **Supabase**: planeado para usuarios, almacenamiento de imágenes y catálogo (p. ej. Educadies). Hasta su adopción, los specs y planes pueden asumir almacenamiento local o mock sin contradecir este principio.
- **Stack previsto**: React + Vite, Tailwind, PWA; OpenAI GPT-4o Vision para análisis de imágenes. Las decisiones de stack en los planes MUST alinearse con PWA y offline (Principio IV) y con gobierno de datos (Principio V).

## Development Workflow

- Las especificaciones de features (`spec.md`) MUST respetar los principios de UX (III), datos (V) y pruebas (II). El comando `/speckit.plan` debe verificar el “Constitution Check” antes de cerrar el plan.
- Las tareas generadas (`tasks.md`) MUST incluir, cuando corresponda, tareas de pruebas y de manejo offline/privacidad según los principios. La complejidad debe estar justificada; la constitución prima sobre preferencias ad hoc.
- Cualquier desviación explícita de un principio (p. ej. no offline en un primer MVP) MUST documentarse en el spec o plan con razón y alcance limitado.

## Governance

- Esta constitución es la referencia máxima para decisiones de diseño e implementación en CarbTrack. Los documentos de spec, plan y tasks están subordinados a ella.
- **Enmiendas**: Cualquier cambio en principios o gobernanza requiere actualizar este archivo, incrementar la versión según semver (MAJOR: eliminación o redefinición incompatible de principios; MINOR: nuevo principio o sección; PATCH: aclaraciones, redacción) y actualizar “Last Amended”. Se recomienda documentar el motivo en el mensaje de commit o en un changelog.
- **Cumplimiento**: Los PRs y revisiones deben verificar que los cambios cumplan los principios. En caso de conflicto entre una práctica existente y la constitución, prevalece la constitución; si un principio debe relajarse, se enmienda la constitución en lugar de ignorarla.

**Version**: 1.0.1 | **Ratified**: 2025-02-03 | **Last Amended**: 2025-02-03
