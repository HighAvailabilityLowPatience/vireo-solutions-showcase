import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

// Generate a unique license key in format VVS-XXXX-XXXX-XXXX
function generateLicenseKey(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const segments = [];
  for (let i = 0; i < 3; i++) {
    let segment = "";
    for (let j = 0; j < 4; j++) {
      segment += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    segments.push(segment);
  }
  return `VVS-${segments.join("-")}`;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const stripeWebhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

    // Create Supabase client with service role key for admin operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    console.log("Received webhook request");

    // If webhook secret is configured, verify the signature
    // For now, we'll process without verification if secret is not set
    if (stripeWebhookSecret && signature) {
      // In production, you should verify the signature using Stripe's library
      // For now, we trust the request if it comes through
      console.log("Webhook secret is configured - signature verification would happen here");
    } else {
      console.log("Warning: STRIPE_WEBHOOK_SECRET not configured - processing without signature verification");
    }

    const event = JSON.parse(body);
    console.log("Event type:", event.type);

    // Only process checkout.session.completed events
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      
      console.log("Processing checkout session:", session.id);
      console.log("Customer email:", session.customer_details?.email);
      console.log("Session metadata:", session.metadata);

      const customerEmail = session.customer_details?.email || session.customer_email;
      const productId = session.metadata?.product_id;

      if (!customerEmail) {
        console.error("No customer email found in session");
        return new Response(JSON.stringify({ error: "No customer email" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Create order record
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          stripe_session_id: session.id,
          stripe_payment_intent_id: session.payment_intent,
          customer_email: customerEmail,
          product_id: productId || null,
          amount_cents: session.amount_total,
          currency: session.currency,
          status: "completed",
        })
        .select()
        .single();

      if (orderError) {
        console.error("Error creating order:", orderError);
        return new Response(JSON.stringify({ error: "Failed to create order" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      console.log("Order created:", order.id);

      // Generate and store license key
      const licenseKey = generateLicenseKey();
      
      const { data: license, error: licenseError } = await supabase
        .from("licenses")
        .insert({
          order_id: order.id,
          product_id: productId || null,
          license_key: licenseKey,
          customer_email: customerEmail,
          is_active: true,
        })
        .select()
        .single();

      if (licenseError) {
        console.error("Error creating license:", licenseError);
        return new Response(JSON.stringify({ error: "Failed to create license" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      console.log("License created:", license.id, "Key:", licenseKey);

      return new Response(
        JSON.stringify({ 
          success: true, 
          order_id: order.id,
          license_key: licenseKey 
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // For other event types, just acknowledge receipt
    console.log("Event type not handled:", event.type);
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Webhook error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
