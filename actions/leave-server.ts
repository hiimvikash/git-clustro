"use server";

import { currentProfile } from "@/lib/current-profile";
import db from "@/lib/db";

export async function leaveServer(serverId?: string) {
  try {
    if (!serverId) {
      throw new Error("Server ID or Member ID is missing."); // This goes to the 'catch' block
    }
    const profile = await currentProfile();
    if (!profile) {
      throw new Error("UnAuthorized"); // This goes to the 'catch' block
    }
    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: {
          not : profile.id
        }, // Creator of server can't leave the server

        members : {
          some : {
            profileId : profile.id
          }
        } // Here we are confirming : User who is living the server is a member of server
      },
      data: {
        members: {
          deleteMany: { // used "deleteMany" bcz if we use "delete" then we need to provide unique parameter for deleting.
              profileId: profile.id // only we can delete ourselves from the server -> LEAVE SERVER
          },
        },
      },
    });

    // Return the updated server as JSON
    return server;
  } catch (error) {
    console.error("[SERVER_ID]", error);
    throw new Error("Internal Error");
  }
}
