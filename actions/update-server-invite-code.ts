"use server";

import { currentProfile } from "@/lib/current-profile";
import {v4 as uuidv4} from "uuid"
import db from "@/lib/db"

export const updateServerInviteCode = async (serverId : string | undefined)=>{
    try {
        const profile = await currentProfile();
        if (!profile) {
            throw new Error("Unauthorized");
        }
      
        if (!serverId) {
            throw new Error("Server ID Missing");
        }
      
          // Update the server invite code in the database
        const server = await db.server.update({
            where: {
              id: serverId,
              profileId: profile.id, // TODO : what if Moderator is refreshing the code ?
            },
            data: {
              inviteCode: uuidv4(),
            },
        });
      
        return server; // Server actions return JSON directly
        
    } catch (error) {
      console.error("[SERVER_ID]", error);
      throw new Error("Internal Error");
    }

}