import { supabase } from '../lib/supabase'

const BUCKET = 'meal-images'
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB per spec edge case
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export type AnalyzeItem = {
  name: string
  carbs_grams: number
  measure: string
  source: 'educadies' | 'vision_only'
}

export type AnalyzeResponse = {
  items: AnalyzeItem[]
  total_carbs: number
  error?: string
}

export type MealRecord = {
  image_url: string
  ai_analysis: Record<string, unknown>
  user_confirmed_carbs: number
  timestamp: string
}

/** Validate file size and type before upload (spec edge case: image too large or unsupported format) */
export function validateImageFile(file: File): { ok: true } | { ok: false; message: string } {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { ok: false, message: 'Formato no soportado. Use JPEG, PNG o WebP.' }
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { ok: false, message: 'La imagen es demasiado grande. Máximo 5 MB.' }
  }
  return { ok: true }
}

/** Upload image to Storage, get public URL */
export async function uploadImage(file: File): Promise<{ url: string; path: string }> {
  const path = `${crypto.randomUUID()}-${file.name.replace(/\s/g, '_')}`
  const { data, error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })
  if (error) throw new Error(error.message)
  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(data.path)
  return { url: urlData.publicUrl, path: data.path }
}

/** Call Edge Function analyze-meal with image_url; parse response per contracts/edge-functions.md */
export async function analyzeMeal(imageUrl: string): Promise<AnalyzeResponse> {
  const { data, error } = await supabase.functions.invoke<AnalyzeResponse>('analyze-meal', {
    body: { image_url: imageUrl },
  })
  if (error) {
    const msg = (error as unknown as { message?: string }).message ?? error.toString()
    if (msg.includes('413') || msg.includes('Payload too large')) return { items: [], total_carbs: 0, error: 'Imagen demasiado grande.' }
    if (msg.includes('502') || msg.includes('502')) return { items: [], total_carbs: 0, error: 'Error del servidor de análisis. Intente más tarde.' }
    return { items: [], total_carbs: 0, error: msg }
  }
  if (data?.error) return { items: data.items ?? [], total_carbs: data.total_carbs ?? 0, error: data.error }
  return {
    items: data?.items ?? [],
    total_carbs: data?.total_carbs ?? 0,
  }
}

/** Upload image, then call analyze-meal. Returns response and the Storage public URL to persist. */
export async function uploadAndAnalyze(file: File): Promise<{ response: AnalyzeResponse; imageUrl: string }> {
  const valid = validateImageFile(file)
  if (!valid.ok) throw new Error(valid.message)
  const { url } = await uploadImage(file)
  const response = await analyzeMeal(url)
  return { response, imageUrl: url }
}

/** Insert row into meal_history (image_url, ai_analysis, user_confirmed_carbs, timestamp) */
export async function saveMeal(record: MealRecord): Promise<{ id: string }> {
  const { data, error } = await supabase
    .from('meal_history')
    .insert({
      image_url: record.image_url,
      ai_analysis: record.ai_analysis,
      user_confirmed_carbs: record.user_confirmed_carbs,
      timestamp: record.timestamp,
    })
    .select('id')
    .single()
  if (error) throw new Error(error.message)
  return { id: data.id }
}

/** Row from meal_history for display */
export type MealEntry = {
  id: string
  image_url: string
  ai_analysis: { items?: AnalyzeItem[]; total_carbs?: number } | null
  user_confirmed_carbs: number
  timestamp: string
}

/** Get meals for today (local date); sum of user_confirmed_carbs = total CH del día (spec SC-002) */
export async function getTodayMeals(): Promise<MealEntry[]> {
  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)
  const { data, error } = await supabase
    .from('meal_history')
    .select('id, image_url, ai_analysis, user_confirmed_carbs, timestamp')
    .gte('timestamp', startOfDay.toISOString())
    .lte('timestamp', endOfDay.toISOString())
    .order('timestamp', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []) as MealEntry[]
}
