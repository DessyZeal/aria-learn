interface LeaderboardRowProps {
  rank: number
  avatar: string
  name: string
  xp: number
  isCurrentUser: boolean
  color: string
}

const RANK_COLORS = ['#f0a500', '#aaa', '#cd7f32']

export default function LeaderboardRow({ rank, avatar, name, xp, isCurrentUser, color }: LeaderboardRowProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', borderBottom: '1px solid #f0f7f3', background: isCurrentUser ? '#e6f7ee' : 'white' }}>
      <div className="font-baloo" style={{ fontSize: 15, fontWeight: 800, color: RANK_COLORS[rank - 1] || '#5a7a66', width: 20 }}>
        {rank}
      </div>
      <div style={{ width: 28, height: 28, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#0f1f17', flexShrink: 0 }}>
        {avatar}
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#1a2e22', flex: 1 }}>
        {name}{isCurrentUser ? ' (you) 👈' : ''}
      </div>
      <div className="font-baloo" style={{ fontSize: 14, fontWeight: 800, color: '#f0a500' }}>
        {xp.toLocaleString()} XP
      </div>
    </div>
  )
}
