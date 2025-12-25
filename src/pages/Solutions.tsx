import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExternalLink, Play } from "lucide-react";

interface Product {
  id: string;
  title: string;
  description: string;
  stripe_url: string | null;
  video_url: string | null;
  price: number | null;
}

const Solutions = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching products:", error);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  const handleProductSelect = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    setSelectedProduct(product || null);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Hero Banner */}
      <section className="pt-32 pb-12 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-foreground tracking-wide mb-6">
            Crafted Solutions
          </h1>
          
          {/* Decorative Line */}
          <div className="w-16 h-px bg-primary/40 mx-auto mb-8" />
          
          {/* Philosophy Statement */}
          <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto font-light leading-relaxed mb-8">
            Each solution is thoughtfully designed for those who appreciate precision and quiet excellence.
          </p>

          {/* Subtle Tags */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            <span className="text-xs tracking-widest uppercase text-muted-foreground/70 border border-border/50 px-4 py-2 rounded-full">
              Bespoke Development
            </span>
            <span className="text-xs tracking-widest uppercase text-muted-foreground/70 border border-border/50 px-4 py-2 rounded-full">
              Tailored Solutions
            </span>
            <span className="text-xs tracking-widest uppercase text-muted-foreground/70 border border-border/50 px-4 py-2 rounded-full">
              Quiet Excellence
            </span>
          </div>
        </div>
      </section>

      {/* Solutions Content */}
      <section className="flex-1 py-16">
        <div className="container mx-auto px-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                No solutions available at the moment. Check back soon!
              </p>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              {/* Product Selector */}
              <div className="mb-12">
                <label className="block text-sm font-medium text-muted-foreground mb-3">
                  Select a Solution
                </label>
                <Select onValueChange={handleProductSelect}>
                  <SelectTrigger className="w-full md:w-96 bg-card border-border">
                    <SelectValue placeholder="Choose a solution to explore..." />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Selected Product Display */}
              {selectedProduct && (
                <Card className="bg-card border-border animate-fade-in">
                  <CardHeader>
                    <CardTitle className="text-2xl md:text-3xl text-foreground">
                      {selectedProduct.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      {selectedProduct.description}
                    </p>

                    {/* Video Placeholder */}
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border border-border">
                      {selectedProduct.video_url ? (
                        <video
                          src={selectedProduct.video_url}
                          controls
                          className="w-full h-full rounded-lg"
                        />
                      ) : (
                        <div className="text-center text-muted-foreground">
                          <Play className="h-16 w-16 mx-auto mb-3 opacity-50" />
                          <p>Demo video coming soon</p>
                        </div>
                      )}
                    </div>

                    {/* Price & CTA */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border">
                      {selectedProduct.price && (
                        <p className="text-2xl font-bold text-foreground">
                          ${selectedProduct.price.toLocaleString()}
                        </p>
                      )}
                      {selectedProduct.stripe_url ? (
                        <Button
                          asChild
                          size="lg"
                          className="bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                          <a
                            href={selectedProduct.stripe_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="mr-2 h-5 w-5" />
                            Buy License
                          </a>
                        </Button>
                      ) : (
                        <Button size="lg" disabled className="opacity-50">
                          Coming Soon
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Solutions;
