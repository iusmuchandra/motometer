import GaugeArc from './GaugeArc.jsx'
import AlertPills from './AlertPills.jsx'
import { scoreGlow } from '../engine/scoreEngine.js'

function Tile({ icon, value, label }) {
  return (
    <div className="flex-1 flex flex-col items-center gap-1 bg-bg-tile rounded-lg py-3 px-2">
      <span style={{ fontSize: 20 }}>{icon}</span>
      <span className="font-bold text-white" style={{ fontSize: 20 }}>
        {value}
      </span>
      <span
        className="text-text-muted font-semibold uppercase"
        style={{ fontSize: 9, letterSpacing: '0.12em' }}
      >
        {label}
      </span>
    </div>
  )
}

export default function Device({ score, factors, location, updatedAt, modeObj }) {
  return (
    <div
      className="relative bg-bg-device border border-border rounded-[24px]"
      style={{
        width: 480,
        height: 580,
        maxWidth: '100%',
        boxShadow: `inset 0 2px 24px rgba(0,0,0,0.6), ${scoreGlow(score)}`,
        transition: 'box-shadow 600ms ease',
      }}
    >
      <div className="flex flex-col h-full p-5">
        {/* Header */}
        <div className="text-center">
          <div
            className="font-semibold flex items-center justify-center gap-1.5"
            style={{ fontSize: 10, letterSpacing: '0.2em', color: modeObj?.accent || '#4a5280' }}
          >
            {modeObj?.icon} {(modeObj?.label || 'MOTOMETER').toUpperCase()}
          </div>
          <div className="mt-1" style={{ fontSize: 12, color: '#6878a8' }}>
            {location}
          </div>
          <div className="text-text-muted" style={{ fontSize: 10 }}>
            {updatedAt}
          </div>
        </div>

        {/* Gauge */}
        <div className="flex-1 flex items-center justify-center">
          <GaugeArc score={score} />
        </div>

        {/* Tiles */}
        <div className="flex gap-2">
          <Tile icon="🌡" value={`${Math.round(factors.temperature)}°`} label="Temp" />
          <Tile icon="💨" value={`${Math.round(factors.windSpeed)}`} label="Wind mph" />
          <Tile
            icon="👁"
            value={`${factors.visibility}`}
            label="Vis mi"
          />
        </div>

        {/* Alert pills */}
        <div className="mt-3">
          <AlertPills score={score} factors={factors} />
        </div>
      </div>
    </div>
  )
}
