import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Footer from "@/components/Footer";
import logo from "@/assets/logo.png";

interface Product {
  id: string;
  title: string;
  description: string;
  stripeUrl: string;
}

const products: Product[] = [
  {
    id: "repo-license",
    title: "Repo License Key Manager",
    description: "Streamline license key generation and validation for your repositories. Built-in analytics, webhook support, and revocation controls.",
    stripeUrl: "https://buy.stripe.com/placeholder-repo-license",
  },
  {
    id: "automation-toolkit",
    title: "Automation Toolkit",
    description: "Powerful automation suite for CI/CD pipelines, deployment workflows, and infrastructure management. Save hours with pre-built templates.",
    stripeUrl: "https://buy.stripe.com/placeholder-automation-toolkit",
  },
  {
    id: "cloud-infra",
    title: "Cloud Infra Visualizer",
    description: "Visualize and manage your cloud infrastructure with interactive diagrams. Real-time monitoring, cost analysis, and dependency mapping.",
    stripeUrl: "https://buy.stripe.com/placeholder-cloud-infra",
  },
];

const Index = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleProductSelect = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    setSelectedProduct(product || null);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="px-6 py-8 md:px-12 md:py-12">
        <img src={logo} alt="Vireo Vitalis Solutions" className="h-16 w-auto" />
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-2xl px-6 py-12 md:py-20 flex-1">
        {/* Product Selector */}
        <div className="space-y-3 text-center">
          <label htmlFor="product-select" className="block text-sm font-medium text-muted-foreground">
            Select a Product
          </label>
          <Select onValueChange={handleProductSelect}>
            <SelectTrigger 
              id="product-select"
              className="mx-auto max-w-md bg-card border-border"
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
          <Card className="mt-16 overflow-hidden border-border bg-card animate-in fade-in-50 duration-500">
            <div className="p-8 md:p-12 space-y-8">
              {/* Product Title */}
              <div className="space-y-2">
                <h2 className="text-3xl font-semibold text-card-foreground tracking-tight">
                  {selectedProduct.title}
                </h2>
                <p className="text-base text-muted-foreground leading-relaxed">
                  {selectedProduct.description}
                </p>
              </div>

              {/* Video Placeholder */}
              <div className="aspect-video rounded-lg bg-muted flex items-center justify-center border border-border">
                <div className="text-center space-y-2 px-6">
                  <div className="h-12 w-12 mx-auto rounded-full bg-background flex items-center justify-center">
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
                <Button
                  asChild
                  size="lg"
                  className="w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <a
                    href={selectedProduct.stripeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Buy License
                  </a>
                </Button>
              </div>
            </div>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Index;
