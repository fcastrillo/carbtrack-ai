import type { MealEntry } from '../services/mealService'

type Props = { meal: MealEntry }

/** Tarjeta: Foto, resumen de alimentos (ai_analysis), CH confirmados (spec: Hoy, Bitácora) */
export function MealCard({ meal }: Props) {
  const items = (meal.ai_analysis?.items ?? []) as { name: string; carbs_grams: number; measure?: string }[]
  const summary = items.length
    ? items.map((i) => `${i.name} ${i.carbs_grams}g`).join(', ')
    : 'Comida registrada'

  return (
    <article className="ct-card p-3 flex gap-3 items-start">
      {meal.image_url && (
        <img
          src={meal.image_url}
          alt=""
          className="w-20 h-20 object-cover rounded flex-shrink-0"
        />
      )}
      <div className="min-w-0 flex-1">
        <p className="text-sm text-white/90 truncate">{summary}</p>
        <p className="text-sm font-medium text-white mt-0.5">{meal.user_confirmed_carbs} g CH</p>
      </div>
    </article>
  )
}
