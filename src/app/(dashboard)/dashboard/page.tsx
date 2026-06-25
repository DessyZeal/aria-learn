import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AVATAR_COLORS } from '@/lib/constants'
import StreakCard from '@/components/dashboard/StreakCard'
import LeaderboardRow from '@/components/dashboard/LeaderboardRow'

export const metadata = { title: 'Àrìa Learn — Dashboard' }

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/login')

  const name = profile.first_name ?? 'Learner'
  const avatar = profile.avatar ?? '🦁'
  const xp: number = profile.xp ?? 0
  const streak: number = profile.streak ?? 0
  const cqCompleted = profile.cq_progress?.completed?.length ?? 0
  const szCompleted = profile.sz_progress?.completed?.length ?? 0

  const allBadges = [
    { icon: '🚀', label: 'First launch', earned: xp > 0 || cqCompleted > 0 },
    { icon: '🔥', label: '3-day streak', earned: streak >= 3 },
    { icon: '💡', label: 'Curious mind', earned: cqCompleted >= 1 },
    { icon: '🏅', label: 'Code master',  earned: cqCompleted >= 5 },
    { icon: '🌍', label: 'Explorer',     earned: szCompleted >= 1 },
    { icon: '⭐', label: 'Top scorer',   earned: xp >= 500 },
  ]

  const leaderboard = [
    { name: 'Amara',  xp: 2100, av: 'A', color: '#ffd166',                                  isMe: false },
    { name: 'Kemi',   xp: 1880, av: 'K', color: '#b5d4f4',                                  isMe: false },
    { name: 'Tunde',  xp: 1560, av: 'T', color: '#c0dd97',                                  isMe: false },
    { name,           xp,       av: name[0], color: AVATAR_COLORS[avatar] ?? '#ffd166',     isMe: true  },
    { name: 'Fatima', xp: 980,  av: 'F', color: '#f5c4b3',                                  isMe: false },
  ].sort((a, b) => b.xp - a.xp)

  const courses = [
    { icon: '💻', name: 'Code Quest',    meta: `Level ${profile.cq_progress?.current ?? 1} of 10`, pct: cqCompleted * 10, color: '#6c4fc7', href: '/courses/code-quest', active: true,  locked: false },
    { icon: '🛡️', name: 'Safe Zone',     meta: `Level ${profile.sz_progress?.current ?? 1} of 10`, pct: szCompleted * 10, color: '#2176c7', href: '/courses/safe-zone',  active: true,  locked: false },
    { icon: '🔬', name: 'Science Lab',   meta: 'Not started yet',              pct: 0, color: '#1a7a4a', href: '#', active: false, locked: false },
    { icon: '🔢', name: 'Maths Arena',   meta: 'Complete Level 5 to unlock',   pct: 0, color: '#e84040', href: '#', active: false, locked: true  },
    { icon: '⚙️', name: 'Build It',      meta: 'Complete Level 5 to unlock',   pct: 0, color: '#f0a500', href: '#', active: false, locked: true  },
    { icon: '🎨', name: 'Create Studio', meta: 'Complete Level 5 to unlock',   pct: 0, color: '#d4538a', href: '#', active: false, locked: true  },
  ]

  return (
    <div style={{ padding: '28px 32px' }}>

      {/* TOPBAR */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 className="font-baloo" style={{ fontSize: 26, fontWeight: 800, color: '#0f1f17', lineHeight: 1.1 }}>
            Welcome back, {name}! 👋
          </h1>
          <p style={{ fontSize: 14, color: '#5a7a66', fontWeight: 600, marginTop: 2 }}>
            {streak >= 3
              ? `You're on a ${streak}-day streak — keep it going!`
              : 'Start a lesson today to begin your streak!'}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'white', border: '1.5px solid #d4ece0', borderRadius: 50, padding: '8px 16px' }}>
          <span style={{ fontSize: 20 }}>⭐</span>
          <span className="font-baloo" style={{ fontSize: 18, fontWeight: 800, color: '#f0a500' }}>{xp.toLocaleString()}</span>
          <span style={{ fontSize: 12, color: '#5a7a66', fontWeight: 600 }}>XP points</span>
        </div>
      </div>

      {/* STREAK */}
      <StreakCard streak={streak} lastActive={profile.last_active ?? ''} />

      {/* CONTINUE LEARNING */}
      <div className="font-baloo" style={{ fontSize: 18, fontWeight: 800, color: '#0f1f17', marginBottom: 14 }}>Continue where you left off</div>
      <Link href="/courses/code-quest"
        style={{ background: '#1a7a4a', borderRadius: 16, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28, cursor: 'pointer', textDecoration: 'none', transition: 'transform 0.2s' }}>
        <div style={{ fontSize: 44, flexShrink: 0 }}>💻</div>
        <div style={{ flex: 1 }}>
          <h3 className="font-baloo" style={{ fontSize: 18, fontWeight: 800, color: 'white' }}>Code Quest</h3>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: 600, marginTop: 2 }}>
            Level {profile.cq_progress?.current ?? 1} — {cqCompleted === 0 ? "Let's begin your coding journey!" : `${cqCompleted} of 10 levels complete`}
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
        {courses.map((c, i) => {
          const cardContent = (
            <>
              {c.active && (
                <div style={{ position: 'absolute', top: -6, right: -6, background: '#e84040', color: 'white', fontSize: 10, fontWeight: 800, padding: '2px 7px', borderRadius: 10 }}>Active</div>
              )}
              {c.locked && (
                <div style={{ position: 'absolute', top: 12, right: 12, fontSize: 14 }}>🔒</div>
              )}
              <div style={{ fontSize: 30, marginBottom: 8 }}>{c.icon}</div>
              <div className="font-baloo" style={{ fontSize: 15, fontWeight: 800, color: '#0f1f17', marginBottom: 2 }}>{c.name}</div>
              <div style={{ fontSize: 11, color: '#5a7a66', fontWeight: 600 }}>{c.meta}</div>
              <div style={{ height: 4, background: '#e8f4ee', borderRadius: 2, marginTop: 10 }}>
                <div style={{ height: '100%', background: c.color, borderRadius: 2, width: `${c.pct}%` }} />
              </div>
            </>
          )

          const cardStyle = {
            background: 'white',
            border: `1.5px solid ${c.active ? '#b8e0cc' : '#d4ece0'}`,
            borderRadius: 14,
            padding: '18px 14px',
            cursor: c.locked ? 'not-allowed' : 'pointer',
            opacity: c.locked ? 0.55 : 1,
            position: 'relative' as const,
            display: 'block',
            textDecoration: 'none',
          }

          if (c.href !== '#') {
            return <Link key={i} href={c.href} style={cardStyle}>{cardContent}</Link>
          }
          return <div key={i} style={cardStyle}>{cardContent}</div>
        })}
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
              <span style={{ fontSize: 15, fontWeight: 800, color: 'white' }}>🏆 This week&apos;s top learners</span>
            </div>
            {leaderboard.slice(0, 5).map((p, i) => (
              <LeaderboardRow
                key={i}
                rank={i + 1}
                avatar={p.av}
                name={p.name}
                xp={p.xp}
                isCurrentUser={p.isMe}
                color={p.color}
              />
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}
