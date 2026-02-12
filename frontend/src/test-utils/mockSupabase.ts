/** Mock Supabase client for tests (Constitución II: no llamar a APIs reales). */
export const mockSupabase = {
  from: () => ({
    select: () => ({ gte: () => ({ lte: () => ({ order: () => Promise.resolve({ data: [], error: null }) }) }), single: () => Promise.resolve({ data: null, error: null }), maybeSingle: () => Promise.resolve({ data: null, error: null }), insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: { id: 'fake-id' }, error: null }) }) }), update: () => ({ eq: () => Promise.resolve({ error: null }) }) }),
  }),
  storage: { from: () => ({ upload: () => Promise.resolve({ data: { path: 'fake-path' }, error: null }), getPublicUrl: () => ({ data: { publicUrl: 'https://example.com/fake.jpg' } }) }) },
  functions: { invoke: () => Promise.resolve({ data: { items: [], total_carbs: 0 }, error: null }) },
}
