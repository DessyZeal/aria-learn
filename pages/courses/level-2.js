import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { supabase } from '../../../lib/supabase'

export default function CQLevel2() {
  const router = useRouter()
  const [step, setStep] = useState('story') // story | learn | activity | quiz | badge
  const [selected, setSelected] = useState(null)
  const [quizAnswers, setQuizAnswers] = useState({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [saving, setSaving] = useState(false)
  const [dragItems, setDragItems] = useState(['Beat 3', 'Beat 1', 'Beat 4', 'Beat 2'])
  const [arranged, setArranged] = useState([])
  const [activityDone, setActivityDone] = useState(false)
  const [activityFeedback, setActivityFeedback] = useState('')

  const quiz = [
    {
      q: 'What does it mean to debug a program?',
      options: ['Delete the whole program', 'Find and fix errors in the code', 'Add more code to make it longer', 'Run the program faster'],
      answer: 'Find and fix errors in the code'
    },
    {
      q: 'Why does the ORDER of instructions matter in coding?',
      options: ['It does not matter at all', 'Computers follow instructions from bottom to top', 'Computers follow instructions exactly as written, in order', 'Only the last instruction matters'],
      answer: 'Computers follow instructions exactly as written, in order'
    },
    {
      q: 'Adaeze plays Beat 2 before Beat 1. What happens?',
      options: ['The message arrives correctly', 'The message is sent faster', 'The message is wrong because the order is wrong', 'Nothing happens'],
      answer: 'The message is wrong because the order is wrong'
    },
  ]

  const handleDrag = (item) => setSelected(item)

  const handleDrop = () => {
    if (!selected || arranged.includes(selected)) return
    setArranged(prev => [...prev, selected])
    setSelected(null)
  }

  const checkActivity = () => {
    const correct = ['Beat 1', 'Beat 2', 'Beat 3', 'Beat 4']
    const isCorrect = JSON.stringify(arranged) === JSON.stringify(correct)
    if (isCorrect) {
      setActivityFeedback('correct')
      setActivityDone(true)
    } else {
      setActivityFeedback('wrong')
    }
  }

  const resetActivity = () => {
    setArranged([])
    setActivityFeedback('')
    setActivityDone(false)
    setDragItems(['Beat 3', 'Beat 1', 'Beat 4', 'Beat 2'])
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
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: prof } = await supabase.from('profiles').select('xp, cq_progress, badges').eq('id', user.id).single()
      const currentProgress = prof?.cq_progress || { completed: [], current: 1 }
      if (!currentProgress.completed.includes(2)) {
        currentProgress.completed.push(2)
        currentProgress.current = 3
      }
      await supabase.from('profiles').update({
        xp: (prof?.xp || 0) + 50,
        cq_progress: currentProgress,
        badges: [...new Set([...(prof?.badges || []), 'drum_coder'])],
        last_active: new Date().toISOString(),
      }).eq('id', user.id)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const s = { // styles
    page: { minHeight: '100vh', background: '#f4fbf7', fontFamily: 'Nunito, sans-serif' },
    topbar: { background: '#0f1f17', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 16 },
    backBtn: { background: 'none', border: '1.5px solid #3a5a44', color: '#8aad96', padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 700, cursor: 'pointer', textDecoration: 'none', display: 'inline-block' },
    title: { fontFamily: "'Baloo 2', cursive", fontSize: 16, fontWeight: 800, color: 'white', flex: 1 },
    badge: { background: '#6c4fc7', color: 'white', fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 20 },
    card: { background: 'white', borderRadius: 16, padding: 28, maxWidth: 680, margin: '32px auto', boxShadow: '0 2px 16px #1a7a4a10' },
    h2: { fontFamily: "'Baloo 2', cursive", fontSize: 26, fontWeight: 800, color: '#0f1f17', marginBottom: 12 },
    body: { fontSize: 15, color: '#1a2e22', lineHeight: 1.7, marginBottom: 16, fontWeight: 600 },
    scene: { background: 'linear-gradient(135deg, #1a2e0f, #2d4a1a)', borderRadius: 14, padding: 28, textAlign: 'center', marginBottom: 20 },
    btnGreen: { background: '#1a7a4a', color: 'white', border: 'none', padding: '12px 28px', borderRadius: 50, fontSize: 15, fontWeight: 800, cursor: 'pointer', marginTop: 16 },
    btnPurple: { background: '#6c4fc7', color: 'white', border: 'none', padding: '12px 28px', borderRadius: 50, fontSize: 15, fontWeight: 800, cursor: 'pointer', marginTop: 16 },
    option: (selected, correct, submitted, isAnswer) => ({
      background: submitted ? (isAnswer ? '#e6f7ee' : selected ? '#fff0f0' : 'white') : selected ? '#f0edfd' : 'white',
      border: `2px solid ${submitted ? (isAnswer ? '#1a7a4a' : selected ? '#e84040' : '#d4ece0') : selected ? '#6c4fc7' : '#d4ece0'}`,
      borderRadius: 10, padding: '12px 16px', cursor: submitted ? 'default' : 'pointer',
      fontSize: 14, fontWeight: 600, color: '#1a2e22', marginBottom: 8, display: 'block', width: '100%', textAlign: 'left'
    }),
    dragItem: { background: '#f0edfd', border: '2px solid #6c4fc7', borderRadius: 10, padding: '10px 20px', fontFamily: "'Baloo 2', cursive", fontSize: 15, fontWeight: 700, color: '#6c4fc7', cursor: 'grab', margin: 6, display: 'inline-block' },
    dropZone: { background: '#f8fffe', border: '2px dashed #b8ddc8', borderRadius: 12, minHeight: 60, padding: 12, marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' },
    placedItem: { background: '#1a7a4a', color: 'white', borderRadius: 10, padding: '8px 16px', fontFamily: "'Baloo 2', cursive", fontSize: 14, fontWeight: 700 },
  }

  return (
    <>
      <Head><title>Àrìa Learn — Code Quest Level 2</title></Head>
      <div style={s.page}>
        <div style={s.topbar}>
          <Link href="/courses/code-quest" style={s.backBtn}>← Back</Link>
          <div style={s.title}>💻 Code Quest — Level 2: The Talking Drum</div>
          <div style={s.badge}>⭐ 50 XP</div>
        </div>

        {/* PROGRESS */}
        <div style={{ background: 'white', borderBottom: '1.5px solid #d4ece0', padding: '10px 24px', display: 'flex', gap: 6 }}>
          {['story','learn','activity','quiz','badge'].map((st, i) => (
            <div key={i} style={{ height: 8, borderRadius: 4, flex: 1, background: ['story','learn','activity','quiz','badge'].indexOf(step) >= i ? '#1a7a4a' : '#e0ede7' }} />
          ))}
        </div>

        {/* STORY */}
        {step === 'story' && (
          <div style={s.card}>
            <div style={s.scene}>
              <div style={{ fontSize: 72 }}>🥁</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginTop: 8 }}>Adaeze's Village · Abia State</div>
            </div>
            <h2 style={s.h2}>The Talking Drum 🥁</h2>
            <p style={s.body}>In Adaeze's village, the talking drum is used to send messages between communities. Each beat has a meaning — but the beats must come in the <strong>exact right order</strong> or the message becomes nonsense.</p>
            <p style={s.body}>Today, Adaeze is learning to send an important message to the next village. But she accidentally mixed up the order of her beats. The message came out wrong and the neighbouring village was confused!</p>
            <p style={s.body}>Help Adaeze understand why <strong>order matters in coding</strong> — and how to fix her mistake by <strong>debugging</strong> the sequence.</p>
            <button style={s.btnGreen} onClick={() => setStep('learn')}>Learn the concept →</button>
          </div>
        )}

        {/* LEARN */}
        {step === 'learn' && (
          <div style={s.card}>
            <h2 style={s.h2}>📖 Order of Instructions</h2>
            <div style={{ background: '#f0edfd', border: '1.5px solid #c5b8f0', borderRadius: 14, padding: 20, marginBottom: 20 }}>
              <p style={{ ...s.body, marginBottom: 8 }}>In coding, a computer follows your instructions <strong>exactly as you write them — in order, from top to bottom.</strong></p>
              <p style={{ ...s.body, marginBottom: 8 }}>If you write the wrong order, you get the wrong result. Just like Adaeze's drum beats.</p>
              <p style={{ ...s.body, marginBottom: 0 }}>Finding and fixing mistakes in code is called <strong style={{ color: '#6c4fc7' }}>DEBUGGING</strong>. Every programmer debugs their code — it is a normal and important skill.</p>
            </div>
            <div style={{ background: '#e6f7ee', border: '1.5px solid #1a7a4a', borderRadius: 14, padding: 20, marginBottom: 20 }}>
              <p style={{ fontFamily: "'Baloo 2', cursive", fontSize: 16, fontWeight: 800, color: '#1a7a4a', marginBottom: 8 }}>Example:</p>
              <div style={{ fontFamily: 'Courier New, monospace', fontSize: 14, color: '#0f1f17', lineHeight: 2 }}>
                <div style={{ color: '#e84040' }}>❌ Wrong order:</div>
                <div>beat(3)</div>
                <div>beat(1)</div>
                <div>beat(2)</div>
                <div style={{ marginTop: 8, color: '#1a7a4a' }}>✅ Correct order:</div>
                <div>beat(1)</div>
                <div>beat(2)</div>
                <div>beat(3)</div>
              </div>
            </div>
            <button style={s.btnPurple} onClick={() => setStep('activity')}>Try the activity →</button>
          </div>
        )}

        {/* ACTIVITY */}
        {step === 'activity' && (
          <div style={s.card}>
            <h2 style={s.h2}>🎯 Fix Adaeze's Drum Beats</h2>
            <p style={s.body}>The beats below are in the wrong order. Tap them in the correct order (Beat 1, Beat 2, Beat 3, Beat 4) to fix Adaeze's message!</p>

            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#5a7a66', marginBottom: 8 }}>Available beats — tap to arrange:</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {dragItems.filter(item => !arranged.includes(item)).map(item => (
                  <button key={item} onClick={() => { if (!arranged.includes(item)) setArranged(prev => [...prev, item]) }}
                    style={s.dragItem}>{item}</button>
                ))}
              </div>
            </div>

            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#5a7a66', marginBottom: 8 }}>Your arrangement:</p>
              <div style={s.dropZone}>
                {arranged.length === 0 && <span style={{ fontSize: 13, color: '#aaa', margin: 'auto' }}>Tap the beats above to arrange them here</span>}
                {arranged.map((item, i) => (
                  <div key={i} style={s.placedItem}>{item}</div>
                ))}
              </div>
            </div>

            {activityFeedback === 'correct' && (
              <div style={{ background: '#e6f7ee', border: '1.5px solid #1a7a4a', borderRadius: 12, padding: 16, marginTop: 16 }}>
                <p style={{ fontFamily: "'Baloo 2', cursive", fontSize: 16, fontWeight: 800, color: '#1a7a4a' }}>🎉 Perfect! The message is correct!</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#1a2e22', marginTop: 4 }}>You debugged Adaeze's drum sequence. The village received the right message!</p>
              </div>
            )}
            {activityFeedback === 'wrong' && (
              <div style={{ background: '#fff0f0', border: '1.5px solid #f5a0a0', borderRadius: 12, padding: 16, marginTop: 16 }}>
                <p style={{ fontFamily: "'Baloo 2', cursive", fontSize: 16, fontWeight: 800, color: '#e84040' }}>🤔 Not quite! Try again.</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#1a2e22', marginTop: 4 }}>Remember — Beat 1 comes first, then 2, then 3, then 4!</p>
              </div>
            )}

            <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
              {arranged.length > 0 && !activityDone && (
                <button style={s.btnGreen} onClick={checkActivity}>Check my answer</button>
              )}
              {arranged.length > 0 && (
                <button style={{ ...s.btnGreen, background: '#5a7a66' }} onClick={resetActivity}>Reset</button>
              )}
              {activityDone && (
                <button style={s.btnPurple} onClick={() => setStep('quiz')}>Take the quiz →</button>
              )}
            </div>
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
              <button style={s.btnPurple} onClick={submitQuiz} disabled={Object.keys(quizAnswers).length < quiz.length}>
                Submit answers
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
            <div style={{ fontSize: 80, marginBottom: 16 }}>🥁</div>
            <h2 style={{ ...s.h2, textAlign: 'center' }}>You earned the Drum Coder badge!</h2>
            <p style={{ ...s.body, textAlign: 'center' }}>You understand that order matters in coding and you know how to debug a sequence. Adaeze's village got the right message — because of you!</p>
            <div style={{ background: '#fff8e8', border: '2px solid #f0a500', borderRadius: 16, padding: 16, margin: '20px auto', maxWidth: 300 }}>
              <div style={{ fontSize: 48 }}>🥁</div>
              <div style={{ fontFamily: "'Baloo 2', cursive", fontSize: 20, fontWeight: 800, color: '#f0a500' }}>Drum Coder</div>
              <div style={{ fontSize: 13, color: '#5a7a66', fontWeight: 600 }}>+50 XP earned</div>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 8 }}>
              <Link href="/courses/code-quest" style={{ ...s.btnGreen, textDecoration: 'none', display: 'inline-block' }}>← Back to Code Quest</Link>
              <Link href="/courses/code-quest/level-3" style={{ ...s.btnPurple, textDecoration: 'none', display: 'inline-block' }}>Next Level →</Link>
            </div>
          </div>
        )}
      </div>
    </>
  )
}