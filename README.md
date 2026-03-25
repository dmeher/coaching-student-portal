# Student Portal — Quick Start

## Stack
- **Next.js 15** — App Router
- **Supabase** — same DB as the admin coaching-fees-app
- **Tailwind CSS** — styling
- **Vercel** — deployment

## Local Setup

```bash
cd coaching-student-portal
npm install
cp .env.example .env.local
# Fill in the same Supabase URL + ANON KEY from the admin app
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key |

> Both values are the same as the admin app — this portal reuses the same database.

## Deploy to Vercel

1. Push this folder to a GitHub repo (or monorepo subfolder)
2. Import into Vercel
3. Set the two environment variables above
4. Deploy

## Pages

| Route | Description |
|---|---|
| `/` | Welcome / home |
| `/students` | Searchable student directory (name, class, gender, address) |
| `/teachers` | Teacher profiles (name, subject, phone) |

## What's NOT shown

- Mobile numbers of students
- Fee records / payment history
- Admin controls

This is a **read-only** public portal.
