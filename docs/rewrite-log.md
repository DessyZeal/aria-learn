# Àrìa Learn — Rewrite Log

## Stack
- Next.js 15 (App Router)
- TypeScript (strict, no `any`)
- Tailwind CSS with custom design tokens
- Supabase (@supabase/ssr) — Auth, RLS policies, realtime
- Prisma 7 (@prisma/client + @prisma/adapter-pg) — schema, queries, types

## Branch
`rewrite/migrate-to-ts`

## Migration Approach
In-place migration from Next.js 14 Pages Router (JavaScript) to 
Next.js 15 App Router (TypeScript). Existing UI, markup, styles and 
logic are preserved exactly. Only file extensions, imports, and 
architecture are changed.

## Design Tokens
- green.DEFAULT: #1a7a4a | green.light: #25a864 | green.pale: #e6f7ee | green.dark: #0f1f17
- gold.DEFAULT: #f0a500 | gold.pale: #fff8e8 | gold.dark: #b07800
- muted: #5a7a66 | body-bg: #f4fbf7 | body-text: #1a2e22
- purple: #6c4fc7 | blue: #2176c7 | danger: #e84040 | border: #d4ece0
- Fonts: Baloo 2 (headings/logo) + Nunito (body) — loaded via next/font/google

## Rules (apply to every step)
- Never change any UI markup, colors, copy, or layout
- Only change: file extensions, import paths, add TypeScript types
- Server Components by default, "use client" only when necessary
- No extra libraries (no Framer Motion, no Radix, no shadcn)
- One step at a time, stop and wait for approval
- After each step run npm run dev and confirm no errors

---

## Step 1 — TypeScript Support ✅
- Installed: typescript @types/react @types/node @types/react-dom
- Created tsconfig.json with strict mode and allowJs: true
  (allowJs lets existing .js files work during gradual migration)

## Step 2 — Package Upgrades ✅
- Upgraded next to 15.x
- Installed @supabase/supabase-js @supabase/ssr
- Removed @supabase/auth-helpers-nextjs (deprecated, was causing auth bug)
- Updated react and react-dom to 19.x

## Step 3 — Config Files Converted ✅
- tailwind.config.js → tailwind.config.ts (all design tokens added)
- next.config.js → next.config.ts
- postcss.config.js → postcss.config.mjs
- Old .js config files deleted

## Step 4 — App Router Folder Structure ✅
Created src/ with route groups:
- src/app/(marketing)/ — public home page
- src/app/(auth)/ — signup and login pages
- src/app/(dashboard)/ — protected dashboard and course pages
- src/components/{ui, marketing, dashboard, auth}/
- src/lib/supabase/{client.ts, server.ts, types.ts}
- src/lib/constants.ts
- src/middleware.ts

## Step 5 — Root Layout ✅
- src/app/layout.tsx created
- Baloo 2 + Nunito loaded via next/font/google as CSS variables
- Nigerian flag stripe (8px, green/white/gold/red repeating) at top
- globals.css imported

## Step 6 — globals.css ✅
- Copied from styles/globals.css
- Removed Google Fonts @import (next/font handles this now)
- @tailwind directives added as first three lines
- .greeting-slide and .greeting-slide.active animation classes preserved

## Step 7 — Supabase Clients ✅
- src/lib/supabase/client.ts — browser client (createBrowserClient)
- src/lib/supabase/server.ts — server client (createServerClient + cookies)
- src/lib/constants.ts — COURSES, GREETINGS, AVATARS, NIGERIAN_STATES arrays

## Step 8 — Middleware ✅
- src/middleware.ts created with full auth guard:
  - Protects /dashboard and /courses → redirects to /login if no session
  - Redirects logged-in users away from /signup and /login → /dashboard
- This permanently fixes the auth redirect loop from the original app
- pages/_app.js renamed to _app.js.bak to stop Pages Router conflict

## Step 9 — Home Page Migrated ✅
- pages/index.js → src/app/(marketing)/page.tsx
- src/app/(marketing)/layout.tsx created with Navbar
- Components extracted:
  - src/components/marketing/Navbar.tsx (sticky, scroll shadow)
  - src/components/marketing/GreetingSlideshow.tsx (2.8s rotation, 
    one greeting at a time, fade+slide animation)
  - src/components/marketing/CourseCard.tsx (hover lift effect)
  - src/components/marketing/StatsStrip.tsx
- All inline styles preserved exactly
- Fonts confirmed working (Baloo 2 headings, Nunito body)
- Page padding/margin reset fixed in globals.css

## Step 10 — Signup & Login Pages Migrated ✅
- pages/signup.js → src/app/(auth)/signup/page.tsx
- Login screen extracted → src/app/(auth)/login/page.tsx
- Components extracted:
  - src/components/auth/RoleSelector.tsx
  - src/components/auth/AvatarPicker.tsx
  - src/components/auth/SignupForm.tsx
- Supabase auth replaced: auth-helpers → @supabase/ssr client
- Multi-step flow preserved (who → signup → success)
- 2-column split layout preserved on registration screen
- Avatar picker position fixed (below heading, above form fields)
- Error handling inline (no alert())

## Step 11 — Dashboard ✅
- pages/dashboard.js.bak → src/app/(dashboard)/dashboard/page.tsx (Server Component)
- Components extracted:
  - src/components/dashboard/Sidebar.tsx ("use client", logout via Supabase signOut)
  - src/components/dashboard/StreakCard.tsx (Server Component, 7-day circles)
  - src/components/dashboard/LeaderboardRow.tsx (Server Component, rank colors)
- src/app/(dashboard)/layout.tsx: auth check + Prisma profile fetch + Sidebar
- All sections preserved: topbar, streak, continue learning, courses grid, badges, leaderboard
- This step fixes the core auth redirect bug (middleware now guards /dashboard → /login)

## Step 11b — Prisma ✅
- Prisma 7.8.0 installed with @prisma/adapter-pg (required for Prisma 7 runtime)
- prisma/schema.prisma: Profile + LessonAttempt models mapped to existing Supabase tables
- prisma.config.ts: datasource URL + shadowDatabaseUrl for CLI migrations
- src/lib/prisma.ts: singleton PrismaClient using PrismaPg adapter
- src/lib/supabase/types.ts: re-exports Profile + LessonAttempt from @prisma/client
- (dashboard)/layout.tsx: uses Prisma for profile fetch instead of raw Supabase query
- SignupForm.tsx: removed manual profile insert — handle_new_user trigger creates it
- .env.example: added DATABASE_URL (pooled, port 6543) + DIRECT_URL (direct, port 5432)
- NOTE: For db push, use DIRECT_URL as DATABASE_URL temporarily (pgBouncer blocks DDL)

---

## Step 12 — Course Pages ✅
- pages/courses/code-quest.js → src/app/(dashboard)/courses/code-quest/page.tsx (Server Component, Prisma fetch)
- pages/level-1.js → src/app/(dashboard)/courses/code-quest/level-1/page.tsx ("use client", drag and drop)
- pages/courses/level-2.js → src/app/(dashboard)/courses/code-quest/level-2/page.tsx ("use client", 5-step flow)
- CodeQuestLevels.tsx extracted as client component for interactive level grid
- Sidebar active state fixed: usePathname() replaces hardcoded activeItem prop
- pages/courses/ .bak files renamed then deleted to unblock App Router routes
- All three pages confirmed working (307 → /login for unauthenticated requests)

## Step 13 — Cleanup ✅
- Created src/app/auth/confirm/route.ts (Supabase email OTP confirmation handler)
- Deleted all Pages Router files from pages/ (index, dashboard, signup, level-1, courses/)
- Deleted pages/ directory (empty after removal)
- Deleted root-level lib/supabase.js and styles/globals.css (replaced by src/ equivalents)
- Deleted root-level lib/ and styles/ directories (empty after removal)
- Verified .gitignore covers .env, .env*.local, .next/, node_modules/
- Project is now fully on App Router — no Pages Router files remain

---

## Remaining Steps
- Add /courses index page (new feature, post-migration)
- Mobile responsiveness check
- End-to-end auth flow test
