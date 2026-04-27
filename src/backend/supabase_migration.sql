-- ============================================================
-- Supabase migration: resume_scores table
-- Run this in the Supabase SQL editor
-- ============================================================

create table if not exists public.resume_scores (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  file_name       text not null,
  job_role        text,
  overall         smallint not null check (overall between 0 and 100),

  -- JSONB columns — stored exactly as Gemini returns them
  categories      jsonb not null,
  strengths       jsonb not null,
  improvements    jsonb not null,
  keywords_missing jsonb not null,

  created_at      timestamptz not null default now()
);

-- Index for fast user history queries
create index if not exists resume_scores_user_id_created_at_idx
  on public.resume_scores (user_id, created_at desc);

-- ── Row Level Security ──────────────────────────────────────
alter table public.resume_scores enable row level security;

-- Users can only read their own scores
create policy "Users can read own scores"
  on public.resume_scores
  for select
  using (auth.uid() = user_id);

-- Our backend uses the service role key so it bypasses RLS for inserts
-- (no insert policy needed — service role is exempt)

-- ── Optional: expose to PostgREST ──────────────────────────
grant select on public.resume_scores to authenticated;
