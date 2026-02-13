# Retrospective: T020 — analyze-meal Vision Integration

## Summary
- **Story:** T020 (Epic E1 — MVP Asistente CH)
- **Started:** 2026-02-12 (across 3 sessions due to context limits)
- **Completed:** 2026-02-12
- **Feature Size:** M (moderate)
- **Commits:** 3 (scope → design+story-start → implementation)
- **Files changed:** 5 (+489 lines, -14 lines)

## What Went Well
- **Design-first approach paid off:** Having scope.md and design.md before coding made the implementation straightforward — no ambiguity about what to build
- **Clean decomposition:** The 5-task plan mapped well to the actual work. Tasks 1-3 were naturally sequential and each had a clear boundary
- **Contract alignment:** The frontend's `AnalyzeItem` type and `analyzeMeal()` function already matched the Edge Function's response shape — zero frontend changes needed
- **Guardrails worked:** `must-arch-001` (isolated `callVision()`) and `must-sec-001` (env-only keys) were addressed naturally in the design, not as afterthoughts

## What Could Improve
- **Context window management:** The story spanned 3 Claude sessions because context ran out during design. Consider chunking skill executions more carefully
- **Edge Function testing gap:** No Deno test runner in the project means verification relied on code review and frontend test compatibility. This is acceptable for MVP but should be addressed before production
- **Pre-existing lint/tsc errors:** 6 pre-existing errors in frontend files create noise during verification. Should be cleaned up in a separate task

## Heutagogical Checkpoint

### What did you learn?
- Supabase Edge Functions use `esm.sh` CDN for npm package imports in Deno — `https://esm.sh/@supabase/supabase-js@2` is the standard pattern
- OpenAI Vision API responses may wrap JSON in markdown code blocks — the regex `/{[\s\S]*}/` handles this robustly
- Including catalog food names directly in the Vision prompt produces better matching than post-hoc string comparison (design decision validated by the approach in the OpenAI docs)

### What would you change about the process?
- For stories that modify a single file, Tasks 1-3 could have been a single task since they're not independently deployable. The decomposition was useful for thinking but added overhead in tracking
- The HITL checkpoint after each task is good for learning but could be relaxed to "checkpoint after each commit" for familiar patterns

### Are there improvements for the framework?
- **Edge Function testing pattern:** Consider adding a `should-test-edge-001` guardrail: "Edge Functions should have integration test stubs with mocked external APIs"
- **Context budget awareness:** The skill flow (start → design → plan → implement → review → close) can consume significant context. Consider a "lightweight" mode for small/moderate stories that combines design+plan

### What are you more capable of now?
- Full RaiSE story lifecycle execution (start → design → plan → implement → review)
- Deno Edge Function development with Supabase client and external API integration
- OpenAI Vision API integration with structured output parsing

## Improvements Applied
- None to framework (first story — establishing baseline)

## Action Items
- [ ] Clean up pre-existing lint/tsc errors (CargaDatosPage, test imports, vite.config) — separate task
- [ ] Consider adding Deno test stubs for Edge Functions in future stories
- [ ] Calibration baseline established for moderate Edge Function stories
