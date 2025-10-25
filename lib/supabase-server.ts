import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

// Alternative Supabase client that bypasses JWT for testing
export const createSupabaseServerClient = async () => {
  const { userId } = await auth();
  
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          // Use the service role key if you have it, or anon key for now
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        }
      }
    }
  );
};

// Function to get current user ID from Clerk
export const getCurrentUserId = async (): Promise<string | null> => {
  const { userId } = await auth();
  return userId;
};