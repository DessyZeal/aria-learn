'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const inputStyle = {
    width: '100%', padding: '12px 16px', border: '1.5px solid #d4ece0',
    borderRadius: 12, fontFamily: 'Nunito, sans-serif', fontSize: 14,
    color: '#1a2e22', background: '#f4fbf7', outline: 'none',
    transition: 'border-color 0.2s',
  }
  const labelStyle = { display: 'block' as const, fontSize: 13, fontWeight: 700, color: '#1a2e22', marginBottom: 6 }
  const btnPrimary = {
    background: '#1a7a4a', color: 'white', border: 'none', padding: '14px 36px',
    borderRadius: 50, fontFamily: 'Nunito, sans-serif', fontSize: 16,
    fontWeight: 800, cursor: 'pointer', width: '100%', marginTop: 8,
    opacity: loading ? 0.7 : 1,
  }
  const btnOutline = {
    background: 'transparent', color: '#1a7a4a', border: '2px solid #1a7a4a',
    padding: '12px 28px', borderRadius: 50, fontFamily: 'Nunito, sans-serif',
    fontSize: 15, fontWeight: 700, cursor: 'pointer', width: '100%',
  }

  const handleLogin = async () => {
    setError('')
    if (!email || !password) {
      setError('Please enter your email and password.')
      return
    }
    setLoading(true)
    try {
      const supabase = createClient()
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
      if (authError) throw authError
      router.push('/dashboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 8px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', background: 'linear-gradient(160deg, #f4fbf7 0%, #fff8e8 100%)' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <Link href="/signup" style={{ background: 'none', border: 'none', color: '#5a7a66', fontWeight: 700, fontSize: 13, cursor: 'pointer', marginBottom: 24, display: 'inline-block', textDecoration: 'none' }}>← Back</Link>
        <div className="font-baloo" style={{ fontSize: 32, fontWeight: 800, color: '#1a7a4a', marginBottom: 4 }}>
          Àrìa <span style={{ color: '#f0a500' }}>Learn</span>
        </div>
        <div className="font-baloo" style={{ fontSize: 26, fontWeight: 800, color: '#0f1f17', marginBottom: 4, marginTop: 16 }}>Welcome back 👋</div>
        <p style={{ fontSize: 13, color: '#5a7a66', fontWeight: 600, marginBottom: 24 }}>Log in to continue your learning journey</p>

        {error && (
          <div style={{ background: '#fff0f0', border: '1.5px solid #f5a0a0', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#e84040', marginBottom: 16 }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Email address</label>
          <input style={inputStyle} type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ ...labelStyle, display: 'flex', justifyContent: 'space-between' }}>
            <span>Password</span>
            <span style={{ color: '#1a7a4a', fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>Forgot password?</span>
          </label>
          <input style={inputStyle} type="password" placeholder="Your password" value={password} onChange={e => setPassword(e.target.value)} />
        </div>

        <button onClick={handleLogin} disabled={loading} style={btnPrimary}>
          {loading ? 'Logging in...' : 'Log In'}
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '16px 0' }}>
          <div style={{ flex: 1, height: 1, background: '#d4ece0' }} />
          <span style={{ fontSize: 12, color: '#5a7a66', fontWeight: 600 }}>or</span>
          <div style={{ flex: 1, height: 1, background: '#d4ece0' }} />
        </div>
        <button style={btnOutline}>Continue with Google</button>
        <p style={{ fontSize: 13, color: '#5a7a66', textAlign: 'center', marginTop: 16, fontWeight: 600 }}>
          Don&apos;t have an account?{' '}
          <Link href="/signup" style={{ color: '#1a7a4a', fontWeight: 800, textDecoration: 'none' }}>Sign up</Link>
        </p>
      </div>
    </div>
  )
}
