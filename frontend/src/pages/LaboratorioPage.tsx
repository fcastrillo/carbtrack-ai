import { useState, useEffect } from 'react'
import { getMealsByRange } from '../services/mealService'

const EMPTY_MESSAGE = 'Carga un CSV y registra comidas para ver recomendaciones.'

export function LaboratorioPage() {
  const [mealsCount, setMealsCount] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const now = new Date()
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)
    const start = new Date(now)
    start.setDate(start.getDate() - 7)
    start.setHours(0, 0, 0, 0)
    getMealsByRange(start, end)
      .then((list) => { if (!cancelled) setMealsCount(list.length) })
      .catch(() => { if (!cancelled) setMealsCount(0) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const hasData = mealsCount !== null && mealsCount > 0

  return (
    <main className="p-4 pb-20">
      <h1 className="text-xl font-semibold">Laboratorio</h1>
      <p className="mt-2 text-white/70 text-sm">
        Resumen de recomendaciones significativas de la última semana (CSV + comidas).
      </p>
      {loading ? (
        <p className="mt-4 text-white/60 text-sm">Cargando…</p>
      ) : !hasData ? (
        <p className="mt-4 text-white/70 text-sm">{EMPTY_MESSAGE}</p>
      ) : (
        <div className="mt-4 p-4 bg-[#18181b] rounded-lg">
          <h2 className="text-sm font-medium text-white/90">Recomendaciones (última semana)</h2>
          <p className="mt-2 text-white/80 text-sm">
            {mealsCount} comida{mealsCount !== 1 ? 's' : ''} registrada{mealsCount !== 1 ? 's' : ''} esta semana.
            Con CSV de CareLink cargado en Carga de Datos podrás ver cruces con glucosa y sugerencias.
          </p>
        </div>
      )}
    </main>
  )
}
