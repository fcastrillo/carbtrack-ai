---
type: guardrails
version: "1.0.0"
---

# Guardrails: carbtrack-ai

> Code and architecture guardrails

---

## Guardrails Activos

### Code Quality

| ID | Level | Guardrail | Verification | Derived from |
|----|-------|-----------|--------------|--------------|
| must-code-001 | MUST | TypeScript strict mode — all public APIs have type annotations | `npm run build` (tsc check) | RF-01 |
| must-code-002 | MUST | ESLint passes with zero errors | `npm run lint` | RF-01 |
| should-code-001 | SHOULD | Service layer pattern — one service file per domain, no direct Supabase calls from components | Code review | RF-01 |
| should-code-002 | SHOULD | Dark theme enforced — background #0a0a0a, cards #18181b on all pages | Visual review | RF-02 |

### Testing

| ID | Level | Guardrail | Verification | Derived from |
|----|-------|-----------|--------------|--------------|
| must-test-001 | MUST | All tests use mock Supabase — no real API calls in test suite | `npm test` + review mockSupabase usage | RF-01 |
| must-test-002 | MUST | Test data is synthetic — never use real patient health data | Code review | RF-04 |
| should-test-001 | SHOULD | Service functions have unit tests covering happy path and error cases | `npm test` coverage | RF-01 |

### Security and Privacy

| ID | Level | Guardrail | Verification | Derived from |
|----|-------|-----------|--------------|--------------|
| must-sec-001 | MUST | Backend secrets (OPENAI_API_KEY, NIGHTSCOUT_URL, NIGHTSCOUT_API_SECRET) never in client code | grep audit | RF-01 |
| must-sec-002 | MUST | Image uploads validated: 5MB max, JPEG/PNG/WebP only | Unit test on validateImageFile | RF-01 |
| should-sec-001 | SHOULD | No PII in logs or error messages — glucose values and meal data are health data | Code review | RF-04 |

### Architecture

| ID | Level | Guardrail | Verification | Derived from |
|----|-------|-----------|--------------|--------------|
| must-arch-001 | MUST | AI provider layer is model-agnostic — analyze-meal Edge Function abstracts the vision API | Code review of Edge Function | RF-01 |
| should-arch-001 | SHOULD | Local React state only (useState/useEffect) — no global store in MVP | Code review | RF-02 |
| should-arch-002 | SHOULD | Tailwind CSS utility classes only — no custom CSS files | Code review | RF-02 |
