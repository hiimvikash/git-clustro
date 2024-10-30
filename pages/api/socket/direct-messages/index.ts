import { currentProfilePages } from "@/lib/current-profile-pages";
import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";
import db from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {

    const profile = await currentProfilePages(req);
    const { content, fileUrl } = req.body;
    const { conversationId } = req.query;
    if (!profile) return res.status(401).json({ error: "Unauthorized" });
    if (!content) return res.status(400).json({ error: "Content missing" });
    if (!conversationId) return res.status(400).json({ message: "conversation Id missing" });


    const conversation = await db.conversation.findFirst({
      where : {
        id : conversationId as string,
        OR : [
          {
            memberOne : {
              profileId : profile.id
            }
          },
          {
            memberTwo : {
              profileId : profile.id
            }
          }
        ]
      },
      include : {
        memberOne : {
          include : {
            profile : true
          }
        },
        memberTwo : {
          include : {
            profile : true
          }
        }
      }
    })

    if(!conversation) return res.status(404).json({ message: "conversation not found" });
    
    const senderMember = conversation.memberOne.profileId === profile.id ? conversation.memberOne : conversation.memberTwo


    if (!senderMember)
      return res.status(404).json({ message: "Member not found" });

    console.log("message sending...")
    const message = await db.directMessage.create({
      data: {
        content,
        fileUrl,
        conversationId: conversationId as string,
        memberId: senderMember.id,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });
    console.log("message sent")

    const addKey = `chat:${conversationId}:messages`;
    res?.socket?.server?.io?.emit(addKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log(" [DIRECTMESSAGES_POST]", error);
    return res.status(500).json({ message: "Internal Error" });
  }
}
