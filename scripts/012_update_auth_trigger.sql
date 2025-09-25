-- Removed conflicting function and use the corrected one from 008_create_triggers_functions.sql
-- This script is no longer needed as the functionality is consolidated

-- Ensure we're using the correct trigger function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

SELECT 'Auth trigger updated to use consolidated handle_new_user() function' as message;
