---
type: module
name: lib
purpose: "Supabase client initialization and shared infrastructure"
status: current
depends_on: []
depended_by: [services]
components: 1
---

# Module: lib

## Purpose

Provides the singleton Supabase client instance used by all service modules. This is the single point of configuration for database, storage, and Edge Function access. Environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) are read here and nowhere else.

## Architecture

The module exports a single `supabase` constant created via `createClient()`. All downstream services import this instance rather than creating their own clients, ensuring consistent configuration and a single connection point.

## Key Files

| File | Description |
|------|-------------|
| `supabase.ts` | Supabase client initialization from env vars |

## Dependencies

| Dependency | Why |
|------------|-----|
| `@supabase/supabase-js` | Official Supabase client library |

## Conventions

- No other module should call `createClient()` directly
- Environment variable validation happens here (warns on missing vars)
- No authentication logic in MVP — client uses anon key only
