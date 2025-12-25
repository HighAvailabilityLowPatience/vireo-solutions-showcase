import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

// Fallback videos in case database is empty
const FALLBACK_VIDEOS = [
  "https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_30fps.mp4",
  "https://videos.pexels.com/video-files/7989670/7989670-uhd_2560_1440_25fps.mp4",
  "https://videos.pexels.com/video-files/6963744/6963744-uhd_2560_1440_25fps.mp4",
  "https://videos.pexels.com/video-files/5377684/5377684-uhd_2560_1440_25fps.mp4",
];

const HeroSection = () => {
  const [videos, setVideos] = useState<string[]>(FALLBACK_VIDEOS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const preloadRef = useRef<HTMLVideoElement | null>(null);

  // Fetch videos from database
  useEffect(() => {
    const fetchVideos = async () => {
      const { data, error } = await supabase
        .from('hero_videos')
        .select('url')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (!error && data && data.length > 0) {
        setVideos(data.map(v => v.url));
      }
    };

    fetchVideos();
  }, []);

  // Preload next video
  useEffect(() => {
    if (videos.length === 0) return;
    
    const nextIndex = (currentIndex + 1) % videos.length;
    const preloadVideo = document.createElement("video");
    preloadVideo.src = videos[nextIndex];
    preloadVideo.preload = "auto";
    preloadVideo.muted = true;
    preloadRef.current = preloadVideo;

    return () => {
      if (preloadRef.current) {
        preloadRef.current.src = "";
        preloadRef.current = null;
      }
    };
  }, [currentIndex, videos]);

  const handleVideoEnd = useCallback(() => {
    setIsFading(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % videos.length);
      setIsLoading(true);
      setIsFading(false);
    }, 500);
  }, [videos.length]);

  const handleCanPlay = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleError = useCallback(() => {
    console.warn(`Video failed to load: ${videos[currentIndex]}`);
    setCurrentIndex((prev) => (prev + 1) % videos.length);
  }, [currentIndex, videos]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Fallback gradient background - always visible behind video */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(var(--primary)/0.1)_0%,_transparent_70%)]" />

      {/* Single video element with proper loading/error handling */}
      {videos.length > 0 && (
        <video
          ref={videoRef}
          key={`${currentIndex}-${videos[currentIndex]}`}
          src={videos[currentIndex]}
          autoPlay
          muted
          playsInline
          onEnded={handleVideoEnd}
          onCanPlay={handleCanPlay}
          onError={handleError}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-700",
            isLoading || isFading ? "opacity-0" : "opacity-100"
          )}
        />
      )}

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-background/70" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground tracking-tight mb-6 animate-fade-in">
          Transforming Business
          <br />
          <span className="text-primary">Through Strategic IT</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          Expert IT consulting and tailored technology solutions that drive growth,
          innovation, and lasting competitive advantage.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <Button
            asChild
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all duration-300 text-lg px-8 py-6"
          >
            <Link to="/business-solutions">Business Solutions</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-primary text-primary hover:bg-primary/10 hover:scale-105 transition-all duration-300 text-lg px-8 py-6"
          >
            <Link to="/solutions">Our Crafted Solutions</Link>
          </Button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="h-8 w-8 text-muted-foreground" />
      </div>
    </section>
  );
};

export default HeroSection;
