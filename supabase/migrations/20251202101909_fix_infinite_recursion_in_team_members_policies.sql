/*
  # Fix Infinite Recursion in Team Members Policies

  ## Problem
  The team_members policies created a recursive loop:
  - Policy checks workspace_id by querying team_members table
  - That query triggers the same policy again
  - Results in "infinite recursion detected" error

  ## Solution
  Use a security definer function to bypass RLS when checking permissions.
  This breaks the recursion cycle safely.

  ## Changes
  1. Drop all existing team_members policies
  2. Create helper function to get user's workspaces
  3. Create new non-recursive policies using the helper function
*/

-- Drop all existing policies on team_members
DROP POLICY IF EXISTS "Users can view team members" ON public.team_members;
DROP POLICY IF EXISTS "Admins can insert team members" ON public.team_members;
DROP POLICY IF EXISTS "Admins can update team members" ON public.team_members;
DROP POLICY IF EXISTS "Admins can delete team members" ON public.team_members;
DROP POLICY IF EXISTS "Team members can view team" ON public.team_members;
DROP POLICY IF EXISTS "Admins can manage team" ON public.team_members;

-- Create helper function to get user's workspaces (bypasses RLS)
CREATE OR REPLACE FUNCTION public.get_user_workspaces(user_uuid uuid)
RETURNS SETOF uuid
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT workspace_id 
  FROM team_members 
  WHERE user_id = user_uuid;
$$;

-- Create helper function to check if user is admin (bypasses RLS)
CREATE OR REPLACE FUNCTION public.is_workspace_admin(user_uuid uuid, workspace_uuid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM team_members 
    WHERE user_id = user_uuid 
    AND workspace_id = workspace_uuid
    AND role IN ('owner', 'admin')
  );
$$;

-- Create non-recursive policies
CREATE POLICY "Users can view team members"
  ON public.team_members FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT get_user_workspaces((select auth.uid()))
    )
  );

CREATE POLICY "Admins can insert team members"
  ON public.team_members FOR INSERT
  TO authenticated
  WITH CHECK (
    is_workspace_admin((select auth.uid()), workspace_id)
  );

CREATE POLICY "Admins can update team members"
  ON public.team_members FOR UPDATE
  TO authenticated
  USING (
    is_workspace_admin((select auth.uid()), workspace_id)
  )
  WITH CHECK (
    is_workspace_admin((select auth.uid()), workspace_id)
  );

CREATE POLICY "Admins can delete team members"
  ON public.team_members FOR DELETE
  TO authenticated
  USING (
    is_workspace_admin((select auth.uid()), workspace_id)
  );
