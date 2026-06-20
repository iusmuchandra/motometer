import { useEffect, useRef, useState } from 'react'

// Counts up to `value` over ~1s using requestAnimationFrame.
// Re-animates from the previous displayed value whenever value changes.
export default function ScoreNumber({ value, className = '', style }) {
  const [display, setDisplay] = useState(0)
  const fromRef = useRef(0)
  const rafRef = useRef(null)

  useEffect(() => {
    const from = fromRef.current
    const to = value
    const duration = 1000
    let start = null

    function step(ts) {
      if (start === null) start = ts
      const t = Math.min(1, (ts - start) / duration)
      // easeOut
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(Math.round(from + (to - from) * eased))
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step)
      } else {
        fromRef.current = to
      }
    }

    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [value])

  return (
    <span className={className} style={style}>
      {display}
    </span>
  )
}
