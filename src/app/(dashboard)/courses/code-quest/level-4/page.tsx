'use client'

import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { CSSProperties } from 'react'

type Step = 'story' | 'learn' | 'activity' | 'quiz' | 'badge'

const STEPS: Step[] = ['story', 'learn', 'activity', 'quiz', 'badge']

interface QuizQuestion {
  q: string
  options: string[]
  answer: string
}

const quiz: QuizQuestion[] = [
  { 
    q: 'What does "if/else" let a program do?', 
    options: ['Repeat forever', 'Make a decision based on a condition', 'Store a number', 'Print text to the screen'], 
    answer: 'Make a decision based on a condition' 
  },
  { 
    q: 'If the road IS blocked, which path should Amara take?', 
    options: ['The road', 'The river path', 'Neither path', 'Both paths at once'], 
    answer: 'The river path' 
  },
  { 
    q: 'In code: if (road_blocked) { take_river() } else { take_road() } — what happens if road_blocked is FALSE?', 
    options: ['take_river() runs', 'take_road() runs', 'Nothing happens', 'Both run'], 
    answer: 'take_road() runs' 
  },
]

export default function CQLevel4() {
  const [step, setStep] = useState<Step>('story')
  const [roadBlocked, setRoadBlocked] = useState<boolean | null>(null)
  const [choice, setChoice] = useState<string | null>(null)
  const [activityDone, setActivityDone] = useState<boolean>(false)
  const [activityFeedback, setActivityFeedback] = useState<string>('')
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({})
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false)
  const [score, setScore] = useState<number>(0)
  const [saving, setSaving] = useState<boolean>(false)

  useEffect(() => { 
    document.title = 'Àrìa Learn — Code Quest Level 4' 
  }, [])

  const tryPath = (blocked: boolean) => {
    setRoadBlocked(blocked)
    setChoice(null)
    setActivityFeedback('')
    setActivityDone(false)
  }

  const makeChoice = (path: string) => {
    setChoice(path)
    const correct = roadBlocked ? 'river' : 'road'
    if (path === correct) {
      setActivityFeedback('correct')
      setActivityDone(true)
    } else {
      setActivityFeedback('wrong')
    }
  }

  const submitQuiz = async () => {
    let correct = 0
    quiz.forEach((q, i) => { 
      if (quizAnswers[i] === q.answer) correct++ 
    })
    setScore(correct)
    setQuizSubmitted(true)
    if (correct >= 2) {
      await saveProgress()
      setTimeout(() => setStep('badge'), 1000)
    }
  }

  const saveProgress = async () => {
    setSaving(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      
      const { data: prof } = await supabase
        .from('profiles')
        .select('xp, cq_progress, badges')
        .eq('id', user.id)
        .single()
        
      const currentProgress: { completed: number[]; current: number } =
        (prof?.cq_progress as { completed: number[]; current: number }) ??
        { completed: [], current: 1 }

      if (!currentProgress.completed.includes(4)) {
        currentProgress.completed.push(4)
        currentProgress.current = 5
      }

      await supabase
        .from('profiles')
        .update({
          xp: ((prof?.xp as number) || 0) + 50,
          cq_progress: currentProgress,
          badges: [...new Set([...((prof?.badges as string[]) || []), 'decision_maker'])],
          last_active: new Date().toISOString(),
        })
        .eq('id', user.id)
    } catch (err) { 
      console.error(err) 
    } finally { 
      setSaving(false) 
    }
  }

  const s: {
    page: CSSProperties
    topbar: CSSProperties
    backBtn: CSSProperties
    title: CSSProperties
    badge: CSSProperties
    card: CSSProperties
    h2: CSSProperties
    body: CSSProperties
    scene: CSSProperties
    btnGreen: CSSProperties
    btnPurple: CSSProperties
    btnBlue: CSSProperties
    option: (selected: boolean, correct: boolean, submitted: boolean, isAnswer: boolean) => CSSProperties
  } = {
    page: { minHeight: '100vh', background: '#f4fbf7', fontFamily: 'Nunito, sans-serif' },
    topbar: { background: '#0f1f17', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 16 },
    backBtn: { background: 'none', border: '1.5px solid #3a5a44', color: '#8aad96', padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 700, cursor: 'pointer', textDecoration: 'none', display: 'inline-block' },
    title: { fontFamily: "'Baloo 2', cursive", fontSize: 16, fontWeight: 800, color: 'white', flex: 1 },
    badge: { background: '#6c4fc7', color: 'white', fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 20 },
    card: { background: 'white', borderRadius: 16, padding: 28, maxWidth: 680, margin: '32px auto', boxShadow: '0 2px 16px #1a7a4a10' },
    h2: { fontFamily: "'Baloo 2', cursive", fontSize: 26, fontWeight: 800, color: '#0f1f17', marginBottom: 12 },
    body: { fontSize: 15, color: '#1a2e22', lineHeight: 1.7, marginBottom: 16, fontWeight: 600 },
    scene: { background: 'linear-gradient(135deg, #0f2e3d, #1a4a5a)', borderRadius: 14, padding: 28, textAlign: 'center', marginBottom: 20 },
    btnGreen: { background: '#1a7a4a', color: 'white', border: 'none', padding: '12px 28px', borderRadius: 50, fontSize: 15, fontWeight: 800, cursor: 'pointer', marginTop: 16 },
    btnPurple: { background: '#6c4fc7', color: 'white', border: 'none', padding: '12px 28px', borderRadius: 50, fontSize: 15, fontWeight: 800, cursor: 'pointer', marginTop: 16 },
    btnBlue: { background: '#2176c7', color: 'white', border: 'none', padding: '12px 28px', borderRadius: 50, fontSize: 15, fontWeight: 800, cursor: 'pointer', margin: 6 },
    option: (selected, _correct, submitted, isAnswer) => ({
      background: submitted ? (isAnswer ? '#e6f7ee' : selected ? '#fff0f0' : 'white') : selected ? '#f0edfd' : 'white',
      border: `2px solid ${submitted ? (isAnswer ? '#1a7a4a' : selected ? '#e84040' : '#d4ece0') : selected ? '#6c4fc7' : '#d4ece0'}`,
      borderRadius: 10, padding: '12px 16px', cursor: submitted ? 'default' : 'pointer',
      fontSize: 14, fontWeight: 600, color: '#1a2e22', marginBottom: 8, display: 'block', width: '100%', textAlign: 'left'
    }),
  }

  const stepIndex = STEPS.indexOf(step)

  return (
    <div style={s.page}>
      {/* TOPBAR */}
      <div style={s.topbar}>
        <Link href="/courses/code-quest" style={s.backBtn}>← Back</Link>
        <div style={s.title}>💻 Code Quest — Level 4: The River or the Road?</div>
        <div style={s.badge}>⭐ 50 XP</div>
      </div>

      {/* PROGRESS */}
      <div style={{ background: 'white', borderBottom: '1.5px solid #d4ece0', padding: '10px 24px', display: 'flex', gap: 6 }}>
        {STEPS.map((st, i) => (
          <div key={st} style={{ height: 8, borderRadius: 4, flex: 1, background: stepIndex >= i ? '#1a7a4a' : '#e0ede7' }} />
        ))}
      </div>

      {/* STORY */}
      {step === 'story' && (
        <div style={s.card}>
          <div style={s.scene}>
            <div style={{ fontSize: 72 }}>🛣️</div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginTop: 8 }}>Amara&apos;s Journey · To the Market</div>
          </div>
          <h2 style={s.h2}>The River or the Road? 🛤️</h2>
          <p style={s.body}>Amara needs to get to Ahia Ohuru to sell her goods. There are two paths, the main road, and a path along the river.</p>
          <p style={s.body}>The road is usually faster, but sometimes it gets blocked by flooding or fallen trees. When that happens, Amara must check the road first, then decide which path to take.</p>
          <p style={s.body}>Help Amara&apos;s program make the right <strong>decision</strong> using a concept called <strong>conditionals - if/else.</strong></p>
          <button style={s.btnGreen} onClick={() => setStep('learn')}>Learn the concept →</button>
        </div>
      )}

      {/* LEARN */}
      {step === 'learn' && (
        <div style={s.card}>
          <h2 style={s.h2}>📖 Conditionals  if/else</h2>
          <div style={{ background: '#e8f2fd', border: '1.5px solid #2176c7', borderRadius: 14, padding: 20, marginBottom: 20 }}>
            <p style={{ ...s.body, marginBottom: 8 }}><strong style={{ color: '#2176c7' }}>if/else</strong> lets your program make a decision. It checks something, and does one thing if it&apos;s true, and a different thing if it&apos;s false.</p>
          </div>
          <div style={{ background: '#e6f7ee', border: '1.5px solid #1a7a4a', borderRadius: 14, padding: 20, marginBottom: 20 }}>
            <p style={{ fontFamily: "'Baloo 2', cursive", fontSize: 16, fontWeight: 800, color: '#1a7a4a', marginBottom: 8 }}>Example:</p>
            <div style={{ fontFamily: 'Courier New, monospace', fontSize: 14, color: '#0f1f17', lineHeight: 2 }}>
              <div>if (road_blocked) {'{'}</div>
              <div style={{ paddingLeft: 16 }}>take_river_path()</div>
              <div>{'}'} else {'{'}</div>
              <div style={{ paddingLeft: 16 }}>take_road()</div>
              <div>{'}'}</div>
            </div>
          </div>
          <button style={s.btnPurple} onClick={() => setStep('activity')}>Try the activity →</button>
        </div>
      )}

      {/* ACTIVITY */}
      {step === 'activity' && (
        <div style={s.card}>
          <h2 style={s.h2}>🎯 Help Amara Decide</h2>
          <p style={s.body}>First, choose a road condition. Then choose which path Amara should take based on that condition!</p>

          <p style={{ fontSize: 13, fontWeight: 700, color: '#5a7a66', marginBottom: 8 }}>Step 1 - Is the road blocked?</p>
          <div style={{ marginBottom: 16 }}>
            <button style={s.btnBlue} onClick={() => tryPath(true)}>🚧 Road is blocked</button>
            <button style={{ ...s.btnBlue, background: '#1a7a4a' }} onClick={() => tryPath(false)}>✅ Road is clear</button>
          </div>

          {roadBlocked !== null && (
            <>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#5a7a66', marginBottom: 8 }}>Step 2 - Which path should Amara take?</p>
              <div style={{ marginBottom: 16 }}>
                <button style={s.btnBlue} onClick={() => makeChoice('river')}>🌊 River path</button>
                <button style={{ ...s.btnBlue, background: '#f0a500', color: '#0f1f17' }} onClick={() => makeChoice('road')}>🛣️ Main road</button>
              </div>
            </>
          )}

          {activityFeedback === 'correct' && (
            <div style={{ background: '#e6f7ee', border: '1.5px solid #1a7a4a', borderRadius: 12, padding: 16 }}>
              <p style={{ fontFamily: "'Baloo 2', cursive", fontSize: 16, fontWeight: 800, color: '#1a7a4a' }}>🎉 Correct decision!</p>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#1a2e22', marginTop: 4 }}>Your if/else logic worked perfectly. Amara made it safely!</p>
              <button style={s.btnPurple} onClick={() => setStep('quiz')}>Take the quiz →</button>
            </div>
          )}
          {activityFeedback === 'wrong' && (
            <div style={{ background: '#fff0f0', border: '1.5px solid #f5a0a0', borderRadius: 12, padding: 16 }}>
              <p style={{ fontFamily: "'Baloo 2', cursive", fontSize: 16, fontWeight: 800, color: '#e84040' }}>🤔 Not quite!</p>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#1a2e22', marginTop: 4 }}>Think again  if the road is blocked, which path makes more sense?</p>
              <button style={{ ...s.btnGreen, background: '#5a7a66' }} onClick={() => tryPath(roadBlocked!)}>Try again</button>
            </div>
          )}
        </div>
      )}

      {/* QUIZ */}
      {step === 'quiz' && (
        <div style={s.card}>
          <h2 style={s.h2}>📝 Quick Quiz</h2>
          <p style={s.body}>Answer at least 2 out of 3 correctly to earn your badge!</p>
          {quiz.map((q, i) => (
            <div key={i} style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#0f1f17', marginBottom: 10 }}>{i + 1}. {q.q}</p>
              {q.options.map(opt => (
                <button key={opt}
                  style={s.option(quizAnswers[i] === opt, quizAnswers[i] === q.answer, quizSubmitted, opt === q.answer)}
                  onClick={() => !quizSubmitted && setQuizAnswers(prev => ({ ...prev, [i]: opt }))}>
                  {quizSubmitted && opt === q.answer && '✅ '}{quizSubmitted && quizAnswers[i] === opt && opt !== q.answer && '❌ '}{opt}
                </button>
              ))}
            </div>
          ))}
          {!quizSubmitted ? (
            <button style={s.btnPurple} onClick={submitQuiz} disabled={Object.keys(quizAnswers).length < quiz.length || saving}>
              {saving ? 'Saving...' : 'Submit answers'}
            </button>
          ) : (
            <div style={{ background: score >= 2 ? '#e6f7ee' : '#fff0f0', border: `1.5px solid ${score >= 2 ? '#1a7a4a' : '#f5a0a0'}`, borderRadius: 12, padding: 16, marginTop: 8 }}>
              <p style={{ fontFamily: "'Baloo 2', cursive", fontSize: 18, fontWeight: 800, color: score >= 2 ? '#1a7a4a' : '#e84040' }}>
                {score >= 2 ? `🎉 You scored ${score}/3 — Amazing!` : `You scored ${score}/3 — Try again!`}
              </p>
              {score < 2 && <button style={s.btnGreen} onClick={() => { setQuizAnswers({}); setQuizSubmitted(false) }}>Try again</button>}
            </div>
          )}
        </div>
      )}

      {/* BADGE */}
      {step === 'badge' && (
        <div style={{ ...s.card, textAlign: 'center' }}>
          <div style={{ fontSize: 80, marginBottom: 16 }}>🛤️</div>
          <h2 style={{ ...s.h2, textAlign: 'center' }}>You earned the Decision Maker badge!</h2>
          <p style={{ ...s.body, textAlign: 'center' }}>You understand if/else and how programs make decisions. Amara reached the market safely, thanks to you!</p>
          <div style={{ background: '#fff8e8', border: '2px solid #f0a500', borderRadius: 16, padding: 16, margin: '20px auto', maxWidth: 300 }}>
            <div style={{ fontSize: 48 }}>🛤️</div>
            <div style={{ fontFamily: "'Baloo 2', cursive", fontSize: 20, fontWeight: 800, color: '#f0a500' }}>Decision Maker</div>
            <div style={{ fontSize: 13, color: '#5a7a66', fontWeight: 600 }}>+50 XP earned</div>
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 8 }}>
            <Link href="/courses/code-quest" style={{ ...s.btnGreen, textDecoration: 'none', display: 'inline-block' }}>← Back to Code Quest</Link>
            <Link href="/courses/code-quest/level-5" style={{ ...s.btnPurple, textDecoration: 'none', display: 'inline-block' }}>Next Level →</Link>
          </div>
        </div>
      )}
    </div>
  )
}