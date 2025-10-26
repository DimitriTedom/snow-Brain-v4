"use server";
import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "../supabase";
import { getCurrentUserId } from "../supabase-server";

export const createBrain = async (formData: CreateCompanion) => {
  const { userId: author } = await auth();
  const supabase = await createSupabaseClient();

  const { data, error } = await supabase
    .from("brains")
    .insert({ ...formData, author })
    .select();

  if (error || !data)
    throw new Error(error?.message || "Failed to create Brain");
  return data[0];
};

export const getAllBrains = async ({
  limit = 10,
  page = 1,
  subject,
  topic,
}: GetAllCompanions) => {
  // Use server client to avoid JWT issues for now
  const supabase = await createSupabaseClient();
  let query = supabase.from("brains").select();

  if (subject && topic) {
    query = query
      .ilike("subject", `%${subject}%`)
      .or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`);
  } else if (subject) {
    query = query.ilike("subject", `%${subject}%`);
  } else if (topic) {
    query = query.or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`);
  }

  query = query.range((page - 1) * limit, page * limit - 1);

  const { data: brains, error } = await query;
  console.log({ brains, error });
  if (error) throw new Error(error.message);

  // Get bookmark status for current user
  if (brains && brains.length > 0) {
    const brainIds = brains.map(brain => brain.id);
    const bookmarkStatus = await getUserBookmarkStatus(brainIds);
    
    // Add bookmark status to each brain
    return brains.map(brain => ({
      ...brain,
      bookmarked: bookmarkStatus[brain.id] || false
    }));
  }

  return brains || [];
};

export const getBrain = async (id: string) => {
  const supabase = await createSupabaseClient();

  const { data, error } = await supabase
    .from("brains").select().eq("id", id);
  if (error) return console.log(error);

  return data[0];
};

export const addToSessionHistory = async (brainId: string) => {
  console.log("addToSessionHistory called with brainId:", brainId);
  
  if (!brainId) {
    throw new Error("Brain ID is required but was not provided");
  }
  
  const userId = await getCurrentUserId();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  
  console.log("User ID:", userId);
  
  // Use debug client to see JWT structure
  const supabase = await createSupabaseClient();

  // First verify that the brain exists
  const { data: brainExists, error: brainError } = await supabase
    .from("brains")
    .select("id")
    .eq("id", brainId)
    .single();

  console.log("Brain lookup result:", { brainExists, brainError });

  if (brainError || !brainExists) {
    throw new Error(`Brain with ID ${brainId} not found`);
  }

  const { data, error } = await supabase
    .from("session_history")
    .insert({ brain_id: brainId, user_id: userId })
    .select();

  console.log("Session history insert result:", { data, error });

  if (error) {
    console.error("Session history insert error:", error);
    throw new Error(error?.message || "Failed to add to session history");
  }
  return data?.[0];
};

export const getRecentSession = async (limit = 10) => {
  // Get current user ID for filtering
  const userId = await getCurrentUserId();
  if (!userId) {
    console.log("No user ID found, returning empty array");
    return [];
  }

  // Use authenticated client to respect RLS policies
  const supabase = await createSupabaseClient();

  // First, let's check if there are any session history records for this user
  const { data: countData, error: countError } = await supabase
    .from("session_history")
    .select("id", { count: "exact" })
    .eq("user_id", userId);
  
  console.log("Session history count for user:", { userId, countData, countError, count: countData?.length });

  const { data, error } = await supabase
    .from("session_history")
    .select(`
      brains!brain_id (
        id,
        name,
        subject,
        topic,
        voice,
        style,
        duration,
        author,
        created_at,
        updated_at
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  console.log("Recent sessions query result:", {data});
  // Flatten the nested structure and ensure we have valid brain objects
  return data?.map((session: any) => session.brains).filter((brain: any) => brain && brain.id) || [];
};

export const getUserSessions = async (userId: string, limit = 10) => {
  const supabase = await createSupabaseClient();

  const { data, error } = await supabase
    .from("session_history")
    .select(`
      brains!brain_id (
        id,
        name,
        subject,
        topic,
        voice,
        style,
        duration,
        author,
        created_at,
        updated_at
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return data?.map((session: any) => session.brains).filter((brain: any) => brain && brain.id) || [];
};

export const getUserBrain = async (userId: string) => {
  const supabase = await createSupabaseClient();

  const { data, error } = await supabase
    .from("brains")
    .select()
    .eq("author", userId);

  if (error) throw new Error(error.message);
  return data || [];
};

export const newBrainPermissions = async () =>{
  const {userId, has} = await auth();
  const supabase = await createSupabaseClient();

  let limit = 0;

  if (has({plan: 'pro'})) {
    return true;
  }else if(has({feature:"3_active_snow_brains"})) {
    limit = 3;
  } else if(has({feature:"10_active_snow_brains"})) {
    limit = 10;
  }

  const {data,error} = await supabase
  .from('brains').select('id',{count:'exact'}).eq('author',userId);
  
  if(error) {
    throw new Error(`Error checking brain permissions: ${error.message}`); 
  }
  const brainCount = data?.length;
  if (brainCount >= limit) {
    return false;
  }else{
    return true
  }

}

export const toggleBookmark = async (brainId: string, currentBookmarkState: boolean) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const supabase = await createSupabaseClient();
  
  try {
    if (currentBookmarkState) {
      // Remove bookmark
      const { error } = await supabase
        .from("user_bookmarks")
        .delete()
        .eq("brain_id", brainId)
        .eq("user_id", userId);

      if (error) throw new Error(error.message);
      return { bookmarked: false };
    } else {
      // Add bookmark
      const { data, error } = await supabase
        .from("user_bookmarks")
        .insert({ brain_id: brainId, user_id: userId })
        .select()
        .single();

      if (error) throw new Error(error.message);
      return { bookmarked: true };
    }
  } catch (error: any) {
    // Fallback: If user_bookmarks table doesn't exist yet, use the old method
    if (error.message?.includes('user_bookmarks') || error.message?.includes('does not exist')) {
      console.warn("user_bookmarks table not found, using fallback method");
      
      // For now, just return the opposite state
      return { bookmarked: !currentBookmarkState };
    }
    throw error;
  }
};

export const getBookmarkedBrains = async ({
  limit = 10,
  page = 1,
}: { limit?: number; page?: number } = {}) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const supabase = await createSupabaseClient();
  
  try {
    const { data: bookmarks, error } = await supabase
      .from("user_bookmarks")
      .select(`
        brain_id,
        brains (
          id,
          name,
          subject,
          topic,
          voice,
          style,
          duration,
          author,
          bookmarked,
          created_at,
          updated_at
        )
      `)
      .eq("user_id", userId)
      .range((page - 1) * limit, page * limit - 1)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return bookmarks?.map(bookmark => bookmark.brains).filter(brain => brain && (brain as any).id) || [];
  } catch (error: any) {
    // Fallback: If user_bookmarks table doesn't exist yet, return empty array
    if (error.message?.includes('user_bookmarks') || error.message?.includes('does not exist')) {
      console.warn("user_bookmarks table not found, returning empty bookmarks");
      return [];
    }
    throw error;
  }
};

export const getUserBookmarkStatus = async (brainIds: string[]) => {
  const { userId } = await auth();
  if (!userId) return {};

  const supabase = await createSupabaseClient();
  
  try {
    const { data: bookmarks, error } = await supabase
      .from("user_bookmarks")
      .select("brain_id")
      .eq("user_id", userId)
      .in("brain_id", brainIds);

    if (error) {
      console.error("Error fetching bookmark status:", error);
      return {};
    }

    const bookmarkMap: Record<string, boolean> = {};
    brainIds.forEach(id => {
      bookmarkMap[id] = bookmarks?.some(bookmark => bookmark.brain_id === id) || false;
    });
    
    return bookmarkMap;
  } catch (error: any) {
    // Fallback: If user_bookmarks table doesn't exist yet, return empty status
    if (error.message?.includes('user_bookmarks') || error.message?.includes('does not exist')) {
      console.warn("user_bookmarks table not found, returning empty bookmark status");
      const bookmarkMap: Record<string, boolean> = {};
      brainIds.forEach(id => {
        bookmarkMap[id] = false;
      });
      return bookmarkMap;
    }
    console.error("Error fetching bookmark status:", error);
    return {};
  }
};