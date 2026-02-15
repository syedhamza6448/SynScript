-- SynScript Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles: linked to auth.users (display name, etc.)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Vaults: shared research repositories
create table public.vaults (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  owner_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Vault members: many-to-many with roles
create type vault_role as enum ('owner', 'contributor', 'viewer');

create table public.vault_members (
  id uuid primary key default uuid_generate_v4(),
  vault_id uuid references public.vaults(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  role vault_role not null default 'viewer',
  joined_at timestamptz default now(),
  unique(vault_id, user_id)
);

-- Sources: URLs, titles, optional PDF
create table public.sources (
  id uuid primary key default uuid_generate_v4(),
  vault_id uuid references public.vaults(id) on delete cascade not null,
  url text,
  title text not null,
  file_path text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Annotations: notes on sources
create table public.annotations (
  id uuid primary key default uuid_generate_v4(),
  source_id uuid references public.sources(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  note text not null,
  created_at timestamptz default now()
);

-- Vault invites: pending invites by email (user accepts when they sign in)
create table public.vault_invites (
  id uuid primary key default uuid_generate_v4(),
  vault_id uuid references public.vaults(id) on delete cascade not null,
  email text not null,
  role vault_role not null default 'viewer',
  created_at timestamptz default now(),
  unique(vault_id, email)
);

-- Audit logs: immutable
create table public.audit_logs (
  id uuid primary key default uuid_generate_v4(),
  vault_id uuid references public.vaults(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  action text not null,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

-- Comment threads: one per source or annotation (discussion threads)
create table public.comment_threads (
  id uuid primary key default uuid_generate_v4(),
  vault_id uuid references public.vaults(id) on delete cascade not null,
  source_id uuid references public.sources(id) on delete cascade,
  annotation_id uuid references public.annotations(id) on delete cascade,
  created_at timestamptz default now(),
  constraint thread_target check (
    (source_id is not null and annotation_id is null) or
    (source_id is null and annotation_id is not null)
  )
);

create table public.comments (
  id uuid primary key default uuid_generate_v4(),
  thread_id uuid references public.comment_threads(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  body text not null,
  created_at timestamptz default now()
);

-- Indexes for foreign keys and common filters (improve query performance)
create index if not exists idx_vault_members_vault_id on public.vault_members(vault_id);
create index if not exists idx_vault_members_user_id on public.vault_members(user_id);
create index if not exists idx_sources_vault_id on public.sources(vault_id);
create index if not exists idx_annotations_source_id on public.annotations(source_id);
create index if not exists idx_annotations_user_id on public.annotations(user_id);
create index if not exists idx_audit_logs_vault_id on public.audit_logs(vault_id);
create index if not exists idx_audit_logs_created_at on public.audit_logs(created_at desc);
create index if not exists idx_vault_invites_vault_id on public.vault_invites(vault_id);
create index if not exists idx_vault_invites_email on public.vault_invites(lower(email));
create index if not exists idx_comment_threads_vault on public.comment_threads(vault_id);
create index if not exists idx_comment_threads_source on public.comment_threads(source_id);
create index if not exists idx_comment_threads_annotation on public.comment_threads(annotation_id);
create index if not exists idx_comments_thread on public.comments(thread_id);

-- Storage bucket for PDFs: Create in Supabase Dashboard > Storage > New bucket
-- Name: pdfs, Public: false
-- Storage policies (run after bucket exists):
-- Allow upload: (bucket_id = 'pdfs') and auth.role() = 'authenticated'
-- Allow read: (bucket_id = 'pdfs') and auth.role() = 'authenticated'

-- RLS Policies

alter table public.profiles enable row level security;
alter table public.vaults enable row level security;
alter table public.vault_members enable row level security;
alter table public.sources enable row level security;
alter table public.annotations enable row level security;
alter table public.vault_invites enable row level security;
alter table public.audit_logs enable row level security;
alter table public.comment_threads enable row level security;
alter table public.comments enable row level security;

-- Comment threads: members read, contributors insert
create policy "Members can read comment_threads"
  on public.comment_threads for select
  using (can_read_vault(vault_id, auth.uid()));

create policy "Contributors can insert comment_threads"
  on public.comment_threads for insert
  with check (can_write_vault(vault_id, auth.uid()));

-- Comments: members read, contributors insert
create policy "Members can read comments"
  on public.comments for select
  using (
    exists (
      select 1 from public.comment_threads t
      where t.id = thread_id and can_read_vault(t.vault_id, auth.uid())
    )
  );

create policy "Contributors can insert comments"
  on public.comments for insert
  with check (
    auth.uid() = user_id and
    exists (
      select 1 from public.comment_threads t
      where t.id = thread_id and can_write_vault(t.vault_id, auth.uid())
    )
  );

-- Profiles: users can read all (for collaborator display), update own
create policy "Users can read all profiles"
  on public.profiles for select
  using (auth.role() = 'authenticated');

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Helper functions (must exist before policies that use them)
create or replace function public.get_vault_role(p_vault_id uuid, p_user_id uuid)
returns vault_role as $$
  select role from public.vault_members
  where vault_id = p_vault_id and user_id = p_user_id
  limit 1;
$$ language sql security definer;

create or replace function public.can_write_vault(p_vault_id uuid, p_user_id uuid)
returns boolean as $$
  select exists (
    select 1 from public.vault_members
    where vault_id = p_vault_id and user_id = p_user_id
    and role in ('owner', 'contributor')
  );
$$ language sql security definer;

create or replace function public.can_read_vault(p_vault_id uuid, p_user_id uuid)
returns boolean as $$
  select exists (
    select 1 from public.vault_members
    where vault_id = p_vault_id and user_id = p_user_id
  );
$$ language sql security definer;

-- Vault invites policies
create policy "Owners can insert and delete invites"
  on public.vault_invites for insert
  with check (get_vault_role(vault_id, auth.uid()) = 'owner');

create policy "Owners can select their vault invites"
  on public.vault_invites for select
  using (get_vault_role(vault_id, auth.uid()) = 'owner');

create policy "Owners can delete invites"
  on public.vault_invites for delete
  using (get_vault_role(vault_id, auth.uid()) = 'owner');

create policy "Users can select invites for their email"
  on public.vault_invites for select
  using (lower((auth.jwt()->>'email')::text) = lower(email));

-- Vaults: owner can do everything; members can read
create policy "Users can read vaults they are members of"
  on public.vaults for select
  using (can_read_vault(id, auth.uid()));

create policy "Users can create vaults"
  on public.vaults for insert
  with check (auth.uid() = owner_id);

create policy "Owners can update vaults"
  on public.vaults for update
  using (auth.uid() = owner_id);

create policy "Owners can delete vaults"
  on public.vaults for delete
  using (auth.uid() = owner_id);

-- Vault members
create policy "Members can read vault_members"
  on public.vault_members for select
  using (can_read_vault(vault_id, auth.uid()));

create policy "Owners can insert vault_members"
  on public.vault_members for insert
  with check (
    get_vault_role(vault_id, auth.uid()) = 'owner'
  );

create policy "Owners can update vault_members"
  on public.vault_members for update
  using (get_vault_role(vault_id, auth.uid()) = 'owner');

create policy "Owners can delete vault_members"
  on public.vault_members for delete
  using (get_vault_role(vault_id, auth.uid()) = 'owner');

-- Sources
create policy "Members can read sources"
  on public.sources for select
  using (can_read_vault(vault_id, auth.uid()));

create policy "Contributors can insert sources"
  on public.sources for insert
  with check (can_write_vault(vault_id, auth.uid()));

create policy "Contributors can update sources"
  on public.sources for update
  using (can_write_vault(vault_id, auth.uid()));

create policy "Contributors can delete sources"
  on public.sources for delete
  using (can_write_vault(vault_id, auth.uid()));

-- Annotations
create policy "Members can read annotations"
  on public.annotations for select
  using (
    exists (
      select 1 from public.sources s
      where s.id = source_id and can_read_vault(s.vault_id, auth.uid())
    )
  );

create policy "Contributors can insert annotations"
  on public.annotations for insert
  with check (
    auth.uid() = user_id and
    exists (
      select 1 from public.sources s
      where s.id = source_id and can_write_vault(s.vault_id, auth.uid())
    )
  );

create policy "Contributors can update own annotations"
  on public.annotations for update
  using (auth.uid() = user_id);

create policy "Contributors can delete own annotations"
  on public.annotations for delete
  using (auth.uid() = user_id);

-- Audit logs: append-only, members can read
create policy "Members can read audit_logs"
  on public.audit_logs for select
  using (can_read_vault(vault_id, auth.uid()));

create policy "System can insert audit_logs"
  on public.audit_logs for insert
  with check (true);

-- No update or delete on audit_logs
-- (RLS will block by default since we don't add policies)

-- Trigger: add owner to vault_members when vault is created
create or replace function public.handle_new_vault()
returns trigger as $$
begin
  insert into public.vault_members (vault_id, user_id, role)
  values (new.id, new.owner_id, 'owner');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_vault_created
  after insert on public.vaults
  for each row execute function public.handle_new_vault();

-- Trigger: create profile when new user signs up (auth.users)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', new.email));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Realtime: enable for sources and vault_members
-- Run in Supabase SQL Editor after tables exist:
-- alter publication supabase_realtime add table public.sources;
-- alter publication supabase_realtime add table public.vault_members;
