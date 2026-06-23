export type Profile = {
  id: string
  first_name: string | null
  last_name: string | null
  avatar: string | null
  age: number | null
  state: string | null
  role: string | null
  xp: number
  streak: number
  badges: string[]
  cq_progress: { completed: number[]; current: number } | null
  sz_progress: { completed: number[]; current: number } | null
  last_active: string | null
}
