'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { AVATAR_COLORS } from '@/lib/constants'

interface SidebarProps {
  profile: {
    first_name: string
    avatar: string
    xp: number
  }
  activeItem?: string
}

const NAV_ITEMS = [
  { icon: '🏠', label: 'Home',        href: '/dashboard' },
  { icon: '📚', label: 'My Courses',  href: '/courses' },
  { icon: '🏆', label: 'Leaderboard', href: '/dashboard' },
  { icon: '🎖️', label: 'My Badges',   href: '/dashboard' },
  { icon: '👩‍🏫', label: 'My Teacher',  href: '/dashboard' },
]

export default function Sidebar({ profile, activeItem = 'Home' }: SidebarProps) {
  const router = useRouter()
  const { first_name: name, avatar, xp } = profile

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <aside style={{ width: 220, background: '#0f1f17', display: 'flex', flexDirection: 'column', padding: '24px 16px', gap: 6, flexShrink: 0 }}>
      <div className="font-baloo" style={{ fontSize: 22, fontWeight: 800, color: 'white', marginBottom: 24, paddingLeft: 8 }}>
        Àrìa <span style={{ color: '#f0a500' }}>Learn</span>
      </div>
      {NAV_ITEMS.map(item => {
        const active = item.label === activeItem
        return (
          <Link key={item.label} href={item.href}
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, fontSize: 14, fontWeight: 600, color: active ? 'white' : '#8aad96', background: active ? '#1a7a4a' : 'transparent', textDecoration: 'none', transition: 'background 0.2s' }}>
            <span style={{ fontSize: 18, width: 22, textAlign: 'center' }}>{item.icon}</span>
            {item.label}
          </Link>
        )
      })}
      <button onClick={handleLogout}
        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, fontSize: 14, fontWeight: 600, color: '#8aad96', background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}>
        <span style={{ fontSize: 18, width: 22, textAlign: 'center' }}>🚪</span> Log Out
      </button>
      <div style={{ marginTop: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 12, background: '#1a3d28', borderRadius: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: AVATAR_COLORS[avatar] || '#f0a500', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18 }}>
            {avatar}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>{name}</div>
            <div style={{ fontSize: 11, color: '#8aad96' }}>Level {Math.floor(xp / 100) + 1} Explorer</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
