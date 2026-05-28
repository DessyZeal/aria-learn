import { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const AVATAR_COLORS = { '🦁': '#ffd166', '🐢': '#c0dd97', '🦅': '#b5d4f4', '🐘': '#d4ece0', '🦋': '#f4c0d1', '🌟': '#ffd166' }

export default function Dashboard() {
  const router = useRouter()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [todayIndex] = useState(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1)

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/signup'); return }

      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (prof) setProfile(prof)
      else {
        // Fallback: use auth metadata
        setProfile({
          first_name: user.user_metadata?.first_name || 'Learner',
          avatar: user.user_metadata?.avatar || '🦁',
          xp: 0, streak: 0, badges: [],
          cq_progress: { completed: [], current: 1 },
          sz_progress: { completed: [], current: 1 },
        })
      }
      setLoading(false)
    }
    getProfile()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4fbf7' }}>
      <div className="font-baloo" style={{ fontSize: 24, color: '#1a7a4a' }}>Loading your world... 🌍</div>
    </div>
  )

  const name = profile?.first_name || 'Learner'
  const avatar = profile?.avatar || '🦁'
  const xp = profile?.xp || 0
  const streak = profile?.streak || 0
  const badges = profile?.badges || []
  const cqCompleted = profile?.cq_progress?.completed?.length || 0
  const szCompleted = profile?.sz_progress?.completed?.length || 0

  const allBadges = [
    { icon: '🚀', label: 'First launch', earned: xp > 0 || cqCompleted > 0 },
    { icon: '🔥', label: '3-day streak', earned: streak >= 3 },
    { icon: '💡', label: 'Curious mind', earned: cqCompleted >= 1 },
    { icon: '🏅', label: 'Code master',  earned: cqCompleted >= 5 },
    { icon: '🌍', label: 'Explorer',     earned: szCompleted >= 1 },
    { icon: '⭐', label: 'Top scorer',   earned: xp >= 500 },
  ]

  const leaderboard = [
    { name: 'Amara', xp: 2100, av: 'A', color: '#ffd166' },
    { name: 'Kemi',  xp: 1880, av: 'K', color: '#b5d4f4' },
    { name: 'Tunde', xp: 1560, av: 'T', color: '#c0dd97' },
    { name: name,    xp: xp,   av: name[0], color: AVATAR_COLORS[avatar] || '#ffd166', isMe: true },
    { name: 'Fatima',xp: 980,  av: 'F', color: '#f5c4b3' },
  ].sort((a, b) => b.xp - a.xp)

  return (
    <>
      <Head><title>Àrìa Learn — Dashboard</title></Head>
      <div style={{ display: 'flex', minHeight: '100vh' }}>

        {/* SIDEBAR */}
        <aside style={{ width: 220, background: '#0f1f17', display: 'flex', flexDirection: 'column', padding: '24px 16px', gap: 6, flexShrink: 0 }}>
          <div className="font-baloo" style={{ fontSize: 22, fontWeight: 800, color: 'white', marginBottom: 24, paddingLeft: 8 }}>
            Àrìa <span style={{ color: '#f0a500' }}>Learn</span>
          </div>
          {[
            { icon: '🏠', label: 'Home',        href: '/dashboard', active: true },
            { icon: '📚', label: 'My Courses',  href: '/courses' },
            { icon: '🏆', label: 'Leaderboard', href: '/dashboard' },
            { icon: '🎖️', label: 'My Badges',   href: '/dashboard' },
            { icon: '👩‍🏫', label: 'My Teacher',  href: '/dashboard' },
          ].map(item => (
            <Link key={item.label} href={item.href}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, fontSize: 14, fontWeight: 600, color: item.active ? 'white' : '#8aad96', background: item.active ? '#1a7a4a' : 'transparent', textDecoration: 'none', transition: 'background 0.2s' }}>
              <span style={{ fontSize: 18, width: 22, textAlign: 'center' }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
          <button onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, fontSize: 14, fontWeight: 600, color: '#8aad96', background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}>
            <span style={{ fontSize: 18, width: 22, textAlign: 'center' }}>🚪</span> Log Out
          </button>
          <div style={{ marginTop: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 12, background: '#1a3d28', borderRadius: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: AVATAR_COLORS[avatar] || '#f0a500', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18 }}>{avatar}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>{name}</div>
                <div style={{ fontSize: 11, color: '#8aad96' }}>Level {Math.floor(xp / 100) + 1} Explorer</div>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <main style={{ flex: 1, padding: '28px 32px', overflowY: 'auto' }}>

          {/* TOPBAR */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
            <div>
              <h1 className="font-baloo" style={{ fontSize: 26, fontWeight: 800, color: '#0f1f17', lineHeight: 1.1 }}>Welcome back, {name}! 👋</h1>
              <p style={{ fontSize: 14, color: '#5a7a66', fontWeight: 600, marginTop: 2 }}>
                {streak >= 3 ? `You're on a ${streak}-day streak — keep it going!` : 'Start a lesson today to begin your streak!'}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'white', border: '1.5px solid #d4ece0', borderRadius: 50, padding: '8px 16px' }}>
              <span style={{ fontSize: 20 }}>⭐</span>
              <span className="font-baloo" style={{ fontSize: 18, fontWeight: 800, color: '#f0a500' }}>{xp.toLocaleString()}</span>
              <span style={{ fontSize: 12, color: '#5a7a66', fontWeight: 600 }}>XP points</span>
            </div>
          </div>

          {/* STREAK */}
          <div style={{ background: 'white', border: '1.5px solid #d4ece0', borderRadius: 14, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <div style={{ fontSize: 28 }}>🔥</div>
            <div>
              <h3 className="font-baloo" style={{ fontSize: 16, fontWeight: 800, color: '#0f1f17' }}>
                {streak >= 1 ? `${streak}-day learning streak!` : 'Start your streak today!'}
              </h3>
              <p style={{ fontSize: 12, color: '#5a7a66', fontWeight: 600 }}>Learn today to keep your flame alive</p>
            </div>
            <div style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
              {DAYS.map((day, i) => {
                const isDone = i < (streak % 7)
                const isToday = i === todayIndex
                const cls = isDone ? 'day-done' : isToday ? 'day-today' : 'day-future'
                return (
                  <div key={day} className={cls} style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>
                    {day[0]}
                  </div>
                )
              })}
            </div>
          </div>

          {/* CONTINUE LEARNING */}
          <div className="font-baloo" style={{ fontSize: 18, fontWeight: 800, color: '#0f1f17', marginBottom: 14 }}>Continue where you left off</div>
          <Link href="/courses/code-quest"
            style={{ background: '#1a7a4a', borderRadius: 16, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28, cursor: 'pointer', textDecoration: 'none', transition: 'transform 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
            <div style={{ fontSize: 44, flexShrink: 0 }}>💻</div>
            <div style={{ flex: 1 }}>
              <h3 className="font-baloo" style={{ fontSize: 18, fontWeight: 800, color: 'white' }}>Code Quest</h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: 600, marginTop: 2 }}>
                Level {(profile?.cq_progress?.current) || 1} — {cqCompleted === 0 ? "Let's begin your coding journey!" : `${cqCompleted} of 10 levels complete`}
              </p>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.25)', borderRadius: 3, marginTop: 10, width: 220 }}>
                <div style={{ height: '100%', background: '#f0a500', borderRadius: 3, width: `${Math.max(5, cqCompleted * 10)}%`, transition: 'width 0.6s' }} />
              </div>
            </div>
            <button style={{ background: 'white', color: '#1a7a4a', border: 'none', padding: '10px 20px', borderRadius: 50, fontFamily: 'Nunito, sans-serif', fontSize: 14, fontWeight: 800, cursor: 'pointer', flexShrink: 0 }}>
              {cqCompleted > 0 ? 'Continue →' : 'Start →'}
            </button>
          </Link>

          {/* COURSES GRID */}
          <div className="font-baloo" style={{ fontSize: 18, fontWeight: 800, color: '#0f1f17', marginBottom: 14 }}>Your learning worlds</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 28 }}>
            {[
              { icon: '💻', name: 'Code Quest',    meta: `Level ${(profile?.cq_progress?.current) || 1} of 10`, pct: cqCompleted * 10, color: '#6c4fc7', href: '/courses/code-quest', active: true },
              { icon: '🛡️', name: 'Safe Zone',     meta: `Level ${(profile?.sz_progress?.current) || 1} of 10`, pct: szCompleted * 10, color: '#2176c7', href: '/courses/safe-zone',  active: true },
              { icon: '🔬', name: 'Science Lab',   meta: 'Not started yet', pct: 0, color: '#1a7a4a', href: '#', active: false },
              { icon: '🔢', name: 'Maths Arena',   meta: 'Complete Level 5 to unlock', pct: 0, color: '#e84040', href: '#', locked: true },
              { icon: '⚙️', name: 'Build It',      meta: 'Complete Level 5 to unlock', pct: 0, color: '#f0a500', href: '#', locked: true },
              { icon: '🎨', name: 'Create Studio', meta: 'Complete Level 5 to unlock', pct: 0, color: '#d4538a', href: '#', locked: true },
            ].map((c, i) => (
              <div key={i} onClick={() => c.href !== '#' && router.push(c.href)}
                style={{ background: 'white', border: `1.5px solid ${c.active ? '#b8e0cc' : '#d4ece0'}`, borderRadius: 14, padding: '18px 14px', cursor: c.locked ? 'not-allowed' : 'pointer', opacity: c.locked ? 0.55 : 1, transition: 'transform 0.2s', position: 'relative' }}
                onMouseEnter={e => { if (!c.locked) e.currentTarget.style.transform = 'translateY(-3px)' }}
                onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                {c.active && <div style={{ position: 'absolute', top: -6, right: -6, background: '#e84040', color: 'white', fontSize: 10, fontWeight: 800, padding: '2px 7px', borderRadius: 10 }}>Active</div>}
                {c.locked && <div style={{ position: 'absolute', top: 12, right: 12, fontSize: 14 }}>🔒</div>}
                <div style={{ fontSize: 30, marginBottom: 8 }}>{c.icon}</div>
                <div className="font-baloo" style={{ fontSize: 15, fontWeight: 800, color: '#0f1f17', marginBottom: 2 }}>{c.name}</div>
                <div style={{ fontSize: 11, color: '#5a7a66', fontWeight: 600 }}>{c.meta}</div>
                <div style={{ height: 4, background: '#e8f4ee', borderRadius: 2, marginTop: 10 }}>
                  <div style={{ height: '100%', background: c.color, borderRadius: 2, width: `${c.pct}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* BADGES + LEADERBOARD */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div>
              <div className="font-baloo" style={{ fontSize: 18, fontWeight: 800, color: '#0f1f17', marginBottom: 14 }}>My badges</div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {allBadges.map((b, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: 52, height: 52, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, border: `2px solid ${b.earned ? '#f0a500' : '#ddd'}`, background: b.earned ? '#fff8e8' : '#f0f0f0', filter: b.earned ? 'none' : 'grayscale(1)', opacity: b.earned ? 1 : 0.5 }}>
                      {b.icon}
                    </div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#5a7a66', textAlign: 'center', maxWidth: 56 }}>{b.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="font-baloo" style={{ fontSize: 18, fontWeight: 800, color: '#0f1f17', marginBottom: 14 }}>Class leaderboard</div>
              <div style={{ background: 'white', border: '1.5px solid #d4ece0', borderRadius: 14, overflow: 'hidden' }}>
                <div style={{ background: '#0f1f17', padding: '12px 16px' }} className="font-baloo">
                  <span style={{ fontSize: 15, fontWeight: 800, color: 'white' }}>🏆 This week's top learners</span>
                </div>
                {leaderboard.slice(0, 5).map((p, i) => {
                  const rankColors = ['#f0a500', '#aaa', '#cd7f32']
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', borderBottom: '1px solid #f0f7f3', background: p.isMe ? '#e6f7ee' : 'white' }}>
                      <div className="font-baloo" style={{ fontSize: 15, fontWeight: 800, color: rankColors[i] || '#5a7a66', width: 20 }}>{i + 1}</div>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#0f1f17', flexShrink: 0 }}>{p.av}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#1a2e22', flex: 1 }}>{p.name}{p.isMe ? ' (you) 👈' : ''}</div>
                      <div className="font-baloo" style={{ fontSize: 14, fontWeight: 800, color: '#f0a500' }}>{p.xp.toLocaleString()} XP</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

        </main>
      </div>
    </>
  )
}
