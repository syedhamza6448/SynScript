-- Add optional page and position for PDF annotations
ALTER TABLE public.annotations
  ADD COLUMN IF NOT EXISTS page_number integer,
  ADD COLUMN IF NOT EXISTS rect jsonb;

COMMENT ON COLUMN public.annotations.page_number IS 'PDF page (1-based) when annotation targets a specific page';
COMMENT ON COLUMN public.annotations.rect IS 'Bounding box {x,y,w,h} as 0-1 normalized coords on page';
