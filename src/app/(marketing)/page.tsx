import type { Metadata } from 'next'
import Link from 'next/link'
import GreetingSlideshow from '@/components/marketing/GreetingSlideshow'
import CourseCard from '@/components/marketing/CourseCard'
import StatsStrip from '@/components/marketing/StatsStrip'
import { COURSES } from '@/lib/constants'

export const metadata: Metadata = {
  title: "Àrìa Learn — Nigeria's Gamified STEAM Platform",
  description: "Nigeria's first gamified STEAM platform built for every child in every community.",
  icons: { icon: '/favicon.ico' },
}

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section style={{ minHeight: '88vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px 60px', textAlign: 'center', background: 'linear-gradient(160deg, #f7fdf9 0%, #fff8e8 100%)' }}>

        {/* GREETING SLIDESHOW */}
        <GreetingSlideshow />

        <p style={{ fontSize: 'clamp(16px, 3vw, 22px)', color: '#5a7a66', maxWidth: 560, lineHeight: 1.6, margin: '8px 0 32px', fontWeight: 600 }}>
          Nigeria&apos;s first gamified STEAM platform, built <strong style={{ color: '#1a7a4a' }}>for every child</strong>, in every community.
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
        <StatsStrip />
      </section>

      {/* COURSES */}
      <section id="courses" style={{ padding: '64px 24px', background: 'white' }}>
        <div style={{ textAlign: 'center', fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#25a864', marginBottom: 10 }}>What we teach</div>
        <div className="font-baloo" style={{ textAlign: 'center', fontSize: 'clamp(26px, 5vw, 40px)', fontWeight: 800, color: '#0f1f17', marginBottom: 40 }}>
          Six worlds to explore 🌍
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, maxWidth: 900, margin: '0 auto' }}>
          {COURSES.map((c) => (
            <CourseCard key={c.slug} {...c} />
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
