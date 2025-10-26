import BrainForm from "@/components/BrainForm";
import { newBrainPermissions } from "@/lib/actions/brains.actions";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const NewBrain = async () => {
  const {userId} = await auth();
  if(!userId) redirect('/sign-in')

    const canCreateBrain = await newBrainPermissions();
  return (
    <main className="lg:w-1/3 md:w-2/3 items-center justify-center h-full">
      {canCreateBrain ? (

      <article className="w-full gap-4 flex flex-col">
        <h1>Brain Builder</h1>
        <BrainForm />
      </article>
      ) : (
        <article className="companion-limit">
          <Image src={"/images/limit.svg"} alt="SnowBrains Limit Reached" width={360} height={230}/>
          <div className="cta-badge">
            Upgrade your plan
          </div>
          <h1>You've reached your limit</h1>
          <p>Upgrade to a Pro plan to create more brains.</p>
          <Link href={"/subscription"} className="btn-primary w-full justify-center">Upgrade My Plan</Link>
        </article>
      )}
    </main>
  );
};

export default NewBrain;
