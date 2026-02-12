import { supabase } from '../lib/supabase'

export type ImportCsvResult = {
  entries_count: number
  treatments_count: number
  success: boolean
  errors?: string[]
  error?: string
}

/** Send CSV content to Edge Function import-carelink-csv; returns counts or error. */
export async function uploadCareLinkCsv(csvContent: string): Promise<ImportCsvResult> {
  const { data, error } = await supabase.functions.invoke<ImportCsvResult>('import-carelink-csv', {
    body: { csv_content: csvContent },
  })
  if (error) {
    const msg = (error as unknown as { message?: string }).message ?? error.toString()
    return { entries_count: 0, treatments_count: 0, success: false, error: msg }
  }
  if (data?.error) {
    return {
      entries_count: data.entries_count ?? 0,
      treatments_count: data.treatments_count ?? 0,
      success: false,
      error: data.error,
    }
  }
  return {
    entries_count: data?.entries_count ?? 0,
    treatments_count: data?.treatments_count ?? 0,
    success: data?.success ?? false,
    errors: data?.errors,
  }
}
