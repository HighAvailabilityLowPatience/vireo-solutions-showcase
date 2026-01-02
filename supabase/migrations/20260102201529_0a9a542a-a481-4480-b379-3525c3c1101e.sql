-- Create a public storage bucket for videos
INSERT INTO storage.buckets (id, name, public)
VALUES ('videos', 'videos', true);

-- Allow public read access to videos
CREATE POLICY "Anyone can view videos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'videos');

-- Allow admins to upload videos
CREATE POLICY "Admins can upload videos"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'videos' AND has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to delete videos
CREATE POLICY "Admins can delete videos"
ON storage.objects
FOR DELETE
USING (bucket_id = 'videos' AND has_role(auth.uid(), 'admin'::app_role));