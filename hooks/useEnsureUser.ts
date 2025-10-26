"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { createOrUpdateUser } from "@/lib/actions/brains.actions";

export function useEnsureUser() {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && user) {
      const userData = {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress || "",
        name: user.fullName || user.firstName || "Anonymous",
        avatar_url: user.imageUrl,
      };

      createOrUpdateUser(userData).catch(console.error);
    }
  }, [isLoaded, user]);

  return { user, isLoaded };
}