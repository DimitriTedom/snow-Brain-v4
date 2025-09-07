import BrainCard from "@/components/BrainCard";
import BrainList from "@/components/BrainList";
import Cta from "@/components/Cta";
import { Button } from "@/components/ui/button";
import { recentSessions } from "@/constants";

const Page = () => {
  return (
    <main>
      <h1 className="text-2xl underline">Popular Brains</h1>

      <section className="home-section">
        <BrainCard
          id="12"
          name="neura the Brainy Explorer"
          topic="neural Network of the Brain"
          subject="science"
          duration={45}
          color="#ffda6e"
        />
        <BrainCard
          id="123"
          name="Countsy the Number Wizard"
          topic="Derivatives & Integrals"
          subject="maths"
          duration={30}
          color="#e5d0ff"
        />
        <BrainCard
          id="124"
          name="Verba the Vocabulary Builer"
          topic="Language"
          subject="English Literature"
          duration={15}
          color="#bde7ff"
        />
      </section>

      <section className="home-section">
        <BrainList title="Recently completed Session" brains={recentSessions} classNames="w-2/3 max-lg:w-full"/>
        <Cta />
      </section>
    </main>
  );
};

export default Page;
