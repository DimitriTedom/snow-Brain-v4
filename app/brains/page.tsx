import BrainCard from "@/components/BrainCard";
import SearchInput from "@/components/SearchInput";
import SubjectFilter from "@/components/SubjectFilter";
import { getAllBrains } from "@/lib/actions/brains.actions";
import { getSubjectColor } from "@/lib/utils";
import { SearchParams } from "@/types";

const BrainLibrary = async ({searchParams}:SearchParams) => {
  const filters = await searchParams;
  const subject = Array.isArray(filters.subject) ? filters.subject[0] : filters.subject || '';
  const topic = Array.isArray(filters.topic) ? filters.topic[0] : filters.topic || '';
  

  const brains = await getAllBrains({subject,topic})
  return (
    <main>
    <section className="flex justify-between gap-4 max-sm:flex-col">
      <h1>Brain Library</h1>
      <div className="flex gap-4">
        <SearchInput/>
        <SubjectFilter/>
      </div>
    </section>

    <section className="companions-grid">
    {brains.map((brain)=>(
      <BrainCard key={brain.id} {...brain} color={getSubjectColor(brain.subject)}/>
    ))}
    </section>
    </main>
  )
}

export default BrainLibrary