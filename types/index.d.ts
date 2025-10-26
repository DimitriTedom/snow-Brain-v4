// type User = {
//   name: string;
//   email: string;
//   image?: string;
//   accountId: string;
// };

export enum Subject {
  maths = "maths",
  language = "language", 
  science = "science",
  history = "history",
  coding = "coding",
  geography = "geography",
  economics = "economics",
  finance = "finance",
  business = "business",
}

export interface User {
  id: string; // Clerk user ID
  email: string;
  name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Brain {
  id: string;
  name: string;
  subject: string;
  topic: string;
  voice?: string;
  style?: string;
  duration: number;
  author: string;
  created_at: string;
  updated_at: string;
}

export interface UserBookmark {
  id: string;
  user_id: string;
  brain_id: string;
  created_at: string;
}

export type Companion = Brain;

export interface CreateCompanion {
  name: string;
  subject: string;
  topic: string;
  voice: string;
  style: string;
  duration: number;
}

export interface GetAllCompanions {
  limit?: number;
  page?: number;
  subject?: string | string[];
  topic?: string | string[];
}

export interface BuildClient {
  key?: string;
  sessionToken?: string;
}

export interface CreateUser {
  email: string;
  name: string;
  image?: string;
  accountId: string;
}

export interface SearchParams {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export interface Avatar {
  userName: string;
  width: number;
  height: number;
  className?: string;
}

export interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

export interface CompanionComponentProps {
  brainId: string;
  subject: string;
  topic: string;
  name: string;
  userName: string;
  userImage: string;
  voice: string;
  style: string;
}

export interface UserBookmark {
  id: string;
  user_id: string;
  brain_id: string;
  created_at: string;
}