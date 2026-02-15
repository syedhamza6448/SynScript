-- Enable Realtime for annotations (INSERT, UPDATE, DELETE)
-- Run in Supabase SQL Editor so annotation changes broadcast to clients.

ALTER PUBLICATION supabase_realtime ADD TABLE public.annotations;
ALTER TABLE public.annotations REPLICA IDENTITY FULL;
