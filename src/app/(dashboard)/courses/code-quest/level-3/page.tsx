'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { CSSProperties } from 'react'

type Step = 'story' | 'learn' | 'activity' | 'quiz' | 'badge'

const STEPS: Step[] = ['story', 'learn', 'activity', 'quiz', 'badge']

const quiz = [
  {
    q: 'What does a loop help you do in coding?',
    options: [
      'Delete code',
      'Repeat an action without writing it many times',
      'Slow down the program',
      'Make the screen colourful',
    ],
    answer: 'Repeat an action without writing it many times',
  },
  {
    q: 'Farmer Chukwu has 7 yams. Using repeat(7), how many times will count_yam() run?',
    options: ['1 time', '7 times', 'Forever', '0 times'],
    answer: '7 times',
  },
  {
    q: 'Without loops, what would Chukwu have to do to count 7 yams?',
    options: [
      'Write count_yam() seven separate times',
      'Nothing, it counts automatically',
      'Use a calculator instead',
      'Ask someone else to count',
    ],
    answer: 'Write count_yam() seven separate times',
  },
]

export default function CQLevel3() {
  const [step, setStep]                   = useState<Step>('story')
  const [repeatCount, setRepeatCount]     = useState<number>(0)
  const [activityDone, setActivityDone]   = useState(false)
  const [quizAnswers, setQuizAnswers]     = useState<Record<number, string>>({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [score, setScore]                 = useState(0)
  const [saving, setSaving]               = useState(false)

  useEffect(() => { document.title = 'Àrìa Learn — Code Quest Level 3' }, [])

  const tapYam = () => {
    if (repeatCount < 5) {
      const next = repeatCount + 1
      setRepeatCount(next)
      if (next === 5) setActivityDone(true)
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
      if (!currentProgress.completed.includes(3)) {
        currentProgress.completed.push(3)
        currentProgress.current = 4
      }
      await supabase
        .from('profiles')
        .update({
          xp: ((prof?.xp as number) || 0) + 50,
          cq_progress: currentProgress,
          badges: [...new Set([...((prof?.badges as string[]) || []), 'loop_master'])],
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
    badgeChip: CSSProperties
    card: CSSProperties
    h2: CSSProperties
    body: CSSProperties
    scene: CSSProperties
    btnGreen: CSSProperties
    btnPurple: CSSProperties
    option: (selected: boolean, correct: boolean, submitted: boolean, isAnswer: boolean) => CSSProperties
  } = {
    page:      { minHeight: '100vh', background: '#f4fbf7', fontFamily: 'Nunito, sans-serif' },
    topbar:    { background: '#0f1f17', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 16 },
    backBtn:   { background: 'none', border: '1.5px solid #3a5a44', color: '#8aad96', padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 700, cursor: 'pointer', textDecoration: 'none', display: 'inline-block' },
    title:     { fontFamily: "'Baloo 2', cursive", fontSize: 16, fontWeight: 800, color: 'white', flex: 1 },
    badgeChip: { background: '#6c4fc7', color: 'white', fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 20 },
    card:      { background: 'white', borderRadius: 16, padding: 28, maxWidth: 680, margin: '32px auto', boxShadow: '0 2px 16px #1a7a4a10' },
    h2:        { fontFamily: "'Baloo 2', cursive", fontSize: 26, fontWeight: 800, color: '#0f1f17', marginBottom: 12 },
    body:      { fontSize: 15, color: '#1a2e22', lineHeight: 1.7, marginBottom: 16, fontWeight: 600 },
    scene:     { background: 'linear-gradient(135deg, #3d2a0f, #5a3d1a)', borderRadius: 14, padding: 28, textAlign: 'center', marginBottom: 20 },
    btnGreen:  { background: '#1a7a4a', color: 'white', border: 'none', padding: '12px 28px', borderRadius: 50, fontSize: 15, fontWeight: 800, cursor: 'pointer', marginTop: 16 },
    btnPurple: { background: '#6c4fc7', color: 'white', border: 'none', padding: '12px 28px', borderRadius: 50, fontSize: 15, fontWeight: 800, cursor: 'pointer', marginTop: 16 },
    option:    (sel, _correct, submitted, isAnswer) => ({
      background: submitted ? (isAnswer ? '#e6f7ee' : sel ? '#fff0f0' : 'white') : sel ? '#f0edfd' : 'white',
      border: `2px solid ${submitted ? (isAnswer ? '#1a7a4a' : sel ? '#e84040' : '#d4ece0') : sel ? '#6c4fc7' : '#d4ece0'}`,
      borderRadius: 10, padding: '12px 16px', cursor: submitted ? 'default' : 'pointer',
      fontSize: 14, fontWeight: 600, color: '#1a2e22', marginBottom: 8, display: 'block', width: '100%', textAlign: 'left',
    }),
  }

  const stepIndex = STEPS.indexOf(step)

  return (
    <div style={s.page}>
      {/* TOPBAR */}
      <div style={s.topbar}>
        <Link href="/courses/code-quest" style={s.backBtn}>← Back</Link>
        <div style={s.title}>💻 Code Quest — Level 3: Counting the Yams</div>
        <div style={s.badgeChip}>⭐ 50 XP</div>
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
            <div style={{ fontSize: 72 }}>🍠</div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginTop: 8 }}>
              Mr Chukwu&apos;s Farm · Harvest Season
            </div>
          </div>
          <h2 style={s.h2}>Counting the Yams 🍠</h2>
          <p style={s.body}>
            Farmer Chukwu just harvested a huge pile of yams from his farm. He needs to count every single one to know how much he can sell at the Aba market.
          </p>
          <p style={s.body}>
            If he writes &quot;count one yam&quot; seven separate times, his program would be long and tiring to write. There must be a smarter way!
          </p>
          <p style={s.body}>
            Help Chukwu discover the power of <strong>loops</strong>, a way to repeat an action without writing it over and over again.
          </p>
          <button style={s.btnGreen} onClick={() => setStep('learn')}>Learn the concept →</button>
        </div>
      )}

      {/* LEARN */}
      {step === 'learn' && (
        <div style={s.card}>
          <h2 style={s.h2}>📖 Loops - repeat()</h2>
          <div style={{ background: '#fff8e8', border: '1.5px solid #f0a500', borderRadius: 14, padding: 20, marginBottom: 20 }}>
            <p style={{ ...s.body, marginBottom: 8 }}>
              A <strong style={{ color: '#f0a500' }}>loop</strong> lets a computer repeat an action multiple times without you writing the same line again and again.
            </p>
            <p style={{ ...s.body, marginBottom: 0 }}>
              In code, this is written as{' '}
              <code style={{ background: '#fff', padding: '2px 8px', borderRadius: 6, fontFamily: 'Courier New' }}>repeat(7)</code>{' '}
               meaning &quot;do this 7 times.&quot;
            </p>
          </div>
          <div style={{ background: '#e6f7ee', border: '1.5px solid #1a7a4a', borderRadius: 14, padding: 20, marginBottom: 20 }}>
            <p style={{ fontFamily: "'Baloo 2', cursive", fontSize: 16, fontWeight: 800, color: '#1a7a4a', marginBottom: 8 }}>Example:</p>
            <div style={{ fontFamily: 'Courier New, monospace', fontSize: 14, color: '#0f1f17', lineHeight: 2 }}>
              <div style={{ color: '#e84040' }}>❌ Without a loop:</div>
              <div>count_yam()</div>
              <div>count_yam()</div>
              <div>count_yam()</div>
              <div>...written 7 times</div>
              <div style={{ marginTop: 8, color: '#1a7a4a' }}>✅ With a loop:</div>
              <div>repeat(7) {'{ count_yam() }'}</div>
            </div>
          </div>
          <button style={s.btnPurple} onClick={() => setStep('activity')}>Try the activity →</button>
        </div>
      )}

      {/* ACTIVITY */}
      {step === 'activity' && (
        <div style={s.card}>
          <h2 style={s.h2}>🎯 Help Farmer Chukwu Count</h2>
          <p style={s.body}>
            Tap the yam button 5 times to simulate{' '}
            <code style={{ background: '#f0edfd', padding: '2px 8px', borderRadius: 6 }}>repeat(5)</code>{' '}
            running count_yam() five times!
          </p>

          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <button
              onClick={tapYam}
              disabled={activityDone}
              style={{ fontSize: 64, background: 'none', border: 'none', cursor: activityDone ? 'default' : 'pointer' }}
            >
              🍠
            </button>
            <div style={{ fontFamily: "'Baloo 2', cursive", fontSize: 32, fontWeight: 800, color: '#1a7a4a', marginTop: 8 }}>
              {repeatCount} / 5
            </div>
            <div style={{ fontSize: 13, color: '#5a7a66', fontWeight: 600 }}>yams counted</div>
          </div>

          {/* Progress bar */}
          <div style={{ background: '#e8f4ee', borderRadius: 8, height: 12, margin: '0 0 16px', overflow: 'hidden' }}>
            <div style={{ height: '100%', background: '#1a7a4a', borderRadius: 8, width: `${(repeatCount / 5) * 100}%`, transition: 'width 0.3s ease' }} />
          </div>

          {activityDone && (
            <div style={{ background: '#e6f7ee', border: '1.5px solid #1a7a4a', borderRadius: 12, padding: 16, marginTop: 16 }}>
              <p style={{ fontFamily: "'Baloo 2', cursive", fontSize: 16, fontWeight: 800, color: '#1a7a4a' }}>
                🎉 All 5 yams counted!
              </p>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#1a2e22', marginTop: 4 }}>
                You just simulated repeat(5)  one instruction running 5 times instead of writing it 5 separate times!
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
                <button
                  key={opt}
                  style={s.option(quizAnswers[i] === opt, quizAnswers[i] === q.answer, quizSubmitted, opt === q.answer)}
                  onClick={() => !quizSubmitted && setQuizAnswers(prev => ({ ...prev, [i]: opt }))}
                >
                  {quizSubmitted && opt === q.answer && '✅ '}
                  {quizSubmitted && quizAnswers[i] === opt && opt !== q.answer && '❌ '}
                  {opt}
                </button>
              ))}
            </div>
          ))}
          {!quizSubmitted ? (
            <button
              style={s.btnPurple}
              onClick={submitQuiz}
              disabled={Object.keys(quizAnswers).length < quiz.length || saving}
            >
              {saving ? 'Saving...' : 'Submit answers'}
            </button>
          ) : (
            <div style={{ background: score >= 2 ? '#e6f7ee' : '#fff0f0', border: `1.5px solid ${score >= 2 ? '#1a7a4a' : '#f5a0a0'}`, borderRadius: 12, padding: 16, marginTop: 8 }}>
              <p style={{ fontFamily: "'Baloo 2', cursive", fontSize: 18, fontWeight: 800, color: score >= 2 ? '#1a7a4a' : '#e84040' }}>
                {score >= 2 ? `🎉 You scored ${score}/3 — Amazing!` : `You scored ${score}/3 — Try again!`}
              </p>
              {score < 2 && (
                <button style={s.btnGreen} onClick={() => { setQuizAnswers({}); setQuizSubmitted(false) }}>
                  Try again
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* BADGE */}
      {step === 'badge' && (
        <div style={{ ...s.card, textAlign: 'center' }}>
          <div style={{ fontSize: 80, marginBottom: 16 }}>🔄</div>
          <h2 style={{ ...s.h2, textAlign: 'center' }}>You earned the Loop Master badge!</h2>
          <p style={{ ...s.body, textAlign: 'center' }}>
            You now understand how loops save time and effort in coding. Chukwu can count his entire harvest in seconds, thanks to you!
          </p>
          <div style={{ background: '#fff8e8', border: '2px solid #f0a500', borderRadius: 16, padding: 16, margin: '20px auto', maxWidth: 300 }}>
            <div style={{ fontSize: 48 }}>🔄</div>
            <div style={{ fontFamily: "'Baloo 2', cursive", fontSize: 20, fontWeight: 800, color: '#f0a500' }}>Loop Master</div>
            <div style={{ fontSize: 13, color: '#5a7a66', fontWeight: 600 }}>+50 XP earned</div>
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 8 }}>
            <Link href="/courses/code-quest" style={{ ...s.btnGreen, textDecoration: 'none', display: 'inline-block' }}>
              ← Back to Code Quest
            </Link>
            <Link href="/courses/code-quest/level-4" style={{ ...s.btnPurple, textDecoration: 'none', display: 'inline-block' }}>
              Next Level →
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
