/*
  # Fix Team Members Policy Overlap

  This migration addresses the multiple permissive policies warning for team_members table.
  
  ## Issue
  Having both "Team members can view team" and "Admins can manage team" SELECT policies
  creates unnecessary overhead as both are evaluated for every SELECT query.

  ## Solution
  Consolidate into a single view policy and separate admin management policies.

  ## Changes
  1. Remove overlapping SELECT policies
  2. Create single unified SELECT policy
  3. Keep separate INSERT/UPDATE/DELETE policies for admins
*/

-- Drop existing overlapping policies
DROP POLICY IF EXISTS "Team members can view team" ON public.team_members;
DROP POLICY IF EXISTS "Admins can manage team" ON public.team_members;

-- Create unified SELECT policy (all team members can view their team)
CREATE POLICY "Users can view team members"
  ON public.team_members FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id FROM team_members 
      WHERE user_id = (select auth.uid())
    )
  );

-- Create separate admin management policies
CREATE POLICY "Admins can insert team members"
  ON public.team_members FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id FROM team_members 
      WHERE user_id = (select auth.uid()) 
      AND role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Admins can update team members"
  ON public.team_members FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id FROM team_members 
      WHERE user_id = (select auth.uid()) 
      AND role IN ('owner', 'admin')
    )
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id FROM team_members 
      WHERE user_id = (select auth.uid()) 
      AND role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Admins can delete team members"
  ON public.team_members FOR DELETE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id FROM team_members 
      WHERE user_id = (select auth.uid()) 
      AND role IN ('owner', 'admin')
    )
  );
