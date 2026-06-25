'use client'

import { useRouter } from 'next/navigation'

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

type CQProgress = { completed: number[]; current: number }

export default function CodeQuestLevels({ progress, done }: { progress: CQProgress; done: number }) {
  const router = useRouter()

  return (
    <div style={{ padding: '32px 40px', maxWidth: 1100, margin: '0 auto' }}>
      <div className="font-baloo" style={{ fontSize: 22, fontWeight: 800, color: '#0f1f17', marginBottom: 20 }}>Your 10 levels 🗺️</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {LEVELS.map(level => {
          const isDone    = progress.completed.includes(level.num)
          const isCurrent = progress.current === level.num
          const isLocked  = !isDone && !isCurrent

          return (
            <div
              key={level.num}
              onClick={() => {
                if (!isLocked) router.push(`/courses/code-quest/level-${level.num}`)
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
                  <button
                    style={{ marginTop: 8, background: done > 0 ? '#f0a500' : '#6c4fc7', color: done > 0 ? '#0f1f17' : 'white', border: 'none', padding: '8px 18px', borderRadius: 20, fontFamily: 'Nunito, sans-serif', fontSize: 13, fontWeight: 800, cursor: 'pointer' }}
                    onClick={e => { e.stopPropagation(); router.push(`/courses/code-quest/level-${level.num}`) }}
                  >
                    {done > 0 ? '▶ Resume' : '▶ Start Level'}
                  </button>
                )}
                {isDone && (
                  <button
                    style={{ marginTop: 8, background: '#1a7a4a', color: 'white', border: 'none', padding: '8px 18px', borderRadius: 20, fontFamily: 'Nunito, sans-serif', fontSize: 13, fontWeight: 800, cursor: 'pointer' }}
                    onClick={e => { e.stopPropagation(); router.push(`/courses/code-quest/level-${level.num}`) }}
                  >
                    ↺ Replay
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
