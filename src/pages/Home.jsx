import Device from '../components/Device.jsx'
import ConditionsPanel, { RiderToggles } from '../components/ConditionsPanel.jsx'
import HazardChips from '../components/HazardChips.jsx'
import ForecastStrip from '../components/ForecastStrip.jsx'
import ModeSwitcher from '../components/ModeSwitcher.jsx'
import NavBar from '../components/NavBar.jsx'
import HeroMedia from '../components/HeroMedia.jsx'
import { useAppState } from '../state/AppState.jsx'

function SectionLabel({ children }) {
  return (
    <div
      className="font-bold uppercase mb-3"
      style={{ fontSize: 9, letterSpacing: '0.15em', color: '#4a5280' }}
    >
      {children}
    </div>
  )
}

export default function Home() {
  const {
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
  } = useAppState()

  return (
    <div className="min-h-screen w-full" style={{ background: '#07080f', '--thumb-color': color }}>
      {/* HERO — per-activity video + poster, full width */}
      <div className="relative w-full overflow-hidden h-[40vh] min-h-[280px] max-h-[440px]">
        <HeroMedia modeKey={mode} color={color} dark={0.45} />
        <div className="absolute top-4 right-4 z-10">
          <NavBar accent={accent} />
        </div>
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center pb-6 text-center">
          <h1 className="font-extrabold text-white" style={{ fontSize: 40, letterSpacing: '0.18em' }}>
            MOTOMETER
          </h1>
          <p className="text-text-muted" style={{ fontSize: 12, letterSpacing: '0.08em' }}>
            Premium {modeObj.label.toLowerCase()} ride-condition scoring
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-5 pb-10 pt-6 relative">
        {/* Mode switcher */}
        <div className="mb-6">
          <ModeSwitcher mode={mode} setMode={setMode} />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT — device */}
          <div className="lg:w-[60%] flex items-start justify-center">
            <Device
              score={score}
              factors={factors}
              location={location}
              updatedAt={updatedAt}
              modeObj={modeObj}
            />
          </div>

          {/* RIGHT — controls */}
          <div className="lg:w-[40%]">
            <div className="lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto no-scrollbar flex flex-col gap-6 pr-1">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSearch(query)
                }}
                className="flex gap-2"
              >
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
                  style={{ background: accent, opacity: loading ? 0.7 : 1 }}
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

              <ConditionsPanel
                factors={factors}
                setFactor={setFactor}
                scoreColorValue={color}
                factorKeys={modeObj.factors}
              />

              {modeObj.hasHazards && (
                <div>
                  <SectionLabel>Hazards</SectionLabel>
                  <HazardChips hazards={hazards} onToggle={toggleHazard} />
                </div>
              )}

              {modeObj.hasRider && <RiderToggles toggles={toggles} setToggle={setToggle} />}

              <div>
                <SectionLabel>This Week</SectionLabel>
                <ForecastStrip week={scoredWeek} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
