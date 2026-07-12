'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

type Block = { id: string; name: string; label: string; color: string }
type PlacedBlock = { name: string; label: string; srcId: string }

const BLOCKS: Block[] = [
  { id: 'b-move1', name: 'move_forward', label: '▶ move_forward()', color: '#6c4fc7' },
  { id: 'b-move2', name: 'move_forward', label: '▶ move_forward()', color: '#6c4fc7' },
  { id: 'b-say',   name: 'say_arrived',  label: '💬 say("I made it!")', color: '#1a7a4a' },
  { id: 'b-turn',  name: 'turn_back',    label: '↩ turn_back()',       color: '#f0a500' },
  { id: 'b-wait',  name: 'wait',         label: '⏸ wait()',            color: '#2176c7' },
]

export default function CQLevel1() {
  const [placed, setPlaced]           = useState<(PlacedBlock | null)[]>([])
  const [usedIds, setUsedIds]         = useState<string[]>([])
  const [dragging, setDragging]       = useState<Block | null>(null)
  const [dragOver, setDragOver]       = useState(false)
  const [feedback, setFeedback]       = useState<'correct' | 'wrong' | null>(null)
  const [feedbackMsg, setFeedbackMsg] = useState({ title: '', body: '' })
  const [tortoise, setTortoise]       = useState<'idle' | 'moved' | 'done'>('idle')
  const [pathPct, setPathPct]         = useState(0)
  const [sceneLabel, setSceneLabel]   = useState('Help Mbe reach the river 🌊')
  const [showXP, setShowXP]           = useState(false)
  const [saving, setSaving]           = useState(false)
  const [done, setDone]               = useState(false)

  useEffect(() => { document.title = 'Àrìa Learn — Code Quest Level 1' }, [])

  const removeBlock = (index: number) => {
    const item = placed[index]
    if (!item) return
    setUsedIds(prev => prev.filter(id => id !== item.srcId))
    setPlaced(prev => prev.map((p, i) => i === index ? null : p))
    setFeedback(null)
  }

  const handleDrop = () => {
    if (!dragging) return
    if (usedIds.includes(dragging.id)) return
    setPlaced(prev => [...prev.filter((p): p is PlacedBlock => p !== null), { name: dragging.name, label: dragging.label, srcId: dragging.id }])
    setUsedIds(prev => [...prev, dragging.id])
    setDragOver(false)
    setDragging(null)
  }

  const runProgram = async () => {
    const seq = placed.filter((p): p is PlacedBlock => p !== null).map(p => p.name)
    const correct = ['move_forward', 'move_forward', 'say_arrived']
    const isCorrect = JSON.stringify(seq) === JSON.stringify(correct)

    if (isCorrect) {
      setFeedback('correct')
      setFeedbackMsg({ title: '🎉 Excellent! You did it!', body: "Mbe made it to the river! move_forward() tells Mbe to take one step. Computers follow instructions exactly like this!" })
      setTortoise('moved'); setPathPct(50)
      setTimeout(() => { setTortoise('done'); setPathPct(100); setSceneLabel('Mbe reached the river! 🌊🎉') }, 700)
      setShowXP(true); setTimeout(() => setShowXP(false), 2200)
      setDone(true)
      await saveProgress()
    } else if (seq.includes('move_forward') && seq.includes('say_arrived')) {
      setFeedback('wrong')
      setFeedbackMsg({ title: '🤔 Almost there!', body: 'Mbe needs to move forward TWICE before saying he arrived. Try rearranging your blocks!' })
    } else {
      setFeedback('wrong')
      setFeedbackMsg({ title: '🤔 Not quite!', body: 'Mbe needs to move first, then speak when he arrives. What should happen first?' })
    }
  }

  const saveProgress = async () => {
    setSaving(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: profRaw } = await supabase.from('profiles').select('xp, cq_progress, badges, streak').eq('id', user.id).single()
      const prof = profRaw as { xp: number; cq_progress: unknown; badges: string[]; streak: number } | null
      const currentProgress: { completed: number[]; current: number } = (prof?.cq_progress as { completed: number[]; current: number }) ?? { completed: [], current: 1 }
      if (!currentProgress.completed.includes(1)) {
        currentProgress.completed.push(1)
        currentProgress.current = 2
      }
      await supabase.from('profiles').update({
        xp: (prof?.xp || 0) + 50,
        cq_progress: currentProgress,
        badges: [...new Set([...(prof?.badges || []), 'first_step'])],
        streak: (prof?.streak || 0) + 1,
        last_active: new Date().toISOString(),
      }).eq('id', user.id)
    } catch (err) {
      console.error('Error saving progress:', err)
    } finally {
      setSaving(false)
    }
  }

  const tortoiseX = tortoise === 'done' ? 120 : tortoise === 'moved' ? 60 : 0
  const placedCount = placed.filter(Boolean).length

  return (
    <>
      <div style={{ background: '#0f1f17', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <Link href="/courses/code-quest" style={{ background: 'none', border: '1.5px solid #3a5a44', color: '#8aad96', padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>← Back</Link>
        <div style={{ fontFamily: "'Baloo 2', cursive", fontSize: 16, fontWeight: 800, color: 'white', flex: 1 }}>💻 Code Quest — Level 1: Tortoise&apos;s Journey</div>
        <div style={{ background: '#6c4fc7', color: 'white', fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 20 }}>⭐ 50 XP</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 'calc(100vh - 56px)' }}>
        <div style={{ padding: 28, background: 'white', borderRight: '1.5px solid #d4ece0', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: 'linear-gradient(160deg, #0f2d1a 0%, #1a4a2a 100%)', borderRadius: 16, padding: 20, minHeight: 180, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ fontSize: 64, zIndex: 1, transform: `translateX(${tortoiseX}px)`, transition: 'transform 0.5s ease' }}>🐢</div>
            <div style={{ width: '100%', height: 4, background: 'rgba(255,255,255,0.15)', borderRadius: 2, marginTop: 12, zIndex: 1 }}>
              <div style={{ height: '100%', background: '#f0a500', borderRadius: 2, width: `${pathPct}%`, transition: 'width 0.6s ease' }} />
            </div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginTop: 8, zIndex: 1 }}>{sceneLabel}</div>
          </div>

          <div style={{ background: '#fff8e8', border: '1.5px solid #ffd166', borderRadius: 14, padding: '16px 18px' }}>
            <p style={{ fontSize: 14, lineHeight: 1.65, color: '#1a2e22', fontWeight: 600 }}>
              Long ago, <strong style={{ color: '#1a7a4a' }}>Mbe the Tortoise</strong> was known across the land for his wisdom. One dry season, he needed to reach the great river to fetch water for his village. But Mbe moves slowly, he needs your help to write the steps that will guide him there! 🌍
            </p>
          </div>

          <div style={{ background: '#f0edfd', border: '1.5px solid #c5b8f0', borderRadius: 14, padding: '16px 18px' }}>
            <h3 style={{ fontFamily: "'Baloo 2', cursive", fontSize: 16, fontWeight: 800, color: '#6c4fc7', marginBottom: 4 }}>🤔 Your mission</h3>
            <p style={{ fontSize: 13, color: '#1a2e22', fontWeight: 600, lineHeight: 1.5 }}>
              Mbe needs to move forward twice, then say &quot;I made it!&quot; when he arrives. Drag the right code blocks into the program in the correct order.
            </p>
          </div>
        </div>

        <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h3 style={{ fontFamily: "'Baloo 2', cursive", fontSize: 16, fontWeight: 800, color: '#0f1f17' }}>🧩 Build Mbe&apos;s program</h3>
          <p style={{ fontSize: 13, color: '#5a7a66', fontWeight: 600, marginTop: -8 }}>Drag blocks from below into the program area</p>

          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#5a7a66', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Code blocks</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {BLOCKS.map(block => (
                <div
                  key={block.id}
                  draggable={!usedIds.includes(block.id)}
                  onDragStart={() => setDragging(block)}
                  style={{ background: 'white', border: `2px solid ${block.color}`, borderRadius: 10, padding: '8px 14px', fontFamily: "'Baloo 2', cursive", fontSize: 14, fontWeight: 700, cursor: usedIds.includes(block.id) ? 'not-allowed' : 'grab', color: block.color, opacity: usedIds.includes(block.id) ? 0.35 : 1, transition: 'all 0.2s', userSelect: 'none' }}
                >
                  {block.label}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#5a7a66', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Your program</div>
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              style={{ background: dragOver ? '#e6f7ee' : '#f8fffe', border: `2px dashed ${dragOver ? '#1a7a4a' : '#b8ddc8'}`, borderRadius: 12, minHeight: 120, padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}
            >
              {placedCount === 0 && (
                <div style={{ fontSize: 12, color: '#5a7a66', fontWeight: 700, textAlign: 'center', margin: 'auto' }}>Drag code blocks here to build your program</div>
              )}
              {placed.map((item, i) => item && (
                <div key={i} style={{ background: 'white', border: '2px solid #1a7a4a', borderRadius: 10, padding: '8px 14px', fontFamily: "'Baloo 2', cursive", fontSize: 14, fontWeight: 700, color: '#0f1f17', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>{item.label}</span>
                  <button onClick={() => removeBlock(i)} style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: 16, padding: '0 4px', lineHeight: 1 }}>✕</button>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={runProgram}
            disabled={placedCount === 0 || saving}
            style={{ background: '#1a7a4a', color: 'white', border: 'none', padding: '14px 28px', borderRadius: 50, fontFamily: 'Nunito, sans-serif', fontSize: 16, fontWeight: 800, cursor: placedCount === 0 ? 'not-allowed' : 'pointer', width: '100%', opacity: placedCount === 0 ? 0.5 : 1 }}
          >
            {saving ? 'Saving... ⏳' : '▶ Run Program'}
          </button>

          {feedback && (
            <div style={{ background: feedback === 'correct' ? '#e6f7ee' : '#fff0f0', border: `1.5px solid ${feedback === 'correct' ? '#1a7a4a' : '#f5a0a0'}`, borderRadius: 14, padding: '16px 18px' }}>
              <h4 style={{ fontFamily: "'Baloo 2', cursive", fontSize: 16, fontWeight: 800, marginBottom: 4, color: feedback === 'correct' ? '#1a7a4a' : '#e84040' }}>{feedbackMsg.title}</h4>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#1a2e22', lineHeight: 1.5 }}>{feedbackMsg.body}</p>
              {feedback === 'correct' && done && (
                <Link href="/courses/code-quest/level-2" style={{ display: 'inline-block', background: '#f0a500', color: '#0f1f17', border: 'none', padding: '12px 24px', borderRadius: 50, fontFamily: 'Nunito, sans-serif', fontSize: 15, fontWeight: 800, cursor: 'pointer', marginTop: 10, textDecoration: 'none' }}>
                  Next Level →
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {showXP && (
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#f0a500', color: '#0f1f17', padding: '20px 36px', borderRadius: 20, fontFamily: "'Baloo 2', cursive", fontSize: 28, fontWeight: 800, zIndex: 999, textAlign: 'center' }}>
          +50 XP! 🌟
          <p style={{ fontSize: 14, fontWeight: 700, marginTop: 4 }}>Brilliant work!</p>
        </div>
      )}
    </>
  )
}
