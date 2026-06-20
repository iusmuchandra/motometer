import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { scoreColor } from '../engine/scoreEngine.js'

function weatherEmoji(forecast = '') {
  const t = forecast.toLowerCase()
  if (/thunder|storm/.test(t)) return '⛈'
  if (/snow|sleet|flurr/.test(t)) return '❄️'
  if (/rain|shower|drizzle/.test(t)) return '🌧'
  if (/fog|haze|mist/.test(t)) return '🌫'
  if (/partly|few clouds/.test(t)) return '⛅️'
  if (/cloud|overcast/.test(t)) return '☁️'
  if (/clear|sunny|fair/.test(t)) return '☀️'
  return '🌤'
}

// Custom dot colored per score.
function ScoreDot({ cx, cy, payload }) {
  if (cx == null || cy == null) return null
  return <circle cx={cx} cy={cy} r={4} fill={scoreColor(payload.score)} stroke="#07080f" strokeWidth={1.5} />
}

export default function ForecastStrip({ week }) {
  if (!week?.length) return null

  const best = week.reduce((a, b) => (b.score > a.score ? b : a))
  const worst = week.reduce((a, b) => (b.score < a.score ? b : a))

  return (
    <div>
      {/* Cards */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {week.map((d, i) => {
          const isBest = d === best
          const isWorst = d === worst
          return (
            <div
              key={i}
              className="flex-shrink-0 flex flex-col items-center gap-1.5 bg-bg-tile rounded-lg py-2"
              style={{ width: 80, borderBottom: isWorst ? '2px solid rgba(239,68,68,0.5)' : '2px solid transparent' }}
            >
              <span className="text-xs text-text-primary/70 font-medium">{d.day}</span>
              <div
                className="flex items-center justify-center rounded-full text-white font-bold"
                style={{ width: 28, height: 28, fontSize: 12, background: scoreColor(d.score) }}
              >
                {d.score}
              </div>
              {isBest && (
                <span className="text-score-green font-bold" style={{ fontSize: 8, letterSpacing: '0.1em' }}>
                  PRIME
                </span>
              )}
              <span style={{ fontSize: 16 }}>{weatherEmoji(d.forecast)}</span>
              <span className="text-xs text-text-primary/80 font-semibold">{Math.round(d.temp)}°</span>
            </div>
          )
        })}
      </div>

      {/* Line chart */}
      <div style={{ height: 240 }} className="mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={week} margin={{ top: 16, right: 12, left: 12, bottom: 0 }}>
            <XAxis
              dataKey="day"
              tick={{ fill: '#4a5280', fontSize: 11 }}
              axisLine={{ stroke: '#1c1f2e' }}
              tickLine={false}
            />
            <YAxis domain={[0, 100]} hide />
            <Tooltip
              contentStyle={{
                background: '#0e1018',
                border: '1px solid #1c1f2e',
                borderRadius: 8,
                fontSize: 12,
              }}
              labelStyle={{ color: '#6878a8' }}
              itemStyle={{ color: '#e8eaf2' }}
              formatter={(v) => [v, 'Score']}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#3b6fd4"
              strokeWidth={2}
              dot={<ScoreDot />}
              activeDot={{ r: 5 }}
              isAnimationActive
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
