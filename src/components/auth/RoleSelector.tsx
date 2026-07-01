'use client'

interface RoleSelectorProps {
  selected: string | null
  onSelect: (role: string) => void
}

const roles = [
  { type: 'student', emoji: '🎒', title: "I'm a Student", desc: 'I want to learn STEAM through games and challenges' },
  { type: 'school',  emoji: '🏫', title: "I'm a School",  desc: 'I want to bring Àrìa Learn to my students' },
  { type: 'parent',  emoji: '👨‍👩‍👧', title: "I'm a Parent", desc: 'I want to sign up my child for STEAM learning' },
]

export default function RoleSelector({ selected, onSelect }: RoleSelectorProps) {
  return (
    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 28 }}>
      {roles.map(c => (
        <div
          key={c.type}
          onClick={() => onSelect(c.type)}
          style={{
            background: selected === c.type ? '#e6f7ee' : 'white',
            border: `2px solid ${selected === c.type ? '#1a7a4a' : '#d4ece0'}`,
            borderRadius: 20,
            padding: '28px 24px',
            width: 200,
            cursor: 'pointer',
            textAlign: 'center',
            transition: 'all 0.2s',
          }}
        >
          <div style={{ fontSize: 44, marginBottom: 12 }}>{c.emoji}</div>
          <div className="font-baloo" style={{ fontSize: 18, fontWeight: 800, color: '#0f1f17', marginBottom: 4 }}>{c.title}</div>
          <div style={{ fontSize: 12, color: '#5a7a66', fontWeight: 600, lineHeight: 1.5 }}>{c.desc}</div>
        </div>
      ))}
    </div>
  )
}
