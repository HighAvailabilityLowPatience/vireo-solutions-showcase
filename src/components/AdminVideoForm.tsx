import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AdminVideoFormProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
}

const AdminVideoForm = ({ open, onClose, onSave }: AdminVideoFormProps) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !url.trim()) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    // Get the highest display_order
    const { data: existingVideos } = await supabase
      .from('hero_videos')
      .select('display_order')
      .order('display_order', { ascending: false })
      .limit(1);

    const nextOrder = existingVideos && existingVideos.length > 0 
      ? existingVideos[0].display_order + 1 
      : 1;

    const { error } = await supabase
      .from('hero_videos')
      .insert({
        title: title.trim(),
        url: url.trim(),
        is_active: isActive,
        display_order: nextOrder,
      });

    setIsLoading(false);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to add video.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Video added',
        description: 'The video has been added successfully.',
      });
      setTitle('');
      setUrl('');
      setIsActive(true);
      onSave();
      onClose();
    }
  };

  const handleClose = () => {
    setTitle('');
    setUrl('');
    setIsActive(true);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Video</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Digital Network"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">Video URL</Label>
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>

          {/* Video Preview */}
          {url && (
            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="relative w-full h-32 bg-muted rounded-md overflow-hidden">
                <video
                  src={url}
                  className="w-full h-full object-cover"
                  muted
                  autoPlay
                  loop
                  playsInline
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <Label htmlFor="active">Active</Label>
            <Switch
              id="active"
              checked={isActive}
              onCheckedChange={setIsActive}
              className="data-[state=checked]:bg-green-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Video'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminVideoForm;
