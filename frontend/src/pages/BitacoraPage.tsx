import { useState, useEffect, useCallback } from 'react'
import { FilterBar, type BitacoraFilter } from '../components/FilterBar'
import { MealCard } from '../components/MealCard'
import { getMealsByRange, type MealEntry } from '../services/mealService'

const EMPTY_STATE_TEXT = 'Sin historial. Tus comidas registradas aparecerán aquí'

function getRangeForFilter(
  filter: BitacoraFilter,
  customStart: string,
  customEnd: string
): { start: Date; end: Date } {
  const now = new Date()
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)
  switch (filter) {
    case 'today': {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
      return { start, end: endOfToday }
    }
    case 'week': {
      const start = new Date(now)
      start.setDate(start.getDate() - 7)
      start.setHours(0, 0, 0, 0)
      return { start, end: endOfToday }
    }
    case 'month': {
      const start = new Date(now)
      start.setMonth(start.getMonth() - 1)
      start.setHours(0, 0, 0, 0)
      return { start, end: endOfToday }
    }
    case 'custom': {
      const start = customStart ? new Date(customStart + 'T00:00:00') : new Date(0)
      const end = customEnd ? new Date(customEnd + 'T23:59:59.999') : new Date()
      return { start, end }
    }
    default:
      // all: desde hace 10 años hasta ahora
      const start = new Date(now)
      start.setFullYear(start.getFullYear() - 10)
      return { start, end: endOfToday }
  }
}

export function BitacoraPage() {
  const [filter, setFilter] = useState<BitacoraFilter>('all')
  const [customStart, setCustomStart] = useState('')
  const [customEnd, setCustomEnd] = useState('')
  const [meals, setMeals] = useState<MealEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMeals = useCallback(async () => {
    const { start, end } = getRangeForFilter(filter, customStart, customEnd)
    if (filter === 'custom' && (!customStart || !customEnd)) {
      setMeals([])
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const list = await getMealsByRange(start, end)
      setMeals(list)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar')
    } finally {
      setLoading(false)
    }
  }, [filter, customStart, customEnd])

  useEffect(() => {
    fetchMeals()
  }, [fetchMeals])

  return (
    <main className="p-4 pb-20">
      <h1 className="text-xl font-semibold">Bitácora</h1>
      <div className="mt-3">
        <FilterBar
          value={filter}
          onChange={setFilter}
          customStart={customStart}
          customEnd={customEnd}
          onCustomStartChange={setCustomStart}
          onCustomEndChange={setCustomEnd}
        />
      </div>
      {loading ? (
        <p className="mt-4 text-white/60 text-sm">Cargando…</p>
      ) : error ? (
        <p className="mt-4 text-red-400 text-sm">{error}</p>
      ) : meals.length === 0 ? (
        <p className="mt-4 text-white/70 text-sm">{EMPTY_STATE_TEXT}</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {meals.map((meal) => (
            <li key={meal.id}>
              <MealCard meal={meal} />
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
