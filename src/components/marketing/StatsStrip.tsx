const STATS = [
  { val: '50+',  label: 'Students reached'       },
  { val: '2',    label: 'Partner schools'         },
  { val: '6',    label: 'Learning worlds'         },
  { val: '100%', label: 'Free for those in need'  },
]

export default function StatsStrip() {
  return (
    <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
      {STATS.map((s, i, arr) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="font-baloo" style={{ fontSize: 28, fontWeight: 800, color: '#1a7a4a', lineHeight: 1 }}>{s.val}</div>
            <div style={{ fontSize: 12, color: '#5a7a66', fontWeight: 600, marginTop: 2 }}>{s.label}</div>
          </div>
          {i < arr.length - 1 && <div style={{ width: 1.5, height: 40, background: '#c8ddd0' }} />}
        </div>
      ))}
    </div>
  )
}
