---
type: architecture_context
project: carbtrack-ai
status: current
tech_stack:
  frontend: "React 19, Vite, TypeScript, Tailwind CSS 4"
  backend: "Supabase Edge Functions (Deno)"
  database: "PostgreSQL (Supabase)"
  storage: "Supabase Storage"
  ai: "OpenAI GPT-4o Vision (planned)"
external_dependencies:
  - Supabase (DB, Storage, Edge Functions)
  - Nightscout (CGM glucose data)
  - OpenAI GPT-4o Vision (meal analysis)
  - CareLink CSV (manual pump export)
users:
  - T1D patient (single user, PWA)
governed_by:
  - ".specify/memory/constitution.md"
  - "governance/guardrails.md"
---

# System Context: carbtrack-ai

> C4 Level 1 — System Context diagram and description

## Overview

CarbTracker AI is a Progressive Web App used by a single Type 1 diabetes patient to track carbohydrate intake via AI-powered meal photo analysis, audit past meals against real glucose data, and progressively improve carb estimation accuracy. The system integrates with external diabetes data sources (Nightscout, CareLink) and AI vision providers (OpenAI GPT-4o Vision) to close the feedback loop between estimated carbs, actual glucose response, and future predictions.

## Context Diagram

```
                          ┌─────────────────┐
                          │   OpenAI / AI    │
                          │  Vision Provider │
                          └────────▲────────┘
                                   │ HTTPS
┌──────────────┐          ┌────────┴────────┐          ┌─────────────────┐
│  T1D Patient │─────────►│  CarbTracker AI │◄─────────│    Nightscout   │
│  (PWA User)  │  HTTPS   │   (PWA + Edge   │  HTTPS   │   (CGM Data)   │
└──────────────┘          │   Functions)    │          └─────────────────┘
                          └────────┬────────┘
                                   │
                          ┌────────▼────────┐
                          │    Supabase     │
                          │ (DB + Storage)  │
                          └─────────────────┘

                          CareLink CSV ──► uploaded manually by user
```

## External Interfaces

| System | Direction | Protocol | Description |
|--------|-----------|----------|-------------|
| Supabase | Both | HTTPS (REST + Realtime) | Primary database (meal_history, master_food_list, pump_profile), file storage (meal images), Edge Function hosting |
| Nightscout | Both | HTTPS (REST API) | Receives CareLink treatments/entries via import; provides CGM glucose readings for retrospective audit |
| OpenAI GPT-4o Vision | Outbound | HTTPS (REST API) | Analyzes meal photos and returns carbohydrate estimates with food identification |
| CareLink CSV | Inbound | File upload (CSV) | Weekly Medtronic pump export containing two data blocks: treatments (BWZ carb input) and entries (sensor glucose) |
