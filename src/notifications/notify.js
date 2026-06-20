// Browser notification system. No backend/push server, so delivery happens
// while the app is open (a tab/SW timer checks conditions each minute).
import { useEffect, useRef } from 'react'

const STORE_KEY = 'motometer:notify'

export const DEFAULT_SETTINGS = {
  enabled: false,
  morningBriefing: true, // 7am daily summary
  primeWindow: true, // any 7-day score >= 90
  conditionWarning: true, // current score < 45
  quietStart: 22, // 10pm
  quietEnd: 7, // 7am
}

export function loadSettings() {
  try {
    const raw = localStorage.getItem(STORE_KEY)
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : { ...DEFAULT_SETTINGS }
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

export function saveSettings(s) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(s))
  } catch {
    /* ignore */
  }
}

export function permissionState() {
  return typeof Notification === 'undefined' ? 'unsupported' : Notification.permission
}

export async function requestPermission() {
  if (typeof Notification === 'undefined') return 'unsupported'
  if (Notification.permission === 'granted') return 'granted'
  return Notification.requestPermission()
}

// Quiet hours can wrap past midnight (e.g. 22 -> 7).
export function inQuietHours(date, s) {
  const h = date.getHours()
  const { quietStart: a, quietEnd: b } = s
  return a <= b ? h >= a && h < b : h >= a || h < b
}

function fire(title, body, tag) {
  if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return
  try {
    if (navigator.serviceWorker?.controller) {
      navigator.serviceWorker.ready.then((reg) => reg.showNotification(title, { body, tag, icon: '/moto-hero.jpg' }))
    } else {
      new Notification(title, { body, tag })
    }
  } catch {
    /* ignore */
  }
}

// Fire a one-off test notification (used by the settings page button).
export function sendTest() {
  fire('MotoMeter', 'Notifications are on — this is a test alert. 🏍', 'motometer-test')
}

const todayKey = () => new Date().toISOString().slice(0, 10)

/**
 * Runs the notification checks while mounted. Re-evaluates each minute and
 * whenever score/forecast change. Dedupes per day so you aren't spammed.
 */
export function useNotificationScheduler({ settings, score, scoredWeek, copy }) {
  const sentRef = useRef({ morning: '', prime: '', warning: 0 })

  useEffect(() => {
    if (!settings.enabled || permissionState() !== 'granted') return

    function check() {
      const now = new Date()
      if (inQuietHours(now, settings)) return

      // Morning briefing: once/day at/after 7am.
      if (settings.morningBriefing && now.getHours() >= 7 && now.getHours() < 12) {
        if (sentRef.current.morning !== todayKey()) {
          sentRef.current.morning = todayKey()
          fire('Morning briefing', copy.morning(score), 'motometer-morning')
        }
      }

      // Prime window: best upcoming day scoring 90+ (once/day).
      if (settings.primeWindow) {
        const prime = (scoredWeek || []).find((d) => d.score >= 90)
        if (prime && sentRef.current.prime !== todayKey() + prime.day) {
          sentRef.current.prime = todayKey() + prime.day
          fire('Prime window', copy.prime(prime.day, prime.score), 'motometer-prime')
        }
      }

      // Condition warning: current score < 45 (at most once per 3h).
      if (settings.conditionWarning && score < 45) {
        const ts = now.getTime()
        if (ts - sentRef.current.warning > 3 * 3600 * 1000) {
          sentRef.current.warning = ts
          fire('Condition warning', copy.warning(score), 'motometer-warning')
        }
      }
    }

    check()
    const id = setInterval(check, 60 * 1000)
    return () => clearInterval(id)
  }, [settings, score, scoredWeek, copy])
}
