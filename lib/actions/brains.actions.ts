"use server";
import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "../supabase";
import { createSupabaseServerClient, getCurrentUserId } from "../supabase-server";
import { createSupabaseClientWithAuth } from "../supabase-debug";

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
  const supabase = await createSupabaseServerClient();
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
  const supabase = await createSupabaseClientWithAuth();

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
  const supabase = await createSupabaseClientWithAuth();

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