# MotoMeter 🏍

A premium, single-screen motorcycle ride-condition scorer. Search any US city and MotoMeter pulls live weather from the free National Weather Service API, then renders a 0–100 ride score on a physical-looking device gauge — fully tunable with sliders, hazard chips, and rider toggles.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:5173 — no API key, no `.env`, works out of the box.

## Notes

- Weather data comes from the **National Weather Service API** (free, no auth) plus the **Census geocoder** (free, no auth). Both are **US-only** — search US cities.
- On any fetch failure at any step, the app silently falls back to mock data (Austin, TX) and keeps working.

## File map

```
src/engine/scoreEngine.js       computeScore() pure function + score color helpers
src/api/nwsClient.js            NWS + Census fetch chain with silent mock fallback
src/components/Device.jsx       Device shell: gauge + condition tiles + alert pills
src/components/GaugeArc.jsx     SVG semicircle gauge with Framer Motion needle
src/components/ScoreNumber.jsx  Count-up animation for the score number
src/components/ConditionsPanel.jsx  7 condition sliders + rider toggles
src/components/HazardChips.jsx  8 toggleable hazard chips
src/components/ForecastStrip.jsx    7-day cards + Recharts line chart
src/components/AlertPills.jsx   Dynamic status pills from active hazards/factors
src/App.jsx                     Layout, state, wiring
src/main.jsx                    React entry point
src/index.css                   Slider styles, CSS variables, global resets
```
