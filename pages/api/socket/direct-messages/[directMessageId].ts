import { currentProfilePages } from "@/lib/current-profile-pages";
import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";
import db from "@/lib/db";
import { MemberRole } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "DELETE" && req.method !== "PATCH") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const profile = await currentProfilePages(req);
    const { content } = req.body;
    const { conversationId, directMessageId } = req.query;
    if (!profile) return res.status(401).json({ error: "Unauthorized" });
    if (!conversationId) return res.status(400).json({ error: "Conversation ID missing" });


    // The user who is messaging is PART OF conversation ?
    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId as string,
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
      include: {
        memberOne: true,
        memberTwo:true
      },
    });
    if(!conversation) return res.status(404).json({ message: "conversation not found" });
    
    const editingMember = conversation.memberOne.profileId === profile.id ? conversation.memberOne : conversation.memberTwo
    if (!editingMember) return res.status(404).json({ message: "Member not found" });

    let message = await db.directMessage.findFirst({
      where: {
        id: directMessageId as string,
        conversationId : conversationId as string
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!message || message.deleted)
      return res.status(404).json({ message: "Message not found" });

    const isMessageOwner = message.memberId === editingMember.id;
    const isAdmin = editingMember.role === MemberRole.ADMIN;
    const isModerator = editingMember.role === MemberRole.MODERATOR;
    const canModify = isMessageOwner || isAdmin || isModerator;

    if (!canModify) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (req.method === "DELETE") {
      message = await db.directMessage.update({
        where: {
          id: directMessageId as string,
        },
        data: {
          fileUrl: null,
          content: "This message has been deleted.",
          deleted: true,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }
    if (req.method === "PATCH") {
        if(!isMessageOwner){
            return res.status(401).json({ error: "Unauthorized" });
        }
      message = await db.directMessage.update({
        where: {
          id: directMessageId as string,
        },
        data: {
            content
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    

    const updateKey = `chat:${conversationId}:messages:update`;
    res?.socket?.server?.io?.emit(updateKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log(" [DIRECT_MESSAGES_POST]", error);
    return res.status(500).json({ message: "Internal Error" });
  }
}
