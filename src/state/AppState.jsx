import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { defaultFactors } from '../config/factors.js'
import { MODES, DEFAULT_MODE, scoreForMode, notifyCopy } from '../config/modes.js'
import { scoreColor } from '../engine/scoreEngine.js'
import { fetchCityWeather, getMockData } from '../api/nwsClient.js'
import {
  loadSettings,
  saveSettings as persist,
  useNotificationScheduler,
} from '../notifications/notify.js'

const Ctx = createContext(null)
export const useAppState = () => useContext(Ctx)

function nowStamp() {
  return new Date().toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

// Score a single raw forecast day for a mode (forecast lacks humidity/visibility).
function scoreDay(modeKey, d) {
  return scoreForMode(
    modeKey,
    { ...defaultFactors(), temperature: d.temp, windSpeed: d.wind, rain: d.rain },
    {}
  )
}

export function AppStateProvider({ children }) {
  const initial = useMemo(() => getMockData(), [])

  const [mode, setMode] = useState(DEFAULT_MODE)
  const [factors, setFactors] = useState(() => ({
    ...defaultFactors(),
    temperature: initial.current.temperature,
    windSpeed: initial.current.windSpeed,
    rain: initial.current.rain,
    humidity: initial.current.humidity,
    visibility: initial.current.visibility,
  }))
  const [hazards, setHazards] = useState({})
  const [toggles, setToggles] = useState({
    expertRider: false,
    nightRiding: false,
    highwayMode: false,
  })
  const [location, setLocation] = useState(initial.location)
  const [week, setWeek] = useState(initial.week) // raw daily factors
  const [updatedAt, setUpdatedAt] = useState(nowStamp())
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [notice, setNotice] = useState('')
  const [settings, setSettings] = useState(() => loadSettings())

  const extras = useMemo(
    () => ({
      hazards,
      expertRider: toggles.expertRider,
      nightRiding: toggles.nightRiding,
      highwayMode: toggles.highwayMode,
    }),
    [hazards, toggles]
  )

  const score = useMemo(() => scoreForMode(mode, factors, extras), [mode, factors, extras])
  const color = scoreColor(score)
  const modeObj = MODES[mode]
  const accent = modeObj.accent

  const scoredWeek = useMemo(
    () => week.map((d) => ({ ...d, score: scoreDay(mode, d) })),
    [week, mode]
  )

  const setFactor = useCallback((key, value) => setFactors((f) => ({ ...f, [key]: value })), [])
  const toggleHazard = useCallback((key) => setHazards((h) => ({ ...h, [key]: !h[key] })), [])
  const setToggle = useCallback((key) => setToggles((t) => ({ ...t, [key]: !t[key] })), [])

  const saveSettings = useCallback((next) => {
    setSettings(next)
    persist(next)
  }, [])

  const handleSearch = useCallback(
    async (q) => {
      const term = (q ?? '').trim()
      if (!term) return
      setLoading(true)
      setNotice('')
      const data = await fetchCityWeather(term)
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
          ? `Couldn't find live weather for "${term}" — showing demo data. (US cities only.)`
          : ''
      )
      setLoading(false)
    },
    []
  )

  // Wire the notification scheduler to live state.
  const copy = useMemo(() => notifyCopy(mode, location), [mode, location])
  useNotificationScheduler({ settings, score, scoredWeek, copy })

  const value = {
    mode,
    setMode,
    modeObj,
    factors,
    setFactor,
    hazards,
    toggleHazard,
    toggles,
    setToggle,
    location,
    week,
    scoredWeek,
    score,
    color,
    accent,
    updatedAt,
    query,
    setQuery,
    loading,
    notice,
    handleSearch,
    settings,
    saveSettings,
  }

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
