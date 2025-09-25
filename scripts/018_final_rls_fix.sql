-- DEFINITIVE FIX for infinite recursion in RLS policies
-- The issue: profiles table policies are querying profiles table, creating recursion

-- Step 1: Drop ALL existing problematic policies
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_own" ON public.profiles;

-- Step 2: Temporarily disable RLS to clear any cached policies
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Step 3: Create simple, NON-RECURSIVE policies for profiles
-- Users can only access their own profile
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow profile creation during signup (triggered automatically)
CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Step 4: Create admin helper function that doesn't reference profiles table
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT COALESCE(
    (SELECT email FROM auth.users WHERE id = auth.uid()) = 'mantimdanzaki@gmail.com',
    false
  );
$$;

-- Step 5: Add admin access policy using the helper function
CREATE POLICY "profiles_admin_access"
  ON public.profiles FOR ALL
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- Step 6: Fix the trigger function to handle errors gracefully
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert profile with proper error handling
  INSERT INTO public.profiles (id, first_name, last_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'first_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'last_name', ''),
    CASE 
      WHEN NEW.email = 'mantimdanzaki@gmail.com' THEN 'admin'
      ELSE 'customer'
    END
  );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail user creation
    RAISE WARNING 'Profile creation failed for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Step 7: Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
