import { useMemo, useState } from 'react'
import Device from './components/Device.jsx'
import ConditionsPanel, { RiderToggles } from './components/ConditionsPanel.jsx'
import HazardChips from './components/HazardChips.jsx'
import ForecastStrip from './components/ForecastStrip.jsx'
import MotorcycleSilhouette from './components/MotorcycleSilhouette.jsx'
import { computeScore, scoreColor } from './engine/scoreEngine.js'
import { fetchCityWeather, getMockData, MOCK_CURRENT } from './api/nwsClient.js'

const initial = getMockData()

function nowStamp() {
  return new Date().toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export default function App() {
  const [factors, setFactors] = useState({
    temperature: MOCK_CURRENT.temperature,
    windSpeed: MOCK_CURRENT.windSpeed,
    rain: MOCK_CURRENT.rain,
    humidity: MOCK_CURRENT.humidity,
    visibility: MOCK_CURRENT.visibility,
    roadQuality: 7,
    traffic: 4,
  })
  const [hazards, setHazards] = useState({})
  const [toggles, setToggles] = useState({
    expertRider: false,
    nightRiding: false,
    highwayMode: false,
  })
  const [location, setLocation] = useState(initial.location)
  const [week, setWeek] = useState(initial.week)
  const [updatedAt, setUpdatedAt] = useState(nowStamp())
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [notice, setNotice] = useState('')

  const score = useMemo(
    () =>
      computeScore({
        ...factors,
        hazards,
        expertRider: toggles.expertRider,
        nightRiding: toggles.nightRiding,
        highwayMode: toggles.highwayMode,
      }),
    [factors, hazards, toggles]
  )

  const color = scoreColor(score)

  function setFactor(key, value) {
    setFactors((f) => ({ ...f, [key]: value }))
  }
  function toggleHazard(key) {
    setHazards((h) => ({ ...h, [key]: !h[key] }))
  }
  function setToggle(key) {
    setToggles((t) => ({ ...t, [key]: !t[key] }))
  }

  async function handleSearch(e) {
    e?.preventDefault?.()
    const q = query.trim()
    if (!q || loading) return
    setLoading(true)
    setNotice('')
    const data = await fetchCityWeather(q)
    setFactors((f) => ({
      ...f,
      temperature: data.current.temperature,
      windSpeed: data.current.windSpeed,
      rain: data.current.rain,
      humidity: data.current.humidity,
      visibility: data.current.visibility,
    }))
    setLocation(data.location)
    setWeek(data.week)
    setUpdatedAt(nowStamp() + (data.isMock ? ' · demo data' : ''))
    setNotice(
      data.isMock
        ? `Couldn't find live weather for "${q}" — showing demo data. (US cities only.)`
        : ''
    )
    setLoading(false)
  }

  return (
    <div className="min-h-screen w-full" style={{ background: '#07080f', '--thumb-color': color }}>
      <div className="mx-auto max-w-[1200px] px-5 py-8 flex flex-col lg:flex-row gap-8">
        {/* LEFT — device (60%) */}
        <div className="lg:w-[60%] relative flex items-center justify-center">
          {/* Faint motorcycle backdrop, tinted to the live score color */}
          <MotorcycleSilhouette
            className="pointer-events-none absolute inset-0 m-auto w-[115%] max-w-none"
            style={{ color, opacity: 0.06, transition: 'color 600ms ease' }}
          />
          <Device score={score} factors={factors} location={location} updatedAt={updatedAt} />
        </div>

        {/* RIGHT — controls (40%) */}
        <div className="lg:w-[40%]">
          <div className="lg:sticky lg:top-8 lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto no-scrollbar flex flex-col gap-6 pr-1">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search city..."
                className="flex-1 bg-bg-tile border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent"
              />
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg px-4 py-2 text-sm font-semibold text-white flex items-center justify-center min-w-[88px]"
                style={{ background: '#3b6fd4', opacity: loading ? 0.7 : 1 }}
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  'Search'
                )}
              </button>
            </form>

            {notice && (
              <div
                className="-mt-3 rounded-lg px-3 py-2 text-xs"
                style={{
                  background: 'rgba(245,158,11,0.12)',
                  border: '1px solid rgba(245,158,11,0.3)',
                  color: '#f59e0b',
                }}
              >
                {notice}
              </div>
            )}

            <ConditionsPanel factors={factors} setFactor={setFactor} scoreColorValue={color} />

            {/* Hazards */}
            <div>
              <div
                className="font-bold uppercase mb-3"
                style={{ fontSize: 9, letterSpacing: '0.15em', color: '#4a5280' }}
              >
                Hazards
              </div>
              <HazardChips hazards={hazards} onToggle={toggleHazard} />
            </div>

            {/* Rider */}
            <RiderToggles toggles={toggles} setToggle={setToggle} />

            {/* This week */}
            <div>
              <div
                className="font-bold uppercase mb-3"
                style={{ fontSize: 9, letterSpacing: '0.15em', color: '#4a5280' }}
              >
                This Week
              </div>
              <ForecastStrip week={week} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
