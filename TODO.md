# SynScript - Build Plan & TODO

## Completed Phases

### Phase 1: Setup
- [x] Next.js 14 with TypeScript, Tailwind, ESLint
- [x] Supabase client (browser + server)
- [x] shadcn/ui components (Button, Input, Card, Dialog, Dropdown, Toast)
- [x] TanStack Query provider

### Phase 2: Database and Auth
- [x] PostgreSQL schema: vaults, vault_members, sources, annotations, audit_logs, vault_invites
- [x] RLS policies for Owner/Contributor/Viewer
- [x] Supabase Auth (email/password)
- [x] RBAC helpers

### Phase 3: Core CRUD
- [x] Vault CRUD (create, list, delete)
- [x] Source CRUD (add, delete)
- [x] Annotation CRUD (add)

### Phase 4: File Storage and RBAC UI
- [x] Supabase Storage for PDFs
- [x] Upload PDF flow
- [x] Role-based UI (hide edit for Viewers, invite for Owner)
- [x] Invite flow (by email)
- [x] Audit log inserts

### Phase 5: Real-time and Notifications
- [x] Supabase Realtime on sources
- [x] Realtime on vault_members (new collaborator notification)
- [x] In-app toast for new contributors

### Phase 6: Security and Polish
- [x] Rate limiting (Upstash, optional)
- [x] Zod validation on server actions
- [x] Immutable audit logs
- [x] Responsive layout

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Supabase Setup
1. Create a project at [supabase.com](https://supabase.com)
2. Run the SQL in `lib/db/schema.sql` in the SQL Editor
3. Create Storage bucket: Dashboard > Storage > New bucket > name: `pdfs`, private
4. Enable Realtime: SQL Editor > run:
   ```sql
   alter publication supabase_realtime add table public.sources;
   alter publication supabase_realtime add table public.vault_members;
   ```
5. Set Storage policies for `pdfs` bucket (authenticated users can read/write)

### 3. Environment Variables
Create `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
UPSTASH_REDIS_REST_URL=optional
UPSTASH_REDIS_REST_TOKEN=optional
```

### 4. Run
```bash
npm run dev
```

### 5. Deploy to Vercel
```bash
npm run build
vercel
```
Add env vars in Vercel project settings.

## Remaining / Stretch
- [ ] Redis caching for hot sources (if Upstash configured)
- [ ] Export citations (BibTeX)
- [ ] Conflict resolution UX
