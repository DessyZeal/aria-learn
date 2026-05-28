-- ─────────────────────────────────────────────────────────────
-- ÀRÌA LEARN — Supabase Database Setup
-- Run this in your Supabase SQL Editor
-- Supabase Dashboard → SQL Editor → New Query → Paste → Run
-- ─────────────────────────────────────────────────────────────

-- 1. PROFILES TABLE
-- Stores every student and school account
create table if not exists profiles (
  id              uuid references auth.users on delete cascade primary key,
  first_name      text,
  last_name       text,
  avatar          text default '🦁',
  age             int,
  state           text,
  role            text default 'student', -- student | school | parent
  xp              int default 0,
  streak          int default 0,
  last_active     timestamptz default now(),
  badges          text[] default '{}',
  cq_progress     jsonb default '{"completed": [], "current": 1}',
  sz_progress     jsonb default '{"completed": [], "current": 1}',
  school_name     text,
  created_at      timestamptz default now()
);

-- 2. Enable Row Level Security
alter table profiles enable row level security;

-- 3. RLS Policies
-- Students can only read and update their own profile
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = id);

-- 4. LESSON ATTEMPTS TABLE
-- Records every time a student attempts a lesson
create table if not exists lesson_attempts (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references profiles(id) on delete cascade,
  course      text,   -- 'code_quest' | 'safe_zone'
  level       int,
  passed      boolean default false,
  xp_earned   int default 0,
  attempted_at timestamptz default now()
);

alter table lesson_attempts enable row level security;

create policy "Users can view own attempts"
  on lesson_attempts for select
  using (auth.uid() = user_id);

create policy "Users can insert own attempts"
  on lesson_attempts for insert
  with check (auth.uid() = user_id);

-- 5. Auto-create profile on signup trigger
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, first_name, last_name, avatar, role)
  values (
    new.id,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    coalesce(new.raw_user_meta_data->>'avatar', '🦁'),
    coalesce(new.raw_user_meta_data->>'role', 'student')
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
