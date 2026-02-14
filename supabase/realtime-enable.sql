-- Enable Realtime for vault_members (INSERT, UPDATE, DELETE)
-- Run this in Supabase SQL Editor if collaborator role changes don't update in real-time.
-- Ref: https://supabase.com/docs/guides/realtime/postgres-changes

-- 1. Add table to replication (skip if already added)
ALTER PUBLICATION supabase_realtime ADD TABLE public.vault_members;

-- 2. REPLICA IDENTITY FULL - required for UPDATE/DELETE filters to work
--    Without this, filters on vault_id may not match for UPDATE/DELETE events
ALTER TABLE public.vault_members REPLICA IDENTITY FULL;
