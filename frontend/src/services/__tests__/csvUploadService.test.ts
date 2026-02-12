import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../lib/supabase', () => ({
  supabase: {
    functions: {
      invoke: vi.fn(),
    },
  },
}))

describe('csvUploadService', () => {
  beforeEach(async () => {
    const { supabase } = await import('../../lib/supabase')
    vi.mocked(supabase.functions.invoke).mockResolvedValue({
      data: { entries_count: 10, treatments_count: 5, success: true },
      error: null,
    })
  })

  it('calls Edge Function with csv_content and returns counts (synthetic data)', async () => {
    const { uploadCareLinkCsv } = await import('../csvUploadService')
    const { supabase } = await import('../../lib/supabase')
    const result = await uploadCareLinkCsv('Index,Date,Time\n1,2025/01/01,12:00:00')
    expect(supabase.functions.invoke).toHaveBeenCalledWith('import-carelink-csv', {
      body: { csv_content: 'Index,Date,Time\n1,2025/01/01,12:00:00' },
    })
    expect(result.entries_count).toBe(10)
    expect(result.treatments_count).toBe(5)
    expect(result.success).toBe(true)
  })
})
