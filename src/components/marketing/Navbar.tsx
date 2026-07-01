'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav style={{
      background: 'white',
      borderBottom: '1.5px solid #e6f7ee',
      padding: '16px 40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: scrolled ? '0 2px 12px rgba(0,0,0,0.08)' : 'none',
      transition: 'box-shadow 0.2s',
    }}>
      <div className="font-baloo" style={{ fontSize: 26, fontWeight: 800, color: '#1a7a4a' }}>
        Àrìa <span style={{ color: '#f0a500' }}>Learn</span>
      </div>
      <div style={{ display: 'flex', gap: 28, alignItems: 'center', listStyle: 'none' }}>
        <Link href="#courses" style={{ textDecoration: 'none', fontWeight: 600, fontSize: 14, color: '#5a7a66' }}>Courses</Link>
        <Link href="/signup" style={{ textDecoration: 'none', fontWeight: 600, fontSize: 14, color: '#5a7a66' }}>For Schools</Link>
        <Link href="#mission" style={{ textDecoration: 'none', fontWeight: 600, fontSize: 14, color: '#5a7a66' }}>Our Mission</Link>
        <Link href="/signup" style={{ textDecoration: 'none', background: '#1a7a4a', color: 'white', padding: '8px 20px', borderRadius: 20, fontWeight: 700, fontSize: 14 }}>
          Start Learning →
        </Link>
      </div>
    </nav>
  )
}
