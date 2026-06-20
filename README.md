# MotoMeter 🏍

A premium activity ride/condition scorer. Search any US city and MotoMeter pulls live weather from the free National Weather Service API, then renders a 0–100 score on a physical-looking device gauge — fully tunable with sliders, hazard chips, and rider toggles.

## Features

- **11 activity modes** — Motorcycle, Cessna/GA, Skydiving, Water Skiing, Surfing, Hunting, Sailing, Fishing, Hiking, Paragliding, Road Cycling. Each has its own scoring factors, accent color, and notification copy. Switch via the tab bar.
- **Smart alerts** (`/notifications`) — browser push for a 7am morning briefing, prime-window alerts (7-day score ≥ 90), and condition warnings (score < 45), with per-type toggles and quiet hours.
- **Ambient mode** (`/ambient`) — full-screen wall display: huge animated gauge, score-color backlight, live clock, auto-cycling through every mode every 30s.
- **US map** (`/map`) — interactive state map colored by score for the active mode; hover for conditions, click for a 7-day chart.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:5173 — no API key, no `.env`, works out of the box.

## Notes

- Weather data comes from the **National Weather Service API** (free, no auth). City names are geocoded via the **Open-Meteo geocoder** (free, no auth), with the Census geocoder as a fallback for street addresses. Weather is **US-only** — search US cities.
- On any fetch/geocode failure, the app shows a notice and silently falls back to mock data (Austin, TX) so it always keeps working.
- Each activity has its own **hero video + poster** ([Pexels](https://pexels.com), free license), streamed at runtime; the poster paints instantly and is the fallback if a clip can't play. (Production note: for full control you'd self-host transcoded loops on your own CDN.) The favicon/notification icon still uses `public/moto-hero.jpg`.

## File map

```
src/engine/scoreEngine.js       Motorcycle computeScore() + score color helpers
src/config/factors.js           Factor (slider) definitions + defaults
src/config/modes.js             11 activity modes: scoring, accent, notify copy
src/api/nwsClient.js            NWS + Open-Meteo/Census fetch chain, mock fallback
src/state/AppState.jsx          Shared state context across all routes
src/notifications/notify.js     Notification permission, settings, scheduler hook
src/components/Device.jsx       Device shell: gauge + condition tiles + alert pills
src/components/GaugeArc.jsx     SVG semicircle gauge with Framer Motion needle
src/components/ScoreNumber.jsx  Count-up animation for the score number
src/components/ConditionsPanel.jsx  Mode-aware condition sliders + rider toggles
src/components/HazardChips.jsx  8 toggleable hazard chips (motorcycle)
src/components/ForecastStrip.jsx    7-day cards + Recharts line chart
src/components/AlertPills.jsx   Dynamic status pills from active hazards/factors
src/components/ModeSwitcher.jsx Activity-mode tab bar
src/components/NavBar.jsx       Route navigation (Scorer/Map/Ambient/Alerts)
src/pages/Home.jsx              Main scorer page (hero + device + controls)
src/pages/Notifications.jsx     Alert settings + quiet hours
src/pages/Ambient.jsx           Full-screen wall display
src/pages/MapView.jsx           Interactive US state map
src/App.jsx                     Router
src/main.jsx                    Entry: Router + AppStateProvider
src/index.css                   Slider styles, CSS variables, global resets
```
