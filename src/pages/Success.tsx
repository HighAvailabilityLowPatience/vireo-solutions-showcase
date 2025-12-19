import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Copy, Home } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";

interface License {
  license_key: string;
  customer_email: string;
  created_at: string;
}

const Success = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [license, setLicense] = useState<License | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLicense = async () => {
      if (!sessionId) {
        setLoading(false);
        return;
      }

      // First get the order by session ID
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .select("id")
        .eq("stripe_session_id", sessionId)
        .maybeSingle();

      if (orderError) {
        console.error("Error fetching order:", orderError);
        setError("Could not find your order. Please contact support.");
        setLoading(false);
        return;
      }

      if (!order) {
        // Order might not be created yet - webhook may still be processing
        setError("Your order is being processed. Please refresh in a moment.");
        setLoading(false);
        return;
      }

      // Get the license for this order
      const { data: licenseData, error: licenseError } = await supabase
        .from("licenses")
        .select("license_key, customer_email, created_at")
        .eq("order_id", order.id)
        .maybeSingle();

      if (licenseError) {
        console.error("Error fetching license:", licenseError);
        setError("Could not retrieve your license. Please contact support.");
        setLoading(false);
        return;
      }

      if (licenseData) {
        setLicense(licenseData);
      } else {
        setError("License is being generated. Please refresh in a moment.");
      }
      setLoading(false);
    };

    fetchLicense();
  }, [sessionId]);

  const copyToClipboard = () => {
    if (license?.license_key) {
      navigator.clipboard.writeText(license.license_key);
      toast({
        title: "Copied!",
        description: "License key copied to clipboard",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="h-8 w-auto" />
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md border-border bg-card">
          <CardHeader className="text-center">
            {loading ? (
              <div className="flex flex-col items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-muted animate-pulse" />
                <CardTitle className="text-foreground">Loading...</CardTitle>
              </div>
            ) : license ? (
              <div className="flex flex-col items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <CheckCircle className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-foreground">Payment Successful!</CardTitle>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <CardTitle className="text-foreground">Processing...</CardTitle>
              </div>
            )}
          </CardHeader>

          <CardContent className="space-y-6">
            {loading ? (
              <div className="space-y-4">
                <div className="h-20 bg-muted rounded-lg animate-pulse" />
              </div>
            ) : license ? (
              <>
                <p className="text-center text-muted-foreground">
                  Thank you for your purchase! Your license key is below.
                </p>

                <div className="bg-secondary/50 rounded-lg p-4 border border-border">
                  <p className="text-xs text-muted-foreground mb-2">Your License Key</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 font-mono text-lg text-foreground tracking-wider">
                      {license.license_key}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={copyToClipboard}
                      className="shrink-0"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground text-center">
                  A confirmation email has been sent to{" "}
                  <span className="text-foreground">{license.customer_email}</span>
                </p>

                <Button asChild className="w-full">
                  <Link to="/">
                    <Home className="mr-2 h-4 w-4" />
                    Back to Home
                  </Link>
                </Button>
              </>
            ) : (
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">{error}</p>
                <Button onClick={() => window.location.reload()} variant="outline">
                  Refresh Page
                </Button>
                <Button asChild variant="ghost" className="w-full">
                  <Link to="/">
                    <Home className="mr-2 h-4 w-4" />
                    Back to Home
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Success;
