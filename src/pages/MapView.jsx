import { useMemo, useState } from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import { scaleLinear } from 'd3-scale'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip as RTooltip,
} from 'recharts'
import NavBar from '../components/NavBar.jsx'
import { useAppState } from '../state/AppState.jsx'
import { scoreForMode } from '../config/modes.js'
import { scoreColor } from '../engine/scoreEngine.js'
import { defaultFactors } from '../config/factors.js'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json'

// Deterministic 0..1 from a string (so a state always renders the same).
function hash01(str, salt = 0) {
  let h = 2166136261 ^ salt
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return ((h >>> 0) % 10000) / 10000
}

// Synthetic-but-plausible regional conditions for a state (no 50 live API calls).
function stateConditions(name, dayOffset = 0) {
  const t = hash01(name, 1 + dayOffset)
  const w = hash01(name, 7 + dayOffset)
  const r = hash01(name, 13 + dayOffset)
  return {
    temperature: Math.round(40 + t * 55), // 40–95°F
    windSpeed: Math.round(w * 32), // 0–32 mph
    rain: Math.round(r * 90), // 0–90%
    humidity: 50,
    visibility: 10,
  }
}

const colorScale = scaleLinear()
  .domain([0, 50, 80, 100])
  .range(['#ef4444', '#ef4444', '#f59e0b', '#22c55e'])

export default function MapView() {
  const { mode, modeObj, accent } = useAppState()
  const [hover, setHover] = useState(null) // { name, score, cond }
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [selected, setSelected] = useState(null) // { name, week }

  const scoreFor = useMemo(
    () => (name, off = 0) =>
      scoreForMode(mode, { ...defaultFactors(), ...stateConditions(name, off) }, {}),
    [mode]
  )

  function selectState(name) {
    const week = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => ({
      day,
      score: scoreFor(name, i + 1),
    }))
    setSelected({ name, week, cond: stateConditions(name), score: scoreFor(name) })
  }

  return (
    <div className="min-h-screen w-full" style={{ background: '#07080f' }}>
      <div className="mx-auto max-w-[1280px] px-5 py-8">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <span>{modeObj.icon}</span> {modeObj.label} — US Map
            </h1>
            <p className="text-text-muted text-sm">
              States colored by score. Hover for conditions, click for the 7-day outlook.
            </p>
          </div>
          <NavBar accent={accent} />
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mt-4">
          {/* Map */}
          <div
            className="relative lg:flex-1 rounded-2xl bg-bg-device border border-border p-2"
            onMouseMove={(e) => setPos({ x: e.clientX, y: e.clientY })}
          >
            <ComposableMap projection="geoAlbersUsa" style={{ width: '100%', height: 'auto' }}>
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const name = geo.properties.name
                    const s = scoreFor(name)
                    const isSel = selected?.name === name
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        onMouseEnter={() =>
                          setHover({ name, score: s, cond: stateConditions(name) })
                        }
                        onMouseLeave={() => setHover(null)}
                        onClick={() => selectState(name)}
                        style={{
                          default: {
                            fill: colorScale(s),
                            stroke: '#07080f',
                            strokeWidth: 0.6,
                            outline: 'none',
                            opacity: isSel ? 1 : 0.82,
                          },
                          hover: { fill: colorScale(s), outline: 'none', opacity: 1, cursor: 'pointer' },
                          pressed: { fill: colorScale(s), outline: 'none' },
                        }}
                      />
                    )
                  })
                }
              </Geographies>
            </ComposableMap>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2 text-[10px] text-text-muted">
              <span>Poor</span>
              <span className="h-2 w-28 rounded-full" style={{ background: 'linear-gradient(90deg,#ef4444,#f59e0b,#22c55e)' }} />
              <span>Prime</span>
            </div>
          </div>

          {/* Side panel */}
          <div className="lg:w-[320px] rounded-2xl bg-bg-device border border-border p-5">
            {selected ? (
              <>
                <div className="text-white font-bold text-lg">{selected.name}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className="rounded-full text-white font-bold flex items-center justify-center"
                    style={{ width: 36, height: 36, background: scoreColor(selected.score) }}
                  >
                    {selected.score}
                  </span>
                  <span className="text-text-muted text-xs">
                    {selected.cond.temperature}°F · {selected.cond.windSpeed} mph ·{' '}
                    {selected.cond.rain}% rain
                  </span>
                </div>

                <div className="mt-5 text-[9px] font-bold uppercase tracking-widest text-text-muted mb-2">
                  7-Day {modeObj.label} Outlook
                </div>
                <div style={{ height: 200 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={selected.week} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                      <XAxis
                        dataKey="day"
                        tick={{ fill: '#4a5280', fontSize: 10 }}
                        axisLine={{ stroke: '#1c1f2e' }}
                        tickLine={false}
                      />
                      <YAxis domain={[0, 100]} hide />
                      <RTooltip
                        contentStyle={{
                          background: '#0e1018',
                          border: '1px solid #1c1f2e',
                          borderRadius: 8,
                          fontSize: 12,
                        }}
                        labelStyle={{ color: '#6878a8' }}
                        formatter={(v) => [v, 'Score']}
                      />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke={accent}
                        strokeWidth={2}
                        dot={{ r: 3, fill: accent }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </>
            ) : (
              <div className="text-text-muted text-sm flex items-center justify-center h-full text-center">
                Click a state to see its 7-day {modeObj.label.toLowerCase()} forecast.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hover tooltip */}
      {hover && (
        <div
          className="fixed z-50 pointer-events-none rounded-lg px-3 py-2 text-xs bg-bg-device border border-border shadow-lg"
          style={{ left: pos.x + 14, top: pos.y + 14 }}
        >
          <div className="text-white font-semibold">{hover.name}</div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span
              className="rounded-full text-white font-bold flex items-center justify-center"
              style={{ width: 20, height: 20, fontSize: 10, background: scoreColor(hover.score) }}
            >
              {hover.score}
            </span>
            <span className="text-text-muted">
              {hover.cond.temperature}°F · {hover.cond.windSpeed} mph · {hover.cond.rain}%
            </span>
          </div>
        </div>
      )}

      <p className="text-center text-text-muted text-[11px] pb-6">
        Regional scores are simulated for demonstration (live per-state weather would require 50
        API calls). The active mode drives the coloring.
      </p>
    </div>
  )
}
