import { useState, useRef } from 'react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Pencil, Trash2, GripVertical, Play, Pause, Check, X, Clock } from 'lucide-react';

interface HeroVideo {
  id: string;
  url: string;
  title: string;
  is_active: boolean;
  display_order: number;
  thumbnail_url: string | null;
  duration_seconds: number | null;
}

interface AdminVideoCardProps {
  video: HeroVideo;
  onToggle: (id: string, isActive: boolean) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: { title?: string; duration_seconds?: number | null }) => void;
  isUpdating: boolean;
}

const AdminVideoCard = ({ video, onToggle, onDelete, onUpdate, isUpdating }: AdminVideoCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(video.title);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [duration, setDuration] = useState<number>(video.duration_seconds ?? 15);
  const [playFullVideo, setPlayFullVideo] = useState(video.duration_seconds === null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleToggle = (checked: boolean) => {
    onToggle(video.id, checked);
  };

  const handleSaveTitle = () => {
    if (editTitle.trim() && editTitle !== video.title) {
      onUpdate(video.id, { title: editTitle.trim() });
    }
    setIsEditing(false);
  };

  const handleDurationChange = (values: number[]) => {
    const newDuration = values[0];
    setDuration(newDuration);
    if (!playFullVideo) {
      onUpdate(video.id, { duration_seconds: newDuration });
    }
  };

  const handlePlayFullVideoChange = (checked: boolean) => {
    setPlayFullVideo(checked);
    onUpdate(video.id, { duration_seconds: checked ? null : duration });
  };

  const handleCancelEdit = () => {
    setEditTitle(video.title);
    setIsEditing(false);
  };

  const togglePreview = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div 
      className="group relative bg-card border border-border rounded-lg p-4 transition-all hover:border-primary/50 hover:shadow-md"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        if (videoRef.current && isPlaying) {
          videoRef.current.pause();
          setIsPlaying(false);
        }
      }}
    >
      <div className="flex items-center gap-4">
        {/* Drag Handle */}
        <div className="cursor-grab text-muted-foreground hover:text-foreground transition-colors">
          <GripVertical className="h-5 w-5" />
        </div>

        {/* Video Preview */}
        <div className="relative w-32 h-20 bg-muted rounded-md overflow-hidden flex-shrink-0">
          <video
            ref={videoRef}
            src={video.url}
            className="w-full h-full object-cover"
            muted
            loop
            playsInline
          />
          <button
            onClick={togglePreview}
            className="absolute inset-0 flex items-center justify-center bg-background/50 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {isPlaying ? (
              <Pause className="h-6 w-6 text-foreground" />
            ) : (
              <Play className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Video Info */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="h-8"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveTitle();
                  if (e.key === 'Escape') handleCancelEdit();
                }}
              />
              <Button size="sm" variant="ghost" onClick={handleSaveTitle} className="h-8 w-8 p-0">
                <Check className="h-4 w-4 text-green-500" />
              </Button>
              <Button size="sm" variant="ghost" onClick={handleCancelEdit} className="h-8 w-8 p-0">
                <X className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-foreground truncate">{video.title}</h3>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(true)}
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Pencil className="h-3 w-3" />
              </Button>
            </div>
          )}
          <p className="text-sm text-muted-foreground mt-1">Order: {video.display_order}</p>
          
          {/* Duration Control */}
          <div className="flex items-center gap-3 mt-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div className="flex items-center gap-2 flex-1 max-w-[200px]">
              <Slider
                value={[duration]}
                onValueChange={handleDurationChange}
                min={5}
                max={60}
                step={5}
                disabled={playFullVideo || isUpdating}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground w-12">
                {duration}s
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id={`full-${video.id}`}
                checked={playFullVideo}
                onCheckedChange={handlePlayFullVideoChange}
                disabled={isUpdating}
              />
              <label htmlFor={`full-${video.id}`} className="text-sm text-muted-foreground cursor-pointer">
                Full video
              </label>
            </div>
          </div>
        </div>

        {/* Status & Actions */}
        <div className="flex items-center gap-4">
          {/* Status Indicator */}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${video.is_active ? 'bg-green-500' : 'bg-muted-foreground'}`} />
            <span className={`text-sm font-medium ${video.is_active ? 'text-green-500' : 'text-muted-foreground'}`}>
              {video.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>

          {/* Toggle Switch */}
          <Switch
            checked={video.is_active}
            onCheckedChange={handleToggle}
            disabled={isUpdating}
            className="data-[state=checked]:bg-green-500"
          />

          {/* Delete Button */}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(video.id)}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminVideoCard;
