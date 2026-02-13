## Feature Scope: T020 — analyze-meal Vision Integration

**Epic:** E1 — MVP Asistente CH
**Story:** US2 — Captura inteligente de comidas
**Task:** T020

**In Scope:**
- Implement GPT-4o Vision call in `supabase/functions/analyze-meal/index.ts`
- Send meal image (URL or base64) to OpenAI Vision API
- Receive food identification with carb estimates
- Query `master_food_list` (Educadies) to cross-reference detected foods
- Return `{ items: AnalyzeItem[], total_carbs }` per contracts/edge-functions.md
- Mark items as `source: 'educadies'` (matched) or `source: 'vision_only'` (no match)
- Handle errors: missing API key (502), invalid image (400), OpenAI failures (502)
- Spanish error messages consistent with existing Edge Functions

**Out of Scope:**
- Frontend changes (CaptureMeal already handles the response contract)
- Feedback/learning loop (E4 — Continuous Learning)
- Offline support (accepted MVP debt)
- Authentication/JWT verification (accepted MVP debt)
- Prompt tuning beyond initial working version

**Done Criteria:**
- [ ] Edge Function calls OpenAI Vision API with meal image
- [ ] Response matches AnalyzeItem[] contract (name, carbs_grams, measure, source)
- [ ] Foods found in master_food_list marked as 'educadies'
- [ ] Foods not found marked as 'vision_only'
- [ ] Error cases return structured JSON with Spanish messages
- [ ] Guardrail must-arch-001: AI provider abstracted in Edge Function
- [ ] Guardrail must-sec-001: OPENAI_API_KEY only in Edge Function env
- [ ] Existing frontend tests still pass (`npm test`)
