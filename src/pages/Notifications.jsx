import { useState } from 'react'
import NavBar from '../components/NavBar.jsx'
import { Toggle } from '../components/ConditionsPanel.jsx'
import { useAppState } from '../state/AppState.jsx'
import { permissionState, requestPermission, sendTest } from '../notifications/notify.js'

const ALERT_TYPES = [
  {
    key: 'morningBriefing',
    title: 'Morning briefing',
    desc: 'A daily summary at 7am with your score and outlook.',
  },
  {
    key: 'primeWindow',
    title: 'Prime window alerts',
    desc: 'When any day in the 7-day forecast scores 90 or above.',
  },
  {
    key: 'conditionWarning',
    title: 'Condition warnings',
    desc: 'When the current score drops below 45.',
  },
]

const HOURS = Array.from({ length: 24 }, (_, i) => i)
const fmtHour = (h) => `${(h % 12) || 12}${h < 12 ? 'am' : 'pm'}`

export default function Notifications() {
  const { settings, saveSettings, accent } = useAppState()
  const [perm, setPerm] = useState(permissionState())

  const set = (patch) => saveSettings({ ...settings, ...patch })

  async function enable() {
    const result = await requestPermission()
    setPerm(result)
    set({ enabled: result === 'granted' })
  }

  return (
    <div className="min-h-screen w-full" style={{ background: '#07080f' }}>
      <div className="mx-auto max-w-[760px] px-5 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-white">Alerts</h1>
            <p className="text-text-muted text-sm">Smart push notifications for ride conditions.</p>
          </div>
          <NavBar accent={accent} />
        </div>

        {/* Permission / master switch */}
        <div className="rounded-xl bg-bg-device border border-border p-5 mb-6">
          {perm === 'unsupported' ? (
            <p className="text-sm text-score-amber">
              This browser doesn't support notifications.
            </p>
          ) : perm !== 'granted' ? (
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-white font-semibold text-sm">Enable notifications</div>
                <div className="text-text-muted text-xs mt-0.5">
                  Grant permission to receive alerts. They fire while MotoMeter is open in a tab.
                </div>
              </div>
              <button
                onClick={enable}
                className="rounded-lg px-4 py-2 text-sm font-semibold text-white flex-shrink-0"
                style={{ background: accent }}
              >
                Allow
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-semibold text-sm">Notifications enabled</div>
                <div className="text-text-muted text-xs mt-0.5">Permission granted.</div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={sendTest}
                  className="rounded-lg px-3 py-1.5 text-xs font-semibold border border-border text-text-primary"
                >
                  Send test
                </button>
                <Toggle on={settings.enabled} onChange={() => set({ enabled: !settings.enabled })} />
              </div>
            </div>
          )}
        </div>

        {/* Alert types */}
        <div className="rounded-xl bg-bg-device border border-border divide-y divide-border mb-6">
          {ALERT_TYPES.map((a) => (
            <div key={a.key} className="flex items-center justify-between gap-4 p-5">
              <div>
                <div className="text-white font-semibold text-sm">{a.title}</div>
                <div className="text-text-muted text-xs mt-0.5">{a.desc}</div>
              </div>
              <Toggle on={settings[a.key]} onChange={() => set({ [a.key]: !settings[a.key] })} />
            </div>
          ))}
        </div>

        {/* Quiet hours */}
        <div className="rounded-xl bg-bg-device border border-border p-5">
          <div className="text-white font-semibold text-sm">Quiet hours</div>
          <div className="text-text-muted text-xs mt-0.5 mb-4">
            No alerts will fire during this window.
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm text-text-primary/80">From</label>
            <select
              value={settings.quietStart}
              onChange={(e) => set({ quietStart: Number(e.target.value) })}
              className="bg-bg-tile border border-border rounded-lg px-3 py-1.5 text-sm text-text-primary"
            >
              {HOURS.map((h) => (
                <option key={h} value={h}>
                  {fmtHour(h)}
                </option>
              ))}
            </select>
            <label className="text-sm text-text-primary/80">to</label>
            <select
              value={settings.quietEnd}
              onChange={(e) => set({ quietEnd: Number(e.target.value) })}
              className="bg-bg-tile border border-border rounded-lg px-3 py-1.5 text-sm text-text-primary"
            >
              {HOURS.map((h) => (
                <option key={h} value={h}>
                  {fmtHour(h)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="text-text-muted text-[11px] mt-6 leading-relaxed">
          Note: with no backend push server, alerts are delivered while MotoMeter is open in a
          browser tab (checked once a minute). A future version could add a service worker + push
          backend for delivery when the app is closed.
        </p>
      </div>
    </div>
  )
}
