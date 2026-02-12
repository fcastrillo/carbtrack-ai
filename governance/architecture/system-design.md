# System Design: carbtrack-ai

> C4 Level 2 — Container/component decomposition

## Architecture Overview

CarbTracker AI follows a three-layer architecture: a React 19 PWA frontend handles all user interaction through five tabbed pages, a service layer abstracts all Supabase client operations per domain, and Deno Edge Functions on Supabase handle server-side processing (AI meal analysis, CareLink CSV parsing). The frontend communicates exclusively through the service layer — no direct Supabase calls from components. State management uses local React state (useState/useEffect) with no global store in the MVP phase.

## Components

| Component | Responsibility | Technology |
|-----------|---------------|------------|
| PWA Frontend | User interface — 5 tabbed pages (Hoy, Bitacora, Laboratorio, CargaDatos, Perfil), meal capture flow, daily tracking display | React 19, Vite, TypeScript, Tailwind CSS 4, React Router |
| BottomNav | Fixed bottom navigation across all pages, 5 tabs with icons | React, lucide-react |
| CaptureMeal | Multi-step meal capture flow: photo → AI analysis → user confirmation → save | React component |
| MealCard | Displays individual meal entry with image, AI analysis results, confirmed carbs | React component |
| FilterBar | Date range filtering for Bitacora (logbook) page — presets and custom range | React component |
| mealService | Image upload to Storage, Edge Function invocation for analysis, meal CRUD on meal_history | TypeScript, Supabase JS client |
| csvUploadService | Sends CareLink CSV content to import-carelink-csv Edge Function | TypeScript, Supabase JS client |
| profileService | ISF and I:C ratio CRUD on pump_profile table | TypeScript, Supabase JS client |
| catalogService | Inserts user-suggested foods into master_food_list | TypeScript, Supabase JS client |
| Supabase Client | Singleton client initialization with env-based URL and anon key | @supabase/supabase-js |
| analyze-meal Edge Function | Receives image URL/base64, calls AI vision provider, returns carb estimates matched against Educadies catalog | Deno, OpenAI API |
| import-carelink-csv Edge Function | Parses CareLink CSV (two-block detection), extracts treatments and entries, posts to Nightscout | Deno, Nightscout REST API |
| PostgreSQL Schema | master_food_list (Educadies catalog), meal_history (meals + AI analysis), pump_profile (ISF/IC ratios) | Supabase PostgreSQL |
| Supabase Storage | meal-images bucket for uploaded meal photos (UUID filenames, 5MB limit) | Supabase Storage |

## Key Decisions

- Model-agnostic AI layer: analyze-meal Edge Function abstracts the vision provider, enabling swap from OpenAI to Anthropic Claude or others without frontend changes
- No authentication in MVP: single-user tool, JWT verification disabled in Edge Functions
- No offline support in MVP: all data persists directly to Supabase, PWA shell only
- CareLink two-block parsing: CSV format contains two separate header rows detected by `Index,Date,Time,...` pattern, handled as distinct data blocks for treatments vs entries
- Educadies as ground truth: the master_food_list based on the Educadies catalog serves as the authoritative carb reference, with AI results cross-referenced against it
