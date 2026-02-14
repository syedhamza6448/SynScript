<<<<<<< HEAD
# SynScript
=======
# SynScript

Collaborative Research & Citation Engine. Build Knowledge Vaults with verified sources, annotated PDFs, and cross-referenced citations.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth + RBAC (Owner/Contributor/Viewer)
- **Real-time**: Supabase Realtime
- **Storage**: Supabase Storage (PDFs)
- **UI**: Tailwind CSS, shadcn/ui
- **Rate limiting**: Upstash Redis (optional)
- **Hosting**: Vercel

## Quick Start

1. Install: `npm install`
2. Copy `.env.example` to `.env.local` and add Supabase credentials
3. Run schema: paste `lib/db/schema.sql` in Supabase SQL Editor
4. Create Storage bucket `pdfs` (private)
5. Enable Realtime on `sources` and `vault_members` tables
6. Run: `npm run dev`

See [TODO.md](TODO.md) for full setup instructions.

## Features

- **Knowledge Vaults**: Create shared research repositories
- **Sources**: Add URLs, titles, and PDF uploads
- **Annotations**: Add notes to sources
- **RBAC**: Owner (full control), Contributor (add/edit), Viewer (read-only)
- **Real-time**: Instant updates when sources are added
- **Notifications**: In-app toast when new collaborators join
- **Audit logs**: Immutable records of key actions
>>>>>>> efe50a4 (fix)
