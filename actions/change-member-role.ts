"use server";

import { currentProfile } from "@/lib/current-profile";
import db from "@/lib/db";
import { MemberRole } from "@prisma/client";

export async function onRoleChange(
  memberId: string,
  role: MemberRole,
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
        profileId: profile.id, // this will make sure that only admins are able to change role.
      },
      data: {
        members: {
          update: {
            where: {
              id: memberId,
              profileId: { not: profile.id }, // Server owner cannot change there role.
            },
            data: { role },
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
