"use client"
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toggleBookmark } from "@/lib/actions/brains.actions";

interface BrainCardProps {
  id: string;
  name: string;
  topic: string;
  bookmarked: boolean;
  subject: string;
  duration: number;
  color: string;
}

const BrainCard = ({
  id,
  name,
  topic,
  bookmarked,
  subject,
  duration,
  color
}: BrainCardProps) => {
  const [isBookmarked, setIsBookmarked] = useState(bookmarked);
  const [isLoading, setIsLoading] = useState(false);

  const handleBookmarkClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await toggleBookmark(id, isBookmarked);
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error("Failed to toggle bookmark:", error);
      // Optionally show an error toast or notification here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <article className="companion-card" style={{ backgroundColor: color }}>
      <div className="flex justify-between items-center">
        <div className="subject-badge">{subject}</div>
        <button 
          className="companion-bookmark" 
          onClick={handleBookmarkClick}
          disabled={isLoading}
        >
          <Image
            src={isBookmarked ? "/icons/bookmark-filled.svg" : "/icons/bookmark.svg"}
            alt="bookmark"
            width={12.5}
            height={15}
          />
        </button>
      </div>
      <h2 className="text-2xl font-bold">{name}</h2>
      <p className="text-sm">{topic}</p>
      <div className="flex items-center gap-2">
        <Image
          src={"/icons/clock.svg"}
          alt="duration"
          width={13.5}
          height={13.5}
        />
        <p className="text-sm">{duration} minutes</p>
      </div>

      <Link href={`/brains/${id}`} className="w-full">
        <button className="btn-primary w-full justify-center">
          Lauch Lesson
        </button>
      </Link>
    </article>
  );
};

export default BrainCard;
