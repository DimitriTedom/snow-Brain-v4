import BrainList from "@/components/BrainList";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getUserBrains, getRecentSessionBrains, getUserSessionCount } from "@/lib/actions/brains.actions";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";

import React from "react";

const Profile = async () => {
  const user = await currentUser()
  if (!user) redirect('/sign-in');

  const brains = await getUserBrains();
  const sessionHistory = await getRecentSessionBrains(20);
  const sessionCount = await getUserSessionCount();

  return (
    <main className="lg:w-3/4">
      <section className="flex justify-between gap-4 max-sm:flex-col items-center">
      <div className="flex gap-4 items-center">

      </div>
        <Image src={user.imageUrl} alt={user.firstName!} width={100} height={100} />
        <div className="flex flex-col gap-2">
          <h1 className="font-bold text-2">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-sm text-muted-foreground">
            {user.emailAddresses[0].emailAddress}
          </p>
        </div>

        <div className="flex gap-4">
          <div className="border border-black rounded-lg p-3 gap-2 flex flex-col h-fit">
            <div className="flex gap-2 items-center">
              <Image src={"/icons/check.svg"} alt="Check icon" width={22} height={22} />
              <p className="text-2xl font-bold">{sessionCount}</p>
            </div>
            <div>Lessons Completed</div>
          </div>

                    <div className="border border-black rounded-lg p-3 gap-2 flex flex-col h-fit">
            <div className="flex gap-2 items-center">
              <Image src={"/icons/cap.svg"} alt="cap icon" width={22} height={22} />
              <p className="text-2xl font-bold">{brains.length}</p>
            </div>
            <div>Brains Created</div>
          </div>
        </div>
      </section>
      <Accordion type="multiple" >
        <AccordionItem value="recent">
          <AccordionTrigger className="text-2xl font-bold">Recent Sessions</AccordionTrigger>
          <AccordionContent>
          <BrainList title="Recent Sessions" brains={sessionHistory}/>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="brains">
          <AccordionTrigger className="text-2xl font-bold">
          My Brains {`(${brains.length})`}
          </AccordionTrigger>

          <AccordionContent title="My Brains">
            <BrainList title="My Brains" brains={brains}/>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </main>
  );
};

export default Profile;
