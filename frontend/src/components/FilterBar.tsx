export type BitacoraFilter = 'all' | 'today' | 'week' | 'month' | 'custom'

type Props = {
  value: BitacoraFilter
  onChange: (f: BitacoraFilter) => void
  customStart?: string
  customEnd?: string
  onCustomStartChange?: (date: string) => void
  onCustomEndChange?: (date: string) => void
}

const labels: Record<BitacoraFilter, string> = {
  all: 'Todas',
  today: 'Hoy',
  week: 'Última semana',
  month: 'Último mes',
  custom: 'Rango personalizado',
}

export function FilterBar({
  value,
  onChange,
  customStart = '',
  customEnd = '',
  onCustomStartChange,
  onCustomEndChange,
}: Props) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {(['all', 'today', 'week', 'month', 'custom'] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => onChange(f)}
            className={`px-3 py-1.5 rounded text-sm ${
              value === f ? 'bg-white/20 text-white' : 'bg-white/10 text-white/80'
            }`}
          >
            {labels[f]}
          </button>
        ))}
      </div>
      {value === 'custom' && (
        <div className="flex flex-wrap items-center gap-2 mt-1">
          <label className="text-sm text-white/70">
            Desde
            <input
              type="date"
              value={customStart}
              onChange={(e) => onCustomStartChange?.(e.target.value)}
              className="ml-2 px-2 py-1 rounded bg-black/30 text-white border border-white/20"
            />
          </label>
          <label className="text-sm text-white/70">
            Hasta
            <input
              type="date"
              value={customEnd}
              onChange={(e) => onCustomEndChange?.(e.target.value)}
              className="ml-2 px-2 py-1 rounded bg-black/30 text-white border border-white/20"
            />
          </label>
        </div>
      )}
    </div>
  )
}
