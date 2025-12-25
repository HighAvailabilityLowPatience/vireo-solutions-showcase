import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Video } from 'lucide-react';
import AdminVideoCard from './AdminVideoCard';
import AdminVideoForm from './AdminVideoForm';

interface HeroVideo {
  id: string;
  url: string;
  title: string;
  is_active: boolean;
  display_order: number;
  thumbnail_url: string | null;
  duration_seconds: number | null;
}

const AdminVideoManager = () => {
  const [videos, setVideos] = useState<HeroVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('hero_videos')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to load videos.',
        variant: 'destructive',
      });
    } else {
      setVideos(data || []);
    }
    setIsLoading(false);
  };

  const handleToggle = async (id: string, isActive: boolean) => {
    setIsUpdating(true);
    const { error } = await supabase
      .from('hero_videos')
      .update({ is_active: isActive })
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update video status.',
        variant: 'destructive',
      });
    } else {
      setVideos(prev => 
        prev.map(v => v.id === id ? { ...v, is_active: isActive } : v)
      );
      toast({
        title: isActive ? 'Video activated' : 'Video deactivated',
        description: `The video is now ${isActive ? 'visible' : 'hidden'} on the homepage.`,
      });
    }
    setIsUpdating(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('hero_videos')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete video.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Video deleted',
        description: 'The video has been removed.',
      });
      fetchVideos();
    }
  };

  const handleUpdate = async (id: string, updates: { title?: string; duration_seconds?: number | null }) => {
    const { error } = await supabase
      .from('hero_videos')
      .update(updates)
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update video.',
        variant: 'destructive',
      });
    } else {
      setVideos(prev => 
        prev.map(v => v.id === id ? { ...v, ...updates } : v)
      );
      toast({
        title: 'Video updated',
        description: 'Changes saved successfully.',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Loading videos...
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Video className="h-5 w-5 text-primary" />
          <div>
            <h2 className="text-lg font-semibold text-foreground">Hero Videos</h2>
            <p className="text-sm text-muted-foreground">
              {videos.filter(v => v.is_active).length} of {videos.length} videos active
            </p>
          </div>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Video
        </Button>
      </div>

      {videos.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-border rounded-lg">
          <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No videos yet. Add your first hero video.</p>
          <Button variant="outline" className="mt-4" onClick={() => setFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Video
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {videos.map((video) => (
            <AdminVideoCard
              key={video.id}
              video={video}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
              isUpdating={isUpdating}
            />
          ))}
        </div>
      )}

      <AdminVideoForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={fetchVideos}
      />
    </div>
  );
};

export default AdminVideoManager;
