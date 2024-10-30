"use server";

import { currentProfile } from "@/lib/current-profile";
import db from "@/lib/db";
import { MemberRole } from "@prisma/client";

export async function onDeleteChannel(
  serverId: string | undefined,
  channelId: string | undefined
) {
  try {
    if (!channelId || !serverId) {
      throw new Error("Channel ID or Server ID is missing."); // This goes to the 'catch' block
    }
    const profile = await currentProfile();
    if (!profile) {
      throw new Error("UnAuthorized"); // This goes to the 'catch' block
    }
    const server = await db.server.update({
      where: {
        id: serverId,
        members : {
          some : {
            profileId : profile.id,
            role : {
              in : [MemberRole.ADMIN , MemberRole.MODERATOR]
            } 
          }
        }
      },
      data: {
        channels: {
          delete: {
              id: channelId,
              name: { not: "general" },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
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
