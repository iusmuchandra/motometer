import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Scorer', end: true },
  { to: '/map', label: 'Map' },
  { to: '/ambient', label: 'Ambient' },
  { to: '/notifications', label: 'Alerts' },
]

export default function NavBar({ accent = '#3b6fd4' }) {
  return (
    <nav className="flex items-center gap-1 rounded-full bg-bg-tile/80 border border-border p-1 backdrop-blur">
      {links.map((l) => (
        <NavLink
          key={l.to}
          to={l.to}
          end={l.end}
          className="px-3 py-1.5 rounded-full text-xs font-semibold transition-colors"
          style={({ isActive }) =>
            isActive
              ? { background: `${accent}22`, color: accent }
              : { color: '#8b93b5' }
          }
        >
          {l.label}
        </NavLink>
      ))}
    </nav>
  )
}
