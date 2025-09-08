import BrainForm from "@/components/BrainForm";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const NewBrain = async () => {
  const {userId} = await auth();
  if(!userId) redirect('/sign-in')
  return (
    <main className="min-lg:w-1/3 min-md:w-2/3 items-center justify-center h-full">
      <article className="w-full gap-4 flex flex-col">
        <h1>Brain Builder</h1>
        <BrainForm />
      </article>
    </main>
  );
};

export default NewBrain;
