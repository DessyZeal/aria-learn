export const GREETINGS = [
  { text: 'Ẹ káàbọ̀!', language: 'YORUBA', color: '#1a7a4a' },
  { text: 'Nnọọ!',      language: 'IGBO',   color: '#f0a500' },
  { text: 'Barka!',     language: 'HAUSA',  color: '#e84040' },
] as const

export const COURSES = [
  { emoji: '🔬', name: 'Science Lab',   description: 'Experiments rooted in African nature & food', accentColor: '#1a7a4a', slug: 'science-lab'   },
  { emoji: '💻', name: 'Code Quest',    description: 'Build games using African stories',           accentColor: '#6c4fc7', slug: 'code-quest'    },
  { emoji: '⚙️', name: 'Build It',      description: 'Engineering challenges for real problems',    accentColor: '#f0a500', slug: 'build-it'      },
  { emoji: '🔢', name: 'Maths Arena',   description: 'Game-based maths set in African daily life',  accentColor: '#e84040', slug: 'maths-arena'   },
  { emoji: '🎨', name: 'Create Studio', description: 'Art & music inspired by African culture',     accentColor: '#d4538a', slug: 'create-studio' },
  { emoji: '🛡️', name: 'Safe Zone',     description: 'Internet safety & anti-cyberbullying',       accentColor: '#2176c7', slug: 'safe-zone'     },
] as const

export const AVATARS = ['🦁', '🐢', '🦅', '🐘', '🦋', '🌟'] as const

export const AVATAR_COLORS: Record<string, string> = {
  '🦁': '#ffd166',
  '🐢': '#c0dd97',
  '🦅': '#b5d4f4',
  '🐘': '#d4ece0',
  '🦋': '#f4c0d1',
  '🌟': '#ffd166',
}

export const NIGERIAN_STATES = [
  'Abia', 'Anambra', 'Ebonyi', 'Enugu', 'Imo',
  'Lagos', 'Abuja', 'Kano', 'Rivers', 'Oyo',
  'Kaduna', 'Delta', 'Other',
] as const
