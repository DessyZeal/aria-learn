'use client'
import { useEffect, useRef, useState, type SetStateAction } from 'react'
import { GREETINGS } from '@/lib/constants'

export default function GreetingSlideshow() {
  const [current, setCurrent] = useState(0)
  const [exiting, setExiting] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const goToSlide = (index: SetStateAction<number>) => {
    setExiting(true)
    setTimeout(() => {
      setExiting(false)
      setCurrent(index)
    }, 300)
  }

  useEffect(() => {
    timerRef.current = setInterval(() => {
      goToSlide((prev) => (prev + 1) % GREETINGS.length)
    }, 2800)
    return () => { if (timerRef.current !== null) clearInterval(timerRef.current) }
  }, [])

  const handleDotClick = (i: number) => {
    if (timerRef.current !== null) clearInterval(timerRef.current)
    goToSlide(i)
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % GREETINGS.length)
    }, 2800)
  }

  return (
    <div style={{ minHeight: 130, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: 12, position: 'relative', width: '100%' }}>
      {GREETINGS.map((g, i) => (
        <div
          key={i}
          className={`greeting-slide ${i === current && !exiting ? 'active' : ''} ${i === current && exiting ? 'exit' : ''}`}
        >
          <div className="font-baloo" style={{ fontSize: 'clamp(44px, 9vw, 80px)', fontWeight: 800, color: g.color, lineHeight: 1.05 }}>
            {g.text}
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginTop: 4, opacity: 0.75, color: g.color }}>
            {g.sub}
          </div>
        </div>
      ))}
      {/* DOTS */}
      <div style={{ display: 'flex', gap: 8, marginTop: 140 }}>
        {GREETINGS.map((_, i) => (
          <div
            key={i}
            onClick={() => handleDotClick(i)}
            style={{
              width: 8, height: 8, borderRadius: '50%', cursor: 'pointer',
              background: i === current ? '#1a7a4a' : '#c8ddd0',
              transform: i === current ? 'scale(1.3)' : 'scale(1)',
              transition: 'background 0.3s, transform 0.3s',
            }}
          />
        ))}
      </div>
    </div>
  )
}
