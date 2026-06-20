import { MODE_LIST } from '../config/modes.js'

export default function ModeSwitcher({ mode, setMode }) {
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
      {MODE_LIST.map((m) => {
        const active = m.key === mode
        return (
          <button
            key={m.key}
            type="button"
            onClick={() => setMode(m.key)}
            className="flex-shrink-0 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold border transition-colors"
            style={
              active
                ? {
                    background: `${m.accent}22`,
                    borderColor: m.accent,
                    color: m.accent,
                  }
                : { background: '#12141f', borderColor: '#2a2d3e', color: '#8b93b5' }
            }
            title={m.label}
          >
            <span style={{ fontSize: 14 }}>{m.icon}</span>
            <span>{m.label}</span>
          </button>
        )
      })}
    </div>
  )
}
