import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixRLS() {
  const sql = `
-- Fix RLS policies for user_active_contexts after FK change to profiles.id
-- The user_id column now references profiles.id, but auth.uid() returns users.id
-- So we need to join with profiles to check ownership

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own active context" ON user_active_contexts;
DROP POLICY IF EXISTS "Users can insert their own active context" ON user_active_contexts;
DROP POLICY IF EXISTS "Users can update their own active context" ON user_active_contexts;

-- Create corrected policies that join with profiles
CREATE POLICY "Users can view their own active context"
ON user_active_contexts
FOR SELECT
TO authenticated
USING (
  auth.uid() = (
    SELECT auth_user_id FROM profiles WHERE id = user_active_contexts.user_id
  )
);

CREATE POLICY "Users can insert their own active context"
ON user_active_contexts
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = (
    SELECT auth_user_id FROM profiles WHERE id = user_active_contexts.user_id
  )
);

CREATE POLICY "Users can update their own active context"
ON user_active_contexts
FOR UPDATE
TO authenticated
USING (
  auth.uid() = (
    SELECT auth_user_id FROM profiles WHERE id = user_active_contexts.user_id
  )
)
WITH CHECK (
  auth.uid() = (
    SELECT auth_user_id FROM profiles WHERE id = user_active_contexts.user_id
  )
);
  `;

  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql });
    if (error) {
      console.error('Error executing SQL:', error);
    } else {
      console.log('RLS policies updated successfully');
    }
  } catch (err) {
    console.error('Failed to execute SQL:', err);
  }
}

fixRLS();