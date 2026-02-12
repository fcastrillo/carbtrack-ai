import { useState, useEffect } from 'react'
import { getProfile, saveProfile } from '../services/profileService'

const EMPTY_MESSAGE = 'Configura sensibilidad y ratio (entrada manual o desde Nightscout cuando esté integrado).'

export function PerfilPage() {
  const [isf, setIsf] = useState('')
  const [ratioIc, setRatioIc] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<'idle' | 'saved' | 'error'>('idle')

  useEffect(() => {
    getProfile()
      .then((p) => {
        if (p) {
          setIsf(p.isf != null ? String(p.isf) : '')
          setRatioIc(p.ratio_ic != null ? String(p.ratio_ic) : '')
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    const isfNum = parseFloat(isf)
    const ratioNum = parseFloat(ratioIc)
    if (Number.isNaN(isfNum) || Number.isNaN(ratioNum) || isfNum < 0 || ratioNum <= 0) {
      setMessage('error')
      return
    }
    setSaving(true)
    setMessage('idle')
    try {
      await saveProfile(isfNum, ratioNum)
      setMessage('saved')
    } catch {
      setMessage('error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <main className="p-4">
        <h1 className="text-xl font-semibold">Perfil</h1>
        <p className="mt-4 text-white/60 text-sm">Cargando…</p>
      </main>
    )
  }

  const hasValues = (isf !== '' && ratioIc !== '') || (parseFloat(isf) > 0 || parseFloat(ratioIc) > 0)

  return (
    <main className="p-4 pb-20">
      <h1 className="text-xl font-semibold">Perfil</h1>
      <p className="mt-2 text-white/70 text-sm">Sensibilidad (ISF) y ratio insulina/CH (I:C).</p>

      {!hasValues && !saving && (
        <p className="mt-3 text-white/60 text-sm">{EMPTY_MESSAGE}</p>
      )}

      <div className="mt-4 p-4 bg-[#18181b] rounded-lg space-y-3">
        <label className="block">
          <span className="text-sm text-white/80">Sensibilidad ISF (unidades por mg/dL)</span>
          <input
            type="number"
            step="0.1"
            min="0"
            value={isf}
            onChange={(e) => setIsf(e.target.value)}
            className="mt-1 w-full px-3 py-2 rounded bg-black/30 text-white border border-white/20"
          />
        </label>
        <label className="block">
          <span className="text-sm text-white/80">Ratio I:C (unidades por ración CH)</span>
          <input
            type="number"
            step="0.1"
            min="0.1"
            value={ratioIc}
            onChange={(e) => setRatioIc(e.target.value)}
            className="mt-1 w-full px-3 py-2 rounded bg-black/30 text-white border border-white/20"
          />
        </label>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 rounded bg-white/20 text-white text-sm font-medium disabled:opacity-50"
        >
          {saving ? 'Guardando…' : 'Guardar'}
        </button>
        {message === 'saved' && <p className="text-green-400 text-sm">Guardado.</p>}
        {message === 'error' && <p className="text-red-400 text-sm">Revisa los valores e intenta de nuevo.</p>}
      </div>
    </main>
  )
}
