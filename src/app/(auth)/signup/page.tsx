'use client'

import { useState } from 'react'
import Link from 'next/link'
import RoleSelector from '@/components/auth/RoleSelector'
import SignupForm from '@/components/auth/SignupForm'

type Screen = 'who' | 'signup' | 'success'

const greetings = [
  { text: 'Ẹ káàbọ̀!', lang: 'Yoruba', color: '#25a864' },
  { text: 'Nnọọ!',     lang: 'Igbo',   color: '#f0a500' },
  { text: 'Barka!',    lang: 'Hausa',  color: '#e84040' },
]

function LeftPanel({ tagline, sub }: { tagline: string; sub: string }) {
  return (
    <div style={{ width: '42%', background: '#0f1f17', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 40px', gap: 20 }}>
      <div className="font-baloo" style={{ fontSize: 28, fontWeight: 800, color: 'white' }}>
        Àrìa <span style={{ color: '#f0a500' }}>Learn</span>
      </div>
      <div className="font-baloo" style={{ fontSize: 22, fontWeight: 800, color: 'white', textAlign: 'center', lineHeight: 1.3 }}>{tagline}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 260 }}>
        {greetings.map((g, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#1a3d28', borderRadius: 12, padding: '10px 16px' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: g.color, flexShrink: 0 }} />
            <div className="font-baloo" style={{ fontSize: 16, fontWeight: 800, color: g.color }}>{g.text}</div>
            <div style={{ fontSize: 11, color: '#6a9a7a', fontWeight: 600, marginLeft: 'auto' }}>{g.lang}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 13, color: '#8aad96', fontWeight: 600, textAlign: 'center', lineHeight: 1.6, maxWidth: 280 }}>{sub}</div>
    </div>
  )
}

export default function SignupPage() {
  const [screen, setScreen] = useState<Screen>('who')
  const [whoChoice, setWhoChoice] = useState<string | null>(null)
  const [avatar, setAvatar] = useState('🦁')

  const btnPrimary = {
    background: '#1a7a4a', color: 'white', border: 'none', padding: '14px 36px',
    borderRadius: 50, fontFamily: 'Nunito, sans-serif', fontSize: 16,
    fontWeight: 800, cursor: 'pointer',
  }

  return (
    <>
      {/* ── WHO ARE YOU ── */}
      {screen === 'who' && (
        <div style={{ minHeight: 'calc(100vh - 8px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', textAlign: 'center', background: 'linear-gradient(160deg, #f4fbf7 0%, #fff8e8 100%)' }}>
          <div className="font-baloo" style={{ fontSize: 32, fontWeight: 800, color: '#1a7a4a', marginBottom: 4 }}>
            Àrìa <span style={{ color: '#f0a500' }}>Learn</span>
          </div>
          <p style={{ fontSize: 14, color: '#5a7a66', fontWeight: 600, marginBottom: 28 }}>Nigeria&apos;s gamified STEAM platform</p>
          <div className="font-baloo" style={{ fontSize: 26, fontWeight: 800, color: '#0f1f17', marginBottom: 8 }}>Who is joining today? 👋</div>
          <p style={{ fontSize: 14, color: '#5a7a66', fontWeight: 600, marginBottom: 32 }}>Choose your account type to get started</p>

          <RoleSelector selected={whoChoice} onSelect={setWhoChoice} />

          <button
            onClick={() => setScreen('signup')}
            disabled={!whoChoice}
            style={{ ...btnPrimary, opacity: whoChoice ? 1 : 0.5 }}
          >
            Continue →
          </button>
          <p style={{ marginTop: 16, fontSize: 13, color: '#5a7a66', fontWeight: 600 }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: '#1a7a4a', fontWeight: 800, textDecoration: 'none' }}>Log in here</Link>
          </p>
          <p style={{ marginTop: 8, fontSize: 13 }}>
            <Link href="/" style={{ color: '#1a7a4a' }}>← Back to homepage</Link>
          </p>
        </div>
      )}

      {/* ── SIGNUP ── */}
      {screen === 'signup' && (
        <div style={{ minHeight: 'calc(100vh - 8px)', display: 'flex' }}>
          <LeftPanel
            tagline="Every Nigerian child is welcome here 🌍"
            sub="Join 200+ students already learning through play. Earn badges, climb leaderboards and unlock new worlds!"
          />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 40px', background: 'white', overflowY: 'auto' }}>
            <SignupForm
              avatar={avatar}
              onAvatarSelect={setAvatar}
              role={whoChoice}
              onBack={() => setScreen('who')}
              onSuccess={() => setScreen('success')}
            />
          </div>
        </div>
      )}

      {/* ── SUCCESS ── */}
      {screen === 'success' && (
        <div style={{ minHeight: 'calc(100vh - 8px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', textAlign: 'center', background: 'linear-gradient(160deg, #f4fbf7 0%, #fff8e8 100%)' }}>
          <div style={{ fontSize: 72, marginBottom: 16 }}>🎉</div>
          <div className="font-baloo" style={{ fontSize: 30, fontWeight: 800, color: '#1a7a4a', marginBottom: 8 }}>You&apos;re in, welcome to Àrìa Learn!</div>
          <p style={{ fontSize: 15, color: '#5a7a66', fontWeight: 600, maxWidth: 400, lineHeight: 1.6, marginBottom: 28 }}>
            Your account is ready. You are now part of a community changing the story of STEAM education in Nigeria.
          </p>
          <div style={{ background: '#fff8e8', border: '2px solid #f0a500', borderRadius: 16, padding: '16px 24px', marginBottom: 24, maxWidth: 380 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#b07800', lineHeight: 1.6 }}>
              🤝 Because you joined, <strong style={{ color: '#1a7a4a' }}>one child who cannot afford access</strong> has just been given a free seat on Àrìa Learn. Thank you for being part of the solution.
            </p>
          </div>
          <Link
            href="/dashboard"
            style={{ background: '#1a7a4a', color: 'white', border: 'none', padding: '14px 32px', borderRadius: 50, fontSize: 16, fontWeight: 700, textDecoration: 'none', cursor: 'pointer' }}
          >
            Go to My Dashboard →
          </Link>
          <p style={{ marginTop: 14, fontSize: 13, color: '#5a7a66', fontWeight: 600 }}>Check your email for a confirmation link</p>
        </div>
      )}
    </>
  )
}
