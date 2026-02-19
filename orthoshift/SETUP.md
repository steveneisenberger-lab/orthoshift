# OrthoShift — Deployment Guide

## What you have
- A React app that talks to Supabase for real auth and live data
- Deployable to Vercel for free in ~10 minutes

---

## Step 1 — Set up Supabase (5 min)

1. Go to https://supabase.com and sign up / log in
2. Click **"New project"**, name it `orthoshift`, save the database password
3. Wait ~2 min for it to spin up
4. In the left sidebar click **"SQL Editor"** → **"New query"**
5. Paste the entire contents of `supabase-schema.sql` and click **Run**
   - This creates all your tables, policies, and seeds the office/doctor data

### Create your demo users
6. In Supabase sidebar go to **Authentication → Users → "Add user"**
7. Create these accounts (use "Send invite" = OFF, just add directly):
   - admin@orthoshift.com / Admin123!
   - maria@orthoshift.com / Maria123!
   - jenna@orthoshift.com / Jenna123!
   - tyra@orthoshift.com / Tyra123!
   - leo@orthoshift.com / Leo123!
   - diana@orthoshift.com / Diana123!
   - sam@orthoshift.com / Sam123!

8. After creating them, go back to **SQL Editor** and run this to set their roles
   (replace each UUID with what Supabase shows in the Users table):

```sql
-- Get the UUIDs first:
select id, email from auth.users;

-- Then update each profile (example — use real UUIDs):
update profiles set role='admin', name='Admin', initials='AD'
  where id = (select id from auth.users where email='admin@orthoshift.com');

update profiles set role='assistant', name='Maria Santos', initials='MS', phone='917-555-0101', points=47, streak=6
  where id = (select id from auth.users where email='maria@orthoshift.com');

update profiles set role='assistant', name='Jenna Park', initials='JP', phone='646-555-0182', points=38, streak=3
  where id = (select id from auth.users where email='jenna@orthoshift.com');

update profiles set role='assistant', name='Tyra Coleman', initials='TC', phone='718-555-0143', points=55, streak=9
  where id = (select id from auth.users where email='tyra@orthoshift.com');

update profiles set role='assistant', name='Leo Vargas', initials='LV', phone='917-555-0164', points=22, streak=1
  where id = (select id from auth.users where email='leo@orthoshift.com');

update profiles set role='assistant', name='Diana Wu', initials='DW', phone='646-555-0125', points=61, streak=12
  where id = (select id from auth.users where email='diana@orthoshift.com');

update profiles set role='assistant', name='Sam Okafor', initials='SO', phone='718-555-0196', points=18, streak=0
  where id = (select id from auth.users where email='sam@orthoshift.com');
```

### Get your API keys
9. In Supabase sidebar go to **Project Settings → API**
10. Copy:
    - **Project URL** (looks like https://abcxyz.supabase.co)
    - **anon / public key** (long string starting with eyJ...)

---

## Step 2 — Set up the project locally (2 min)

```bash
# In this folder:
npm install

# Create your .env file
cp .env.example .env
```

Open `.env` and fill in your Supabase values:
```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Test it locally:
```bash
npm run dev
```
Open http://localhost:5173 — you should see the login screen.

---

## Step 3 — Deploy to Vercel (3 min)

### Option A: GitHub (recommended)
1. Push this folder to a GitHub repo
2. Go to https://vercel.com → "Add New Project" → import your repo
3. In **Environment Variables**, add:
   - `VITE_SUPABASE_URL` = your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = your anon key
4. Click **Deploy** — done. Vercel gives you a live URL instantly.

### Option B: Vercel CLI
```bash
npm install -g vercel
vercel
# Follow the prompts, add env vars when asked
```

---

## Step 4 — Add your real assistants

Once it's live, go to Supabase → Authentication → Users and add real emails.
Then run the SQL to update their profile with name, initials, etc.

Or you can build an "Add staff" form in the admin panel — I can help with that next.

---

## Monthly cost
- Supabase free tier: $0 (up to 50,000 rows, 500MB — more than enough)
- Vercel free tier: $0
- **Total: $0/month** until you scale to thousands of users

---

## What's working right now
- ✅ Real email/password login (Supabase Auth)
- ✅ Role-based routing (admin vs assistant)
- ✅ Coverage overview pulls live shift data
- ✅ Swap requests saved to database, admin can approve/deny
- ✅ Calendar manager saves open days/hours to database
- ✅ Doctor roster and schedule from database
- ✅ Assistant reliability board with live points/streaks
- ✅ Assistant portal shows real shifts, can submit swap requests
- ✅ Point history from database

## What to build next
- Email notifications when swaps are approved/denied
- Shift assignment UI (drag-and-drop calendar)
- Paychex CSV export for bonus payroll
- Mobile push notifications (OneSignal)
- Bulk schedule import from Ortho2-Edge
