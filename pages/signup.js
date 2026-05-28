import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'

const AVATARS = ['🦁', '🐢', '🦅', '🐘', '🦋', '🌟']

export default function Signup() {
  const router = useRouter()
  const [screen, setScreen] = useState('who') // who | signup | login | success
  const [whoChoice, setWhoChoice] = useState(null)
  const [avatar, setAvatar] = useState('🦁')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', age: '', state: '',
    schoolName: '', contactName: '', phone: '', studentCount: ''
  })

  const updateForm = (key, val) => setForm(prev => ({ ...prev, [key]: val }))

  // ── SIGN UP ──
  const handleSignup = async () => {
    setError('')
    if (!form.email || !form.password || !form.firstName) {
      setError('Please fill in all required fields.')
      return
    }
    setLoading(true)
    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            first_name: form.firstName,
            last_name: form.lastName,
            avatar: avatar,
            age: form.age,
            state: form.state,
            role: whoChoice,
          }
        }
      })
      if (authError) throw authError

      // Create student profile in database
      if (data.user) {
        await supabase.from('profiles').insert({
          id: data.user.id,
          first_name: form.firstName,
          last_name: form.lastName,
          avatar: avatar,
          age: parseInt(form.age) || null,
          state: form.state,
          role: whoChoice,
          xp: 0,
          streak: 0,
          badges: [],
        })
      }
      setScreen('success')
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── LOGIN ──
  const handleLogin = async () => {
    setError('')
    if (!form.email || !form.password) {
      setError('Please enter your email and password.')
      return
    }
    setLoading(true)
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      })
      if (authError) throw authError
      router.push('/dashboard')
    } catch (err) {
      setError(err.message || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '12px 16px', border: '1.5px solid #d4ece0',
    borderRadius: 12, fontFamily: 'Nunito, sans-serif', fontSize: 14,
    color: '#1a2e22', background: '#f4fbf7', outline: 'none',
    transition: 'border-color 0.2s',
  }
  const labelStyle = { display: 'block', fontSize: 13, fontWeight: 700, color: '#1a2e22', marginBottom: 6 }
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

  const LeftPanel = ({ tagline, sub }) => (
    <div style={{ width: '42%', background: '#0f1f17', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 40px', gap: 20 }}>
      <div className="font-baloo" style={{ fontSize: 28, fontWeight: 800, color: 'white' }}>
        Àrìa <span style={{ color: '#f0a500' }}>Learn</span>
      </div>
      <div className="font-baloo" style={{ fontSize: 22, fontWeight: 800, color: 'white', textAlign: 'center', lineHeight: 1.3 }}>{tagline}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 260 }}>
        {[
          { text: 'Ẹ káàbọ̀!', lang: 'Yoruba', color: '#25a864' },
          { text: 'Nnọọ!',     lang: 'Igbo',   color: '#f0a500' },
          { text: 'Barka!',    lang: 'Hausa',  color: '#e84040' },
        ].map((g, i) => (
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

  return (
    <>
      <Head><title>Àrìa Learn — Join Us</title></Head>
      <div className="pattern-strip" />

      {/* ── WHO ARE YOU ── */}
      {screen === 'who' && (
        <div style={{ minHeight: 'calc(100vh - 6px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', textAlign: 'center', background: 'linear-gradient(160deg, #f4fbf7 0%, #fff8e8 100%)' }}>
          <div className="font-baloo" style={{ fontSize: 32, fontWeight: 800, color: '#1a7a4a', marginBottom: 4 }}>
            Àrìa <span style={{ color: '#f0a500' }}>Learn</span>
          </div>
          <p style={{ fontSize: 14, color: '#5a7a66', fontWeight: 600, marginBottom: 28 }}>Nigeria's gamified STEAM platform</p>
          <div className="font-baloo" style={{ fontSize: 26, fontWeight: 800, color: '#0f1f17', marginBottom: 8 }}>Who is joining today? 👋</div>
          <p style={{ fontSize: 14, color: '#5a7a66', fontWeight: 600, marginBottom: 32 }}>Choose your account type to get started</p>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 28 }}>
            {[
              { type: 'student', emoji: '🎒', title: "I'm a Student", desc: 'I want to learn STEAM through games and challenges' },
              { type: 'school',  emoji: '🏫', title: "I'm a School",  desc: 'I want to bring Àrìa Learn to my students' },
              { type: 'parent',  emoji: '👨‍👩‍👧', title: "I'm a Parent", desc: 'I want to sign up my child for STEAM learning' },
            ].map(c => (
              <div key={c.type} onClick={() => setWhoChoice(c.type)}
                style={{ background: 'white', border: `2px solid ${whoChoice === c.type ? '#1a7a4a' : '#d4ece0'}`, borderRadius: 20, padding: '28px 24px', width: 200, cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s', background: whoChoice === c.type ? '#e6f7ee' : 'white' }}>
                <div style={{ fontSize: 44, marginBottom: 12 }}>{c.emoji}</div>
                <div className="font-baloo" style={{ fontSize: 18, fontWeight: 800, color: '#0f1f17', marginBottom: 4 }}>{c.title}</div>
                <div style={{ fontSize: 12, color: '#5a7a66', fontWeight: 600, lineHeight: 1.5 }}>{c.desc}</div>
              </div>
            ))}
          </div>
          <button onClick={() => setScreen('signup')} disabled={!whoChoice}
            style={{ ...btnPrimary, width: 'auto', padding: '14px 36px', opacity: whoChoice ? 1 : 0.5 }}>
            Continue →
          </button>
          <p style={{ marginTop: 16, fontSize: 13, color: '#5a7a66', fontWeight: 600 }}>
            Already have an account?{' '}
            <span onClick={() => setScreen('login')} style={{ color: '#1a7a4a', fontWeight: 800, cursor: 'pointer' }}>Log in here</span>
          </p>
          <p style={{ marginTop: 8, fontSize: 13 }}>
            <Link href="/" style={{ color: '#1a7a4a' }}>← Back to homepage</Link>
          </p>
        </div>
      )}

      {/* ── SIGNUP ── */}
      {screen === 'signup' && (
        <div style={{ minHeight: 'calc(100vh - 6px)', display: 'flex' }}>
          <LeftPanel tagline="Every Nigerian child is welcome here 🌍" sub="Join 200+ students already learning through play. Earn badges, climb leaderboards and unlock new worlds!" />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 40px', background: 'white', overflowY: 'auto' }}>
            <div style={{ width: '100%', maxWidth: 380 }}>
              <button onClick={() => setScreen('who')} style={{ background: 'none', border: 'none', color: '#5a7a66', fontWeight: 700, fontSize: 13, cursor: 'pointer', marginBottom: 24 }}>← Back</button>
              <div className="font-baloo" style={{ fontSize: 26, fontWeight: 800, color: '#0f1f17', marginBottom: 4 }}>Create your account 🚀</div>
              <p style={{ fontSize: 13, color: '#5a7a66', fontWeight: 600, marginBottom: 24 }}>Let's get you learning in under 2 minutes!</p>

              {error && <div style={{ background: '#fff0f0', border: '1.5px solid #f5a0a0', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#e84040', marginBottom: 16 }}>{error}</div>}

              {/* Avatar */}
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Pick your avatar</label>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 6 }}>
                  {AVATARS.map(a => (
                    <div key={a} onClick={() => setAvatar(a)}
                      style={{ width: 48, height: 48, borderRadius: '50%', border: `2px solid ${avatar === a ? '#1a7a4a' : '#d4ece0'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, cursor: 'pointer', background: avatar === a ? '#e6f7ee' : '#f4fbf7', transition: 'all 0.2s' }}>
                      {a}
                    </div>
                  ))}
                </div>
              </div>

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
                    {['Abia','Anambra','Ebonyi','Enugu','Imo','Lagos','Abuja','Kano','Rivers','Oyo','Kaduna','Delta','Other'].map(s => <option key={s}>{s}</option>)}
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
                <span onClick={() => setScreen('login')} style={{ color: '#1a7a4a', fontWeight: 800, cursor: 'pointer' }}>Log in</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── LOGIN ── */}
      {screen === 'login' && (
        <div style={{ minHeight: 'calc(100vh - 6px)', display: 'flex' }}>
          <LeftPanel tagline="Welcome back! Your streak is waiting 🔥" sub="Your badges, XP and progress are all saved. Pick up where you left off." />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 40px', background: 'white' }}>
            <div style={{ width: '100%', maxWidth: 380 }}>
              <button onClick={() => setScreen('who')} style={{ background: 'none', border: 'none', color: '#5a7a66', fontWeight: 700, fontSize: 13, cursor: 'pointer', marginBottom: 24 }}>← Back</button>
              <div className="font-baloo" style={{ fontSize: 26, fontWeight: 800, color: '#0f1f17', marginBottom: 4 }}>Welcome back 👋</div>
              <p style={{ fontSize: 13, color: '#5a7a66', fontWeight: 600, marginBottom: 24 }}>Log in to continue your learning journey</p>

              {error && <div style={{ background: '#fff0f0', border: '1.5px solid #f5a0a0', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#e84040', marginBottom: 16 }}>{error}</div>}

              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Email address</label>
                <input style={inputStyle} type="email" placeholder="your@email.com" value={form.email} onChange={e => updateForm('email', e.target.value)} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ ...labelStyle, display: 'flex', justifyContent: 'space-between' }}>
                  Password
                  <span style={{ color: '#1a7a4a', fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>Forgot password?</span>
                </label>
                <input style={inputStyle} type="password" placeholder="Your password" value={form.password} onChange={e => updateForm('password', e.target.value)} />
              </div>

              <button onClick={handleLogin} disabled={loading} style={btnPrimary}>
                {loading ? 'Logging in...' : 'Log In →'}
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '16px 0' }}>
                <div style={{ flex: 1, height: 1, background: '#d4ece0' }} />
                <span style={{ fontSize: 12, color: '#5a7a66', fontWeight: 600 }}>or</span>
                <div style={{ flex: 1, height: 1, background: '#d4ece0' }} />
              </div>
              <button style={btnOutline}>Continue with Google</button>
              <p style={{ fontSize: 13, color: '#5a7a66', textAlign: 'center', marginTop: 16, fontWeight: 600 }}>
                New to Àrìa Learn?{' '}
                <span onClick={() => setScreen('who')} style={{ color: '#1a7a4a', fontWeight: 800, cursor: 'pointer' }}>Create an account</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── SUCCESS ── */}
      {screen === 'success' && (
        <div style={{ minHeight: 'calc(100vh - 6px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', textAlign: 'center', background: 'linear-gradient(160deg, #f4fbf7 0%, #fff8e8 100%)' }}>
          <div style={{ fontSize: 72, marginBottom: 16, animation: 'bounce 0.6s ease' }}>🎉</div>
          <div className="font-baloo" style={{ fontSize: 30, fontWeight: 800, color: '#1a7a4a', marginBottom: 8 }}>You're in, welcome to Àrìa Learn!</div>
          <p style={{ fontSize: 15, color: '#5a7a66', fontWeight: 600, maxWidth: 400, lineHeight: 1.6, marginBottom: 28 }}>
            Your account is ready. You are now part of a community changing the story of STEAM education in Nigeria.
          </p>
          <div style={{ background: '#fff8e8', border: '2px solid #f0a500', borderRadius: 16, padding: '16px 24px', marginBottom: 24, maxWidth: 380 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#b07800', lineHeight: 1.6 }}>
              🤝 Because you joined, <strong style={{ color: '#1a7a4a' }}>one child who cannot afford access</strong> has just been given a free seat on Àrìa Learn. Thank you for being part of the solution.
            </p>
          </div>
          <Link href="/dashboard" style={{ background: '#1a7a4a', color: 'white', border: 'none', padding: '14px 32px', borderRadius: 50, fontSize: 16, fontWeight: 700, textDecoration: 'none', cursor: 'pointer' }}>
            Go to My Dashboard →
          </Link>
          <p style={{ marginTop: 14, fontSize: 13, color: '#5a7a66', fontWeight: 600 }}>Check your email for a confirmation link</p>
        </div>
      )}
    </>
  )
}
