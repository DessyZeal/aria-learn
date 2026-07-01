const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

interface StreakCardProps {
  streak: number
  lastActive: string
}

export default function StreakCard({ streak }: StreakCardProps) {
  const dayOfWeek = new Date().getDay()
  const todayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1

  return (
    <div style={{ background: 'white', border: '1.5px solid #d4ece0', borderRadius: 14, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
      <div style={{ fontSize: 28 }}>🔥</div>
      <div>
        <h3 className="font-baloo" style={{ fontSize: 16, fontWeight: 800, color: '#0f1f17' }}>
          {streak >= 1 ? `${streak}-day learning streak!` : 'Start your streak today!'}
        </h3>
        <p style={{ fontSize: 12, color: '#5a7a66', fontWeight: 600 }}>Learn today to keep your flame alive</p>
      </div>
      <div style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
        {DAYS.map((dayLabel, i) => {
          const isDone = i < (streak % 7)
          const isToday = i === todayIndex
          const cls = isDone ? 'day-done' : isToday ? 'day-today' : 'day-future'
          return (
            <div key={dayLabel} className={cls} style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>
              {dayLabel[0]}
            </div>
          )
        })}
      </div>
    </div>
  )
}
