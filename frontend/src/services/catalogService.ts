import { supabase } from '../lib/supabase'

export type AddToCatalogPayload = {
  alimento: string
  ch_por_racion: number
  medida: string
  categoria: string
}

/** Insert one row into master_food_list (T023: "Agregar al catálogo") */
export async function addToCatalog(payload: AddToCatalogPayload): Promise<{ id: string }> {
  const { data, error } = await supabase
    .from('master_food_list')
    .insert({
      alimento: payload.alimento,
      ch_por_racion: payload.ch_por_racion,
      medida: payload.medida || '',
      categoria: payload.categoria || 'Otros',
    })
    .select('id')
    .single()
  if (error) throw new Error(error.message)
  return { id: data.id }
}
