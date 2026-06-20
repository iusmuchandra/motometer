import { scoreColor } from '../engine/scoreEngine.js'

const SLIDERS = [
  { key: 'temperature', label: 'Temperature', min: 0, max: 120, step: 1, unit: '°F' },
  { key: 'windSpeed', label: 'Wind Speed', min: 0, max: 60, step: 1, unit: 'mph' },
  { key: 'rain', label: 'Rain Intensity', min: 0, max: 100, step: 1, unit: '%' },
  { key: 'humidity', label: 'Humidity', min: 0, max: 100, step: 1, unit: '%' },
  { key: 'visibility', label: 'Visibility', min: 0, max: 10, step: 0.1, unit: 'mi' },
  { key: 'roadQuality', label: 'Road Quality', min: 1, max: 10, step: 1, unit: '/10' },
  { key: 'traffic', label: 'Traffic Density', min: 0, max: 10, step: 1, unit: '/10' },
]

function SectionLabel({ children }) {
  return (
    <div
      className="font-bold uppercase mb-3"
      style={{ fontSize: 9, letterSpacing: '0.15em', color: '#4a5280' }}
    >
      {children}
    </div>
  )
}

export function Toggle({ on, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="relative rounded-full transition-colors"
      style={{
        width: 40,
        height: 22,
        background: on ? '#3b6fd4' : '#2a2d3e',
      }}
    >
      <span
        className="absolute rounded-full bg-white transition-all"
        style={{ width: 16, height: 16, top: 3, left: on ? 21 : 3 }}
      />
    </button>
  )
}

export function RiderToggles({ toggles, setToggle }) {
  return (
    <div>
      <SectionLabel>Rider</SectionLabel>
      <div className="flex flex-col gap-3">
        {[
          { key: 'expertRider', label: 'Expert Rider' },
          { key: 'nightRiding', label: 'Night Riding' },
          { key: 'highwayMode', label: 'Highway Mode' },
        ].map((t) => (
          <div key={t.key} className="flex items-center justify-between">
            <span className="text-sm text-text-primary/80">{t.label}</span>
            <Toggle on={!!toggles[t.key]} onChange={() => setToggle(t.key)} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ConditionsPanel({ factors, setFactor, scoreColorValue }) {
  const color = scoreColorValue ?? scoreColor(50)

  return (
    <div>
      <SectionLabel>Conditions</SectionLabel>
      <div className="flex flex-col gap-3">
        {SLIDERS.map((s) => {
          const val = factors[s.key]
          const shown = s.step < 1 ? Number(val).toFixed(1) : Math.round(val)
          return (
            <div key={s.key}>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-primary/80">{s.label}</span>
                <span className="text-sm font-bold" style={{ color }}>
                  {shown}
                  <span className="text-text-muted font-normal ml-0.5">{s.unit}</span>
                </span>
              </div>
              <input
                type="range"
                min={s.min}
                max={s.max}
                step={s.step}
                value={val}
                onChange={(e) => setFactor(s.key, Number(e.target.value))}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
