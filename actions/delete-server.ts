"use server";

import { currentProfile } from "@/lib/current-profile";
import db from "@/lib/db";

export async function deleteServer(serverId?: string) {
  try {
    if (!serverId) {
      throw new Error("Server ID is missing."); // This goes to the 'catch' block
    }
    const profile = await currentProfile();
    if (!profile) {
      throw new Error("UnAuthorized"); // This goes to the 'catch' block
    }
    const server = await db.server.delete({
      where: {
        id: serverId,
        profileId: profile.id // only admin can delete
      }
    });

    // Return the updated server as JSON
    return server;
  } catch (error) {
    console.error("[SERVER_ID]", error);
    throw new Error("Internal Error");
  }
}
