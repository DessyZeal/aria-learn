'use client'

const AVATARS = ['🦁', '🐢', '🦅', '🐘', '🦋', '🌟']

interface AvatarPickerProps {
  selected: string
  onSelect: (avatar: string) => void
}

const labelStyle = { display: 'block' as const, fontSize: 13, fontWeight: 700, color: '#1a2e22', marginBottom: 6 }

export default function AvatarPicker({ selected, onSelect }: AvatarPickerProps) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={labelStyle}>Pick your avatar</label>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 6 }}>
        {AVATARS.map(a => (
          <div
            key={a}
            onClick={() => onSelect(a)}
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              border: `2px solid ${selected === a ? '#1a7a4a' : '#d4ece0'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
              cursor: 'pointer',
              background: selected === a ? '#e6f7ee' : '#f4fbf7',
              transition: 'all 0.2s',
            }}
          >
            {a}
          </div>
        ))}
      </div>
    </div>
  )
}
