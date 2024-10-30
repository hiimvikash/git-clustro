import { currentProfile } from "@/lib/current-profile";
import { DirectMessage, Message } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db"

const MESSAGES_BATCH = 10;
export async function GET(req: NextRequest) {
  try {
    const profile = await currentProfile();
    const cursor   = req.nextUrl.searchParams.get("cursor");
    const conversationId   = req.nextUrl.searchParams.get("conversationId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!conversationId) {
      return new NextResponse("Channel ID is missing", { status: 400 });
    }

    let messages : DirectMessage[] = [];
    if(cursor){
        messages = await db.directMessage.findMany({
            take: MESSAGES_BATCH,        // 1. Number of messages to fetch.
            skip: 1,                      // 2. Skip the first message of the cursor to avoid duplicates.
            cursor: {                     // 3. Cursor-based pagination.
              id: cursor,                 // Use the `id` as the cursor point.
            },
            where: {                      // 4. Filter messages by channelId.
              conversationId,
            },
            include: {                    // 5. Include related member and profile data.
              member: {                   // Include the member who sent the message.
                include: {                // Also include the profile of that member.
                  profile: true,
                },
              },
            },
            orderBy: {                    // 6. Order messages by creation time.
              createdAt: "desc",          // Sort messages in descending order of `createdAt`.
            },
          });
    }
    else {
        messages = await db.directMessage.findMany({
            take: MESSAGES_BATCH,        // 1. Number of messages to fetch.
            where: {                      // 4. Filter messages by channelId.
              conversationId,
            },
            include: {                    // 5. Include related member and profile data.
              member: {                   // Include the member who sent the message.
                include: {                // Also include the profile of that member.
                  profile: true,
                },
              },
            },
            orderBy: {                    // 6. Order messages by creation time.
              createdAt: "desc",          // Sort messages in descending order of `createdAt`.
            },
          });
    }
    let nextCursor = null;
    if(messages.length === MESSAGES_BATCH)
    {
        nextCursor = messages[MESSAGES_BATCH - 1].id;
    }

    return NextResponse.json({
        messages,
        nextCursor
    })
  } catch (error) {
    console.log(" [DIRECT_MESSAGES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

