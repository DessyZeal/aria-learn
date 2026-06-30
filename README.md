# Àrìa Learn — Typescript Application

Nigeria's first gamified STEAM learning platform.

**Stack:** Typescript · Supabase · Vercel


## What Is Inside

```
aria-learn/
├── pages/
│   ├── index.js          → Landing page with greeting slideshow
│   ├── signup.js         → Signup, login and success screens
│   ├── dashboard.js      → Student dashboard (requires login)
│   ├── lesson.js         → Code Quest Level 1 interactive lesson
│   └── courses/
│       └── code-quest.js → Code Quest overview with all 10 levels
├── lib/
│   └── supabase.js       → Supabase client
├── styles/
│   └── globals.css       → Global styles and animations
├── supabase_setup.sql    → Run this in Supabase to set up your database
├── .env.example          → Copy to .env.local and fill in your keys
└── README.md             → This file
```

---

## Setup — Step by Step

### Step 1 — Install Node.js
Download and install Node.js from https://nodejs.org
Choose the LTS version. This also installs npm.

Verify it worked by opening your terminal and typing:
```
node --version
npm --version
```

### Step 2 — Install project dependencies
Open a terminal in the aria-learn folder and run:
```
npm install
```
This installs Next.js, React, Supabase and all other packages.
It may take 1-2 minutes. You will see a node_modules folder appear.

### Step 3 — Create your Supabase account and project
1. Go to https://supabase.com and click "Start your project"
2. Sign up with your email or GitHub
3. Click "New project"
4. Name it: aria-learn
5. Set a database password (save this somewhere safe)
6. Choose the closest region to Nigeria (Europe West is fine)
7. Wait 1-2 minutes for the project to be ready

### Step 4 — Set up your database
1. Inside your Supabase project, click "SQL Editor" in the left sidebar
2. Click "New query"
3. Open the file supabase_setup.sql from this project
4. Copy ALL the contents and paste into the SQL editor
5. Click "Run"
6. You should see "Success. No rows returned"

### Step 5 — Get your Supabase keys
1. In your Supabase project, click "Settings" → "API"
2. Copy the "Project URL" — it looks like: https://xxxxx.supabase.co
3. Copy the "anon public" key — it is a long string starting with "eyJ"

### Step 6 — Create your .env.local file
1. In the aria-learn folder, find the file called .env.example
2. Make a copy of it and rename the copy to .env.local
3. Open .env.local and fill in your values:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 7 — Run the development server
In your terminal, inside the aria-learn folder, run:
```
npm run dev
```
Open your browser and go to: http://localhost:3000
Your Àrìa Learn site is now running locally!

---

## Deploying to Vercel

### Step 1 — Push to GitHub
1. Create a GitHub account at https://github.com
2. Create a new repository called "aria-learn"
3. Upload your aria-learn folder to the repository

### Step 2 — Deploy on Vercel
1. Go to https://vercel.com and sign up with GitHub
2. Click "Add New Project"
3. Select your aria-learn repository
4. Click "Deploy"

### Step 3 — Add environment variables on Vercel
1. In Vercel, go to your project → Settings → Environment Variables
2. Add these two variables:
   - NEXT_PUBLIC_SUPABASE_URL = your Supabase project URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY = your Supabase anon key
3. Click "Redeploy"

Your site is now live at: https://aria-learn.vercel.app

---

## Connecting Your Domain (arialearn.ng)

1. Register arialearn.ng at QServers or WhoGoHost
2. In Vercel → your project → Settings → Domains
3. Add: arialearn.ng
4. Vercel will give you DNS records to add to your domain registrar
5. Add those records and wait up to 24 hours for it to go live

---

## Personalise Before Launch

Open these files and update:

**pages/index.js**
- Update stats (200+ students, 2 schools) as your numbers grow
- Update course cards if needed

**pages/dashboard.js**
- Leaderboard currently shows example names — connect to real data later

**pages/signup.js**
- Add Google OAuth by enabling it in Supabase Auth settings

---

## Need Help?

Every piece of this was built with love for Àrìa Learn.
If you get stuck on any step, ask your development partner for help.

Built with ❤️ in Nigeria 🇳🇬
Àrìa Learn — Every child is welcome here.
