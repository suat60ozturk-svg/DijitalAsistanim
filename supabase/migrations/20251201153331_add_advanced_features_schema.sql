/*
  # Advanced Features Schema Extension

  ## Overview
  Adds comprehensive tables for enterprise-level features including AI chatbot, 
  multi-channel support, team collaboration, workflows, tickets, and audit logs.

  ## New Tables

  ### 1. `team_members`
  Team collaboration and role management
  - `id` (uuid, primary key)
  - `business_id` (uuid, FK to profiles)
  - `user_id` (uuid, FK to auth.users)
  - `role` (text) - admin, manager, agent, viewer
  - `permissions` (jsonb) - Granular permission settings
  - `is_active` (boolean)
  - `invited_by` (uuid, FK to auth.users)
  - `joined_at` (timestamptz)
  - `created_at` (timestamptz)

  ### 2. `channels`
  Multi-channel communication configuration
  - `id` (uuid, primary key)
  - `business_id` (uuid, FK to profiles)
  - `type` (text) - whatsapp, email, sms, instagram, facebook, webchat
  - `name` (text) - Channel display name
  - `credentials` (jsonb) - Encrypted API credentials
  - `is_active` (boolean)
  - `config` (jsonb) - Channel-specific settings
  - `created_at` (timestamptz)

  ### 3. `conversations`
  Unified conversation threads across channels
  - `id` (uuid, primary key)
  - `business_id` (uuid, FK to profiles)
  - `customer_id` (uuid, FK to customers)
  - `channel_id` (uuid, FK to channels)
  - `assigned_to` (uuid, FK to team_members)
  - `status` (text) - open, waiting, resolved, closed
  - `priority` (text) - low, medium, high, urgent
  - `tags` (text[]) - Conversation tags
  - `last_message_at` (timestamptz)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 4. `messages`
  Individual messages in conversations
  - `id` (uuid, primary key)
  - `conversation_id` (uuid, FK to conversations)
  - `sender_type` (text) - customer, agent, bot
  - `sender_id` (uuid) - customer_id or user_id
  - `content` (text)
  - `content_type` (text) - text, image, file, audio, video
  - `metadata` (jsonb) - Attachments, media URLs
  - `is_ai_generated` (boolean)
  - `sentiment` (text) - positive, neutral, negative
  - `created_at` (timestamptz)

  ### 5. `ai_bot_configs`
  AI chatbot configuration
  - `id` (uuid, primary key)
  - `business_id` (uuid, FK to profiles)
  - `name` (text) - Bot name
  - `provider` (text) - openai, anthropic
  - `model` (text) - gpt-4, claude-3
  - `system_prompt` (text) - Bot personality
  - `temperature` (decimal) - Creativity level
  - `max_tokens` (integer)
  - `is_active` (boolean)
  - `fallback_to_human` (boolean)
  - `auto_learn` (boolean)
  - `created_at` (timestamptz)

  ### 6. `workflows`
  Automation workflow definitions
  - `id` (uuid, primary key)
  - `business_id` (uuid, FK to profiles)
  - `name` (text)
  - `description` (text)
  - `trigger_type` (text) - order_created, message_received, time_based
  - `trigger_config` (jsonb) - Trigger conditions
  - `actions` (jsonb) - Array of actions to execute
  - `is_active` (boolean)
  - `execution_count` (integer)
  - `last_executed_at` (timestamptz)
  - `created_at` (timestamptz)

  ### 7. `workflow_executions`
  Workflow execution history
  - `id` (uuid, primary key)
  - `workflow_id` (uuid, FK to workflows)
  - `status` (text) - success, failed, pending
  - `trigger_data` (jsonb)
  - `execution_log` (jsonb)
  - `error_message` (text)
  - `executed_at` (timestamptz)

  ### 8. `tickets`
  Support ticket system
  - `id` (uuid, primary key)
  - `business_id` (uuid, FK to profiles)
  - `customer_id` (uuid, FK to customers)
  - `ticket_number` (text, unique)
  - `subject` (text)
  - `description` (text)
  - `status` (text) - open, in_progress, waiting, resolved, closed
  - `priority` (text) - low, medium, high, urgent
  - `assigned_to` (uuid, FK to team_members)
  - `category` (text)
  - `resolution` (text)
  - `resolved_at` (timestamptz)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 9. `audit_logs`
  Activity tracking and compliance
  - `id` (uuid, primary key)
  - `business_id` (uuid, FK to profiles)
  - `user_id` (uuid, FK to auth.users)
  - `action` (text) - Action performed
  - `resource_type` (text) - Table/resource affected
  - `resource_id` (uuid) - ID of affected resource
  - `old_values` (jsonb) - Before state
  - `new_values` (jsonb) - After state
  - `ip_address` (inet)
  - `user_agent` (text)
  - `created_at` (timestamptz)

  ### 10. `knowledge_base_articles`
  Help center and documentation
  - `id` (uuid, primary key)
  - `business_id` (uuid, FK to profiles)
  - `title` (text)
  - `content` (text)
  - `category` (text)
  - `tags` (text[])
  - `is_published` (boolean)
  - `view_count` (integer)
  - `helpful_count` (integer)
  - `author_id` (uuid, FK to auth.users)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 11. `customer_segments`
  Customer segmentation for targeted marketing
  - `id` (uuid, primary key)
  - `business_id` (uuid, FK to profiles)
  - `name` (text)
  - `description` (text)
  - `conditions` (jsonb) - Segmentation rules
  - `customer_count` (integer)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 12. `export_jobs`
  Data export tracking
  - `id` (uuid, primary key)
  - `business_id` (uuid, FK to profiles)
  - `export_type` (text) - customers, orders, analytics
  - `format` (text) - csv, excel, pdf
  - `filters` (jsonb)
  - `status` (text) - pending, processing, completed, failed
  - `file_url` (text)
  - `created_by` (uuid, FK to auth.users)
  - `created_at` (timestamptz)
  - `completed_at` (timestamptz)

  ## Security
  - Enable RLS on all new tables
  - Users can only access data from their own business
  - Audit logs are read-only after creation
*/

-- Team members table
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('admin', 'manager', 'agent', 'viewer')),
  permissions jsonb DEFAULT '{}',
  is_active boolean DEFAULT true,
  invited_by uuid REFERENCES auth.users(id),
  joined_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(business_id, user_id)
);

-- Channels table
CREATE TABLE IF NOT EXISTS channels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('whatsapp', 'email', 'sms', 'instagram', 'facebook', 'webchat')),
  name text NOT NULL,
  credentials jsonb DEFAULT '{}',
  is_active boolean DEFAULT false,
  config jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  channel_id uuid REFERENCES channels(id),
  assigned_to uuid REFERENCES team_members(id),
  status text DEFAULT 'open' CHECK (status IN ('open', 'waiting', 'resolved', 'closed')),
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  tags text[] DEFAULT '{}',
  last_message_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_type text NOT NULL CHECK (sender_type IN ('customer', 'agent', 'bot')),
  sender_id uuid,
  content text NOT NULL,
  content_type text DEFAULT 'text' CHECK (content_type IN ('text', 'image', 'file', 'audio', 'video')),
  metadata jsonb DEFAULT '{}',
  is_ai_generated boolean DEFAULT false,
  sentiment text CHECK (sentiment IN ('positive', 'neutral', 'negative')),
  created_at timestamptz DEFAULT now()
);

-- AI bot configs table
CREATE TABLE IF NOT EXISTS ai_bot_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  provider text DEFAULT 'openai' CHECK (provider IN ('openai', 'anthropic')),
  model text DEFAULT 'gpt-4',
  system_prompt text NOT NULL,
  temperature decimal(3,2) DEFAULT 0.7,
  max_tokens integer DEFAULT 500,
  is_active boolean DEFAULT false,
  fallback_to_human boolean DEFAULT true,
  auto_learn boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Workflows table
CREATE TABLE IF NOT EXISTS workflows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  trigger_type text NOT NULL CHECK (trigger_type IN ('order_created', 'message_received', 'customer_created', 'time_based', 'manual')),
  trigger_config jsonb DEFAULT '{}',
  actions jsonb NOT NULL DEFAULT '[]',
  is_active boolean DEFAULT false,
  execution_count integer DEFAULT 0,
  last_executed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Workflow executions table
CREATE TABLE IF NOT EXISTS workflow_executions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id uuid NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  status text DEFAULT 'pending' CHECK (status IN ('success', 'failed', 'pending')),
  trigger_data jsonb DEFAULT '{}',
  execution_log jsonb DEFAULT '[]',
  error_message text,
  executed_at timestamptz DEFAULT now()
);

-- Tickets table
CREATE TABLE IF NOT EXISTS tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES customers(id),
  ticket_number text UNIQUE NOT NULL,
  subject text NOT NULL,
  description text NOT NULL,
  status text DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'waiting', 'resolved', 'closed')),
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  assigned_to uuid REFERENCES team_members(id),
  category text,
  resolution text,
  resolved_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id uuid,
  old_values jsonb,
  new_values jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Knowledge base articles table
CREATE TABLE IF NOT EXISTS knowledge_base_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  category text,
  tags text[] DEFAULT '{}',
  is_published boolean DEFAULT false,
  view_count integer DEFAULT 0,
  helpful_count integer DEFAULT 0,
  author_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Customer segments table
CREATE TABLE IF NOT EXISTS customer_segments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  conditions jsonb NOT NULL,
  customer_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Export jobs table
CREATE TABLE IF NOT EXISTS export_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  export_type text NOT NULL CHECK (export_type IN ('customers', 'orders', 'analytics', 'conversations', 'tickets')),
  format text NOT NULL CHECK (format IN ('csv', 'excel', 'pdf')),
  filters jsonb DEFAULT '{}',
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  file_url text,
  created_by uuid NOT NULL REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_team_members_business ON team_members(business_id);
CREATE INDEX IF NOT EXISTS idx_channels_business ON channels(business_id);
CREATE INDEX IF NOT EXISTS idx_conversations_business ON conversations(business_id);
CREATE INDEX IF NOT EXISTS idx_conversations_customer ON conversations(customer_id);
CREATE INDEX IF NOT EXISTS idx_conversations_status ON conversations(status);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_workflows_business ON workflows(business_id);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_workflow ON workflow_executions(workflow_id);
CREATE INDEX IF NOT EXISTS idx_tickets_business ON tickets(business_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_business ON audit_logs(business_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);

-- Enable RLS
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_bot_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE export_jobs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for team_members
CREATE POLICY "Team members can view own team"
  ON team_members FOR SELECT
  TO authenticated
  USING (business_id IN (SELECT id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Admins can manage team"
  ON team_members FOR ALL
  TO authenticated
  USING (
    business_id IN (
      SELECT business_id FROM team_members 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for channels
CREATE POLICY "Users can view own channels"
  ON channels FOR SELECT
  TO authenticated
  USING (business_id = auth.uid());

CREATE POLICY "Users can manage own channels"
  ON channels FOR ALL
  TO authenticated
  USING (business_id = auth.uid())
  WITH CHECK (business_id = auth.uid());

-- RLS Policies for conversations
CREATE POLICY "Users can view own conversations"
  ON conversations FOR SELECT
  TO authenticated
  USING (business_id = auth.uid());

CREATE POLICY "Users can manage own conversations"
  ON conversations FOR ALL
  TO authenticated
  USING (business_id = auth.uid())
  WITH CHECK (business_id = auth.uid());

-- RLS Policies for messages
CREATE POLICY "Users can view messages in own conversations"
  ON messages FOR SELECT
  TO authenticated
  USING (
    conversation_id IN (
      SELECT id FROM conversations WHERE business_id = auth.uid()
    )
  );

CREATE POLICY "Users can create messages in own conversations"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (
    conversation_id IN (
      SELECT id FROM conversations WHERE business_id = auth.uid()
    )
  );

-- RLS Policies for ai_bot_configs
CREATE POLICY "Users can view own bot configs"
  ON ai_bot_configs FOR SELECT
  TO authenticated
  USING (business_id = auth.uid());

CREATE POLICY "Users can manage own bot configs"
  ON ai_bot_configs FOR ALL
  TO authenticated
  USING (business_id = auth.uid())
  WITH CHECK (business_id = auth.uid());

-- RLS Policies for workflows
CREATE POLICY "Users can view own workflows"
  ON workflows FOR SELECT
  TO authenticated
  USING (business_id = auth.uid());

CREATE POLICY "Users can manage own workflows"
  ON workflows FOR ALL
  TO authenticated
  USING (business_id = auth.uid())
  WITH CHECK (business_id = auth.uid());

-- RLS Policies for workflow_executions
CREATE POLICY "Users can view own workflow executions"
  ON workflow_executions FOR SELECT
  TO authenticated
  USING (
    workflow_id IN (
      SELECT id FROM workflows WHERE business_id = auth.uid()
    )
  );

-- RLS Policies for tickets
CREATE POLICY "Users can view own tickets"
  ON tickets FOR SELECT
  TO authenticated
  USING (business_id = auth.uid());

CREATE POLICY "Users can manage own tickets"
  ON tickets FOR ALL
  TO authenticated
  USING (business_id = auth.uid())
  WITH CHECK (business_id = auth.uid());

-- RLS Policies for audit_logs (read-only)
CREATE POLICY "Users can view own audit logs"
  ON audit_logs FOR SELECT
  TO authenticated
  USING (business_id = auth.uid());

-- RLS Policies for knowledge_base_articles
CREATE POLICY "Users can view own articles"
  ON knowledge_base_articles FOR SELECT
  TO authenticated
  USING (business_id = auth.uid());

CREATE POLICY "Users can manage own articles"
  ON knowledge_base_articles FOR ALL
  TO authenticated
  USING (business_id = auth.uid())
  WITH CHECK (business_id = auth.uid());

-- RLS Policies for customer_segments
CREATE POLICY "Users can view own segments"
  ON customer_segments FOR SELECT
  TO authenticated
  USING (business_id = auth.uid());

CREATE POLICY "Users can manage own segments"
  ON customer_segments FOR ALL
  TO authenticated
  USING (business_id = auth.uid())
  WITH CHECK (business_id = auth.uid());

-- RLS Policies for export_jobs
CREATE POLICY "Users can view own exports"
  ON export_jobs FOR SELECT
  TO authenticated
  USING (business_id = auth.uid());

CREATE POLICY "Users can create own exports"
  ON export_jobs FOR INSERT
  TO authenticated
  WITH CHECK (business_id = auth.uid());

-- Triggers for updated_at
CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_tickets_updated_at
  BEFORE UPDATE ON tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_knowledge_base_articles_updated_at
  BEFORE UPDATE ON knowledge_base_articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_customer_segments_updated_at
  BEFORE UPDATE ON customer_segments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();