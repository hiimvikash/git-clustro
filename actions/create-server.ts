"use server";

import * as z from "zod";
import { createServerSchema } from "@/zod-schemas";

import { currentProfile } from "@/lib/current-profile";
import {v4 as uuidv4} from "uuid"
import db from "@/lib/db"
import { MemberRole } from "@prisma/client";

export const createServer = async (values : z.infer<typeof createServerSchema>)=>{
    try {
        const validatedFields = createServerSchema.safeParse(values);

        if (!validatedFields.success) {
            return { error: "Invalid fields!" };
        }

        const profile = await currentProfile();
        if(!profile) return {error : "Unauthorized"};

        const { name, imageUrl} = validatedFields.data;

        const server = await db.server.create({
            data : {
                profileId : profile.id,
                name,
                imageUrl,
                inviteCode : uuidv4(),
                channels : {
                    create : [
                        {name : "general", profileId : profile.id}
                    ]
                },
                members : {
                    create : [
                        {profileId : profile.id, role: MemberRole.ADMIN }
                    ]
                }
            }
        })

        return {success : "Server Created"};
        
    } catch (error:any) {
        console.log(error.message);
    }
}