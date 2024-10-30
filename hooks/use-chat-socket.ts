import { useSocket } from "@/components/providers/socket-provider";
import { Member, Message, Profile } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type ChatSocketProps = {
  addKey: string;
  updateKey: string;
  queryKey: string;
};

type MessageWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile;
  };
};

export const useChatSocket = ({
  addKey,
  updateKey,
  queryKey,
}: ChatSocketProps) => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if(!socket) return;
    
    socket.on(updateKey, (updatedMessage: MessageWithMemberWithProfile) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0)
          return oldData;

        // here we are updating pages[]
        const newPages = oldData.pages.map((page: any) => {
          return {
            ...page,
            messages: page.messages.map(
              (message: MessageWithMemberWithProfile) => {
                if (message.id === updatedMessage.id) {
                  return updatedMessage;
                }
                return message;
              }
            ),
          };
        });

        return {
          ...oldData,
          pages: newPages,
        };
      });
    });
    socket.on(addKey, (newMessage: MessageWithMemberWithProfile) => {
      console.log("I am adding new message in cache in Query");
      queryClient.setQueryData([queryKey], (oldData: any) => {
        console.log("This is old data :", oldData);
        if (!oldData || !oldData.pages || oldData.pages.length === 0)
          return {
            pages: [{ messages: [newMessage], nextCursor: null}],
          };

        // here we are updating making newPages[]
        const newPages = [...oldData.pages]; // phle ka sab daldo

        newPages[0] = {
          ...newPages[0],
          messages: [newMessage, ...newPages[0].messages],
        };

        return {
          ...oldData,
          pages: newPages,
        };
      });
    });

    return () => {
      socket.off(addKey);
      socket.off(updateKey);
    };
  }, [socket, queryClient, addKey, updateKey, queryKey]);
};

/**
 * 
    {
        pages : [
            {messages : [{}, {}, ... 10, {}], nextCursor : "ksdbfkjbsdbf0925798239i420"},
            {messages : [{}, {}, ... 10], nextCursor : "ksdbfkjbsdbf0925798239i420"}
            ....
        ]
    }
 */
