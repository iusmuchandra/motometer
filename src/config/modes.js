// Activity modes. Each defines: relevant factors, a pure scoring function,
// an accent color, an emoji icon, and smart notification copy.
import { computeScore as motoScore } from '../engine/scoreEngine.js'

const clamp = (n) => Math.round(Math.max(0, Math.min(100, n)))

// Deduction for the HIGHEST threshold the value exceeds.
// pairs: [[threshold, deduction], ...] ascending by threshold.
function over(value, pairs) {
  let d = 0
  for (const [t, x] of pairs) if (value > t) d = x
  return d
}
// Deduction for the LOWEST threshold the value falls under.
// pairs: [[threshold, deduction], ...] descending by threshold.
function under(value, pairs) {
  let d = 0
  for (const [t, x] of pairs) if (value < t) d = x
  return d
}
// Penalty for being outside an ideal [lo, hi] band (used where a mid value is best).
function band(value, lo, hi, perUnit, cap) {
  let off = 0
  if (value < lo) off = (lo - value) * perUnit
  else if (value > hi) off = (value - hi) * perUnit
  return Math.min(cap, off)
}

const SHARED = ['temperature', 'windSpeed', 'rain', 'humidity', 'visibility']

export const MODES = {
  motorcycle: {
    key: 'motorcycle',
    label: 'Motorcycle',
    icon: '🏍',
    accent: '#3b6fd4',
    factors: ['temperature', 'windSpeed', 'rain', 'humidity', 'visibility', 'roadQuality', 'traffic'],
    hasHazards: true,
    hasRider: true,
    // Delegates to the original engine (hazards/rider live in extras).
    score: (f, extras = {}) => motoScore({ ...f, ...extras }),
    tip: 'slick roads & crosswinds',
  },

  cessna: {
    key: 'cessna',
    label: 'Cessna / GA',
    icon: '🛩',
    accent: '#38bdf8',
    factors: SHARED,
    score: (f) =>
      clamp(
        96 -
          under(f.visibility, [[5, 15], [3, 30], [1, 45]]) -
          over(f.windSpeed, [[15, 10], [22, 22], [30, 35]]) -
          over(f.rain, [[30, 12], [60, 25]]) -
          under(f.temperature, [[20, 20]]) -
          over(f.temperature, [[100, 12]])
      ),
    tip: 'low ceilings & gusty crosswinds',
  },

  skydiving: {
    key: 'skydiving',
    label: 'Skydiving',
    icon: '🪂',
    accent: '#f97316',
    factors: SHARED,
    score: (f) =>
      clamp(
        97 -
          over(f.windSpeed, [[9, 6], [12, 15], [18, 30], [25, 50]]) -
          over(f.rain, [[5, 15], [20, 40]]) -
          under(f.visibility, [[8, 12], [5, 30]]) -
          under(f.temperature, [[25, 12]]) -
          over(f.temperature, [[100, 8]])
      ),
    tip: 'upper winds & cloud cover',
  },

  waterski: {
    key: 'waterski',
    label: 'Water Skiing',
    icon: '🎿',
    accent: '#06b6d4',
    factors: SHARED,
    score: (f) =>
      clamp(
        95 -
          over(f.windSpeed, [[5, 4], [9, 12], [14, 25], [20, 40]]) - // chop ruins flat water
          under(f.temperature, [[72, 6], [65, 15], [55, 30]]) -
          over(f.temperature, [[100, 6]]) -
          over(f.rain, [[15, 10], [40, 25]])
      ),
    tip: 'wind chop on the water',
  },

  surfing: {
    key: 'surfing',
    label: 'Surfing',
    icon: '🏄',
    accent: '#2dd4bf',
    factors: SHARED,
    score: (f) =>
      clamp(
        90 -
          over(f.windSpeed, [[12, 8], [18, 18], [25, 30]]) - // onshore chop
          under(f.temperature, [[60, 8], [50, 20]]) -
          over(f.rain, [[50, 12]])
      ),
    tip: 'onshore wind & cold water',
  },

  hunting: {
    key: 'hunting',
    label: 'Hunting',
    icon: '🦌',
    accent: '#b45309',
    factors: SHARED,
    score: (f) =>
      clamp(
        94 -
          over(f.windSpeed, [[18, 12], [25, 25]]) - // scent / unsettled game
          over(f.rain, [[15, 8], [40, 20]]) -
          under(f.visibility, [[5, 10], [2, 25]]) -
          under(f.temperature, [[15, 15]]) -
          over(f.temperature, [[95, 10]])
      ),
    tip: 'wind direction & poor visibility',
  },

  sailing: {
    key: 'sailing',
    label: 'Sailing',
    icon: '⛵️',
    accent: '#6366f1',
    factors: SHARED,
    // Sailing WANTS a moderate breeze (ideal ~10–22 mph).
    score: (f) =>
      clamp(
        95 -
          band(f.windSpeed, 10, 22, 2.2, 30) -
          over(f.windSpeed, [[28, 12], [34, 25]]) - // storm-force on top of band
          over(f.rain, [[20, 8], [50, 18]]) -
          under(f.visibility, [[4, 12], [2, 25]])
      ),
    tip: 'too little or too much wind',
  },

  fishing: {
    key: 'fishing',
    label: 'Fishing',
    icon: '🎣',
    accent: '#10b981',
    factors: SHARED,
    score: (f) =>
      clamp(
        94 -
          over(f.windSpeed, [[12, 6], [18, 15], [25, 30]]) -
          over(f.rain, [[40, 8], [60, 20]]) - // light rain can be fine
          under(f.temperature, [[45, 8], [35, 20]]) -
          over(f.temperature, [[100, 8]])
      ),
    tip: 'high wind & heavy rain',
  },

  hiking: {
    key: 'hiking',
    label: 'Hiking',
    icon: '🥾',
    accent: '#84cc16',
    factors: SHARED,
    score: (f) =>
      clamp(
        96 -
          under(f.temperature, [[45, 8], [35, 18], [25, 30]]) -
          over(f.temperature, [[95, 15], [105, 25]]) -
          over(f.rain, [[10, 5], [25, 12], [50, 25]]) -
          over(f.windSpeed, [[25, 10], [35, 20]]) -
          under(f.visibility, [[4, 6], [2, 15]])
      ),
    tip: 'heat, storms & exposure',
  },

  paragliding: {
    key: 'paragliding',
    label: 'Paragliding',
    icon: '🪂',
    accent: '#a855f7',
    factors: SHARED,
    score: (f) =>
      clamp(
        95 -
          over(f.windSpeed, [[11, 12], [16, 28], [22, 45]]) -
          over(f.rain, [[5, 15], [15, 40]]) -
          under(f.visibility, [[8, 10], [5, 25]]) -
          under(f.temperature, [[35, 12]])
      ),
    tip: 'strong wind & weak lift',
  },

  cycling: {
    key: 'cycling',
    label: 'Road Cycling',
    icon: '🚴',
    accent: '#eab308',
    factors: ['temperature', 'windSpeed', 'rain', 'humidity', 'visibility', 'traffic'],
    score: (f) =>
      clamp(
        96 -
          under(f.temperature, [[45, 12], [35, 25]]) -
          over(f.temperature, [[95, 15], [100, 25]]) -
          over(f.rain, [[10, 6], [25, 15], [50, 30]]) -
          over(f.windSpeed, [[12, 6], [22, 15], [30, 25]]) -
          under(f.visibility, [[4, 8], [2, 20]]) -
          over(f.traffic ?? 4, [[5, 6], [7, 12]])
      ),
    tip: 'wind, rain & traffic',
  },
}

export const MODE_LIST = Object.values(MODES)
export const DEFAULT_MODE = 'motorcycle'

// Score a mode against a factor set (+ motorcycle extras: hazards/rider).
export function scoreForMode(modeKey, factors, extras) {
  const mode = MODES[modeKey] || MODES[DEFAULT_MODE]
  return mode.score(factors, extras)
}

// Smart notification copy, parameterized by mode.
export function notifyCopy(modeKey, location) {
  const m = MODES[modeKey] || MODES[DEFAULT_MODE]
  return {
    morning: (score) =>
      `${m.icon} ${m.label} briefing — ${location}: score ${score}/100. ${
        score >= 80 ? 'Prime day, get out there.' : score >= 50 ? 'Workable, check the details.' : 'Rough conditions today.'
      }`,
    prime: (day, score) =>
      `🔥 Prime ${m.label.toLowerCase()} window: ${day} hits ${score}/100 in ${location}. Block the calendar.`,
    warning: (score) =>
      `⚠️ ${m.label} conditions dropping in ${location} — ${score}/100. Watch for ${m.tip}.`,
  }
}
