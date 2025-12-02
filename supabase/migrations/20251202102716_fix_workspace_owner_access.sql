/*
  # Fix Workspace Owner Access

  ## Problem
  - Workspace owners cannot see their own workspaces after signup
  - The SELECT policy only allows team members, not the owner
  
  ## Changes
  - Drop the restrictive SELECT policy
  - Create a new policy that allows both owners and team members to view workspaces
  
  ## Security
  - Owners can view their own workspaces
  - Team members can view workspaces they belong to
*/

DROP POLICY IF EXISTS "Users can view workspaces" ON workspaces;

CREATE POLICY "Owners and team members can view workspaces"
  ON workspaces
  FOR SELECT
  TO authenticated
  USING (
    owner_id = auth.uid() 
    OR 
    id IN (
      SELECT workspace_id 
      FROM team_members 
      WHERE user_id = auth.uid()
    )
  );
