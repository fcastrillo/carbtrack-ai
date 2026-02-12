import { useState, useRef } from 'react'
import {
  uploadAndAnalyze,
  saveMeal,
  type AnalyzeItem,
  type AnalyzeResponse,
} from '../services/mealService'
import { addToCatalog } from '../services/catalogService'

type Step = 'select' | 'analyzing' | 'confirm' | 'saved' | 'error'

export function CaptureMeal() {
  const [step, setStep] = useState<Step>('select')
  const [analysis, setAnalysis] = useState<AnalyzeResponse | null>(null)
  const [confirmedCarbs, setConfirmedCarbs] = useState(0)
  const [imageUrl, setImageUrl] = useState<string | null>(null) // Storage public URL for DB
  const [previewUrl, setPreviewUrl] = useState<string | null>(null) // blob for display
  const [errorMessage, setErrorMessage] = useState('')
  const [addedToCatalog, setAddedToCatalog] = useState<Set<number>>(new Set())
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setErrorMessage('')
    setStep('analyzing')
    try {
      const { response, imageUrl: storedUrl } = await uploadAndAnalyze(file)
      if (response.error) {
        setErrorMessage(response.error)
        setStep('error')
        return
      }
      setAnalysis(response)
      setConfirmedCarbs(response.total_carbs)
      setImageUrl(storedUrl)
      setPreviewUrl(URL.createObjectURL(file))
      setStep('confirm')
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Error al analizar la imagen')
      setStep('error')
    } finally {
      e.target.value = ''
    }
  }

  const handleConfirm = async () => {
    if (!analysis || !imageUrl) return
    setStep('analyzing')
    try {
      const ts = new Date().toISOString()
      await saveMeal({
        image_url: imageUrl,
        ai_analysis: { items: analysis.items, total_carbs: analysis.total_carbs },
        user_confirmed_carbs: confirmedCarbs,
        timestamp: ts,
      })
      setStep('saved')
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Error al guardar')
      setStep('error')
    }
  }

  const handleAddToCatalog = async (item: AnalyzeItem, index: number) => {
    try {
      await addToCatalog({
        alimento: item.name,
        ch_por_racion: item.carbs_grams,
        medida: item.measure || '',
        categoria: 'Otros',
      })
      setAddedToCatalog((prev) => new Set(prev).add(index))
    } catch {
      setErrorMessage('No se pudo agregar al catálogo.')
    }
  }

  const handleReset = () => {
    setStep('select')
    setAnalysis(null)
    setConfirmedCarbs(0)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    setImageUrl(null)
    setErrorMessage('')
    setAddedToCatalog(new Set())
  }

  if (step === 'select') {
    return (
      <div className="p-4 bg-[#18181b] rounded-lg">
        <label className="block text-sm text-white/80 mb-2">Foto del plato</label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="block w-full text-sm text-white/90 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-white/10 file:text-white"
        />
        <p className="text-xs text-white/50 mt-2">Máx. 5 MB. JPEG, PNG o WebP.</p>
      </div>
    )
  }

  if (step === 'analyzing') {
    return (
      <div className="p-4 bg-[#18181b] rounded-lg text-center text-white/80">
        {step === 'analyzing' && !analysis ? 'Analizando imagen…' : 'Guardando…'}
      </div>
    )
  }

  if (step === 'error') {
    return (
      <div className="p-4 bg-[#18181b] rounded-lg">
        <p className="text-red-400 text-sm">{errorMessage}</p>
        <button
          type="button"
          onClick={handleReset}
          className="mt-2 px-3 py-1.5 rounded bg-white/10 text-white text-sm"
        >
          Volver a intentar
        </button>
      </div>
    )
  }

  if (step === 'saved') {
    return (
      <div className="p-4 bg-[#18181b] rounded-lg">
        <p className="text-green-400 text-sm">Comida registrada correctamente.</p>
        <button
          type="button"
          onClick={handleReset}
          className="mt-2 px-3 py-1.5 rounded bg-white/10 text-white text-sm"
        >
          Registrar otra
        </button>
      </div>
    )
  }

  // confirm
  const items = (analysis?.items ?? []) as AnalyzeItem[]
  return (
    <div className="p-4 bg-[#18181b] rounded-lg space-y-3">
      {(previewUrl || imageUrl) && (
        <img src={previewUrl || imageUrl || ''} alt="Plato" className="w-full max-h-40 object-cover rounded" />
      )}
      <div>
        <p className="text-sm text-white/80 mb-1">Sugerencia de CH</p>
        <ul className="text-sm text-white/90 list-disc list-inside">
          {items.map((item, i) => (
            <li key={i} className="flex flex-wrap items-center gap-1">
              <span>{item.name}: {item.carbs_grams} g ({item.measure || '—'})</span>
              {item.source === 'vision_only' && (
                <>
                  <span className="text-amber-400 text-xs">(especifique manualmente)</span>
                  {!addedToCatalog.has(i) ? (
                    <button
                      type="button"
                      onClick={() => handleAddToCatalog(item, i)}
                      className="text-xs px-2 py-0.5 rounded bg-white/10 text-white"
                    >
                      Agregar al catálogo
                    </button>
                  ) : (
                    <span className="text-green-400 text-xs">Añadido</span>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
        <div className="mt-2 flex items-center gap-2">
          <label className="text-sm text-white/80">CH total:</label>
          <input
            type="number"
            min={0}
            value={confirmedCarbs}
            onChange={(e) => setConfirmedCarbs(Number(e.target.value) || 0)}
            className="w-20 px-2 py-1 rounded bg-black/30 text-white border border-white/20"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleConfirm}
          className="px-4 py-2 rounded bg-white/20 text-white text-sm font-medium"
        >
          Confirmar
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2 rounded bg-white/10 text-white text-sm"
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}
