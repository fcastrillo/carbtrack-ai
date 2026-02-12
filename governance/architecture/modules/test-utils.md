---
type: module
name: test-utils
purpose: "Test infrastructure — mock Supabase client and setup"
status: current
depends_on: []
depended_by: []
components: 1
---

# Module: test-utils

## Purpose

Provides test infrastructure for the frontend test suite. The primary artifact is `mockSupabase`, a test double that stubs all Supabase client methods (`.from()`, `.storage`, `.functions.invoke()`) with deterministic responses. This ensures Constitution Principle II compliance: no real API calls in tests, all test data is synthetic.

## Key Files

| File | Description |
|------|-------------|
| `mockSupabase.ts` | Supabase client mock with stubbed methods |
| `setup.ts` | Vitest global setup (referenced in vite.config.ts) |

## Conventions

- Mock returns deterministic data (`'fake-id'`, `'https://example.com/fake.jpg'`)
- Tests use jsdom environment with Vitest globals
- Never use real patient health data in tests (Constitution II, guardrail `must-test-002`)
