-- Comment threads: one per source or per annotation
create table if not exists public.comment_threads (
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

create table if not exists public.comments (
  id uuid primary key default uuid_generate_v4(),
  thread_id uuid references public.comment_threads(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  body text not null,
  created_at timestamptz default now()
);

create index if not exists idx_comment_threads_vault on public.comment_threads(vault_id);
create index if not exists idx_comment_threads_source on public.comment_threads(source_id);
create index if not exists idx_comment_threads_annotation on public.comment_threads(annotation_id);
create index if not exists idx_comments_thread on public.comments(thread_id);

alter table public.comment_threads enable row level security;
alter table public.comments enable row level security;

create policy "Members can read comment_threads"
  on public.comment_threads for select
  using (public.can_read_vault(vault_id, auth.uid()));

create policy "Contributors can insert comment_threads"
  on public.comment_threads for insert
  with check (public.can_write_vault(vault_id, auth.uid()));

create policy "Members can read comments"
  on public.comments for select
  using (
    exists (
      select 1 from public.comment_threads t
      where t.id = thread_id and public.can_read_vault(t.vault_id, auth.uid())
    )
  );

create policy "Contributors can insert comments"
  on public.comments for insert
  with check (
    auth.uid() = user_id and
    exists (
      select 1 from public.comment_threads t
      where t.id = thread_id and public.can_write_vault(t.vault_id, auth.uid())
    )
  );
