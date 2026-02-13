import { useState } from 'react'
import { uploadCareLinkCsv } from '../services/csvUploadService'

export function CargaDatosPage() {
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setStatus('uploading')
    setMessage('')
    try {
      const text = await file.text()
      const data = await uploadCareLinkCsv(text)
      if (data.error) {
        setStatus('error')
        setMessage(data.error)
        return
      }
      if (data.errors?.length) {
        setStatus('error')
        setMessage(data.errors.join('; '))
        return
      }
      setStatus('success')
      setMessage(
        data.success
          ? `Enviados: ${data.entries_count} entries (glucosa), ${data.treatments_count} treatments (carbos).`
          : 'Proceso completado con advertencias.'
      )
    } catch (err) {
      setStatus('error')
      setMessage(err instanceof Error ? err.message : 'Error al procesar el CSV')
    } finally {
      e.target.value = ''
    }
  }

  return (
    <main className="p-4 pb-20">
      <h1 className="text-xl font-semibold">Carga de Datos</h1>
      <p className="mt-2 text-white/70 text-sm">
        Sube un CSV exportado de CareLink para sincronizar glucosa e insulina con Nightscout.
      </p>
      <div className="mt-4 p-4 bg-[#18181b] rounded-lg">
        <label className="block text-sm text-white/80 mb-2">Archivo CSV</label>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          disabled={status === 'uploading'}
          className="block w-full text-sm text-white/90 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-white/10 file:text-white"
        />
        {status === 'uploading' && <p className="mt-2 text-white/60 text-sm">Procesando…</p>}
        {status === 'success' && message && (
          <p className="mt-2 text-green-400 text-sm">{message}</p>
        )}
        {status === 'error' && message && (
          <p className="mt-2 text-red-400 text-sm">{message}</p>
        )}
      </div>
    </main>
  )
}
