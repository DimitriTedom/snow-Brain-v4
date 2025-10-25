import BrainComponent from "@/components/BrainComponent";
import { getBrain } from "@/lib/actions/brains.actions";
import { getSubjectColor } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";

interface BrainSessionProps {
  params: Promise<{ id: string }>;
}
const BrainSession = async ({ params }: BrainSessionProps) => {
  const { id } = await params;
  const brain = await getBrain(id);
  const user = await currentUser();

  const  {name,subject,title,topic,duration} = brain
  if (!user) redirect("/sign-in");
  if (!name) redirect("/brains");
  return (
    <main>
      <article className="flex rounded-border justify-between p-6 max-md:flex-col">
        <div className="flex items-center gap-2">
          <div
            className="flex items-center justify-center rounded-lg max-md:hidden size-[72px]"
            style={{ backgroundColor: getSubjectColor(subject) }}
          >
            <Image
              src={`/icons/${subject}.svg`}
              alt={subject}
              width={35}
              height={35}
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                  <p className="font-bold text-2xl">
                    {name}
                  </p>
                  <div className="subject-badge max-sm:hidden">
                    {subject}
                  </div>
            </div>
            <p className="text-lg">{topic}</p>
          </div>
        </div>
        <div className="items-start text-2xl max-md:hidden">{duration} minutes</div>
      </article>
      <BrainComponent 
        brainId={brain.id}
        subject={brain.subject}
        topic={brain.topic}
        name={brain.name}
        voice={brain.voice}
        style={brain.style}
        userName={user.firstName!} 
        userImage={user.imageUrl}
      />
    </main>
  );
};

export default BrainSession;
