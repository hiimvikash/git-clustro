"use server";

import * as z from "zod";
import { createChannelSchema } from "@/zod-schemas";

import { currentProfile } from "@/lib/current-profile";
import { v4 as uuidv4 } from "uuid";
import db from "@/lib/db";
import { MemberRole } from "@prisma/client";

export const createChannel = async (
  values: z.infer<typeof createChannelSchema>,
  serverId: string
) => {
  try {
    const validatedFields = createChannelSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    const profile = await currentProfile();
    if (!profile) return { error: "Unauthorized" };

    const { name, type } = validatedFields.data;

    const server = await db.server.update({
        // update the server where id==serverId only if currentLoggedIn user is a member(with ADMIN or MODERATOR) of that server.
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },

      data: {
        channels : {
            create : {
                profileId : profile.id,
                name,
                type
            }
        }
      },
    });

    return { success: "Channel Created" };
  } catch (error: any) {
    console.log(error.message);
  }
};
