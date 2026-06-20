import { motion } from 'framer-motion'
import ScoreNumber from './ScoreNumber.jsx'
import { scoreColor } from '../engine/scoreEngine.js'

// 180° semicircle gauge. score 0 -> needle left, 100 -> needle right.
export default function GaugeArc({ score }) {
  const CX = 150
  const CY = 150
  const R = 120
  const color = scoreColor(score)

  // -90° (left) at score 0, +90° (right) at score 100.
  const angle = (Math.min(100, Math.max(0, score)) - 50) / 50 * 90

  return (
    <div className="relative w-[300px] mx-auto select-none">
      <svg viewBox="0 0 300 180" width="300" height="180">
        <defs>
          <linearGradient id="gaugeTrack" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
        </defs>

        {/* Track */}
        <path
          d={`M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`}
          fill="none"
          stroke="url(#gaugeTrack)"
          strokeWidth="18"
          strokeLinecap="round"
        />

        {/* Needle */}
        <motion.g
          style={{ originX: `${CX}px`, originY: `${CY}px` }}
          initial={{ rotate: -90 }}
          animate={{ rotate: angle }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        >
          <line
            x1={CX}
            y1={CY}
            x2={CX}
            y2={CY - (R - 18)}
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
          />
        </motion.g>

        {/* Pivot */}
        <circle cx={CX} cy={CY} r="7" fill="#0e1018" stroke={color} strokeWidth="2.5" />
      </svg>

      {/* Score number + label, sitting in the open belly of the arc */}
      <div className="absolute inset-x-0 top-[78px] flex flex-col items-center">
        <ScoreNumber
          value={score}
          className="font-extrabold leading-none"
          style={{ fontSize: '72px', color: '#fff' }}
        />
        <span
          className="mt-1 text-text-muted font-semibold"
          style={{ fontSize: '10px', letterSpacing: '0.2em' }}
        >
          RIDE SCORE
        </span>
      </div>
    </div>
  )
}
