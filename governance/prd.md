# PRD: carbtrack-ai

> Product Requirements Document

---

## Problem

Every meal for a Type 1 diabetes patient requires an accurate carbohydrate estimate to calculate the correct insulin bolus dose. Despite having an advanced insulin pump and continuous glucose sensor setup, carb counting remains entirely manual, imprecise, and error-prone. These estimation errors directly cause suboptimal glucose control, leading to spikes and dips that degrade Time in Range. There is no tool that closes the loop between what was estimated, what actually happened to blood glucose, and what should be estimated next time.

## Goals

- AI carb estimates converge toward the user's biology, requiring fewer manual corrections week over week
- Post-meal glucose spikes become smaller and more predictable over time
- Time in Range (TIR%) improves measurably over weeks and months (north-star metric)
- Every underestimate becomes a learning opportunity through systematic retrospective audit
- Tool is reliable and clear enough to share with clinical care team

---

## Requirements

### RF-01: Photo-Based Meal Recognition

The system uses GPT-4o Vision (or equivalent model) to analyze a photo of a meal and suggest carbohydrate estimates. Results are presented using terminology from the Educadies food catalog, matching foods to known entries where possible and flagging vision-only estimates when no catalog match exists. The architecture is model-agnostic, supporting provider swaps.

### RF-02: Daily Carb Tracking and Goal Comparison

The system logs total carbohydrate intake per day, aggregating all confirmed meal entries. It compares the daily total against the user's personal daily target and displays progress on the Hoy (Today) page, giving the user a clear picture of their intake status.

### RF-03: CareLink CSV Import and Nightscout Sync

The system processes weekly Medtronic CareLink CSV exports using two-block parsing logic — extracting Treatments (BWZ Carb Input) from the first block and Entries (Sensor Glucose) from the second block. Parsed data is synced to Nightscout for integration with the audit engine.

### RF-04: Retrospective Audit Engine

The system crosses meal history against Nightscout CGM data to calculate the actual glycemic impact of each meal. It compares the AI's original carb estimate against the real 2-hour post-meal glucose delta, identifying meals where the response exceeded expectations and systematically flagging foods that are consistently underestimated.

### RF-05: Continuous Learning Loop

Building on the audit engine (Phase 2), the system feeds correction data back to improve future carb estimates. By comparing original AI predictions with actual glucose outcomes over time, the model adapts to the user's specific metabolic patterns, progressively reducing estimation error.

### RF-06: Pump Profile Management

The system allows the user to manually enter and update their ISF (Insulin Sensitivity Factor) and I:C (Insulin-to-Carb) ratio. These values are used by the audit engine to contextualize glucose response relative to the insulin delivered.

### RF-07: Food Catalog (Educadies)

The system maintains a master food list based on the Educadies catalog with carb-per-serving data. Users can suggest new foods to add to the catalog when the AI identifies items not present in the existing list. The catalog serves as the ground-truth reference for carb estimation.
