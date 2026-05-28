import { useEffect, useRef, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'

const greetings = [
  { text: 'Ẹ káàbọ̀!', sub: 'Yoruba · Welcome', color: '#1a7a4a' },
  { text: 'Nnọọ!',      sub: 'Igbo · Welcome',   color: '#f0a500' },
  { text: 'Barka!',     sub: 'Hausa · Welcome',   color: '#e84040' },
]

const courses = [
  { icon: '🔬', name: 'Science Lab',   desc: 'Experiments rooted in African nature & food' },
  { icon: '💻', name: 'Code Quest',    desc: 'Build games using African stories' },
  { icon: '⚙️', name: 'Build It',      desc: 'Engineering challenges for real problems' },
  { icon: '🔢', name: 'Maths Arena',   desc: 'Game-based maths set in African daily life' },
  { icon: '🎨', name: 'Create Studio', desc: 'Art & music inspired by African culture' },
  { icon: '🛡️', name: 'Safe Zone',     desc: 'Internet safety & anti-cyberbullying' },
]

export default function Home() {
  const [current, setCurrent] = useState(0)
  const [exiting, setExiting] = useState(false)
  const timerRef = useRef(null)

  const goToSlide = (index) => {
    setExiting(true)
    setTimeout(() => {
      setExiting(false)
      setCurrent(index)
    }, 300)
  }

  useEffect(() => {
    timerRef.current = setInterval(() => {
      goToSlide((prev) => (prev + 1) % greetings.length)
    }, 2800)
    return () => clearInterval(timerRef.current)
  }, [])

  const handleDotClick = (i) => {
    clearInterval(timerRef.current)
    goToSlide(i)
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % greetings.length)
    }, 2800)
  }

  return (
    <>
      <Head>
        <title>Àrìa Learn — Nigeria's Gamified STEAM Platform</title>
        <meta name="description" content="Nigeria's first gamified STEAM platform built for every child in every community." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="pattern-strip" />

      {/* NAV */}
      <nav style={{ background: 'white', borderBottom: '1.5px solid #e6f7ee', padding: '16px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
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

      {/* HERO */}
      <section style={{ minHeight: '88vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px 60px', textAlign: 'center', background: 'linear-gradient(160deg, #f7fdf9 0%, #fff8e8 100%)' }}>

        {/* GREETING SLIDESHOW */}
        <div style={{ minHeight: 130, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: 12, position: 'relative', width: '100%' }}>
          {greetings.map((g, i) => (
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
            {greetings.map((_, i) => (
              <div
                key={i}
                onClick={() => handleDotClick(i)}
                style={{
                  width: 8, height: 8, borderRadius: '50%', cursor: 'pointer',
                  background: i === current ? '#1a7a4a' : '#c8ddd0',
                  transform: i === current ? 'scale(1.3)' : 'scale(1)',
                  transition: 'background 0.3s, transform 0.3s'
                }}
              />
            ))}
          </div>
        </div>

        <p style={{ fontSize: 'clamp(16px, 3vw, 22px)', color: '#5a7a66', maxWidth: 560, lineHeight: 1.6, margin: '8px 0 32px', fontWeight: 600 }}>
          Nigeria's first gamified STEAM platform, built <strong style={{ color: '#1a7a4a' }}>for every child</strong>, in every community.
        </p>

        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 48 }}>
          <Link href="/signup" style={{ background: '#1a7a4a', color: 'white', border: 'none', padding: '14px 32px', borderRadius: 50, fontSize: 16, fontWeight: 700, textDecoration: 'none', cursor: 'pointer' }}>
            Start Learning Free →
          </Link>
          <Link href="/signup?type=school" style={{ background: 'transparent', color: '#1a7a4a', border: '2px solid #1a7a4a', padding: '12px 28px', borderRadius: 50, fontSize: 16, fontWeight: 700, textDecoration: 'none' }}>
            For Schools
          </Link>
        </div>

        {/* STATS */}
        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { val: '50+', label: 'Students reached' },
            { val: '2',    label: 'Partner schools' },
            { val: '6',    label: 'Learning worlds' },
            { val: '100%', label: 'Free for those in need' },
          ].map((s, i, arr) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className="font-baloo" style={{ fontSize: 28, fontWeight: 800, color: '#1a7a4a', lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontSize: 12, color: '#5a7a66', fontWeight: 600, marginTop: 2 }}>{s.label}</div>
              </div>
              {i < arr.length - 1 && <div style={{ width: 1.5, height: 40, background: '#c8ddd0' }} />}
            </div>
          ))}
        </div>
      </section>

      {/* COURSES */}
      <section id="courses" style={{ padding: '64px 24px', background: 'white' }}>
        <div style={{ textAlign: 'center', fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#25a864', marginBottom: 10 }}>What we teach</div>
        <div className="font-baloo" style={{ textAlign: 'center', fontSize: 'clamp(26px, 5vw, 40px)', fontWeight: 800, color: '#0f1f17', marginBottom: 40 }}>
          Six worlds to explore 🌍
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, maxWidth: 900, margin: '0 auto' }}>
          {courses.map((c, i) => (
            <div key={i} style={{ background: '#f7fdf9', border: '1.5px solid #d4ece0', borderRadius: 16, padding: '24px 16px 20px', textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px #1a7a4a18' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
            >
              <div style={{ fontSize: 36, marginBottom: 10 }}>{c.icon}</div>
              <div className="font-baloo" style={{ fontSize: 16, fontWeight: 700, color: '#0f1f17', marginBottom: 4 }}>{c.name}</div>
              <div style={{ fontSize: 12, color: '#5a7a66', fontWeight: 600, lineHeight: 1.5 }}>{c.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* MISSION BANNER */}
      <section id="mission" style={{ background: '#1a7a4a', color: 'white', padding: '48px 24px', textAlign: 'center' }}>
        <div className="font-baloo" style={{ fontSize: 'clamp(24px, 5vw, 38px)', fontWeight: 800, marginBottom: 10 }}>
          1 subscription = 1 free seat 🤝
        </div>
        <p style={{ fontSize: 16, opacity: 0.88, maxWidth: 520, margin: '0 auto 24px', lineHeight: 1.6, fontWeight: 600 }}>
          Every paying student sponsors a child who cannot afford access. Join and you automatically give another child the gift of learning.
        </p>
        <Link href="/signup" style={{ background: 'white', color: '#1a7a4a', border: 'none', padding: '12px 28px', borderRadius: 50, fontSize: 15, fontWeight: 700, textDecoration: 'none', cursor: 'pointer' }}>
          Join the mission →
        </Link>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#0f1f17', color: '#8aad96', textAlign: 'center', padding: 24, fontSize: 13, fontWeight: 600 }}>
        Built with ❤️ in Nigeria &nbsp;·&nbsp; <span style={{ color: '#ffd166' }}>Àrìa Learn</span> &nbsp;·&nbsp; Every child deserves to discover their potential
      </footer>
    </>
  )
}
