'use client'
import { useState, useEffect } from 'react'
import { GREETINGS } from '@/lib/constants'

export default function GreetingSlideshow() {
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimating(true)
      setTimeout(() => {
        setCurrent(prev => (prev + 1) % GREETINGS.length)
        setAnimating(false)
      }, 400)
    }, 2800)
    return () => clearInterval(interval)
  }, [])

  const greeting = GREETINGS[current]

  return (
    <div style={{ textAlign: 'center', minHeight: '140px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div
        className={`greeting-slide ${!animating ? 'active' : ''}`}
        style={{ color: greeting.color }}
      >
        <h1 style={{
          fontFamily: 'var(--font-baloo)',
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 800,
          lineHeight: 1.1,
        }}>
          {greeting.text}
        </h1>
        <p style={{
          fontSize: '0.8rem',
          letterSpacing: '0.1em',
          marginTop: '0.5rem',
          color: '#5a7a66',
          fontFamily: 'var(--font-nunito)',
        }}>
          {greeting.language} · WELCOME
        </p>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginTop: '1.5rem' }}>
        {GREETINGS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            style={{
              width: '8px', height: '8px',
              borderRadius: '50%',
              border: '2px solid #1a7a4a',
              background: i === current ? '#1a7a4a' : 'transparent',
              cursor: 'pointer',
              padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  )
}
