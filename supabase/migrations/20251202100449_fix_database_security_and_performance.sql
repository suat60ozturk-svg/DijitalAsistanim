/*
  # Fix Database Security and Performance Issues

  This migration addresses critical security and performance issues:

  ## 1. Foreign Key Indexes
  Creates indexes on all foreign key columns to optimize join performance:
  - ai_bot_configs (business_id)
  - audit_logs (user_id)
  - conversations (assigned_to, channel_id)
  - customer_segments (business_id)
  - export_jobs (business_id, created_by)
  - knowledge_base_articles (author_id, business_id)
  - message_templates (business_id)
  - team_members (invited_by, user_id)
  - tickets (assigned_to, customer_id)

  ## 2. RLS Policy Optimization
  Updates all RLS policies to use `(select auth.uid())` instead of `auth.uid()`
  to prevent re-evaluation on each row. This dramatically improves query performance.

  ## 3. Function Security
  Fixes search_path security for all functions by setting them to immutable or
  adding explicit schema qualification.

  ## 4. Duplicate Policy Cleanup
  Removes redundant permissive policies that create unnecessary overhead.

  ## Important Notes
  - No data loss or schema changes
  - All operations are safe and reversible
  - Performance improvements are immediate
*/

-- =====================================================
-- PART 1: CREATE MISSING FOREIGN KEY INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_ai_bot_configs_business_id 
  ON public.ai_bot_configs(business_id);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id 
  ON public.audit_logs(user_id);

CREATE INDEX IF NOT EXISTS idx_conversations_assigned_to 
  ON public.conversations(assigned_to);

CREATE INDEX IF NOT EXISTS idx_conversations_channel_id 
  ON public.conversations(channel_id);

CREATE INDEX IF NOT EXISTS idx_customer_segments_business_id 
  ON public.customer_segments(business_id);

CREATE INDEX IF NOT EXISTS idx_export_jobs_business_id 
  ON public.export_jobs(business_id);

CREATE INDEX IF NOT EXISTS idx_export_jobs_created_by 
  ON public.export_jobs(created_by);

CREATE INDEX IF NOT EXISTS idx_knowledge_base_articles_author_id 
  ON public.knowledge_base_articles(author_id);

CREATE INDEX IF NOT EXISTS idx_knowledge_base_articles_business_id 
  ON public.knowledge_base_articles(business_id);

CREATE INDEX IF NOT EXISTS idx_message_templates_business_id 
  ON public.message_templates(business_id);

CREATE INDEX IF NOT EXISTS idx_team_members_invited_by 
  ON public.team_members(invited_by);

CREATE INDEX IF NOT EXISTS idx_team_members_user_id 
  ON public.team_members(user_id);

CREATE INDEX IF NOT EXISTS idx_tickets_assigned_to 
  ON public.tickets(assigned_to);

CREATE INDEX IF NOT EXISTS idx_tickets_customer_id 
  ON public.tickets(customer_id);

-- =====================================================
-- PART 2: OPTIMIZE RLS POLICIES - PROFILES
-- =====================================================

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (id = (select auth.uid()));

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (id = (select auth.uid()))
  WITH CHECK (id = (select auth.uid()));

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (id = (select auth.uid()));

-- =====================================================
-- PART 3: OPTIMIZE RLS POLICIES - ORDERS
-- =====================================================

DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can insert own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can update own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can delete own orders" ON public.orders;

CREATE POLICY "Users can view own orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id FROM team_members 
      WHERE user_id = (select auth.uid())
    )
  );

CREATE POLICY "Users can insert own orders"
  ON public.orders FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id FROM team_members 
      WHERE user_id = (select auth.uid())
    )
  );

CREATE POLICY "Users can update own orders"
  ON public.orders FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id FROM team_members 
      WHERE user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id FROM team_members 
      WHERE user_id = (select auth.uid())
    )
  );

CREATE POLICY "Users can delete own orders"
  ON public.orders FOR DELETE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id FROM team_members 
      WHERE user_id = (select auth.uid())
    )
  );

-- =====================================================
-- PART 4: OPTIMIZE RLS POLICIES - INTEGRATIONS
-- =====================================================

DROP POLICY IF EXISTS "Users can view own integrations" ON public.integrations;
DROP POLICY IF EXISTS "Users can insert own integrations" ON public.integrations;
DROP POLICY IF EXISTS "Users can update own integrations" ON public.integrations;
DROP POLICY IF EXISTS "Users can delete own integrations" ON public.integrations;

CREATE POLICY "Users can view own integrations"
  ON public.integrations FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id FROM team_members 
      WHERE user_id = (select auth.uid())
    )
  );

CREATE POLICY "Users can insert own integrations"
  ON public.integrations FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id FROM team_members 
      WHERE user_id = (select auth.uid())
    )
  );

CREATE POLICY "Users can update own integrations"
  ON public.integrations FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id FROM team_members 
      WHERE user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id FROM team_members 
      WHERE user_id = (select auth.uid())
    )
  );

CREATE POLICY "Users can delete own integrations"
  ON public.integrations FOR DELETE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id FROM team_members 
      WHERE user_id = (select auth.uid())
    )
  );

-- =====================================================
-- PART 5: OPTIMIZE RLS POLICIES - MESSAGE TEMPLATES
-- =====================================================

DROP POLICY IF EXISTS "Users can view own templates" ON public.message_templates;
DROP POLICY IF EXISTS "Users can insert own templates" ON public.message_templates;
DROP POLICY IF EXISTS "Users can update own templates" ON public.message_templates;
DROP POLICY IF EXISTS "Users can delete own templates" ON public.message_templates;

CREATE POLICY "Users can view own templates"
  ON public.message_templates FOR SELECT
  TO authenticated
  USING (
    business_id IN (
      SELECT workspace_id FROM team_members 
      WHERE user_id = (select auth.uid())
    )
  );

CREATE POLICY "Users can insert own templates"
  ON public.message_templates FOR INSERT
  TO authenticated
  WITH CHECK (
    business_id IN (
      SELECT workspace_id FROM team_members 
      WHERE user_id = (select auth.uid())
    )
  );

CREATE POLICY "Users can update own templates"
  ON public.message_templates FOR UPDATE
  TO authenticated
  USING (
    business_id IN (
      SELECT workspace_id FROM team_members 
      WHERE user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    business_id IN (
      SELECT workspace_id FROM team_members 
      WHERE user_id = (select auth.uid())
    )
  );

CREATE POLICY "Users can delete own templates"
  ON public.message_templates FOR DELETE
  TO authenticated
  USING (
    business_id IN (
      SELECT workspace_id FROM team_members 
      WHERE user_id = (select auth.uid())
    )
  );

-- =====================================================
-- PART 6: OPTIMIZE RLS POLICIES - ANALYTICS
-- =====================================================

DROP POLICY IF EXISTS "Users can view own analytics" ON public.analytics;
DROP POLICY IF EXISTS "Users can insert own analytics" ON public.analytics;

CREATE POLICY "Users can view own analytics"
  ON public.analytics FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id FROM team_members 
      WHERE user_id = (select auth.uid())
    )
  );

CREATE POLICY "Users can insert own analytics"
  ON public.analytics FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id FROM team_members 
      WHERE user_id = (select auth.uid())
    )
  );

-- =====================================================
-- PART 7: OPTIMIZE RLS POLICIES - TEAM MEMBERS
-- =====================================================

DROP POLICY IF EXISTS "Team members can view own team" ON public.team_members;
DROP POLICY IF EXISTS "Admins can manage team" ON public.team_members;

CREATE POLICY "Team members can view team"
  ON public.team_members FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id FROM team_members 
      WHERE user_id = (select auth.uid())
    )
  );

CREATE POLICY "Admins can manage team"
  ON public.team_members FOR ALL
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id FROM team_members 
      WHERE user_id = (select auth.uid()) 
      AND role IN ('owner', 'admin')
    )
  );

-- =====================================================
-- PART 8: OPTIMIZE RLS POLICIES - AI BOT CONFIGS
-- =====================================================

DROP POLICY IF EXISTS "Users can view own bot configs" ON public.ai_bot_configs;
DROP POLICY IF EXISTS "Users can manage own bot configs" ON public.ai_bot_configs;

CREATE POLICY "Users can manage bot configs"
  ON public.ai_bot_configs FOR ALL
  TO authenticated
  USING (
    business_id IN (
      SELECT workspace_id FROM team_members 
      WHERE user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    business_id IN (
      SELECT workspace_id FROM team_members 
      WHERE user_id = (select auth.uid())
    )
  );

-- =====================================================
-- PART 9: OPTIMIZE RLS POLICIES - CHANNELS
-- =====================================================

DROP POLICY IF EXISTS "Users can view own channels" ON public.channels;
DROP POLICY IF EXISTS "Users can manage own channels" ON public.channels;

CREATE POLICY "Users can manage channels"
  ON public.channels FOR ALL
  TO authenticated
  USING (
    business_id IN (
      SELECT workspace_id FROM team_members 
      WHERE user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    business_id IN (
      SELECT workspace_id FROM team_members 
      WHERE user_id = (select auth.uid())
    )
  );

-- =====================================================
-- PART 10: OPTIMIZE RLS POLICIES - CONVERSATIONS
-- =====================================================

DROP POLICY IF EXISTS "Users can view own conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can manage own conversations" ON public.conversations;

CREATE POLICY "Users can manage conversations"
  ON public.conversations FOR ALL
  TO authenticated
  USING (
    business_id IN (
      SELECT workspace_id FROM team_members 
      WHERE user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    business_id IN (
      SELECT workspace_id FROM team_members 
      WHERE user_id = (select auth.uid())
    )
  );

-- =====================================================
-- PART 11: OPTIMIZE RLS POLICIES - MESSAGES
-- =====================================================

DROP POLICY IF EXISTS "Users can view messages in own conversations" ON public.messages;
DROP POLICY IF EXISTS "Users can create messages in own conversations" ON public.messages;

CREATE POLICY "Users can view messages"
  ON public.messages FOR SELECT
  TO authenticated
  USING (
    conversation_id IN (
      SELECT id FROM conversations 
      WHERE business_id IN (
        SELECT workspace_id FROM team_members 
        WHERE user_id = (select auth.uid())
      )
    )
  );

CREATE POLICY "Users can create messages"
  ON public.messages FOR INSERT
  TO authenticated
  WITH CHECK (
    conversation_id IN (
      SELECT id FROM conversations 
      WHERE business_id IN (
        SELECT workspace_id FROM team_members 
        WHERE user_id = (select auth.uid())
      )
    )
  );

-- =====================================================
-- PART 12: OPTIMIZE RLS POLICIES - WORKFLOWS
-- =====================================================

DROP POLICY IF EXISTS "Users can view own workflows" ON public.workflows;
DROP POLICY IF EXISTS "Users can manage own workflows" ON public.workflows;

CREATE POLICY "Users can manage workflows"
  ON public.workflows FOR ALL
  TO authenticated
  USING (
    business_id IN (
      SELECT workspace_id FROM team_members 
      WHERE user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    business_id IN (
      SELECT workspace_id FROM team_members 
      WHERE user_id = (select auth.uid())
    )
  );

-- =====================================================
-- PART 13: OPTIMIZE RLS POLICIES - WORKFLOW EXECUTIONS
-- =====================================================

DROP POLICY IF EXISTS "Users can view own workflow executions" ON public.workflow_executions;

CREATE POLICY "Users can view workflow executions"
  ON public.workflow_executions FOR SELECT
  TO authenticated
  USING (
    workflow_id IN (
      SELECT id FROM workflows 
      WHERE business_id IN (
        SELECT workspace_id FROM team_members 
        WHERE user_id = (select auth.uid())
      )
    )
  );

-- =====================================================
-- PART 14: OPTIMIZE RLS POLICIES - TICKETS
-- =====================================================

DROP POLICY IF EXISTS "Users can view own tickets" ON public.tickets;
DROP POLICY IF EXISTS "Users can manage own tickets" ON public.tickets;

CREATE POLICY "Users can manage tickets"
  ON public.tickets FOR ALL
  TO authenticated
  USING (
    business_id IN (
      SELECT workspace_id FROM team_members 
      WHERE user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    business_id IN (
      SELECT workspace_id FROM team_members 
      WHERE user_id = (select auth.uid())
    )
  );

-- =====================================================
-- PART 15: OPTIMIZE RLS POLICIES - AUDIT LOGS
-- =====================================================

DROP POLICY IF EXISTS "Users can view own audit logs" ON public.audit_logs;

CREATE POLICY "Users can view audit logs"
  ON public.audit_logs FOR SELECT
  TO authenticated
  USING (
    business_id IN (
      SELECT workspace_id FROM team_members 
      WHERE user_id = (select auth.uid())
    )
  );

-- =====================================================
-- PART 16: OPTIMIZE RLS POLICIES - KNOWLEDGE BASE
-- =====================================================

DROP POLICY IF EXISTS "Users can view own articles" ON public.knowledge_base_articles;
DROP POLICY IF EXISTS "Users can manage own articles" ON public.knowledge_base_articles;

CREATE POLICY "Users can manage articles"
  ON public.knowledge_base_articles FOR ALL
  TO authenticated
  USING (
    business_id IN (
      SELECT workspace_id FROM team_members 
      WHERE user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    business_id IN (
      SELECT workspace_id FROM team_members 
      WHERE user_id = (select auth.uid())
    )
  );

-- =====================================================
-- PART 17: OPTIMIZE RLS POLICIES - CUSTOMER SEGMENTS
-- =====================================================

DROP POLICY IF EXISTS "Users can view own segments" ON public.customer_segments;
DROP POLICY IF EXISTS "Users can manage own segments" ON public.customer_segments;

CREATE POLICY "Users can manage segments"
  ON public.customer_segments FOR ALL
  TO authenticated
  USING (
    business_id IN (
      SELECT workspace_id FROM team_members 
      WHERE user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    business_id IN (
      SELECT workspace_id FROM team_members 
      WHERE user_id = (select auth.uid())
    )
  );

-- =====================================================
-- PART 18: OPTIMIZE RLS POLICIES - EXPORT JOBS
-- =====================================================

DROP POLICY IF EXISTS "Users can view own exports" ON public.export_jobs;
DROP POLICY IF EXISTS "Users can create own exports" ON public.export_jobs;

CREATE POLICY "Users can view exports"
  ON public.export_jobs FOR SELECT
  TO authenticated
  USING (
    business_id IN (
      SELECT workspace_id FROM team_members 
      WHERE user_id = (select auth.uid())
    )
  );

CREATE POLICY "Users can create exports"
  ON public.export_jobs FOR INSERT
  TO authenticated
  WITH CHECK (
    business_id IN (
      SELECT workspace_id FROM team_members 
      WHERE user_id = (select auth.uid())
    )
  );

-- =====================================================
-- PART 19: OPTIMIZE RLS POLICIES - WORKSPACES
-- =====================================================

DROP POLICY IF EXISTS "Users can view own workspaces" ON public.workspaces;
DROP POLICY IF EXISTS "Users can create own workspaces" ON public.workspaces;
DROP POLICY IF EXISTS "Owners can update own workspaces" ON public.workspaces;
DROP POLICY IF EXISTS "Owners can delete own workspaces" ON public.workspaces;

CREATE POLICY "Users can view workspaces"
  ON public.workspaces FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT workspace_id FROM team_members 
      WHERE user_id = (select auth.uid())
    )
  );

CREATE POLICY "Users can create workspaces"
  ON public.workspaces FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = (select auth.uid()));

CREATE POLICY "Owners can update workspaces"
  ON public.workspaces FOR UPDATE
  TO authenticated
  USING (owner_id = (select auth.uid()))
  WITH CHECK (owner_id = (select auth.uid()));

CREATE POLICY "Owners can delete workspaces"
  ON public.workspaces FOR DELETE
  TO authenticated
  USING (owner_id = (select auth.uid()));

-- =====================================================
-- PART 20: OPTIMIZE RLS POLICIES - SUBSCRIPTIONS
-- =====================================================

DROP POLICY IF EXISTS "Users can view workspace subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "System can manage subscriptions" ON public.subscriptions;

CREATE POLICY "Users can view subscriptions"
  ON public.subscriptions FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id FROM team_members 
      WHERE user_id = (select auth.uid())
    )
  );

CREATE POLICY "Service role can manage subscriptions"
  ON public.subscriptions FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- PART 21: OPTIMIZE RLS POLICIES - USAGE LIMITS
-- =====================================================

DROP POLICY IF EXISTS "Users can view workspace usage" ON public.usage_limits;
DROP POLICY IF EXISTS "System can track usage" ON public.usage_limits;

CREATE POLICY "Users can view usage"
  ON public.usage_limits FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id FROM team_members 
      WHERE user_id = (select auth.uid())
    )
  );

CREATE POLICY "Service role can track usage"
  ON public.usage_limits FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- PART 22: OPTIMIZE RLS POLICIES - ONBOARDING
-- =====================================================

DROP POLICY IF EXISTS "Users can view workspace onboarding" ON public.onboarding_progress;
DROP POLICY IF EXISTS "Users can update workspace onboarding" ON public.onboarding_progress;

CREATE POLICY "Users can manage onboarding"
  ON public.onboarding_progress FOR ALL
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id FROM team_members 
      WHERE user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id FROM team_members 
      WHERE user_id = (select auth.uid())
    )
  );

-- =====================================================
-- PART 23: OPTIMIZE RLS POLICIES - CUSTOMERS
-- =====================================================

DROP POLICY IF EXISTS "Users can view workspace customers" ON public.customers;
DROP POLICY IF EXISTS "Users can create workspace customers" ON public.customers;
DROP POLICY IF EXISTS "Users can update workspace customers" ON public.customers;
DROP POLICY IF EXISTS "Users can delete workspace customers" ON public.customers;

CREATE POLICY "Users can view customers"
  ON public.customers FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id FROM team_members 
      WHERE user_id = (select auth.uid())
    )
  );

CREATE POLICY "Users can create customers"
  ON public.customers FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id FROM team_members 
      WHERE user_id = (select auth.uid())
    )
  );

CREATE POLICY "Users can update customers"
  ON public.customers FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id FROM team_members 
      WHERE user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id FROM team_members 
      WHERE user_id = (select auth.uid())
    )
  );

CREATE POLICY "Users can delete customers"
  ON public.customers FOR DELETE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id FROM team_members 
      WHERE user_id = (select auth.uid())
    )
  );

-- =====================================================
-- PART 24: FIX FUNCTION SECURITY
-- =====================================================

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.initialize_onboarding_steps()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.steps := jsonb_build_object(
    'profile_setup', false,
    'whatsapp_setup', false,
    'marketplace_setup', false
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.initialize_usage_tracking()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.usage_limits (workspace_id, period_start, period_end)
  VALUES (
    NEW.id,
    date_trunc('month', now()),
    date_trunc('month', now()) + interval '1 month'
  );
  RETURN NEW;
END;
$$;
