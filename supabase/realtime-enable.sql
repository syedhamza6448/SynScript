-- Enable Realtime for vault_members (INSERT, UPDATE, DELETE)
-- Run this in Supabase SQL Editor if collaborator role changes don't update in real-time.
-- If you get "already exists" error, the table is already in the publication.
-- Ref: https://supabase.com/docs/guides/realtime/postgres-changes

ALTER PUBLICATION supabase_realtime ADD TABLE public.vault_members;
