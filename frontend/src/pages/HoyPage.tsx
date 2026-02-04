import { useState, useEffect, useCallback } from 'react'
import { Plus } from 'lucide-react'
import { CaptureMeal } from '../components/CaptureMeal'
import { MealCard } from '../components/MealCard'
import { getTodayMeals, type MealEntry } from '../services/mealService'

export function HoyPage() {
  const [showCapture, setShowCapture] = useState(false)
  const [meals, setMeals] = useState<MealEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchToday = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const list = await getTodayMeals()
      setMeals(list)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchToday()
  }, [fetchToday])

  // Al cerrar la captura, refrescar para mostrar la nueva comida
  const handleCloseCapture = () => {
    setShowCapture(false)
    fetchToday()
  }

  const totalCarbs = meals.reduce((sum, m) => sum + m.user_confirmed_carbs, 0)

  return (
    <main className="p-4 pb-20">
      <h1 className="text-xl font-semibold">Hoy</h1>

      {showCapture ? (
        <div className="mt-4">
          <CaptureMeal />
          <button
            type="button"
            onClick={handleCloseCapture}
            className="mt-3 text-sm text-white/70"
          >
            Cerrar
          </button>
        </div>
      ) : (
        <>
          <div className="mt-3 p-3 bg-[#18181b] rounded-lg">
            <p className="text-white/60 text-xs uppercase tracking-wide">Total CH hoy</p>
            <p className="text-2xl font-semibold text-white">{totalCarbs} g</p>
          </div>

          {loading ? (
            <p className="mt-4 text-white/60 text-sm">Cargando…</p>
          ) : error ? (
            <p className="mt-4 text-red-400 text-sm">{error}</p>
          ) : meals.length === 0 ? (
            <p className="mt-4 text-white/60 text-sm">Sin comidas registradas hoy.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {meals.map((meal) => (
                <li key={meal.id}>
                  <MealCard meal={meal} />
                </li>
              ))}
            </ul>
          )}

          <button
            type="button"
            onClick={() => setShowCapture(true)}
            className="fixed bottom-20 right-4 w-14 h-14 rounded-full bg-white/20 flex items-center justify-center shadow-lg"
            aria-label="Registrar comida"
          >
            <Plus size={28} className="text-white" />
          </button>
        </>
      )}
    </main>
  )
}
