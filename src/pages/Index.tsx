import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import WhatWeDoSection from "@/components/WhatWeDoSection";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <HeroSection />
      <WhatWeDoSection />
      <Footer />

      {/* Admin Button */}
      <Button
        onClick={() => navigate('/admin')}
        className="fixed bottom-4 right-4 opacity-50 hover:opacity-100 z-50"
      >
        Admin
      </Button>
    </div>
  );
};

export default Index;
