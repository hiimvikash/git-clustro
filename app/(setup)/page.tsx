import { initialProfile } from "@/lib/initial-profile";
import db from "@/lib/db";
import { redirect } from 'next/navigation'
import { InitialModal } from "@/components/modals/initial-modal";


export default async function SetupPage() {
  // this fun() will return profile model for a clerkUser from DB.
  const profile = await initialProfile();

  // If you have a user profile with a specific profile.id and want to find out if this user is a member of any server, this query will return the first matching server where the user is a member.
  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });


  if(server) return redirect(`/servers/${server.id}`);
  return <InitialModal/>
}
