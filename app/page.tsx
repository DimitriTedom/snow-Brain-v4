import BrainCard from "@/components/BrainCard";
import BrainList from "@/components/BrainList";
import Cta from "@/components/Cta";
import { getAllBrains, getRecentSession } from "@/lib/actions/brains.actions";
import { getSubjectColor } from "@/lib/utils";

const Page = async () => {
  const brains = await getAllBrains({ limit: 6});
  const recentSessionsBrains= await getRecentSession(10);
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
};

export default Page;
