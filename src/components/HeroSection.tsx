import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const VIDEOS = [
  "https://cdn.pixabay.com/video/2020/05/25/40130-424930032_large.mp4",
  "https://cdn.pixabay.com/video/2021/02/21/65881-515376035_large.mp4",
  "https://cdn.pixabay.com/video/2020/08/12/47244-449623750_large.mp4",
  "https://cdn.pixabay.com/video/2019/07/30/25484-351553263_large.mp4",
  "https://cdn.pixabay.com/video/2020/02/04/31806-389965037_large.mp4",
];

const HeroSection = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideoIndex((prev) => (prev + 1) % VIDEOS.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Rotating Video Backgrounds with Crossfade */}
      {VIDEOS.map((src, index) => (
        <video
          key={index}
          autoPlay
          muted
          loop
          playsInline
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-1000",
            index === currentVideoIndex ? "opacity-100" : "opacity-0"
          )}
        >
          <source src={src} type="video/mp4" />
        </video>
      ))}

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
            <Link to="/solutions">Our Crafted Projects</Link>
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
