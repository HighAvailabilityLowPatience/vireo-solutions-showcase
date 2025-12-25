import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import WhatWeDoSection from "@/components/WhatWeDoSection";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  title: string;
  description: string;
  stripe_url: string | null;
  video_url: string | null;
  price: number | null;
}

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: true });

    if (!error && data) {
      setProducts(data);
    }
    setIsLoading(false);
  };

  const handleProductSelect = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    setSelectedProduct(product || null);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <HeroSection />

      <WhatWeDoSection />

      {/* Solutions Section */}
      <section id="solutions" className="py-24 bg-card border-t border-border">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-card-foreground mb-4">
              Our Crafted Solutions
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our portfolio of innovative products designed to solve real business challenges.
            </p>
          </div>

          {/* Product Selector */}
          <div className="max-w-2xl mx-auto">
            <div className="space-y-3 text-center">
              <label htmlFor="product-select" className="block text-sm font-medium text-muted-foreground">
                Select a Product
              </label>
              <Select onValueChange={handleProductSelect}>
                <SelectTrigger 
                  id="product-select"
                  className="mx-auto max-w-md bg-background border-border"
                >
                  <SelectValue placeholder="Choose a product..." />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Product Details */}
            {selectedProduct && (
              <Card className="mt-12 overflow-hidden border-border bg-background animate-in fade-in-50 duration-500">
                <div className="p-8 md:p-12 space-y-8">
                  {/* Product Title */}
                  <div className="space-y-2">
                    <h3 className="text-3xl font-semibold text-foreground tracking-tight">
                      {selectedProduct.title}
                    </h3>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      {selectedProduct.description}
                    </p>
                  </div>

                  {/* Video Placeholder */}
                  <div className="aspect-video rounded-lg bg-muted flex items-center justify-center border border-border">
                    <div className="text-center space-y-2 px-6">
                      <div className="h-12 w-12 mx-auto rounded-full bg-card flex items-center justify-center">
                        <svg
                          className="h-6 w-6 text-muted-foreground"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Video Placeholder
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Add YouTube embed later
                      </p>
                    </div>
                  </div>

                  {/* Buy Button */}
                  <div className="pt-4">
                    {selectedProduct.stripe_url ? (
                      <Button
                        asChild
                        size="lg"
                        className="w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        <a
                          href={selectedProduct.stripe_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Buy License {selectedProduct.price && `- $${selectedProduct.price}`}
                        </a>
                      </Button>
                    ) : (
                      <Button
                        size="lg"
                        disabled
                        className="w-full md:w-auto"
                      >
                        Coming Soon
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
