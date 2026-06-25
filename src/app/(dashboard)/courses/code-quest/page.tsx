import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import CodeQuestLevels from './CodeQuestLevels'

export const metadata = { title: 'Àrìa Learn — Code Quest' }

type CQProgress = { completed: number[]; current: number }

export default async function CodeQuestPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const profile = await prisma.profile.findUnique({ where: { id: user.id } })
  if (!profile) redirect('/login')

  const progress = (profile.cqProgress ?? { completed: [], current: 1 }) as CQProgress
  const done = progress.completed.length
  const pct  = Math.max(5, Math.round((done / 10) * 100))

  return (
    <>
      {/* TOPBAR */}
      <div style={{ background: '#0f1f17', padding: '14px 28px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <Link href="/dashboard" style={{ background: 'none', border: '1.5px solid #3a5a44', color: '#8aad96', padding: '7px 16px', borderRadius: 20, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>← Dashboard</Link>
        <div className="font-baloo" style={{ fontSize: 18, fontWeight: 800, color: 'white', marginLeft: 'auto' }}>
          Àrìa <span style={{ color: '#f0a500' }}>Learn</span>
        </div>
      </div>

      {/* HERO */}
      <div style={{ background: 'linear-gradient(135deg, #1a1035 0%, #2d1f6e 50%, #1a3d28 100%)', padding: '48px 40px 40px', display: 'flex', alignItems: 'center', gap: 32 }}>
        <div style={{ fontSize: 72, flexShrink: 0 }}>💻</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#9ecfb0', marginBottom: 8 }}>Course 1 of 6</div>
          <div className="font-baloo" style={{ fontSize: 40, fontWeight: 800, color: 'white', lineHeight: 1.1, marginBottom: 8 }}>Code Quest</div>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', fontWeight: 600, lineHeight: 1.6, maxWidth: 560, marginBottom: 20 }}>
            Learn to code through the stories of Africa. Help Nigerian and West African characters solve real problems, by writing real programs.
          </p>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {[['10', 'Levels'], ['500', 'Total XP'], ['10', 'Badges'], ['Flexible', 'Your pace']].map(([v, l]) => (
              <div key={l}>
                <div className="font-baloo" style={{ fontSize: 22, fontWeight: 800, color: '#f0a500', lineHeight: 1 }}>{v}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', fontWeight: 600, marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PROGRESS */}
      <div style={{ background: 'white', borderBottom: '1.5px solid #d4ece0', padding: '20px 40px', display: 'flex', alignItems: 'center', gap: 24 }}>
        <div>
          <h3 className="font-baloo" style={{ fontSize: 16, fontWeight: 800, color: '#0f1f17' }}>Your progress</h3>
          <p style={{ fontSize: 13, color: '#5a7a66', fontWeight: 600 }}>
            {done === 0 ? 'Level 1 of 10 — just getting started!' : done === 10 ? 'All 10 levels complete — champion!' : `${done} of 10 levels complete`}
          </p>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ height: 12, background: '#e8f4ee', borderRadius: 6, overflow: 'hidden' }}>
            <div style={{ height: '100%', background: 'linear-gradient(90deg, #6c4fc7, #8b6fd4)', borderRadius: 6, width: `${pct}%`, transition: 'width 0.6s' }} />
          </div>
        </div>
        <div className="font-baloo" style={{ fontSize: 20, fontWeight: 800, color: '#6c4fc7', whiteSpace: 'nowrap' }}>{pct}%</div>
        <div style={{ background: '#fff8e8', border: '1.5px solid #f0a500', borderRadius: 50, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="font-baloo" style={{ fontSize: 16, fontWeight: 800, color: '#f0a500' }}>{done * 50}</span>
          <small style={{ fontSize: 12, color: '#5a7a66', fontWeight: 600 }}>XP earned</small>
        </div>
      </div>

      {/* LEVELS */}
      <CodeQuestLevels progress={progress} done={done} />

      {/* CHARACTERS */}
      <div style={{ background: '#0f1f17', padding: '28px 40px' }}>
        <div className="font-baloo" style={{ fontSize: 16, fontWeight: 800, color: 'white', marginBottom: 16 }}>Characters you will meet 👥</div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {[['🐢', 'Mbe', 'The wise tortoise'], ['👧', 'Adaeze', 'The drum messenger'], ['👩', 'Amara', 'The market navigator'], ['👨', 'Emeka', 'The village builder'], ['🕷️', 'Anansi', 'The spider weaver']].map(([emoji, name, role]) => (
            <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#1a3d28', borderRadius: 12, padding: '10px 16px' }}>
              <div style={{ fontSize: 28 }}>{emoji}</div>
              <div>
                <div className="font-baloo" style={{ fontSize: 14, fontWeight: 800, color: 'white' }}>{name}</div>
                <div style={{ fontSize: 11, color: '#8aad96', fontWeight: 600 }}>{role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
