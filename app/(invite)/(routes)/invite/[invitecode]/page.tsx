import { currentProfile } from "@/lib/current-profile";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import db from "@/lib/db";

interface InviteCodePageProps {
    params : {
        invitecode : string
    }
}


const InviteCodePage = async ({ params } : InviteCodePageProps) => {

    // Check 1 : if user is signedIn or not before using inviteURL.
    const profile = await currentProfile();
    if (!profile) return auth().redirectToSignIn();

    // Check 2 : if user doesn't have invite code then return them to ROOTPAGE.
    if(!params.invitecode) return redirect("/");

    // Check 3 : if user is trying to join the server which he is already a part of.
        // this will check the members of particularServer(via inviteCode) which user is trying to join, and will find if [anyMember of that server] is === [Member who is trying to join].
    const existingServer = await db.server.findFirst({
        where : {
            inviteCode : params.invitecode,
            members : {
                some : {
                    profileId : profile.id
                }
            }
        }
    })
    if(existingServer) return redirect(`/servers/${existingServer.id}`)
      
        
// Now at the end Just add this profile inside the memmber[] of the server.
const updatedServerWithNewMember = await db.server.update({
    where : {
        inviteCode : params.invitecode
    }, 
    data : {
        members : {
            create : [{profileId : profile.id}]
        }
    }
})
if(updatedServerWithNewMember) return redirect(`/servers/${updatedServerWithNewMember.id}`)


    return ( 
        <div>
            Hello Invite!
        </div>
     );
}
 
export default InviteCodePage;