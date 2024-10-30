"use server";

import * as z from "zod";
import { createServerSchema } from "@/zod-schemas";

import { currentProfile } from "@/lib/current-profile";
import {v4 as uuidv4} from "uuid"
import db from "@/lib/db"
import { MemberRole } from "@prisma/client";

export const editServer = async (values : z.infer<typeof createServerSchema>, serverId? : string)=>{
    try {
        const validatedFields = createServerSchema.safeParse(values);

        if (!validatedFields.success) {
            return { error: "Invalid fields!" };
        }

        const profile = await currentProfile();
        if(!profile) return {error : "Unauthorized"};

        const { name, imageUrl} = validatedFields.data;

        const server = await db.server.update({
            where : {
                id : serverId
            },
            data : {
                name,
                imageUrl,
            }
        })

        return {success : "Server Updated"};
        
    } catch (error:any) {
        console.log(error.message);
    }
}