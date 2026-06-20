// MotoMeter scoring engine — pure, deterministic.
// computeScore(factors) -> integer 0..100

const HAZARD_DEDUCTIONS = {
  deer: 6,
  insects: 4,
  ice: 22,
  gravel: 8,
  fog: 13,
  construction: 6,
  sand: 5,
  livestock: 10,
}

/**
 * @param {object} f
 * @param {number} f.temperature   °F
 * @param {number} f.windSpeed     mph
 * @param {number} f.rain          0..100 (%)
 * @param {number} f.humidity      0..100 (%)
 * @param {number} f.visibility    miles (0..10)
 * @param {number} f.roadQuality   1..10
 * @param {number} f.traffic       0..10
 * @param {object} [f.hazards]     { deer, insects, ice, ... } booleans
 * @param {boolean} [f.expertRider]
 * @param {boolean} [f.nightRiding]
 * @param {boolean} [f.highwayMode]
 * @returns {number}
 */
export function computeScore(f = {}) {
  const {
    temperature = 70,
    windSpeed = 0,
    rain = 0,
    humidity = 50,
    visibility = 10,
    roadQuality = 7,
    traffic = 4,
    hazards = {},
    expertRider = false,
    nightRiding = false,
  } = f

  let score = 95

  // Temperature
  if (temperature < 35) score -= 30
  else if (temperature < 45) score -= 20
  else if (temperature < 55) score -= 10
  if (temperature > 105) score -= 20
  else if (temperature > 95) score -= 10

  // Wind (expert riders shrug off 30% of the wind penalty)
  let windDeduction = 0
  if (windSpeed > 40) windDeduction = 30
  else if (windSpeed > 30) windDeduction = 20
  else if (windSpeed > 20) windDeduction = 12
  else if (windSpeed > 10) windDeduction = 5
  if (expertRider) windDeduction *= 0.7
  score -= windDeduction

  // Rain
  if (rain > 60) score -= 35
  else if (rain > 30) score -= 22
  else if (rain > 10) score -= 10

  // Humidity
  if (humidity > 85) score -= 6
  else if (humidity > 75) score -= 3

  // Visibility
  if (visibility < 2) score -= 22
  else if (visibility < 4) score -= 12
  else if (visibility < 6) score -= 5

  // Road quality (centered at 5)
  score += (roadQuality - 5) * 2.5

  // Traffic
  if (traffic > 7) score -= 8
  else if (traffic > 5) score -= 4

  // Hazards
  for (const key of Object.keys(HAZARD_DEDUCTIONS)) {
    if (hazards[key]) score -= HAZARD_DEDUCTIONS[key]
  }

  // Night riding
  if (nightRiding) score -= 8

  return Math.round(Math.max(0, Math.min(100, score)))
}

export { HAZARD_DEDUCTIONS }

// Shared score -> color band helper used across UI components.
export function scoreColor(score) {
  if (score >= 80) return '#22c55e' // green
  if (score >= 50) return '#f59e0b' // amber
  return '#ef4444' // red
}

export function scoreGlow(score) {
  const c = scoreColor(score)
  const rgba = {
    '#22c55e': 'rgba(34,197,94,0.15)',
    '#f59e0b': 'rgba(245,158,11,0.15)',
    '#ef4444': 'rgba(239,68,68,0.15)',
  }[c]
  return `0 0 60px 8px ${rgba}`
}
