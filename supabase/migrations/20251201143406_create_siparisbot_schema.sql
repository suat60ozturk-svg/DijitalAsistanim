/*
  # SiparişBot Platform Schema

  ## Overview
  Complete database schema for SiparişBot - WhatsApp automation platform for e-commerce businesses.

  ## New Tables

  ### 1. `profiles`
  User profile information extending auth.users
  - `id` (uuid, FK to auth.users)
  - `business_name` (text) - Company/store name
  - `phone` (text) - WhatsApp Business phone number
  - `subscription_tier` (text) - Subscription plan level
  - `subscription_status` (text) - Active, expired, trial
  - `trial_ends_at` (timestamptz) - Trial expiration date
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. `customers`
  End customers who place orders
  - `id` (uuid, primary key)
  - `business_id` (uuid, FK to profiles)
  - `name` (text) - Customer name
  - `phone` (text) - Customer WhatsApp number
  - `email` (text, optional)
  - `total_orders` (integer) - Order count
  - `total_spent` (decimal) - Total spending amount
  - `notes` (text) - Customer notes
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 3. `orders`
  Order records from WhatsApp
  - `id` (uuid, primary key)
  - `business_id` (uuid, FK to profiles)
  - `customer_id` (uuid, FK to customers)
  - `order_number` (text) - Unique order identifier
  - `status` (text) - pending, confirmed, shipped, delivered, cancelled
  - `items` (jsonb) - Order items array
  - `total_amount` (decimal) - Order total
  - `shipping_address` (text)
  - `tracking_number` (text, optional)
  - `marketplace` (text) - trendyol, n11, hepsiburada, whatsapp
  - `notes` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 4. `integrations`
  External service integrations
  - `id` (uuid, primary key)
  - `business_id` (uuid, FK to profiles)
  - `platform` (text) - whatsapp, trendyol, n11, hepsiburada
  - `api_key` (text, encrypted)
  - `api_secret` (text, encrypted)
  - `is_active` (boolean)
  - `config` (jsonb) - Platform-specific configuration
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 5. `message_templates`
  WhatsApp message templates
  - `id` (uuid, primary key)
  - `business_id` (uuid, FK to profiles)
  - `name` (text) - Template name
  - `type` (text) - order_confirmation, shipping_update, delivery_notification
  - `content` (text) - Message template with variables
  - `is_active` (boolean)
  - `created_at` (timestamptz)

  ### 6. `analytics`
  Daily analytics data
  - `id` (uuid, primary key)
  - `business_id` (uuid, FK to profiles)
  - `date` (date) - Analytics date
  - `total_orders` (integer)
  - `total_revenue` (decimal)
  - `new_customers` (integer)
  - `messages_sent` (integer)
  - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Users can only access their own business data
  - Authenticated access required for all operations
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name text NOT NULL,
  phone text,
  subscription_tier text DEFAULT 'trial' CHECK (subscription_tier IN ('trial', 'baslangic', 'profesyonel', 'enterprise')),
  subscription_status text DEFAULT 'trial' CHECK (subscription_status IN ('trial', 'active', 'expired', 'cancelled')),
  trial_ends_at timestamptz DEFAULT (now() + interval '14 days'),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  total_orders integer DEFAULT 0,
  total_spent decimal(10,2) DEFAULT 0,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  order_number text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  items jsonb NOT NULL DEFAULT '[]',
  total_amount decimal(10,2) NOT NULL,
  shipping_address text,
  tracking_number text,
  marketplace text DEFAULT 'whatsapp' CHECK (marketplace IN ('whatsapp', 'trendyol', 'n11', 'hepsiburada', 'other')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create integrations table
CREATE TABLE IF NOT EXISTS integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  platform text NOT NULL CHECK (platform IN ('whatsapp', 'trendyol', 'n11', 'hepsiburada')),
  api_key text,
  api_secret text,
  is_active boolean DEFAULT false,
  config jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(business_id, platform)
);

-- Create message_templates table
CREATE TABLE IF NOT EXISTS message_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('order_confirmation', 'shipping_update', 'delivery_notification', 'custom')),
  content text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create analytics table
CREATE TABLE IF NOT EXISTS analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date date NOT NULL,
  total_orders integer DEFAULT 0,
  total_revenue decimal(10,2) DEFAULT 0,
  new_customers integer DEFAULT 0,
  messages_sent integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(business_id, date)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_customers_business ON customers(business_id);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_orders_business ON orders(business_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_business_date ON analytics(business_id, date DESC);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Customers policies
CREATE POLICY "Users can view own customers"
  ON customers FOR SELECT
  TO authenticated
  USING (business_id = auth.uid());

CREATE POLICY "Users can insert own customers"
  ON customers FOR INSERT
  TO authenticated
  WITH CHECK (business_id = auth.uid());

CREATE POLICY "Users can update own customers"
  ON customers FOR UPDATE
  TO authenticated
  USING (business_id = auth.uid())
  WITH CHECK (business_id = auth.uid());

CREATE POLICY "Users can delete own customers"
  ON customers FOR DELETE
  TO authenticated
  USING (business_id = auth.uid());

-- Orders policies
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (business_id = auth.uid());

CREATE POLICY "Users can insert own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (business_id = auth.uid());

CREATE POLICY "Users can update own orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (business_id = auth.uid())
  WITH CHECK (business_id = auth.uid());

CREATE POLICY "Users can delete own orders"
  ON orders FOR DELETE
  TO authenticated
  USING (business_id = auth.uid());

-- Integrations policies
CREATE POLICY "Users can view own integrations"
  ON integrations FOR SELECT
  TO authenticated
  USING (business_id = auth.uid());

CREATE POLICY "Users can insert own integrations"
  ON integrations FOR INSERT
  TO authenticated
  WITH CHECK (business_id = auth.uid());

CREATE POLICY "Users can update own integrations"
  ON integrations FOR UPDATE
  TO authenticated
  USING (business_id = auth.uid())
  WITH CHECK (business_id = auth.uid());

CREATE POLICY "Users can delete own integrations"
  ON integrations FOR DELETE
  TO authenticated
  USING (business_id = auth.uid());

-- Message templates policies
CREATE POLICY "Users can view own templates"
  ON message_templates FOR SELECT
  TO authenticated
  USING (business_id = auth.uid());

CREATE POLICY "Users can insert own templates"
  ON message_templates FOR INSERT
  TO authenticated
  WITH CHECK (business_id = auth.uid());

CREATE POLICY "Users can update own templates"
  ON message_templates FOR UPDATE
  TO authenticated
  USING (business_id = auth.uid())
  WITH CHECK (business_id = auth.uid());

CREATE POLICY "Users can delete own templates"
  ON message_templates FOR DELETE
  TO authenticated
  USING (business_id = auth.uid());

-- Analytics policies
CREATE POLICY "Users can view own analytics"
  ON analytics FOR SELECT
  TO authenticated
  USING (business_id = auth.uid());

CREATE POLICY "Users can insert own analytics"
  ON analytics FOR INSERT
  TO authenticated
  WITH CHECK (business_id = auth.uid());

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_integrations_updated_at
  BEFORE UPDATE ON integrations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();