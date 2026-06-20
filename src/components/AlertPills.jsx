// Builds up to a handful of dynamic status pills from the current factors.
// Returns the two highest-priority pills (spec: two pills at device bottom).

function buildAlerts({ score, factors }) {
  const alerts = []
  const { rain, windSpeed, temperature, hazards = {} } = factors

  if (hazards.ice) alerts.push({ sev: 'red', text: '🧊 Ice hazard active' })
  if (rain > 60) alerts.push({ sev: 'red', text: '🌧 Heavy rain — slick roads' })
  else if (rain > 30) alerts.push({ sev: 'amber', text: '🌧 Rain risk — slick roads ahead' })
  if (windSpeed > 30) alerts.push({ sev: 'amber', text: '💨 High winds — crosswind caution' })
  if (temperature < 45) alerts.push({ sev: 'amber', text: '🥶 Cold temps — gear up' })
  if (hazards.fog) alerts.push({ sev: 'amber', text: '🌫 Fog — reduced visibility' })

  if (score > 80) alerts.unshift({ sev: 'green', text: '✅ Great conditions — ride on' })
  else if (alerts.length === 0)
    alerts.push({ sev: 'amber', text: '⚠️ Mixed conditions — ride aware' })

  return alerts
}

const SEV_STYLE = {
  green: 'bg-score-green/15 text-score-green border border-score-green/30',
  amber: 'bg-score-amber/15 text-score-amber border border-score-amber/30',
  red: 'bg-score-red/15 text-score-red border border-score-red/30',
}

export default function AlertPills({ score, factors }) {
  const alerts = buildAlerts({ score, factors }).slice(0, 2)
  return (
    <div className="flex flex-col gap-2 w-full">
      {alerts.map((a, i) => (
        <div
          key={i}
          className={`flex items-center justify-center rounded-full px-3 text-[11px] font-medium ${SEV_STYLE[a.sev]}`}
          style={{ height: 28 }}
        >
          {a.text}
        </div>
      ))}
    </div>
  )
}
