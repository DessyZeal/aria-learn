'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { CSSProperties } from 'react'

type Step = 'story' | 'learn' | 'activity' | 'quiz' | 'badge'

const STEPS: Step[] = ['story', 'learn', 'activity', 'quiz', 'badge']

const quiz = [
  {
    q: 'What is a nested condition?',
    options: [
      'A loop inside another loop',
      'An if statement inside another if statement',
      'A function that calls itself',
      'A variable that stores multiple values',
    ],
    answer: 'An if statement inside another if statement',
  },
  {
    q: 'In Boolean logic, what does AND mean?',
    options: [
      'Either one condition must be true',
      'Both conditions must be true',
      'Neither condition is true',
      'Only the first condition matters',
    ],
    answer: 'Both conditions must be true',
  },
  {
    q: 'Mama Ngozi checks: has_tomatoes AND has_rice. She has tomatoes but NO rice. What happens?',
    options: [
      'The jollof rice is made',
      'The jollof rice is NOT made because both must be true',
      'The tomatoes are used anyway',
      'The program crashes',
    ],
    answer: 'The jollof rice is NOT made because both must be true',
  },
]

type Ingredient = 'tomatoes' | 'rice' | 'pepper' | 'onions'

export default function CQLevel5() {
  const [step, setStep]                   = useState<Step>('story')
  const [ingredients, setIngredients]     = useState<Record<Ingredient, boolean>>({ tomatoes: false, rice: false, pepper: false, onions: false })
  const [recipeResult, setRecipeResult]   = useState<'success' | 'fail' | null>(null)
  const [activityDone, setActivityDone]   = useState(false)
  const [quizAnswers, setQuizAnswers]     = useState<Record<number, string>>({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [score, setScore]                 = useState(0)
  const [saving, setSaving]               = useState(false)

  useEffect(() => { document.title = 'Àrìa Learn — Code Quest Level 5' }, [])

  const toggleIngredient = (item: Ingredient) => {
    setIngredients(prev => ({ ...prev, [item]: !prev[item] }))
    setRecipeResult(null)
    setActivityDone(false)
  }

  const checkRecipe = () => {
    const { tomatoes, rice, pepper, onions } = ingredients
    if (tomatoes && rice && pepper && onions) {
      setRecipeResult('success')
      setActivityDone(true)
    } else {
      setRecipeResult('fail')
    }
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
      if (!currentProgress.completed.includes(5)) {
        currentProgress.completed.push(5)
        currentProgress.current = 6
      }
      await supabase.from('profiles').update({
        xp: ((prof?.xp as number) || 0) + 50,
        cq_progress: currentProgress,
        badges: [...new Set([...((prof?.badges as string[]) || []), 'logic_chef'])],
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
    scene:     { background: 'linear-gradient(135deg, #2d1a0f, #4a2a1a)', borderRadius: 14, padding: 28, textAlign: 'center', marginBottom: 20 },
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
  const ingredientList: { key: Ingredient; emoji: string; label: string }[] = [
    { key: 'tomatoes', emoji: '🍅', label: 'Tomatoes' },
    { key: 'rice',     emoji: '🍚', label: 'Rice' },
    { key: 'pepper',   emoji: '🌶️', label: 'Pepper' },
    { key: 'onions',   emoji: '🧅', label: 'Onions' },
  ]

  return (
    <div style={s.page}>
      <div style={s.topbar}>
        <Link href="/courses/code-quest" style={s.backBtn}>← Back</Link>
        <div style={s.title}>💻 Code Quest - Level 5: Mama&apos;s Recipe</div>
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
            <div style={{ fontSize: 72 }}>🍛</div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginTop: 8 }}>Mama Ngozi&apos;s Kitchen · Sunday Afternoon</div>
          </div>
          <h2 style={s.h2}>Mama&apos;s Recipe 🍛</h2>
          <p style={s.body}>Every Sunday, Mama Ngozi makes the best jollof rice in the neighbourhood. But her recipe is very precise, she will only start cooking <strong>if she has ALL the ingredients</strong>. If even one is missing, she sends someone to the market first.</p>
          <p style={s.body}>Her recipe is like a program with <strong>nested conditions</strong>, if this AND that AND the other are true, only then do we cook.</p>
          <p style={s.body}>Help Mama Ngozi write the logic that checks her ingredients before she starts cooking!</p>
          <button style={s.btnGreen} onClick={() => setStep('learn')}>Learn the concept →</button>
        </div>
      )}

      {/* LEARN */}
      {step === 'learn' && (
        <div style={s.card}>
          <h2 style={s.h2}>📖 Nested Conditions & Boolean Logic</h2>
          <div style={{ background: '#fff8e8', border: '1.5px solid #f0a500', borderRadius: 14, padding: 20, marginBottom: 20 }}>
            <p style={{ ...s.body, marginBottom: 8 }}>
              <strong style={{ color: '#f0a500' }}>Nested conditions</strong> are if statements inside other if statements. They let you check multiple things before doing something.
            </p>
            <p style={{ ...s.body, marginBottom: 0 }}>
              <strong style={{ color: '#f0a500' }}>Boolean logic</strong> uses AND, OR, NOT to combine conditions. <strong>AND</strong> means ALL conditions must be true.
            </p>
          </div>
          <div style={{ background: '#e6f7ee', border: '1.5px solid #1a7a4a', borderRadius: 14, padding: 20, marginBottom: 20 }}>
            <p style={{ fontFamily: "'Baloo 2', cursive", fontSize: 16, fontWeight: 800, color: '#1a7a4a', marginBottom: 8 }}>Mama&apos;s recipe in code:</p>
            <div style={{ fontFamily: 'Courier New, monospace', fontSize: 13, color: '#0f1f17', lineHeight: 2 }}>
              <div>if (has_tomatoes AND has_rice) {'{'}</div>
              <div style={{ paddingLeft: 16 }}>if (has_pepper AND has_onions) {'{'}</div>
              <div style={{ paddingLeft: 32 }}>cook_jollof_rice()</div>
              <div style={{ paddingLeft: 16 }}>{'}'}</div>
              <div>{'}'} else {'{'}</div>
              <div style={{ paddingLeft: 16 }}>go_to_market()</div>
              <div>{'}'}</div>
            </div>
          </div>
          <button style={s.btnPurple} onClick={() => setStep('activity')}>Try the activity →</button>
        </div>
      )}

      {/* ACTIVITY */}
      {step === 'activity' && (
        <div style={s.card}>
          <h2 style={s.h2}>🎯 Stock Mama&apos;s Kitchen</h2>
          <p style={s.body}>Toggle each ingredient ON or OFF to stock the kitchen. Then run the recipe check, ALL four ingredients must be available for Mama to cook!</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
            {ingredientList.map(({ key, emoji, label }) => (
              <button
                key={key}
                onClick={() => toggleIngredient(key)}
                style={{
                  background: ingredients[key] ? '#e6f7ee' : '#f8f8f8',
                  border: `2px solid ${ingredients[key] ? '#1a7a4a' : '#d4ece0'}`,
                  borderRadius: 12, padding: '16px 12px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 12, transition: 'all 0.2s',
                }}
              >
                <span style={{ fontSize: 28 }}>{emoji}</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontFamily: "'Baloo 2', cursive", fontSize: 15, fontWeight: 800, color: '#0f1f17' }}>{label}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: ingredients[key] ? '#1a7a4a' : '#aaa' }}>
                    {ingredients[key] ? '✅ Available' : '❌ Missing'}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <button style={s.btnGreen} onClick={checkRecipe}>🍳 Run Recipe Check</button>

          {recipeResult === 'success' && (
            <div style={{ background: '#e6f7ee', border: '1.5px solid #1a7a4a', borderRadius: 12, padding: 16, marginTop: 16 }}>
              <p style={{ fontFamily: "'Baloo 2', cursive", fontSize: 16, fontWeight: 800, color: '#1a7a4a' }}>🎉 Jollof rice is cooking!</p>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#1a2e22', marginTop: 4 }}>All conditions were TRUE, the nested if/AND logic passed every check. Mama is cooking!</p>
              <button style={s.btnPurple} onClick={() => setStep('quiz')}>Take the quiz →</button>
            </div>
          )}
          {recipeResult === 'fail' && (
            <div style={{ background: '#fff0f0', border: '1.5px solid #f5a0a0', borderRadius: 12, padding: 16, marginTop: 16 }}>
              <p style={{ fontFamily: "'Baloo 2', cursive", fontSize: 16, fontWeight: 800, color: '#e84040' }}>🛒 Someone must go to the market!</p>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#1a2e22', marginTop: 4 }}>Not all ingredients are available. Toggle ALL four to ON and try again!</p>
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
          <div style={{ fontSize: 80, marginBottom: 16 }}>🍛</div>
          <h2 style={{ ...s.h2, textAlign: 'center' }}>You earned the Logic Chef badge!</h2>
          <p style={{ ...s.body, textAlign: 'center' }}>You understand nested conditions and Boolean AND logic. Mama&apos;s jollof rice came out perfectly — because your logic was right!</p>
          <div style={{ background: '#fff8e8', border: '2px solid #f0a500', borderRadius: 16, padding: 16, margin: '20px auto', maxWidth: 300 }}>
            <div style={{ fontSize: 48 }}>🍛</div>
            <div style={{ fontFamily: "'Baloo 2', cursive", fontSize: 20, fontWeight: 800, color: '#f0a500' }}>Logic Chef</div>
            <div style={{ fontSize: 13, color: '#5a7a66', fontWeight: 600 }}>+50 XP earned</div>
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 8 }}>
            <Link href="/courses/code-quest" style={{ ...s.btnGreen, textDecoration: 'none', display: 'inline-block' }}>← Back to Code Quest</Link>
            <Link href="/courses/code-quest/level-6" style={{ ...s.btnPurple, textDecoration: 'none', display: 'inline-block' }}>Next Level →</Link>
          </div>
        </div>
      )}
    </div>
  )
}
