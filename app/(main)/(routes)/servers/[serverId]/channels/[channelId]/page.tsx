import { currentProfile } from "@/lib/current-profile";
import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { ChannelType } from "@prisma/client";
import { MediaRoom } from "@/components/media-room";

interface ChannelPageProps {
  params: {
    serverId: string;
    channelId: string;
  };
}

const ChannelPage = async ({ params }: ChannelPageProps) => {
  const profile = await currentProfile();
  if (!profile) {
    return auth().redirectToSignIn();
  }

  const channel = await db.channel.findUnique({
    where: {
      id: params.channelId,
    },
  });

  const member = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id, // There can be many member with this profileId but we want to find the member which is in this server.
    },
  });

  if (!channel || !member) return redirect("/");
  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        serverId={params.serverId}
        name={channel.name}
        type="channel"
      />
      {channel.type === ChannelType.TEXT && (
        <>
          <ChatMessages
            member={member} // loggedIn member
            name={channel.name}
            chatId={channel.id}
            type="channel"
            apiUrl="/api/messages"
            socketUrl="/api/socket/messages"
            socketQuery={{
              channelId: channel.id,
              serverId: channel.serverId,
            }}
            paramKey="channelId"
            paramValue={channel.id}
          />
          <ChatInput
            name={channel.name}
            type="channel"
            apiUrl="/api/socket/messages"
            query={{ channelId: channel.id, serverId: channel.serverId }}
          />
        </>
      )}
      {channel.type === ChannelType.AUDIO && (
        <MediaRoom
        chatId={channel.id}
        video={false}
        audio={true}
        />
      )}
      {channel.type === ChannelType.VIDEO && (
        <MediaRoom
        chatId={channel.id}
        video={true}
        audio={true}
        />
      )}

    </div>
  );
};

export default ChannelPage;
