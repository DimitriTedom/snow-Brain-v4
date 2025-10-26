"use server";
import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "../supabase";
import { getCurrentUserId } from "../supabase-server";
import { CreateCompanion } from "@/types";

// User management functions
export const createOrUpdateUser = async (userData: {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
}) => {
  const supabase = await createSupabaseClient();

  const { data, error } = await supabase
    .from("users")
    .upsert(userData, { onConflict: "id" })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const getUser = async (userId: string) => {
  const supabase = await createSupabaseClient();

  const { data, error } = await supabase
    .from("users")
    .select()
    .eq("id", userId)
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// Ensure user exists in our database (call this in pages/components that require user data)
export const ensureUserExists = async () => {
  const { userId } = await auth();
  if (!userId) return null;

  try {
    // Try to get existing user
    const existingUser = await getUser(userId);
    return existingUser;
  } catch (error) {
    // User doesn't exist, we should be created
    // This requires Clerk user data, which should be handled in the client or middleware
    console.log("User not found in database, should be created");
    return null;
  }
};

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
  filter,
  orderBy = "updated_at",
  limit,
  subject,
  topic,
}: {
  filter?: string;
  orderBy?: "updated_at" | "created_at" | "name";
  limit?: number;
  subject?: string;
  topic?: string;
}) => {
  const supabase = await createSupabaseClient();
  const { userId } = await auth();

  // Base query
  let query = supabase
    .from("brains")
    .select(`
      *,
      session_history (count)
    `)
    .order(orderBy, { ascending: false });

  // Apply limit if provided
  if (limit) {
    query = query.limit(limit);
  }

  // Apply subject filter if provided
  if (subject) {
    query = query.eq("subject", subject);
  }

  // Apply topic filter if provided
  if (topic) {
    query = query.ilike("topic", `%${topic}%`);
  }

  // Apply filter if provided
  if (filter) {
    query = query.or(
      `name.ilike.%${filter}%,category.ilike.%${filter}%,description.ilike.%${filter}%`
    );
  }

  const { data: brains, error } = await query;
  console.log({ brains, error });
  if (error) throw new Error(error.message);

  // Get bookmark status for current user
  if (brains && brains.length > 0) {
    const brainIds = brains.map(brain => brain.id);
    const bookmarkStatus = await getUserBookmarkStatus(brainIds);
    
    // Add bookmark status to each brain
    const brainsWithBookmarks = brains.map(brain => ({
      ...brain,
      isBookmarked: bookmarkStatus[brain.id] || false
    }));

    return brainsWithBookmarks;
  }

  return brains;
};

export const getBrain = async (id: string) => {
  const supabase = await createSupabaseClient();

  const { data, error } = await supabase
    .from("brains")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const getUserBrain = async (id: string) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const supabase = await createSupabaseClient();

  const { data, error } = await supabase
    .from("brains")
    .select("*")
    .eq("id", id)
    .eq("author", userId)
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const getUserBrains = async () => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const supabase = await createSupabaseClient();

  const { data, error } = await supabase
    .from("brains")
    .select("*")
    .eq("author", userId)
    .order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};

export const getUserSessions = async () => {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error("Unauthorized");

  const supabase = await createSupabaseClient();

  const { data, error } = await supabase
    .from("session_history")
    .select(`
      *,
      brains (
        id,
        name,
        avatar_url
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) throw new Error(error.message);
  return data;
};

export const getUserSessionCount = async () => {
  const userId = await getCurrentUserId();
  if (!userId) return 0;

  const supabase = await createSupabaseClient();

  const { data, error } = await supabase
    .from("session_history")
    .select("id", { count: "exact" })
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching session count:", error);
    return 0;
  }

  return data?.length || 0;
};

export const getRecentSession = async () => {
  const userId = await getCurrentUserId();
  if (!userId) return null;

  const supabase = await createSupabaseClient();

  const { data, error } = await supabase
    .from("session_history")
    .select(`
      *,
      brains (
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
    .limit(1)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching recent session:", error);
    return null;
  }

  return data;
};

export const getRecentSessionBrains = async (limit: number = 10) => {
  const userId = await getCurrentUserId();
  if (!userId) return [];

  const supabase = await createSupabaseClient();

  // First get recent session brain IDs
  const { data: sessions, error: sessionError } = await supabase
    .from("session_history")
    .select("brain_id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (sessionError) {
    console.error("Error fetching recent sessions:", sessionError);
    return [];
  }

  if (!sessions || sessions.length === 0) return [];

  // Get unique brain IDs
  const uniqueBrainIds = [...new Set(sessions.map(session => session.brain_id))];

  // Get full brain data
  const { data: brains, error: brainsError } = await supabase
    .from("brains")
    .select("*")
    .in("id", uniqueBrainIds);

  if (brainsError) {
    console.error("Error fetching brains:", brainsError);
    return [];
  }

  return brains || [];
};

export const addToSessionHistory = async (brainId: string, query: string, response: string) => {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error("Unauthorized");

  const supabase = await createSupabaseClient();

  const { data, error } = await supabase
    .from("session_history")
    .insert({
      user_id: userId,
      brain_id: brainId,
      query,
      response,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// Brain permission checking
export const newBrainPermissions = async () => {
  const { userId, has } = await auth();
  if (!userId) throw new Error("User not authenticated");

  // Check user's subscription plan for brain limits
  if (has({ plan: 'SnowBrain v4 Heavy' }) || has({ plan: 'heavy' })) {
    // Heavy plan ($40) - Unlimited brains
    return { allowed: true, remaining: Infinity };
  } else if (has({ plan: 'SnowBrain v4 Expert' }) || has({ plan: 'expert' })) {
    // Expert plan ($20) - 10 brains
    const userBrainCount = await getUserBrainCount();
    const limit = 10;
    const remaining = Math.max(0, limit - userBrainCount);
    
    console.log(`User ${userId} has ${userBrainCount}/10 brains (Expert plan)`);
    return { 
      allowed: userBrainCount < limit, 
      remaining: remaining,
      total: userBrainCount 
    };
  } else {
    // Free plan (SnowBrain v4 Fast) - 3 brains
    const userBrainCount = await getUserBrainCount();
    const limit = 3;
    const remaining = Math.max(0, limit - userBrainCount);
    
    console.log(`User ${userId} has ${userBrainCount}/3 brains (Free plan)`);
    return { 
      allowed: userBrainCount < limit, 
      remaining: remaining,
      total: userBrainCount 
    };
  }
};

const getUserBrainCount = async () => {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");

  const supabase = await createSupabaseClient();

  const { data, error } = await supabase
    .from('brains')
    .select('id', { count: 'exact' })
    .eq('author', userId);

  if (error) {
    throw new Error(`Error counting user brains: ${error.message}`);
  }

  return data?.length || 0;
};

export const checkConversationLimits = async () => {
  const { userId, has } = await auth();
  if (!userId) throw new Error("User not authenticated");

  // Check user's subscription plan for conversation limits
  if (has({ plan: 'SnowBrain v4 Heavy' }) || has({ plan: 'heavy' }) ||
      has({ plan: 'SnowBrain v4 Expert' }) || has({ plan: 'expert' })) {
    // Expert ($20) and Heavy ($40) plans have unlimited conversations
    return { allowed: true, remaining: Infinity };
  }

  // Free plan (SnowBrain v4 Fast) - 10 Conversations/Month
  const supabase = await createSupabaseClient();
  
  // Get start of current month
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  const { data, error } = await supabase
    .from('session_history')
    .select('id', { count: 'exact' })
    .eq('user_id', userId)
    .gte('created_at', startOfMonth.toISOString());

  if (error) {
    throw new Error(`Error checking conversation limits: ${error.message}`);
  }

  const conversationCount = data?.length || 0;
  const limit = 10;
  const remaining = Math.max(0, limit - conversationCount);

  console.log(`User ${userId} has ${conversationCount}/10 conversations this month`);

  return { 
    allowed: conversationCount < limit, 
    remaining: remaining,
    total: conversationCount 
  };
};

export const getUserPlanDetails = async () => {
  const { userId, has } = await auth();
  if (!userId) throw new Error("User not authenticated");

  let planName = "SnowBrain v4 Fast";
  let brainLimit = 3;
  let conversationLimit = 10;
  let price = 0;

  if (has({ plan: 'SnowBrain v4 Heavy' }) || has({ plan: 'heavy' })) {
    planName = "SnowBrain v4 Heavy";
    brainLimit = Infinity;
    conversationLimit = Infinity;
    price = 40;
  } else if (has({ plan: 'SnowBrain v4 Expert' }) || has({ plan: 'expert' })) {
    planName = "SnowBrain v4 Expert";
    brainLimit = 10;
    conversationLimit = Infinity;
    price = 20;
  }

  // Get current usage
  const supabase = await createSupabaseClient();
  
  // Get brain count
  const { data: brains } = await supabase
    .from('brains')
    .select('id', { count: 'exact' })
    .eq('author', userId);

  // Get conversation count for current month (for free plan)
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  const { data: conversations } = await supabase
    .from('session_history')
    .select('id', { count: 'exact' })
    .eq('user_id', userId)
    .gte('created_at', startOfMonth.toISOString());

  return {
    planName,
    price,
    brainLimit,
    conversationLimit,
    currentBrains: brains?.length || 0,
    currentConversations: conversations?.length || 0,
    brainsRemaining: brainLimit === Infinity ? Infinity : Math.max(0, brainLimit - (brains?.length || 0)),
    conversationsRemaining: conversationLimit === Infinity ? Infinity : Math.max(0, conversationLimit - (conversations?.length || 0))
  };
};

export const toggleBookmark = async (brainId: string, currentBookmarkState: boolean) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const supabase = await createSupabaseClient();

  if (currentBookmarkState) {
    // Remove bookmark
    const { error } = await supabase
      .from("user_bookmarks")
      .delete()
      .eq("user_id", userId)
      .eq("brain_id", brainId);

    if (error) throw new Error(error.message);
    return { success: true, bookmarked: false };
  } else {
    // Add bookmark
    const { error } = await supabase
      .from("user_bookmarks")
      .insert({ user_id: userId, brain_id: brainId });

    if (error) throw new Error(error.message);
    return { success: true, bookmarked: true };
  }
};

export const getBookmarkedBrains = async () => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const supabase = await createSupabaseClient();

  // First get bookmark IDs
  const { data: bookmarks, error: bookmarkError } = await supabase
    .from("user_bookmarks")
    .select("brain_id")
    .eq("user_id", userId);

  if (bookmarkError) throw new Error(bookmarkError.message);
  
  if (!bookmarks || bookmarks.length === 0) return [];

  const brainIds = bookmarks.map(bookmark => bookmark.brain_id);

  // Then get full brain data
  const { data: brains, error: brainsError } = await supabase
    .from("brains")
    .select("*")
    .in("id", brainIds);

  if (brainsError) throw new Error(brainsError.message);

  // Add bookmark status to each brain
  return brains?.map(brain => ({
    ...brain,
    isBookmarked: true
  })) || [];
};

export const getUserBookmarkStatus = async (brainIds: string[]) => {
  const { userId } = await auth();
  if (!userId) return {};

  const supabase = await createSupabaseClient();
  
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
};