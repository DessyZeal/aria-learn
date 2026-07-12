'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { CSSProperties } from 'react'

type Step = 'story' | 'learn' | 'activity' | 'quiz' | 'badge'

const STEPS: Step[] = ['story', 'learn', 'activity', 'quiz', 'badge']

const quiz = [
  {
    q: 'What is a variable in coding?',
    options: [
      'A type of loop',
      'A named container that stores a value',
      'A function that runs automatically',
      'A condition that checks true or false',
    ],
    answer: 'A named container that stores a value',
  },
  {
    q: 'Fatima stores 50 bags of rice in a variable called harvest. Later she adds 20 more. What is harvest now?',
    options: ['50', '20', '70', '30'],
    answer: '70',
  },
  {
    q: 'Why are variables useful?',
    options: [
      'They make programs slower',
      'They let you store and reuse values throughout your program',
      'They only work with text',
      'They replace functions',
    ],
    answer: 'They let you store and reuse values throughout your program',
  },
]

interface HarvestItem {
  name: string
  emoji: string
  variable: string
  amount: number
}

const ITEMS: HarvestItem[] = [
  { name: 'Rice bags',   emoji: '🌾', variable: 'rice_bags',    amount: 0 },
  { name: 'Yam tubers',  emoji: '🍠', variable: 'yam_tubers',   amount: 0 },
  { name: 'Corn cobs',   emoji: '🌽', variable: 'corn_cobs',    amount: 0 },
]

export default function CQLevel7() {
  const [step, setStep]                   = useState<Step>('story')
  const [harvest, setHarvest]             = useState<Record<string, number>>({ rice_bags: 0, yam_tubers: 0, corn_cobs: 0 })
  const [activityDone, setActivityDone]   = useState(false)
  const [quizAnswers, setQuizAnswers]     = useState<Record<number, string>>({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [score, setScore]                 = useState(0)
  const [saving, setSaving]               = useState(false)
  const [savedMessage, setSavedMessage]   = useState('')

  useEffect(() => { document.title = 'Àrìa Learn — Code Quest Level 7' }, [])

  const addToHarvest = (variable: string, amount: number) => {
    setHarvest(prev => {
      const next = { ...prev, [variable]: prev[variable] + amount }
      const total = Object.values(next).reduce((a, b) => a + b, 0)
      if (total >= 15) setActivityDone(true)
      return next
    })
    setSavedMessage(`Stored! ${variable} updated ✅`)
    setTimeout(() => setSavedMessage(''), 1500)
  }

  const resetHarvest = () => {
    setHarvest({ rice_bags: 0, yam_tubers: 0, corn_cobs: 0 })
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
      if (!currentProgress.completed.includes(7)) {
        currentProgress.completed.push(7)
        currentProgress.current = 8
      }
      await supabase.from('profiles').update({
        xp: ((prof?.xp as number) || 0) + 50,
        cq_progress: currentProgress,
        badges: [...new Set([...((prof?.badges as string[]) || []), 'data_keeper'])],
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
    scene:     { background: 'linear-gradient(135deg, #1a2e0f, #2a4a1a)', borderRadius: 14, padding: 28, textAlign: 'center', marginBottom: 20 },
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
  const totalHarvest = Object.values(harvest).reduce((a, b) => a + b, 0)

  return (
    <div style={s.page}>
      <div style={s.topbar}>
        <Link href="/courses/code-quest" style={s.backBtn}>← Back</Link>
        <div style={s.title}>💻 Code Quest — Level 7: Saving the Harvest</div>
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
            <div style={{ fontSize: 72 }}>⛈️</div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginTop: 8 }}>Fatima&apos;s Farm · Storm Season</div>
          </div>
          <h2 style={s.h2}>Saving the Harvest 📦</h2>
          <p style={s.body}>Dark clouds are gathering over Fatima&apos;s farm. A big storm is coming and she only has a few hours to count and store all her harvest before it gets damaged.</p>
          <p style={s.body}>She needs to keep track of how many bags of rice, yam tubers and corn cobs she has collected. If she loses count, she won&apos;t know what to sell at the market.</p>
          <p style={s.body}>Help Fatima use <strong>variables</strong> to store and track every item of her harvest before the storm arrives!</p>
          <button style={s.btnGreen} onClick={() => setStep('learn')}>Learn the concept →</button>
        </div>
      )}

      {/* LEARN */}
      {step === 'learn' && (
        <div style={s.card}>
          <h2 style={s.h2}>📖 Variables — Storing Data</h2>
          <div style={{ background: '#fff8e8', border: '1.5px solid #f0a500', borderRadius: 14, padding: 20, marginBottom: 20 }}>
            <p style={{ ...s.body, marginBottom: 8 }}>
              A <strong style={{ color: '#f0a500' }}>variable</strong> is like a labelled box that stores a value. You give it a name, put something inside, and can update or read it any time.
            </p>
            <p style={{ ...s.body, marginBottom: 0 }}>
              Variables let your program <strong>remember</strong> information as it runs.
            </p>
          </div>
          <div style={{ background: '#e6f7ee', border: '1.5px solid #1a7a4a', borderRadius: 14, padding: 20, marginBottom: 20 }}>
            <p style={{ fontFamily: "'Baloo 2', cursive", fontSize: 16, fontWeight: 800, color: '#1a7a4a', marginBottom: 8 }}>Fatima&apos;s harvest in code:</p>
            <div style={{ fontFamily: 'Courier New, monospace', fontSize: 13, color: '#0f1f17', lineHeight: 2 }}>
              <div style={{ color: '#5a7a66' }}>// Create variables to store each item</div>
              <div>let rice_bags = 0</div>
              <div>let yam_tubers = 0</div>
              <div>let corn_cobs = 0</div>
              <div style={{ marginTop: 8, color: '#5a7a66' }}>// Update as she counts</div>
              <div>rice_bags = rice_bags + 5</div>
              <div>yam_tubers = yam_tubers + 8</div>
              <div style={{ marginTop: 8, color: '#5a7a66' }}>// Read the total any time</div>
              <div>total = rice_bags + yam_tubers + corn_cobs</div>
            </div>
          </div>
          <button style={s.btnPurple} onClick={() => setStep('activity')}>Try the activity →</button>
        </div>
      )}

      {/* ACTIVITY */}
      {step === 'activity' && (
        <div style={s.card}>
          <h2 style={s.h2}>🎯 Store Fatima&apos;s Harvest</h2>
          <p style={s.body}>Click &quot;+Add&quot; to add items to each variable. Get the total to 15 or more to safely store the harvest before the storm!</p>

          {/* Variable display */}
          <div style={{ background: '#0f1f17', borderRadius: 12, padding: 16, marginBottom: 20, fontFamily: 'Courier New, monospace', fontSize: 13, color: '#9ecfb0', lineHeight: 2.2 }}>
            {ITEMS.map(item => (
              <div key={item.variable}>
                <span style={{ color: '#f0a500' }}>{item.variable}</span>
                <span style={{ color: 'white' }}> = </span>
                <span style={{ color: '#25a864', fontWeight: 700 }}>{harvest[item.variable]}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid #2a4a2a', marginTop: 8, paddingTop: 8 }}>
              <span style={{ color: '#f0a500' }}>total</span>
              <span style={{ color: 'white' }}> = </span>
              <span style={{ color: totalHarvest >= 15 ? '#25a864' : '#f0a500', fontWeight: 700 }}>{totalHarvest}</span>
            </div>
          </div>

          {savedMessage && (
            <div style={{ background: '#e6f7ee', border: '1.5px solid #1a7a4a', borderRadius: 8, padding: '8px 14px', marginBottom: 12, fontSize: 13, fontWeight: 700, color: '#1a7a4a' }}>
              {savedMessage}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
            {ITEMS.map(item => (
              <div key={item.variable} style={{ background: '#f4fbf7', border: '1.5px solid #d4ece0', borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 28 }}>{item.emoji}</span>
                  <div>
                    <div style={{ fontFamily: "'Baloo 2', cursive", fontSize: 15, fontWeight: 800, color: '#0f1f17' }}>{item.name}</div>
                    <div style={{ fontFamily: 'Courier New, monospace', fontSize: 11, color: '#6c4fc7' }}>{item.variable} = {harvest[item.variable]}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[1, 3, 5].map(amt => (
                    <button
                      key={amt}
                      onClick={() => addToHarvest(item.variable, amt)}
                      style={{ background: '#1a7a4a', color: 'white', border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                    >
                      +{amt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {totalHarvest > 0 && !activityDone && (
              <button style={{ ...s.btnGreen, background: '#5a7a66', marginTop: 0 }} onClick={resetHarvest}>Reset</button>
            )}
          </div>

          {activityDone && (
            <div style={{ background: '#e6f7ee', border: '1.5px solid #1a7a4a', borderRadius: 12, padding: 16, marginTop: 8 }}>
              <p style={{ fontFamily: "'Baloo 2', cursive", fontSize: 16, fontWeight: 800, color: '#1a7a4a' }}>🎉 Harvest saved before the storm!</p>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#1a2e22', marginTop: 4 }}>
                You stored {totalHarvest} items across 3 variables. Fatima&apos;s harvest is safe and she knows exactly what to sell!
              </p>
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
          <div style={{ fontSize: 80, marginBottom: 16 }}>📦</div>
          <h2 style={{ ...s.h2, textAlign: 'center' }}>You earned the Data Keeper badge!</h2>
          <p style={{ ...s.body, textAlign: 'center' }}>
            You understand how variables store and track data. Fatima&apos;s harvest is safe — and she knows exactly what she has, all thanks to your variable skills!
          </p>
          <div style={{ background: '#fff8e8', border: '2px solid #f0a500', borderRadius: 16, padding: 16, margin: '20px auto', maxWidth: 300 }}>
            <div style={{ fontSize: 48 }}>📦</div>
            <div style={{ fontFamily: "'Baloo 2', cursive", fontSize: 20, fontWeight: 800, color: '#f0a500' }}>Data Keeper</div>
            <div style={{ fontSize: 13, color: '#5a7a66', fontWeight: 600 }}>+50 XP earned</div>
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 8 }}>
            <Link href="/courses/code-quest" style={{ ...s.btnGreen, textDecoration: 'none', display: 'inline-block' }}>← Back to Code Quest</Link>
            <Link href="/courses/code-quest/level-8" style={{ ...s.btnPurple, textDecoration: 'none', display: 'inline-block' }}>Next Level →</Link>
          </div>
        </div>
      )}
    </div>
  )
}
