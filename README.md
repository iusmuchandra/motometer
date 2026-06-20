# MotoMeter 🏍

A premium, single-screen motorcycle ride-condition scorer. Search any US city and MotoMeter pulls live weather from the free National Weather Service API, then renders a 0–100 ride score on a physical-looking device gauge — fully tunable with sliders, hazard chips, and rider toggles.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:5173 — no API key, no `.env`, works out of the box.

## Notes

- Weather data comes from the **National Weather Service API** (free, no auth). City names are geocoded via the **Open-Meteo geocoder** (free, no auth), with the Census geocoder as a fallback for street addresses. Weather is **US-only** — search US cities.
- On any fetch/geocode failure, the app shows a notice and silently falls back to mock data (Austin, TX) so it always keeps working.
- The hero photo (`public/moto-hero.jpg`) is from [Unsplash](https://unsplash.com) (free license).

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
