import BrainCard from "@/components/BrainCard";
import { getBookmarkedBrains } from "@/lib/actions/brains.actions";
import { getSubjectColor } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const BookmarksPage = async () => {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  try {
    const bookmarkedBrains = await getBookmarkedBrains();

    return (
      <main>
        <section className="flex justify-between gap-4 max-sm:flex-col">
          <h1>My Bookmarks</h1>
          <p className="text-sm text-muted-foreground">
            {bookmarkedBrains.length} brain{bookmarkedBrains.length !== 1 ? 's' : ''} bookmarked
          </p>
        </section>

        {bookmarkedBrains.length === 0 ? (
          <section className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-4">
              <h2 className="text-xl font-semibold text-muted-foreground">No bookmarks yet</h2>
              <p className="text-sm text-muted-foreground max-w-md">
                Start bookmarking your favorite brains to access them quickly from here.
              </p>
            </div>
          </section>
        ) : (
          <section className="companions-grid">
            {bookmarkedBrains.map((brain) => (
              <BrainCard 
                key={brain.id} 
                {...brain} 
                color={getSubjectColor(brain.subject)} 
              />
            ))}
          </section>
        )}
      </main>
    );
  } catch (error) {
    console.error("Error loading bookmarks:", error);
    return (
      <main>
        <section className="flex flex-col items-center justify-center py-12">
          <div className="text-center space-y-4">
            <h2 className="text-xl font-semibold text-destructive">Error loading bookmarks</h2>
            <p className="text-sm text-muted-foreground">
              Please try refreshing the page or contact support if the issue persists.
            </p>
          </div>
        </section>
      </main>
    );
  }
};

export default BookmarksPage;