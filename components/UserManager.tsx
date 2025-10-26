"use client";
import { useEnsureUser } from "@/hooks/useEnsureUser";

export default function UserManager() {
  useEnsureUser();
  return null; // This component doesn't render anything
}