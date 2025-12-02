/*
  # Convert to Multi-Tenant SaaS Platform

  ## Overview
  Transforms the single-tenant system into a scalable multi-tenant SaaS platform where
  multiple businesses can self-service signup and manage their own workspaces.

  ## Key Changes

  ### 1. Workspace Management
  - Adds `workspaces` table for business isolation
  - Separates user accounts from business accounts
  - Enables one user to manage multiple workspaces

  ### 2. Subscription System
  - Adds `subscriptions` table for billing management
  - Tracks plan tiers, payment status, and usage limits
  - Automated trial management

  ### 3. Onboarding Flow
  - Adds `onboarding_steps` table to track setup progress
  - Step-by-step wizard completion tracking

  ## New Tables

  ### `workspaces`
  Business workspace for each customer
  - `id` (uuid, primary key)
  - `owner_id` (uuid, FK to auth.users)
  - `business_name` (text)
  - `subdomain` (text, unique) - customer.siparisbot.com
  - `logo_url` (text)
  - `phone` (text)
  - `settings` (jsonb) - Brand colors, timezone, etc.
  - `is_active` (boolean)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `subscriptions`
  Subscription and billing management
  - `id` (uuid, primary key)
  - `workspace_id` (uuid, FK to workspaces)
  - `plan_tier` (text) - starter, professional, enterprise
  - `status` (text) - trial, active, past_due, cancelled
  - `trial_ends_at` (timestamptz)
  - `current_period_start` (timestamptz)
  - `current_period_end` (timestamptz)
  - `cancel_at_period_end` (boolean)
  - `monthly_price` (decimal)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `usage_limits`
  Track feature usage against plan limits
  - `id` (uuid, primary key)
  - `workspace_id` (uuid, FK to workspaces)
  - `period_start` (date)
  - `period_end` (date)
  - `orders_count` (integer)
  - `messages_sent` (integer)
  - `ai_requests` (integer)
  - `created_at` (timestamptz)

  ### `onboarding_progress`
  Track setup wizard completion
  - `id` (uuid, primary key)
  - `workspace_id` (uuid, FK to workspaces)
  - `step_name` (text) - whatsapp_setup, marketplace_integration, etc.
  - `is_completed` (boolean)
  - `completed_at` (timestamptz)
  - `created_at` (timestamptz)

  ## Migration Strategy
  - Existing `profiles` data migrated to new `workspaces`
  - All existing tables updated to reference `workspace_id` instead of `business_id`
  - RLS policies updated for workspace isolation

  ## Security
  - Full workspace isolation via RLS
  - Owner can invite team members
  - Team members have role-based access
*/

-- Create workspaces table
CREATE TABLE IF NOT EXISTS workspaces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name text NOT NULL,
  subdomain text UNIQUE,
  logo_url text,
  phone text,
  settings jsonb DEFAULT '{"theme": "blue", "timezone": "Europe/Istanbul"}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  plan_tier text DEFAULT 'starter' CHECK (plan_tier IN ('starter', 'professional', 'enterprise')),
  status text DEFAULT 'trial' CHECK (status IN ('trial', 'active', 'past_due', 'cancelled', 'expired')),
  trial_ends_at timestamptz DEFAULT (now() + interval '14 days'),
  current_period_start timestamptz DEFAULT now(),
  current_period_end timestamptz DEFAULT (now() + interval '1 month'),
  cancel_at_period_end boolean DEFAULT false,
  monthly_price decimal(10,2) DEFAULT 1499.00,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(workspace_id)
);

-- Create usage limits table
CREATE TABLE IF NOT EXISTS usage_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  period_start date NOT NULL,
  period_end date NOT NULL,
  orders_count integer DEFAULT 0,
  messages_sent integer DEFAULT 0,
  ai_requests integer DEFAULT 0,
  storage_used_mb integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(workspace_id, period_start)
);

-- Create onboarding progress table
CREATE TABLE IF NOT EXISTS onboarding_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  step_name text NOT NULL CHECK (step_name IN ('profile_created', 'whatsapp_connected', 'marketplace_integrated', 'first_order', 'team_invited')),
  is_completed boolean DEFAULT false,
  completed_at timestamptz,
  data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  UNIQUE(workspace_id, step_name)
);

-- Migrate existing profiles to workspaces
INSERT INTO workspaces (id, owner_id, business_name, phone, created_at, updated_at)
SELECT id, id, business_name, phone, created_at, updated_at
FROM profiles
ON CONFLICT (id) DO NOTHING;

-- Create subscriptions for existing workspaces
INSERT INTO subscriptions (workspace_id, plan_tier, status, trial_ends_at, created_at)
SELECT id, 
  CASE subscription_tier 
    WHEN 'baslangic' THEN 'starter'
    WHEN 'profesyonel' THEN 'professional'
    ELSE 'starter'
  END,
  subscription_status,
  trial_ends_at,
  created_at
FROM profiles
ON CONFLICT (workspace_id) DO NOTHING;

-- Add workspace_id to existing tables (for migration)
DO $$
BEGIN
  -- Check and add workspace_id to customers
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'customers' AND column_name = 'workspace_id'
  ) THEN
    ALTER TABLE customers ADD COLUMN workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE;
    UPDATE customers SET workspace_id = business_id;
    ALTER TABLE customers ALTER COLUMN workspace_id SET NOT NULL;
    CREATE INDEX IF NOT EXISTS idx_customers_workspace ON customers(workspace_id);
  END IF;

  -- Check and add workspace_id to orders
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'workspace_id'
  ) THEN
    ALTER TABLE orders ADD COLUMN workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE;
    UPDATE orders SET workspace_id = business_id;
    ALTER TABLE orders ALTER COLUMN workspace_id SET NOT NULL;
    CREATE INDEX IF NOT EXISTS idx_orders_workspace ON orders(workspace_id);
  END IF;

  -- Check and add workspace_id to integrations
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'integrations' AND column_name = 'workspace_id'
  ) THEN
    ALTER TABLE integrations ADD COLUMN workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE;
    UPDATE integrations SET workspace_id = business_id;
    ALTER TABLE integrations ALTER COLUMN workspace_id SET NOT NULL;
    CREATE INDEX IF NOT EXISTS idx_integrations_workspace ON integrations(workspace_id);
  END IF;

  -- Check and add workspace_id to message_templates
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'message_templates' AND column_name = 'workspace_id'
  ) THEN
    ALTER TABLE message_templates ADD COLUMN workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE;
    UPDATE message_templates SET workspace_id = business_id;
    ALTER TABLE message_templates ALTER COLUMN workspace_id SET NOT NULL;
    CREATE INDEX IF NOT EXISTS idx_message_templates_workspace ON message_templates(workspace_id);
  END IF;

  -- Check and add workspace_id to analytics
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'analytics' AND column_name = 'workspace_id'
  ) THEN
    ALTER TABLE analytics ADD COLUMN workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE;
    UPDATE analytics SET workspace_id = business_id;
    ALTER TABLE analytics ALTER COLUMN workspace_id SET NOT NULL;
    CREATE INDEX IF NOT EXISTS idx_analytics_workspace ON analytics(workspace_id);
  END IF;

  -- Update team_members to use workspace_id
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'team_members' AND column_name = 'workspace_id'
  ) THEN
    ALTER TABLE team_members ADD COLUMN workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE;
    UPDATE team_members SET workspace_id = business_id;
    ALTER TABLE team_members ALTER COLUMN workspace_id SET NOT NULL;
    DROP INDEX IF EXISTS idx_team_members_business;
    CREATE INDEX IF NOT EXISTS idx_team_members_workspace ON team_members(workspace_id);
  END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_workspaces_owner ON workspaces(owner_id);
CREATE INDEX IF NOT EXISTS idx_workspaces_subdomain ON workspaces(subdomain);
CREATE INDEX IF NOT EXISTS idx_subscriptions_workspace ON subscriptions(workspace_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_usage_limits_workspace ON usage_limits(workspace_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_workspace ON onboarding_progress(workspace_id);

-- Enable RLS
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for workspaces
CREATE POLICY "Users can view own workspaces"
  ON workspaces FOR SELECT
  TO authenticated
  USING (
    owner_id = auth.uid() OR 
    id IN (SELECT workspace_id FROM team_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create own workspaces"
  ON workspaces FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owners can update own workspaces"
  ON workspaces FOR UPDATE
  TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owners can delete own workspaces"
  ON workspaces FOR DELETE
  TO authenticated
  USING (owner_id = auth.uid());

-- RLS Policies for subscriptions
CREATE POLICY "Users can view workspace subscriptions"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT id FROM workspaces 
      WHERE owner_id = auth.uid() OR 
      id IN (SELECT workspace_id FROM team_members WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "System can manage subscriptions"
  ON subscriptions FOR ALL
  TO authenticated
  USING (
    workspace_id IN (SELECT id FROM workspaces WHERE owner_id = auth.uid())
  )
  WITH CHECK (
    workspace_id IN (SELECT id FROM workspaces WHERE owner_id = auth.uid())
  );

-- RLS Policies for usage_limits
CREATE POLICY "Users can view workspace usage"
  ON usage_limits FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT id FROM workspaces 
      WHERE owner_id = auth.uid() OR 
      id IN (SELECT workspace_id FROM team_members WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "System can track usage"
  ON usage_limits FOR ALL
  TO authenticated
  USING (
    workspace_id IN (SELECT id FROM workspaces WHERE owner_id = auth.uid())
  )
  WITH CHECK (
    workspace_id IN (SELECT id FROM workspaces WHERE owner_id = auth.uid())
  );

-- RLS Policies for onboarding_progress
CREATE POLICY "Users can view workspace onboarding"
  ON onboarding_progress FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT id FROM workspaces 
      WHERE owner_id = auth.uid() OR 
      id IN (SELECT workspace_id FROM team_members WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Users can update workspace onboarding"
  ON onboarding_progress FOR ALL
  TO authenticated
  USING (
    workspace_id IN (SELECT id FROM workspaces WHERE owner_id = auth.uid())
  )
  WITH CHECK (
    workspace_id IN (SELECT id FROM workspaces WHERE owner_id = auth.uid())
  );

-- Update existing RLS policies to use workspace_id
DROP POLICY IF EXISTS "Users can view own customers" ON customers;
CREATE POLICY "Users can view workspace customers"
  ON customers FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT id FROM workspaces 
      WHERE owner_id = auth.uid() OR 
      id IN (SELECT workspace_id FROM team_members WHERE user_id = auth.uid() AND is_active = true)
    )
  );

DROP POLICY IF EXISTS "Users can insert own customers" ON customers;
CREATE POLICY "Users can create workspace customers"
  ON customers FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update own customers" ON customers;
CREATE POLICY "Users can update workspace customers"
  ON customers FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (SELECT id FROM workspaces WHERE owner_id = auth.uid())
  )
  WITH CHECK (
    workspace_id IN (SELECT id FROM workspaces WHERE owner_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can delete own customers" ON customers;
CREATE POLICY "Users can delete workspace customers"
  ON customers FOR DELETE
  TO authenticated
  USING (
    workspace_id IN (SELECT id FROM workspaces WHERE owner_id = auth.uid())
  );

-- Triggers
CREATE TRIGGER update_workspaces_updated_at
  BEFORE UPDATE ON workspaces
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Function to initialize onboarding steps for new workspace
CREATE OR REPLACE FUNCTION initialize_onboarding_steps()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO onboarding_progress (workspace_id, step_name, is_completed)
  VALUES 
    (NEW.id, 'profile_created', true),
    (NEW.id, 'whatsapp_connected', false),
    (NEW.id, 'marketplace_integrated', false),
    (NEW.id, 'first_order', false),
    (NEW.id, 'team_invited', false)
  ON CONFLICT (workspace_id, step_name) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_initialize_onboarding
  AFTER INSERT ON workspaces
  FOR EACH ROW
  EXECUTE FUNCTION initialize_onboarding_steps();

-- Function to auto-create current usage period
CREATE OR REPLACE FUNCTION initialize_usage_tracking()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO usage_limits (workspace_id, period_start, period_end)
  VALUES (
    NEW.id,
    date_trunc('month', CURRENT_DATE)::date,
    (date_trunc('month', CURRENT_DATE) + interval '1 month' - interval '1 day')::date
  )
  ON CONFLICT (workspace_id, period_start) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_initialize_usage
  AFTER INSERT ON workspaces
  FOR EACH ROW
  EXECUTE FUNCTION initialize_usage_tracking();