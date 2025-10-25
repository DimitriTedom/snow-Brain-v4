import BrainCard from "@/components/BrainCard";
import BrainList from "@/components/BrainList";
import Cta from "@/components/Cta";
import { getAllBrains, getRecentSession } from "@/lib/actions/brains.actions";
import { getSubjectColor } from "@/lib/utils";

const Page = async () => {
  try {
    const brains = await getAllBrains({ limit: 6 });
    const recentSessionsBrains = await getRecentSession(10);
    
    return (
      <main>
        <h1 className="text-2xl underline">Popular Brains</h1>

        <section className="home-section">
          {brains.map((brain) => (
            <BrainCard key={brain.id} {...brain} color={getSubjectColor(brain.subject)} />
          ))}
        </section>

        <section className="home-section">
          <BrainList title="Recently completed Session" brains={recentSessionsBrains} classNames="w-2/3 max-lg:w-full"/>
          <Cta />
        </section>
      </main>
    );
  } catch (error) {
    console.error("Error loading page:", error);
    return (
      <main>
        <h1 className="text-2xl underline">Popular Brains</h1>
        <div className="p-4 text-red-500">
          Error loading brains. Please check your database connection and try again.
        </div>
      </main>
    );
  }
};

export default Page;
