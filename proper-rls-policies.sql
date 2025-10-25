-- Proper RLS policies for Clerk + Supabase integration
-- Drop existing permissive policies
DROP POLICY IF EXISTS "Anyone can view brains" ON brains;
DROP POLICY IF EXISTS "Anyone can create brains" ON brains;
DROP POLICY IF EXISTS "Anyone can update brains" ON brains;
DROP POLICY IF EXISTS "Anyone can delete brains" ON brains;
DROP POLICY IF EXISTS "Anyone can view sessions" ON session_history;
DROP POLICY IF EXISTS "Anyone can create sessions" ON session_history;
DROP POLICY IF EXISTS "Anyone can update sessions" ON session_history;
DROP POLICY IF EXISTS "Anyone can delete sessions" ON session_history;

-- Drop original policies if they exist
DROP POLICY IF EXISTS "Users can view all brains" ON brains;
DROP POLICY IF EXISTS "Users can create their own brains" ON brains;
DROP POLICY IF EXISTS "Users can update their own brains" ON brains;
DROP POLICY IF EXISTS "Users can delete their own brains" ON brains;
DROP POLICY IF EXISTS "Users can view their own sessions" ON session_history;
DROP POLICY IF EXISTS "Users can create their own sessions" ON session_history;

-- Create proper policies for brains table
CREATE POLICY "Users can view all brains" ON brains 
  FOR SELECT USING (true);

CREATE POLICY "Users can create their own brains" ON brains 
  FOR INSERT WITH CHECK (
    CASE 
      WHEN auth.jwt() IS NULL THEN false
      WHEN auth.jwt() ->> 'sub' IS NULL THEN false
      ELSE auth.jwt() ->> 'sub' = author
    END
  );

CREATE POLICY "Users can update their own brains" ON brains 
  FOR UPDATE USING (
    CASE 
      WHEN auth.jwt() IS NULL THEN false
      WHEN auth.jwt() ->> 'sub' IS NULL THEN false
      ELSE auth.jwt() ->> 'sub' = author
    END
  );

CREATE POLICY "Users can delete their own brains" ON brains 
  FOR DELETE USING (
    CASE 
      WHEN auth.jwt() IS NULL THEN false
      WHEN auth.jwt() ->> 'sub' IS NULL THEN false
      ELSE auth.jwt() ->> 'sub' = author
    END
  );

-- Create proper policies for session_history table
CREATE POLICY "Users can view their own sessions" ON session_history 
  FOR SELECT USING (
    CASE 
      WHEN auth.jwt() IS NULL THEN false
      WHEN auth.jwt() ->> 'sub' IS NULL THEN false
      ELSE auth.jwt() ->> 'sub' = user_id
    END
  );

CREATE POLICY "Users can create their own sessions" ON session_history 
  FOR INSERT WITH CHECK (
    CASE 
      WHEN auth.jwt() IS NULL THEN false
      WHEN auth.jwt() ->> 'sub' IS NULL THEN false
      ELSE auth.jwt() ->> 'sub' = user_id
    END
  );

-- Alternative: If Clerk uses a different field in JWT, try these
-- (uncomment and modify if needed based on the JWT debug output)

-- CREATE POLICY "Users can create their own sessions alt" ON session_history 
--   FOR INSERT WITH CHECK (
--     CASE 
--       WHEN auth.jwt() IS NULL THEN false
--       WHEN auth.jwt() ->> 'user_id' IS NULL THEN false
--       ELSE auth.jwt() ->> 'user_id' = user_id
--     END
--   );

-- CREATE POLICY "Users can view their own sessions alt" ON session_history 
--   FOR SELECT USING (
--     CASE 
--       WHEN auth.jwt() IS NULL THEN false
--       WHEN auth.jwt() ->> 'user_id' IS NULL THEN false
--       ELSE auth.jwt() ->> 'user_id' = user_id
--     END
--   );