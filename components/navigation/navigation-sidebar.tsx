import { currentProfile } from "@/lib/current-profile";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area"

import NavigationAction from "@/components/navigation/navigation-action";
import { NavigationItem } from "@/components/navigation/navigation-item"
import { ModeToggle } from "@/components/theme-toggle";
import { UserButton } from "@clerk/nextjs";


const NavigationSideBar = async () => {
  const profile = await currentProfile();
  if (!profile) {
    return redirect("/");
  }

  // Here we are finding all the servers this profile is a part of.
  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });


  return (
    <div className="space-y-4 flex flex-col items-center h-full text-primary w-full bg-[#e3e5e8] dark:bg-[#1E1F22] py-3">
         <NavigationAction /> {/*This is server creation button */}
        <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto"/>
        {/* This will render all the servers this profile is a partOF */}
        <ScrollArea className="flex-1 w-full">
           {
            servers.map((server)=>(
                <div key={server.id} className="mb-5">
                    <NavigationItem id = {server.id} image = {server.imageUrl} name = {server.name}/> {/* this component will render all the servers. */}
                </div>
            ))
           }
        </ScrollArea>
        <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
            <ModeToggle />
            <UserButton />
        </div>
    </div>
  )
};

export default NavigationSideBar;
