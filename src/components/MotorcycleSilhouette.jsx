// Line-art motorcycle (side profile). Uses currentColor so the parent
// controls tint and opacity — used as a faint ambient backdrop + empty states.
export default function MotorcycleSilhouette({ className = '', style }) {
  return (
    <svg
      viewBox="0 0 600 340"
      fill="none"
      stroke="currentColor"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {/* Rear wheel */}
      <circle cx="150" cy="240" r="78" />
      <circle cx="150" cy="240" r="14" />
      {/* Front wheel */}
      <circle cx="470" cy="240" r="78" />
      <circle cx="470" cy="240" r="14" />

      {/* Front forks + handlebar */}
      <line x1="470" y1="240" x2="432" y2="118" />
      <path d="M432 118 q -6 -22 28 -34 l 34 -2" />

      {/* Tank + seat line */}
      <path d="M236 168 q 60 -34 132 -28 q 28 2 46 18" />
      {/* Seat hump over rear wheel */}
      <path d="M236 168 q -34 6 -52 36 q 30 -10 70 -2" />

      {/* Frame triangle */}
      <line x1="150" y1="240" x2="300" y2="186" />
      <line x1="300" y1="186" x2="368" y2="158" />
      <line x1="300" y1="186" x2="432" y2="200" />
      {/* Swingarm to rear hub */}
      <line x1="300" y1="200" x2="150" y2="240" />
      {/* Front fork lower to hub */}
      <line x1="432" y1="200" x2="470" y2="240" />

      {/* Exhaust */}
      <path d="M300 200 q 60 30 130 26" strokeWidth="5" />
    </svg>
  )
}
