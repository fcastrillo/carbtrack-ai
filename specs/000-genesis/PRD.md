---
**⚠️ SUPERSEDED — GENESIS ARTIFACT**

This file is the original project genesis document (pre-RaiSE). It has been archived for historical reference.

**Current governance:** See `governance/prd.md` for active project requirements.

**Context:** This project evolved from spec-kit (Epic E1) to RaiSE framework (Epic E0+). Genesis files are preserved but superseded by RaiSE structure.

**Archived:** 2026-02-13 (Epic E0: Documentation Homologation)

---

[ORIGINAL CONTENT BELOW]

# PRD: Asistente de Conteo de Carbohidratos con IA

## 1. Visión y Alcance (Vision & Scope)
### 1.1 Propósito
Desarrollar una herramienta de precisión para el conteo de carbohidratos que actúe como una capa de inteligencia sobre los datos de la bomba Medtronic. La app busca reducir la carga mental del usuario mediante visión artificial y generar un ciclo de mejora continua basado en la respuesta biológica real.

### 1.2 Fases del Proyecto (Roadmap)
* **Fase 1 (MVP):** Captura de fotos, integración con catálogo Educadies, y procesador de CSV CareLink para sincronización con Nightscout.
* **Fase 2 (Learning Loop):** Auditoría retrospectiva que compara la estimación de la IA vs. el delta de glucosa 2h post-comida.
* **Fase 3 (Ecosistema):** Integración con Apple Health/Google Fit para correlacionar la sensibilidad a la insulina con la actividad física.

## 2. Historias de Usuario
* **Captura:** "Quiero tomar una foto de mi plato y que la IA sugiera carbohidratos usando términos del catálogo Educadies."
* **Consulta:** "Quiero ver el total de carbohidratos consumidos en el día para compararlos con mi objetivo diario."
* **Auditoría:** "Al cargar mi CSV semanal, quiero que la app detecte qué alimentos subestimé para aprender de ellos."

## 3. Requerimientos Funcionales
* **RF1:** Cámara con reconocimiento de imágenes vía GPT-4o Vision.
* **RF2:** Importador de CSV CareLink (Lógica de dos bloques: Entries/Treatments).
* **RF3:** Motor de Auditoría: Cruce de `meal_history` con datos de Nightscout para calcular el impacto glucémico.