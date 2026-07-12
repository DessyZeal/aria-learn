'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { CSSProperties } from 'react'

type Step = 'story' | 'learn' | 'activity' | 'quiz' | 'badge'

const STEPS: Step[] = ['story', 'learn', 'activity', 'quiz', 'badge']

const quiz = [
  {
    q: 'What is a function in coding?',
    options: [
      'A type of loop that runs forever',
      'A reusable block of code that does a specific task',
      'A variable that stores a number',
      'A command that deletes code',
    ],
    answer: 'A reusable block of code that does a specific task',
  },
  {
    q: 'Why are functions useful?',
    options: [
      'They make programs run slower',
      'They let you reuse code without writing it again',
      'They only work with numbers',
      'They replace loops completely',
    ],
    answer: 'They let you reuse code without writing it again',
  },
  {
    q: 'Emeka defines build_wall() once. He calls it 4 times. How many times does the wall-building code run?',
    options: ['1 time', '2 times', '4 times', '0 times'],
    answer: '4 times',
  },
]

type Task = 'wall' | 'roof' | 'door' | 'window'

interface BuildTask {
  key: Task
  emoji: string
  label: string
  functionName: string
}

const BUILD_TASKS: BuildTask[] = [
  { key: 'wall',   emoji: '🧱', label: 'Walls',   functionName: 'build_wall()' },
  { key: 'roof',   emoji: '🏠', label: 'Roof',    functionName: 'build_roof()' },
  { key: 'door',   emoji: '🚪', label: 'Door',    functionName: 'add_door()' },
  { key: 'window', emoji: '🪟', label: 'Windows', functionName: 'add_window()' },
]

export default function CQLevel6() {
  const [step, setStep]                   = useState<Step>('story')
  const [called, setCalled]               = useState<Task[]>([])
  const [activityDone, setActivityDone]   = useState(false)
  const [quizAnswers, setQuizAnswers]     = useState<Record<number, string>>({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [score, setScore]                 = useState(0)
  const [saving, setSaving]               = useState(false)

  useEffect(() => { document.title = 'Àrìa Learn — Code Quest Level 6' }, [])

  const callFunction = (task: Task) => {
    if (called.includes(task)) return
    const next = [...called, task]
    setCalled(next)
    if (next.length === BUILD_TASKS.length) setActivityDone(true)
  }

  const resetActivity = () => {
    setCalled([])
    setActivityDone(false)
  }

  const submitQuiz = async () => {
    let correct = 0
    quiz.forEach((q, i) => { if (quizAnswers[i] === q.answer) correct++ })
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
      const { data: prof } = await supabase.from('profiles').select('xp, cq_progress, badges').eq('id', user.id).single()
      const currentProgress: { completed: number[]; current: number } =
        (prof?.cq_progress as { completed: number[]; current: number }) ?? { completed: [], current: 1 }
      if (!currentProgress.completed.includes(6)) {
        currentProgress.completed.push(6)
        currentProgress.current = 7
      }
      await supabase.from('profiles').update({
        xp: ((prof?.xp as number) || 0) + 50,
        cq_progress: currentProgress,
        badges: [...new Set([...((prof?.badges as string[]) || []), 'function_builder'])],
        last_active: new Date().toISOString(),
      }).eq('id', user.id)
    } catch (err) { console.error(err) } finally { setSaving(false) }
  }

  const s: {
    page: CSSProperties; topbar: CSSProperties; backBtn: CSSProperties; title: CSSProperties
    badgeChip: CSSProperties; card: CSSProperties; h2: CSSProperties; body: CSSProperties
    scene: CSSProperties; btnGreen: CSSProperties; btnPurple: CSSProperties
    option: (sel: boolean, correct: boolean, submitted: boolean, isAnswer: boolean) => CSSProperties
  } = {
    page:      { minHeight: '100vh', background: '#f4fbf7', fontFamily: 'Nunito, sans-serif' },
    topbar:    { background: '#0f1f17', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 16 },
    backBtn:   { background: 'none', border: '1.5px solid #3a5a44', color: '#8aad96', padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 700, cursor: 'pointer', textDecoration: 'none', display: 'inline-block' },
    title:     { fontFamily: "'Baloo 2', cursive", fontSize: 16, fontWeight: 800, color: 'white', flex: 1 },
    badgeChip: { background: '#6c4fc7', color: 'white', fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 20 },
    card:      { background: 'white', borderRadius: 16, padding: 28, maxWidth: 680, margin: '32px auto', boxShadow: '0 2px 16px #1a7a4a10' },
    h2:        { fontFamily: "'Baloo 2', cursive", fontSize: 26, fontWeight: 800, color: '#0f1f17', marginBottom: 12 },
    body:      { fontSize: 15, color: '#1a2e22', lineHeight: 1.7, marginBottom: 16, fontWeight: 600 },
    scene:     { background: 'linear-gradient(135deg, #0f2d1a, #1a4a2a)', borderRadius: 14, padding: 28, textAlign: 'center', marginBottom: 20 },
    btnGreen:  { background: '#1a7a4a', color: 'white', border: 'none', padding: '12px 28px', borderRadius: 50, fontSize: 15, fontWeight: 800, cursor: 'pointer', marginTop: 16 },
    btnPurple: { background: '#6c4fc7', color: 'white', border: 'none', padding: '12px 28px', borderRadius: 50, fontSize: 15, fontWeight: 800, cursor: 'pointer', marginTop: 16 },
    option:    (sel, _c, submitted, isAnswer) => ({
      background: submitted ? (isAnswer ? '#e6f7ee' : sel ? '#fff0f0' : 'white') : sel ? '#f0edfd' : 'white',
      border: `2px solid ${submitted ? (isAnswer ? '#1a7a4a' : sel ? '#e84040' : '#d4ece0') : sel ? '#6c4fc7' : '#d4ece0'}`,
      borderRadius: 10, padding: '12px 16px', cursor: submitted ? 'default' : 'pointer',
      fontSize: 14, fontWeight: 600, color: '#1a2e22', marginBottom: 8, display: 'block', width: '100%', textAlign: 'left',
    }),
  }

  const stepIndex = STEPS.indexOf(step)
  const wellProgress = Math.round((called.length / BUILD_TASKS.length) * 100)

  return (
    <div style={s.page}>
      <div style={s.topbar}>
        <Link href="/courses/code-quest" style={s.backBtn}>← Back</Link>
        <div style={s.title}>💻 Code Quest — Level 6: The Village Builder</div>
        <div style={s.badgeChip}>⭐ 50 XP</div>
      </div>

      <div style={{ background: 'white', borderBottom: '1.5px solid #d4ece0', padding: '10px 24px', display: 'flex', gap: 6 }}>
        {STEPS.map((st, i) => (
          <div key={st} style={{ height: 8, borderRadius: 4, flex: 1, background: stepIndex >= i ? '#1a7a4a' : '#e0ede7' }} />
        ))}
      </div>

      {/* STORY */}
      {step === 'story' && (
        <div style={s.card}>
          <div style={s.scene}>
            <div style={{ fontSize: 72 }}>🏗️</div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginTop: 8 }}>Emeka&apos;s Village · Building Season</div>
          </div>
          <h2 style={s.h2}>The Village Builder 🏗️</h2>
          <p style={s.body}>The community has decided to build a new well house for the village. Emeka has been chosen to lead the construction crew. He needs to give each worker clear instructions.</p>
          <p style={s.body}>The problem is that the village needs to build <strong>four identical well houses</strong> across different parts of the community. Writing the same instructions four times would be exhausting and messy.</p>
          <p style={s.body}>Emeka discovers <strong>functions</strong>, a way to write instructions once and call them as many times as needed!</p>
          <button style={s.btnGreen} onClick={() => setStep('learn')}>Learn the concept →</button>
        </div>
      )}

      {/* LEARN */}
      {step === 'learn' && (
        <div style={s.card}>
          <h2 style={s.h2}>📖 Functions — Define and Call</h2>
          <div style={{ background: '#e8f2fd', border: '1.5px solid #2176c7', borderRadius: 14, padding: 20, marginBottom: 20 }}>
            <p style={{ ...s.body, marginBottom: 8 }}>
              A <strong style={{ color: '#2176c7' }}>function</strong> is a reusable block of code that performs a specific task. You <strong>define</strong> it once, then <strong>call</strong> it whenever you need it.
            </p>
            <p style={{ ...s.body, marginBottom: 0 }}>
              This saves time, reduces mistakes, and makes your code clean and organised.
            </p>
          </div>
          <div style={{ background: '#e6f7ee', border: '1.5px solid #1a7a4a', borderRadius: 14, padding: 20, marginBottom: 20 }}>
            <p style={{ fontFamily: "'Baloo 2', cursive", fontSize: 16, fontWeight: 800, color: '#1a7a4a', marginBottom: 8 }}>Emeka&apos;s building function:</p>
            <div style={{ fontFamily: 'Courier New, monospace', fontSize: 13, color: '#0f1f17', lineHeight: 2 }}>
              <div style={{ color: '#2176c7' }}>// Define the function once</div>
              <div>function build_well_house() {'{'}</div>
              <div style={{ paddingLeft: 16 }}>build_wall()</div>
              <div style={{ paddingLeft: 16 }}>build_roof()</div>
              <div style={{ paddingLeft: 16 }}>add_door()</div>
              <div style={{ paddingLeft: 16 }}>add_window()</div>
              <div>{'}'}</div>
              <div style={{ marginTop: 8, color: '#2176c7' }}>// Call it 4 times, builds 4 houses!</div>
              <div>build_well_house()</div>
              <div>build_well_house()</div>
              <div>build_well_house()</div>
              <div>build_well_house()</div>
            </div>
          </div>
          <button style={s.btnPurple} onClick={() => setStep('activity')}>Try the activity →</button>
        </div>
      )}

      {/* ACTIVITY */}
      {step === 'activity' && (
        <div style={s.card}>
          <h2 style={s.h2}>🎯 Build the Well House</h2>
          <p style={s.body}>Call each building function by tapping it. All four functions must be called to complete the well house!</p>

          {/* Progress */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#5a7a66' }}>Building progress</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#1a7a4a' }}>{wellProgress}%</span>
            </div>
            <div style={{ background: '#e8f4ee', borderRadius: 8, height: 12, overflow: 'hidden' }}>
              <div style={{ height: '100%', background: '#1a7a4a', borderRadius: 8, width: `${wellProgress}%`, transition: 'width 0.4s ease' }} />
            </div>
          </div>

          {/* Function buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
            {BUILD_TASKS.map(({ key, emoji, label, functionName }) => (
              <button
                key={key}
                onClick={() => callFunction(key)}
                disabled={called.includes(key)}
                style={{
                  background: called.includes(key) ? '#e6f7ee' : '#f0edfd',
                  border: `2px solid ${called.includes(key) ? '#1a7a4a' : '#6c4fc7'}`,
                  borderRadius: 12, padding: '16px 12px', cursor: called.includes(key) ? 'default' : 'pointer',
                  display: 'flex', alignItems: 'center', gap: 12, transition: 'all 0.2s', opacity: called.includes(key) ? 0.8 : 1,
                }}
              >
                <span style={{ fontSize: 28 }}>{called.includes(key) ? '✅' : emoji}</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontFamily: "'Baloo 2', cursive", fontSize: 14, fontWeight: 800, color: '#0f1f17' }}>{label}</div>
                  <div style={{ fontFamily: 'Courier New, monospace', fontSize: 11, color: called.includes(key) ? '#1a7a4a' : '#6c4fc7', fontWeight: 700 }}>
                    {functionName}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {called.length > 0 && !activityDone && (
            <button style={{ ...s.btnGreen, background: '#5a7a66', marginTop: 8 }} onClick={resetActivity}>Reset</button>
          )}

          {activityDone && (
            <div style={{ background: '#e6f7ee', border: '1.5px solid #1a7a4a', borderRadius: 12, padding: 16, marginTop: 8 }}>
              <p style={{ fontFamily: "'Baloo 2', cursive", fontSize: 16, fontWeight: 800, color: '#1a7a4a' }}>🎉 The well house is built!</p>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#1a2e22', marginTop: 4 }}>You called all four functions in order. The village now has clean water, because you organised the code well!</p>
              <button style={s.btnPurple} onClick={() => setStep('quiz')}>Take the quiz →</button>
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
                  {quizSubmitted && opt === q.answer && '✅ '}
                  {quizSubmitted && quizAnswers[i] === opt && opt !== q.answer && '❌ '}
                  {opt}
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
                {score >= 2 ? `🎉 You scored ${score}/3 - Amazing!` : `You scored ${score}/3 — Try again!`}
              </p>
              {score < 2 && <button style={s.btnGreen} onClick={() => { setQuizAnswers({}); setQuizSubmitted(false) }}>Try again</button>}
            </div>
          )}
        </div>
      )}

      {/* BADGE */}
      {step === 'badge' && (
        <div style={{ ...s.card, textAlign: 'center' }}>
          <div style={{ fontSize: 80, marginBottom: 16 }}>🏗️</div>
          <h2 style={{ ...s.h2, textAlign: 'center' }}>You earned the Function Builder badge!</h2>
          <p style={{ ...s.body, textAlign: 'center' }}>You understand how to define and call functions. Emeka&apos;s village now has four well houses, all from one set of clean, reusable instructions!</p>
          <div style={{ background: '#fff8e8', border: '2px solid #f0a500', borderRadius: 16, padding: 16, margin: '20px auto', maxWidth: 300 }}>
            <div style={{ fontSize: 48 }}>🏗️</div>
            <div style={{ fontFamily: "'Baloo 2', cursive", fontSize: 20, fontWeight: 800, color: '#f0a500' }}>Function Builder</div>
            <div style={{ fontSize: 13, color: '#5a7a66', fontWeight: 600 }}>+50 XP earned</div>
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 8 }}>
            <Link href="/courses/code-quest" style={{ ...s.btnGreen, textDecoration: 'none', display: 'inline-block' }}>← Back to Code Quest</Link>
            <Link href="/courses/code-quest/level-7" style={{ ...s.btnPurple, textDecoration: 'none', display: 'inline-block' }}>Next Level →</Link>
          </div>
        </div>
      )}
    </div>
  )
}
