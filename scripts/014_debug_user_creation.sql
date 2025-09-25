-- Debug script to check user creation process
-- This will help identify what's failing during signup

-- Check if the handle_new_user function exists and is working
SELECT routine_name, routine_type, routine_definition 
FROM information_schema.routines 
WHERE routine_name = 'handle_new_user';

-- Check if the trigger exists
SELECT trigger_name, event_manipulation, event_object_table, action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Check profiles table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- Check RLS policies on profiles table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'profiles';

-- Test function manually (this will show any errors)
DO $$
BEGIN
    RAISE NOTICE 'Testing handle_new_user function...';
    -- This is just a test block to see if we can access the function
END $$;
