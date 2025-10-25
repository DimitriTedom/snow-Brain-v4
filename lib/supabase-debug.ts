import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

export const createSupabaseClientWithAuth = async () => {
  const { getToken, userId } = await auth();

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        fetch: async (url, options = {}) => {
          const clerkToken = await getToken({
            template: "supabase",
          });

          // Debug: Let's see what the JWT contains
          if (clerkToken) {
            try {
              const payload = JSON.parse(atob(clerkToken.split('.')[1]));
              console.log("JWT Payload from Clerk:", payload);
              console.log("User ID from Clerk auth():", userId);
            } catch (e) {
              console.log("Could not parse JWT:", e);
            }
          }

          const headers = new Headers(options?.headers);
          if (clerkToken) {
            headers.set("Authorization", `Bearer ${clerkToken}`);
          }

          return fetch(url, {
            ...options,
            headers,
          });
        },
      },
    }
  );
};