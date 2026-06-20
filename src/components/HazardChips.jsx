const HAZARDS = [
  { key: 'deer', label: 'Deer' },
  { key: 'insects', label: 'Insects' },
  { key: 'ice', label: 'Ice' },
  { key: 'gravel', label: 'Gravel' },
  { key: 'fog', label: 'Fog' },
  { key: 'construction', label: 'Construction' },
  { key: 'sand', label: 'Sand' },
  { key: 'livestock', label: 'Livestock' },
]

export default function HazardChips({ hazards, onToggle }) {
  return (
    <div className="flex flex-wrap gap-2">
      {HAZARDS.map(({ key, label }) => {
        const on = !!hazards[key]
        return (
          <button
            key={key}
            type="button"
            onClick={() => onToggle(key)}
            className="rounded-full px-3 py-1.5 text-xs font-medium border transition-colors"
            style={
              on
                ? {
                    background: 'rgba(239,68,68,0.15)',
                    borderColor: '#ef4444',
                    color: '#f87171',
                  }
                : {
                    background: '#12141f',
                    borderColor: '#2a2d3e',
                    color: '#6b7394',
                  }
            }
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
