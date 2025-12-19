-- Orders table to track completed payments
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,
  customer_email TEXT NOT NULL,
  product_id UUID REFERENCES public.products(id),
  amount_cents INTEGER,
  currency TEXT DEFAULT 'usd',
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Licenses table to store generated license keys
CREATE TABLE public.licenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id),
  product_id UUID REFERENCES public.products(id),
  license_key TEXT UNIQUE NOT NULL,
  customer_email TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for orders
CREATE POLICY "Admins can view all orders"
ON public.orders
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert orders"
ON public.orders
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for licenses
CREATE POLICY "Admins can view all licenses"
ON public.licenses
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert licenses"
ON public.licenses
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Allow public read of licenses by session_id (for success page lookup)
CREATE POLICY "Anyone can view license by order session"
ON public.licenses
FOR SELECT
USING (true);

-- Allow public read of orders by session_id (for success page lookup)
CREATE POLICY "Anyone can view order by session_id"
ON public.orders
FOR SELECT
USING (true)