// All National Weather Service + Census geocoder fetch logic.
// On ANY failure at any step we silently fall back to mock data.

import { computeScore } from '../engine/scoreEngine.js'

const NWS_HEADERS = {
  // NWS asks for a User-Agent identifying the app; harmless in browsers.
  Accept: 'application/geo+json',
}

// ---------------------------------------------------------------------------
// Mock fallback
// ---------------------------------------------------------------------------

export const MOCK_CURRENT = {
  temperature: 74,
  windSpeed: 11,
  rain: 0,
  humidity: 55,
  visibility: 10,
}

const MOCK_WEEK = [
  { day: 'Mon', score: 81, temp: 74, forecast: 'Sunny' },
  { day: 'Tue', score: 73, temp: 79, forecast: 'Partly Cloudy' },
  { day: 'Wed', score: 44, temp: 68, forecast: 'Rain' },
  { day: 'Thu', score: 36, temp: 61, forecast: 'Heavy Rain' },
  { day: 'Fri', score: 65, temp: 71, forecast: 'Cloudy' },
  { day: 'Sat', score: 92, temp: 77, forecast: 'Sunny' },
  { day: 'Sun', score: 88, temp: 76, forecast: 'Clear' },
]

export function getMockData() {
  return {
    location: 'Austin, TX',
    current: { ...MOCK_CURRENT },
    week: MOCK_WEEK.map((d) => ({ ...d })),
    isMock: true,
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function getJSON(url, opts = {}) {
  const res = await fetch(url, { headers: NWS_HEADERS, ...opts })
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  return res.json()
}

function cToF(c) {
  return c * (9 / 5) + 32
}

// "10 mph" -> 10 ; "5 to 10 mph" -> 10
function parseWindString(s) {
  if (typeof s !== 'number' && !s) return 0
  if (typeof s === 'number') return Math.round(s)
  const nums = String(s).match(/\d+/g)
  if (!nums) return 0
  return Math.max(...nums.map(Number))
}

function rainFromWeather(shortForecast = '', presentWeather = []) {
  const text = (shortForecast || '').toLowerCase()
  const codes = (presentWeather || [])
    .map((w) => (w.rawString || w.weather || '') + '')
    .join(' ')
    .toUpperCase()
  if (/RA|TSRA|SN/.test(codes)) return 75
  if (/rain|shower|thunder|storm|snow|sleet/.test(text)) return 70
  if (/clear|sunny|fair/.test(text)) return 0
  return 20
}

function dayAbbrev(name = '') {
  const map = {
    monday: 'Mon',
    tuesday: 'Tue',
    wednesday: 'Wed',
    thursday: 'Thu',
    friday: 'Fri',
    saturday: 'Sat',
    sunday: 'Sun',
  }
  const key = name.toLowerCase().replace(/ night$/, '')
  if (map[key]) return map[key]
  if (/today|this afternoon/i.test(name)) return 'Today'
  if (/tonight/i.test(name)) return 'Ton'
  return name.slice(0, 3)
}

// ---------------------------------------------------------------------------
// Main flow
// ---------------------------------------------------------------------------

// Step 0: city -> lat/lon.
// Primary: Open-Meteo geocoder (free, no key) — handles bare city names, which
// the Census onelineaddress geocoder does NOT (it only matches street addresses).
// Fallback: Census geocoder for full street addresses.
async function geocodeCity(city) {
  // --- Open-Meteo (city names) ---
  try {
    const url =
      'https://geocoding-api.open-meteo.com/v1/search' +
      `?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
    const data = await getJSON(url, { headers: { Accept: 'application/json' } })
    const r = data?.results?.[0]
    if (r && r.latitude != null && r.longitude != null) {
      const label = [r.name, r.admin1].filter(Boolean).join(', ')
      return { lat: r.latitude, lon: r.longitude, label }
    }
  } catch {
    // fall through to Census
  }

  // --- Census (street addresses) ---
  const url =
    'https://geocoding.geo.census.gov/geocoder/locations/onelineaddress' +
    `?address=${encodeURIComponent(city)}&benchmark=2020&format=json`
  const data = await getJSON(url, { headers: { Accept: 'application/json' } })
  const match = data?.result?.addressMatches?.[0]
  if (!match) throw new Error('No geocode match')
  const { x: lon, y: lat } = match.coordinates
  const label = match.matchedAddress || city
  return { lat, lon, label }
}

async function fetchCurrent(observationStationsUrl) {
  const stations = await getJSON(observationStationsUrl)
  const stationId = stations?.features?.[0]?.properties?.stationIdentifier
  if (!stationId) throw new Error('No observation station')
  const obs = await getJSON(
    `https://api.weather.gov/stations/${stationId}/observations/latest`
  )
  const p = obs?.properties || {}
  const tempC = p.temperature?.value
  const visM = p.visibility?.value
  return {
    temperature:
      tempC == null ? MOCK_CURRENT.temperature : Math.round(cToF(tempC)),
    windSpeed:
      p.windSpeed?.value == null
        ? MOCK_CURRENT.windSpeed
        : Math.round(p.windSpeed.value * 2.237),
    rain: rainFromWeather('', p.presentWeather || []),
    humidity:
      p.relativeHumidity?.value == null
        ? MOCK_CURRENT.humidity
        : Math.round(p.relativeHumidity.value),
    visibility:
      visM == null ? MOCK_CURRENT.visibility : Math.min(10, +(visM / 1609).toFixed(1)),
  }
}

async function fetchWeek(forecastUrl) {
  const fc = await getJSON(forecastUrl)
  const periods = fc?.properties?.periods || []
  // Group: take the daytime period for each day.
  const days = periods.filter((p) => p.isDaytime).slice(0, 7)
  const source = days.length ? days : periods.slice(0, 7)
  return source.map((p) => {
    const temp = p.temperature
    const wind = parseWindString(p.windSpeed)
    const rain = p.probabilityOfPrecipitation?.value ?? rainFromWeather(p.shortForecast)
    const score = computeScore({
      temperature: temp,
      windSpeed: wind,
      rain,
      humidity: 55,
      visibility: 10,
      roadQuality: 7,
      traffic: 4,
    })
    return {
      day: dayAbbrev(p.name),
      score,
      temp,
      forecast: p.shortForecast || '',
    }
  })
}

/**
 * Full city lookup chain. Never throws — returns mock data on any failure.
 * @returns {Promise<{location, current, week, isMock}>}
 */
export async function fetchCityWeather(city) {
  try {
    const { lat, lon, label } = await geocodeCity(city)
    const points = await getJSON(
      `https://api.weather.gov/points/${lat.toFixed(4)},${lon.toFixed(4)}`
    )
    const props = points?.properties
    if (!props) throw new Error('No grid point')

    // current + forecast can be fetched in parallel
    const [current, week] = await Promise.all([
      fetchCurrent(props.observationStations),
      fetchWeek(props.forecast),
    ])

    return {
      location: label,
      current,
      week: week.length ? week : getMockData().week,
      isMock: false,
    }
  } catch (err) {
    // Silent fallback per spec.
    console.warn('[MotoMeter] NWS fetch failed, using mock data:', err.message)
    return getMockData()
  }
}
