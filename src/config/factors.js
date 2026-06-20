// All possible condition factors. Each mode picks the subset it cares about.
// `default` seeds state; min/max/step/unit drive the sliders.
export const FACTOR_DEFS = {
  temperature: { key: 'temperature', label: 'Temperature', min: 0, max: 120, step: 1, unit: '°F', default: 72 },
  windSpeed: { key: 'windSpeed', label: 'Wind Speed', min: 0, max: 60, step: 1, unit: 'mph', default: 8 },
  rain: { key: 'rain', label: 'Precipitation', min: 0, max: 100, step: 1, unit: '%', default: 0 },
  humidity: { key: 'humidity', label: 'Humidity', min: 0, max: 100, step: 1, unit: '%', default: 50 },
  visibility: { key: 'visibility', label: 'Visibility', min: 0, max: 10, step: 0.1, unit: 'mi', default: 10 },
  roadQuality: { key: 'roadQuality', label: 'Road Quality', min: 1, max: 10, step: 1, unit: '/10', default: 7 },
  traffic: { key: 'traffic', label: 'Traffic Density', min: 0, max: 10, step: 1, unit: '/10', default: 4 },
}

// Seed every factor to its default; modes only read the keys they use.
export function defaultFactors() {
  const f = {}
  for (const k of Object.keys(FACTOR_DEFS)) f[k] = FACTOR_DEFS[k].default
  return f
}
