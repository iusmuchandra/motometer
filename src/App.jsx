import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Notifications from './pages/Notifications.jsx'
import Ambient from './pages/Ambient.jsx'
import MapView from './pages/MapView.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/ambient" element={<Ambient />} />
      <Route path="/map" element={<MapView />} />
    </Routes>
  )
}
