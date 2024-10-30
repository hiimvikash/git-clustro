"use server";

import { currentProfile } from "@/lib/current-profile";
import db from "@/lib/db";

export async function onDeleteMember(
  memberId: string,
  serverId: string
) {
  try {
    if (!memberId || !serverId) {
      throw new Error("Member ID or Server ID is missing."); // This goes to the 'catch' block
    }
    const profile = await currentProfile();
    if (!profile) {
      throw new Error("UnAuthorized"); // This goes to the 'catch' block
    }
    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id, // Ensure only server owner can delete members
      },
      data: {
        members: {
          delete: {
              id: memberId,
              profileId: { not: profile.id }, // PREVENT Server owner cannot delete themself.
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
