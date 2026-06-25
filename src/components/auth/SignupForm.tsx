'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { NIGERIAN_STATES } from '@/lib/constants'
import AvatarPicker from '@/components/auth/AvatarPicker'

interface SignupFormProps {
  avatar: string
  onAvatarSelect: (avatar: string) => void
  role: string | null
  onBack: () => void
  onSuccess: () => void
}

export default function SignupForm({ avatar, onAvatarSelect, role, onBack, onSuccess }: SignupFormProps) {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', age: '', state: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const updateForm = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }))

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

  const handleSignup = async () => {
    setError('')
    if (!form.email || !form.password || !form.firstName) {
      setError('Please fill in all required fields.')
      return
    }
    setLoading(true)
    try {
      const supabase = createClient()
      const { error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            first_name: form.firstName,
            last_name: form.lastName,
            avatar,
            role,
          },
        },
      })
      if (authError) throw authError

      onSuccess()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ width: '100%', maxWidth: 380 }}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#5a7a66', fontWeight: 700, fontSize: 13, cursor: 'pointer', marginBottom: 24 }}>← Back</button>
      <div className="font-baloo" style={{ fontSize: 26, fontWeight: 800, color: '#0f1f17', marginBottom: 4 }}>Create your account 🚀</div>
      <p style={{ fontSize: 13, color: '#5a7a66', fontWeight: 600, marginBottom: 24 }}>Let&apos;s get you learning in under 2 minutes!</p>

      {error && (
        <div style={{ background: '#fff0f0', border: '1.5px solid #f5a0a0', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#e84040', marginBottom: 16 }}>
          {error}
        </div>
      )}

      <AvatarPicker selected={avatar} onSelect={onAvatarSelect} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <div>
          <label style={labelStyle}>First name *</label>
          <input style={inputStyle} type="text" placeholder="Chisom" value={form.firstName} onChange={e => updateForm('firstName', e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>Last name</label>
          <input style={inputStyle} type="text" placeholder="Obi" value={form.lastName} onChange={e => updateForm('lastName', e.target.value)} />
        </div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Email address *</label>
        <input style={inputStyle} type="email" placeholder="chisom@email.com" value={form.email} onChange={e => updateForm('email', e.target.value)} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Password *</label>
        <input style={inputStyle} type="password" placeholder="Create a strong password" value={form.password} onChange={e => updateForm('password', e.target.value)} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <div>
          <label style={labelStyle}>Age</label>
          <input style={inputStyle} type="number" placeholder="13" min="8" max="18" value={form.age} onChange={e => updateForm('age', e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>State</label>
          <select style={inputStyle} value={form.state} onChange={e => updateForm('state', e.target.value)}>
            <option value="">Select state</option>
            {NIGERIAN_STATES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <button onClick={handleSignup} disabled={loading} style={btnPrimary}>
        {loading ? 'Creating account...' : 'Create My Account 🎉'}
      </button>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '16px 0' }}>
        <div style={{ flex: 1, height: 1, background: '#d4ece0' }} />
        <span style={{ fontSize: 12, color: '#5a7a66', fontWeight: 600 }}>or</span>
        <div style={{ flex: 1, height: 1, background: '#d4ece0' }} />
      </div>
      <button style={btnOutline}>Continue with Google</button>
      <p style={{ fontSize: 11, color: '#5a7a66', textAlign: 'center', marginTop: 12, lineHeight: 1.5 }}>
        By signing up you agree to our Terms of Service and Privacy Policy.
      </p>
      <p style={{ fontSize: 13, color: '#5a7a66', textAlign: 'center', marginTop: 16, fontWeight: 600 }}>
        Already have an account?{' '}
        <Link href="/login" style={{ color: '#1a7a4a', fontWeight: 800, textDecoration: 'none' }}>Log in</Link>
      </p>
    </div>
  )
}
