import { currentProfile } from "@/lib/current-profile";
import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import { ServerSidebar } from "@/components/server/server-sidebar";

const ServerIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { serverId: string };
}) => {
  const profile = await currentProfile();

  if (!profile) {
    return auth().redirectToSignIn();
  }

  // Here we are finding server with serverId -> only if current profile is a member of that server [so that not any one can loads the content of server]
  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if(!server) {
    return redirect("/");
  }

  return (
    <div className="h-full">
        {/* Divide the above div in 2 part : */}
        <div className="h-full hidden md:flex w-60 z-20 flex-col fixed inset-y-0">
            <ServerSidebar serverId = {params.serverId}/>
        </div>

        <main className="h-full md:pl-60">
            {children}
        </main>
        
    </div>
)};

export default ServerIdLayout;
