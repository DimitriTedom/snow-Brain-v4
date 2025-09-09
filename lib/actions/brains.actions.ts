"use server";
import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "../supabase";
import { clear } from "console";

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
  const supabase = createSupabaseClient();
  let query = (await supabase).from("brains").select();

  if (subject && topic) {
    query = query
      .ilike("subject", `%${subject}%`)
      .or(`topic.ilke.%${topic}%,name.ilike.%${topic}%`);
  } else if (subject) {
    query = query.ilike("subject", `%${subject}%`);
  } else if (topic) {
    clear;
    query = query.or(`topic.ilike.%${subject}%,name.ilike.%${topic}%`);
  }

  query = query.range((page - 1) * limit, page * limit - 1);

  const { data: brains, error } = await query;
  if (error) throw new Error(error.message);

  return brains;
};

export const getBrain = async (id: string) => {
  const supabase = await createSupabaseClient();

  const { data, error } = await supabase
    .from("brains").select().eq("id", id);
  if (error) return console.log(error);

  return data[0];
};
