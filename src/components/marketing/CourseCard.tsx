'use client'

interface CourseCardProps {
  name: string
  emoji: string
  description: string
  accentColor: string
  slug: string
}

export default function CourseCard({ name, emoji, description }: CourseCardProps) {
  return (
    <div
      style={{ background: '#f7fdf9', border: '1.5px solid #d4ece0', borderRadius: 16, padding: '24px 16px 20px', textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px #1a7a4a18' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
    >
      <div style={{ fontSize: 36, marginBottom: 10 }}>{emoji}</div>
      <div className="font-baloo" style={{ fontSize: 16, fontWeight: 700, color: '#0f1f17', marginBottom: 4 }}>{name}</div>
      <div style={{ fontSize: 12, color: '#5a7a66', fontWeight: 600, lineHeight: 1.5 }}>{description}</div>
    </div>
  )
}
