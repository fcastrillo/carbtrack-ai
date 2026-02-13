# Epic E1: MVP Asistente CH — Design Index

```yaml
epic: E1
title: MVP Asistente CH (Asistente de Conteo de Carbohidratos)
status: COMPLETE
_origin: spec-kit
created: 2026-02-03 (spec-kit)
indexed: 2026-02-13 (RaiSE homologation, Epic E0)
```

---

## Bridge: Spec-Kit → RaiSE

This epic was designed and implemented using **spec-kit** methodology (pre-RaiSE). All design artifacts remain in `specs/001-mvp-asistente-ch/` to preserve git history and traceability.

**This index** makes E1 navigable from the RaiSE structure (`work/epics/e1-*/`) while preserving the original spec-kit artifacts in their historical location.

**For E3+ epics:** Design artifacts will live natively in `work/epics/eN-*/` using RaiSE conventions (see ADR-003).

---

## Spec-Kit Artifacts

All design documentation for Epic E1 is located in: `specs/001-mvp-asistente-ch/`

### Core Design Documents

| Artifact | Location | Purpose |
|----------|----------|---------|
| **Feature Spec** | [spec.md](../../../specs/001-mvp-asistente-ch/spec.md) | Acceptance scenarios, functional requirements (FR-N), user stories |
| **Data Model** | [data-model.md](../../../specs/001-mvp-asistente-ch/data-model.md) | Database schema (Supabase tables), data contracts, entity relationships |
| **Implementation Plan** | [plan.md](../../../specs/001-mvp-asistente-ch/plan.md) | Feature sequencing, milestones, dependencies (spec-kit planning phase) |
| **Task Breakdown** | [tasks.md](../../../specs/001-mvp-asistente-ch/tasks.md) | Atomic task list with verification criteria (spec-kit execution phase) |

### Supporting Documents

| Artifact | Location | Purpose |
|----------|----------|---------|
| **Quickstart Guide** | [quickstart.md](../../../specs/001-mvp-asistente-ch/quickstart.md) | Setup instructions, first-time user onboarding, validation checklist |
| **Research Notes** | [research.md](../../../specs/001-mvp-asistente-ch/research.md) | Background research, feasibility analysis, technical exploration |
| **API Contracts** | [contracts/edge-functions.md](../../../specs/001-mvp-asistente-ch/contracts/edge-functions.md) | Edge Function API specifications (analyze-meal, import-carelink-csv) |
| **Accepted Debt** | [ACCEPTED_DEBT.md](../../../specs/001-mvp-asistente-ch/ACCEPTED_DEBT.md) | Known limitations accepted for MVP scope |

---

## Epic E1 Summary

**Objective:** Build MVP for carbohydrate counting assistance using AI vision (GPT-4o Vision), integrated with Nightscout/CareLink for glucose data, and Educadies food catalog.

**Status:** COMPLETE (closed 2026-02-13, Epic E1 retrospective)

**Key Features Delivered:**
- Photo capture with AI analysis (analyze-meal Edge Function)
- Educadies food catalog integration
- CareLink CSV import for Nightscout sync
- Meal history tracking
- Manual pump profile entry (ISF/I:C ratios)

**Tech Stack:**
- Frontend: React 19 + Vite + TypeScript + Tailwind CSS 4 (PWA)
- Backend: Supabase (PostgreSQL + Edge Functions + Storage)
- AI: OpenAI GPT-4o Vision API

**Accepted Limitations (MVP):**
- No authentication (JWT verification disabled)
- No offline support (direct Supabase persistence)
- Placeholder AI analysis (GPT-4o integration pending)
- CareLink import provides counts only (no data validation)

---

## Nomenclature Note

**Functional Requirements:**
- Spec-kit uses **FR-N** (e.g., FR1, FR2, FR3)
- RaiSE governance uses **RF-NN** (e.g., RF-01, RF-02, RF-03) as canonical

**Mapping:** See [spec.md](../../../specs/001-mvp-asistente-ch/spec.md) for FR→RF mapping table (added in Epic E0, F0.3).

**For E3+ epics:** Use RF-NN exclusively (canonical nomenclature per ADR-002).

---

## Related Documents

- **Epic Scope:** See Epic E0 homologation for context on spec-kit → RaiSE bridge
- **Epic Close:** Epic E1 retrospective (2026-02-13) with velocity data and learnings
- **ADRs:** ADR-001 (index vs move), ADR-002 (canonical nomenclature), ADR-003 (RaiSE-native design for E3+)

---

*Index created: 2026-02-13 (Epic E0: Documentation Homologation, F0.2)*
*Origin: Spec-kit (2026-02-03)*
