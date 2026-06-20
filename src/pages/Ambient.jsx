import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import GaugeArc from '../components/GaugeArc.jsx'
import { useAppState } from '../state/AppState.jsx'
import { MODE_LIST, scoreForMode } from '../config/modes.js'
import { scoreColor } from '../engine/scoreEngine.js'

export default function Ambient() {
  const { factors, hazards, toggles, location } = useAppState()
  const [idx, setIdx] = useState(0)
  const [clock, setClock] = useState('')

  // Auto-cycle through modes every 30s.
  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % MODE_LIST.length), 30 * 1000)
    return () => clearInterval(id)
  }, [])

  // Tick the clock each second.
  useEffect(() => {
    const tick = () =>
      setClock(
        new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
      )
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const mode = MODE_LIST[idx]
  const extras = useMemo(
    () => ({
      hazards,
      expertRider: toggles.expertRider,
      nightRiding: toggles.nightRiding,
      highwayMode: toggles.highwayMode,
    }),
    [hazards, toggles]
  )
  const score = scoreForMode(mode.key, factors, extras)
  const color = scoreColor(score)

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center"
      style={{ background: '#050609' }}
    >
      {/* Backlight glow filling the background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(60% 60% at 50% 45%, ${color} 0%, transparent 70%)`,
          opacity: 0.28,
          transition: 'background 900ms ease, opacity 900ms ease',
        }}
      />

      {/* Clock + location top bar */}
      <div className="absolute top-0 inset-x-0 flex items-center justify-between p-8 z-10">
        <div className="text-white/90 font-extrabold" style={{ fontSize: 28 }}>
          {clock}
        </div>
        <div className="text-right">
          <div className="text-white/80 text-sm">{location}</div>
          <Link to="/" className="text-white/40 text-xs hover:text-white/70">
            exit ambient
          </Link>
        </div>
      </div>

      {/* Center: mode + huge gauge */}
      <div className="relative z-10 flex flex-col items-center">
        <div
          className="flex items-center gap-2 mb-2 font-bold uppercase"
          style={{ fontSize: 16, letterSpacing: '0.25em', color: mode.accent }}
        >
          <span style={{ fontSize: 24 }}>{mode.icon}</span>
          {mode.label}
        </div>

        <div style={{ transform: 'scale(2.1)', transformOrigin: 'top center', marginTop: 40 }}>
          <GaugeArc score={score} />
        </div>

        {/* Mode dots */}
        <div className="flex gap-2 mt-[260px]">
          {MODE_LIST.map((m, i) => (
            <span
              key={m.key}
              className="rounded-full transition-all"
              style={{
                width: i === idx ? 22 : 7,
                height: 7,
                background: i === idx ? m.accent : '#2a2d3e',
              }}
            />
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 text-white/30 text-xs z-10">
        Cycling every 30s · MotoMeter Ambient
      </div>
    </div>
  )
}
