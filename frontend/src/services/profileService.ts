import { supabase } from '../lib/supabase'

export type PumpProfile = {
  id: string
  isf: number | null
  ratio_ic: number | null
  updated_at: string
}

/** Get single pump_profile row (MVP: one row for implicit user). */
export async function getProfile(): Promise<PumpProfile | null> {
  const { data, error } = await supabase
    .from('pump_profile')
    .select('id, isf, ratio_ic, updated_at')
    .limit(1)
    .maybeSingle()
  if (error) throw new Error(error.message)
  return data as PumpProfile | null
}

/** Save pump_profile (single row for MVP: update existing or insert). */
export async function saveProfile(isf: number, ratio_ic: number): Promise<void> {
  const existing = await getProfile()
  const row = { isf, ratio_ic, updated_at: new Date().toISOString() }
  if (existing) {
    const { error } = await supabase.from('pump_profile').update(row).eq('id', existing.id)
    if (error) throw new Error(error.message)
  } else {
    const { error } = await supabase.from('pump_profile').insert(row)
    if (error) throw new Error(error.message)
  }
}
