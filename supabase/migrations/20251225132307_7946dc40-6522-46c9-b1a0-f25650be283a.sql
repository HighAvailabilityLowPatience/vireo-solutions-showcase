-- Add duration_seconds column to hero_videos table
ALTER TABLE public.hero_videos 
ADD COLUMN duration_seconds integer DEFAULT NULL;

-- Add a comment explaining the column
COMMENT ON COLUMN public.hero_videos.duration_seconds IS 'Custom duration in seconds (NULL = play full video)';