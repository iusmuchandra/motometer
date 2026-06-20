import { useEffect, useState } from 'react'
import { getHeroMedia } from '../config/heroMedia.js'

/**
 * Per-activity hero. Poster image paints instantly; the looping muted video
 * fades in over it once it can play. If the video errors, the poster remains —
 * so the hero is always at least a per-activity photo.
 *
 * @param {string} modeKey    active mode
 * @param {string} color      score color for the reactive wash
 * @param {number} [dark]     darkening strength 0..1 (default 0.5)
 */
export default function HeroMedia({ modeKey, color, dark = 0.5 }) {
  const media = getHeroMedia(modeKey)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)

  // Reset fade/error state whenever the activity changes.
  useEffect(() => {
    setReady(false)
    setFailed(false)
  }, [modeKey])

  return (
    <>
      {/* Poster (instant) */}
      <img
        src={media.poster}
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Video (fades in) */}
      {!failed && (
        <video
          key={modeKey}
          src={media.video}
          poster={media.poster}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onCanPlay={() => setReady(true)}
          onError={() => setFailed(true)}
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ opacity: ready ? 1 : 0, transition: 'opacity 700ms ease' }}
        />
      )}

      {/* Darkening gradient for legibility */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, rgba(7,8,15,${0.3 + dark * 0.3}) 0%, rgba(7,8,15,${
            dark * 0.4
          }) 40%, rgba(7,8,15,${0.7 + dark * 0.3}) 100%)`,
        }}
      />

      {/* Score-reactive color wash */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(120% 80% at 50% 30%, ${color} 0%, transparent 55%)`,
          opacity: 0.14,
          transition: 'background 600ms ease',
        }}
      />
    </>
  )
}
