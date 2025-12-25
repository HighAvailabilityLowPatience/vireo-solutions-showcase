-- Create hero_videos table
CREATE TABLE public.hero_videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.hero_videos ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
CREATE POLICY "Admins can view all hero videos"
ON public.hero_videos
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert hero videos"
ON public.hero_videos
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update hero videos"
ON public.hero_videos
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete hero videos"
ON public.hero_videos
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Public can read active videos (for the hero section)
CREATE POLICY "Anyone can view active hero videos"
ON public.hero_videos
FOR SELECT
USING (is_active = true);

-- Seed with existing videos
INSERT INTO public.hero_videos (url, title, is_active, display_order) VALUES
('https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_30fps.mp4', 'Digital Network', true, 1),
('https://videos.pexels.com/video-files/7989670/7989670-uhd_2560_1440_25fps.mp4', 'Modern Office', true, 2),
('https://videos.pexels.com/video-files/6963744/6963744-uhd_2560_1440_25fps.mp4', 'Tech Visualization', true, 3),
('https://videos.pexels.com/video-files/5377684/5377684-uhd_2560_1440_25fps.mp4', 'Business Meeting', true, 4);