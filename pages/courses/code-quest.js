import { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabase'

const LEVELS = [
  { num: 1,  title: "Mbe's First Steps",      story: "Mbe the Tortoise must reach the river before dry season ends.",               concept: "Sequencing · move_forward()",         badge: "First Step 🐢",       xp: 50  },
  { num: 2,  title: "The Talking Drum",        story: "Adaeze must send a message by drum — the beats must be in order.",            concept: "Order of instructions · Debugging",   badge: "Drum Coder 🥁",      xp: 50  },
  { num: 3,  title: "Counting the Yams",       story: "Farmer Chukwu needs to count his harvest without counting forever!",          concept: "Loops · repeat()",                    badge: "Loop Master 🔄",     xp: 50  },
  { num: 4,  title: "The River or the Road?",  story: "Amara must choose the fastest path — the road may be blocked.",               concept: "Conditionals · if/else",              badge: "Decision Maker 🛤️",  xp: 50  },
  { num: 5,  title: "Mama's Recipe",           story: "Mama Ngozi's jollof rice recipe has steps that depend on ingredients!",       concept: "Nested conditions · Boolean logic",   badge: "Logic Chef 🍛",      xp: 50  },
  { num: 6,  title: "The Village Builder",     story: "The community wants a new well. Emeka must give workers instructions.",       concept: "Functions · define and call",         badge: "Function Builder 🏗️", xp: 50  },
  { num: 7,  title: "Saving the Harvest",      story: "A storm is coming! Fatima must store village data before it is lost.",        concept: "Variables · storing data",            badge: "Data Keeper 📦",     xp: 50  },
  { num: 8,  title: "The Leaking Bucket",      story: "Kwame's program keeps running but never finishes — something is wrong!",      concept: "Debugging · finding and fixing bugs", badge: "Bug Hunter 🔍",      xp: 50  },
  { num: 9,  title: "The Spider and the Web",  story: "Anansi must weave a web — each thread connects to another. Sound familiar?", concept: "Events · interactions",               badge: "Web Weaver 🕷️",      xp: 50  },
  { num: 10, title: "My First Game",           story: "Use everything you have learned to build your own African-themed game!",      concept: "Capstone — all concepts",             badge: "Game Creator 🎮",    xp: 100 },
]

export default function CodeQuest() {
  const router = useRouter()
  const [progress, setProgress] = useState({ completed: [], current: 1 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/signup'); return }
      const { data: prof } = await supabase.from('profiles').select('cq_progress').eq('id', user.id).single()
      if (prof?.cq_progress) setProgress(prof.cq_progress)
      setLoading(false)
    }
    load()
  }, [])

  const done = progress.completed.length
  const pct  = Math.max(5, Math.round((done / 10) * 100))

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4fbf7' }}>
      <div className="font-baloo" style={{ fontSize: 24, color: '#6c4fc7' }}>Loading Code Quest... 💻</div>
    </div>
  )

  return (
    <>
      <Head><title>Àrìa Learn — Code Quest</title></Head>

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
            Learn to code through the stories of Africa. Help Nigerian and West African characters solve real problems — by writing real programs.
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
      <div style={{ padding: '32px 40px', maxWidth: 1100, margin: '0 auto' }}>
        <div className="font-baloo" style={{ fontSize: 22, fontWeight: 800, color: '#0f1f17', marginBottom: 20 }}>Your 10 levels 🗺️</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {LEVELS.map(level => {
            const isDone    = progress.completed.includes(level.num)
            const isCurrent = progress.current === level.num
            const isLocked  = !isDone && !isCurrent

            return (
              <div key={level.num}
                onClick={() => {
                  if (level.num === 1 && !isLocked) router.push('/lesson')
                  else if (!isLocked) alert(`Level ${level.num} lesson coming soon!`)
                }}
                style={{
                  background: isDone ? '#e6f7ee' : 'white',
                  border: `${isCurrent ? '2px' : '1.5px'} solid ${isDone ? '#1a7a4a' : isCurrent ? '#f0a500' : '#d4ece0'}`,
                  borderRadius: 16, padding: 20, display: 'flex', gap: 16,
                  cursor: isLocked ? 'not-allowed' : 'pointer', opacity: isLocked ? 0.55 : 1,
                  transition: 'transform 0.2s, box-shadow 0.2s', position: 'relative', overflow: 'hidden',
                }}
                onMouseEnter={e => { if (!isLocked) { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px #6c4fc720' } }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
              >
                {isCurrent && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, #f0a500, #6c4fc7)' }} />}
                {isLocked && <div style={{ position: 'absolute', top: 16, right: 16, fontSize: 18 }}>🔒</div>}

                {/* Level number */}
                <div style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Baloo 2', cursive", fontSize: 18, fontWeight: 800, background: isDone ? '#1a7a4a' : isCurrent ? '#f0a500' : '#f0f0f0', color: isDone || isCurrent ? (isDone ? 'white' : '#0f1f17') : '#aaa' }}>
                  {isDone ? '✓' : level.num}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="font-baloo" style={{ fontSize: 16, fontWeight: 800, color: isLocked ? '#5a7a66' : '#0f1f17', marginBottom: 3 }}>Level {level.num}: {level.title}</div>
                  <div style={{ fontSize: 12, color: '#5a7a66', fontWeight: 600, lineHeight: 1.5, marginBottom: 8 }}>{level.story}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, background: isDone ? '#e6f7ee' : isLocked ? '#f0f0f0' : '#f0edfd', color: isDone ? '#1a7a4a' : isLocked ? '#aaa' : '#6c4fc7', padding: '3px 10px', borderRadius: 20, display: 'inline-block', marginBottom: 8 }}>
                    {level.concept}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: isLocked ? '#aaa' : '#f0a500' }}>🏅 {level.badge} · ⭐ {level.xp} XP</div>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: isDone ? '#e6f7ee' : isCurrent ? '#fff8e8' : '#f0f0f0', color: isDone ? '#1a7a4a' : isCurrent ? '#b07800' : '#aaa' }}>
                      {isDone ? 'Completed' : isCurrent ? 'Start now' : '🔒 Locked'}
                    </span>
                  </div>
                  {isCurrent && (
                    <button style={{ marginTop: 8, background: done > 0 ? '#f0a500' : '#6c4fc7', color: done > 0 ? '#0f1f17' : 'white', border: 'none', padding: '8px 18px', borderRadius: 20, fontFamily: 'Nunito, sans-serif', fontSize: 13, fontWeight: 800, cursor: 'pointer' }}
                      onClick={e => { e.stopPropagation(); if (level.num === 1) router.push('/lesson'); else alert('Coming soon!') }}>
                      {done > 0 ? '▶ Resume' : '▶ Start Level'}
                    </button>
                  )}
                  {isDone && (
                    <button style={{ marginTop: 8, background: '#1a7a4a', color: 'white', border: 'none', padding: '8px 18px', borderRadius: 20, fontFamily: 'Nunito, sans-serif', fontSize: 13, fontWeight: 800, cursor: 'pointer' }}>
                      ↺ Replay
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

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
