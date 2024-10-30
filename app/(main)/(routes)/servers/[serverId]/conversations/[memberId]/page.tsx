import { currentProfile } from "@/lib/current-profile";
import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import { getOrCreateConversation } from "@/lib/conversation";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatMessages } from "@/components/chat/chat-messages";
import { ChatInput } from "@/components/chat/chat-input";
import { MediaRoom } from "@/components/media-room";

interface PersonalConversationProps {
  params: {
    memberId: string;
    serverId: string;
  };
  searchParams: {
    video?: boolean;
  };
}

const PersonalConversation = async ({
  params,
  searchParams: { video },
}: PersonalConversationProps) => {
  const profile = await currentProfile();
  if (!profile) return auth().redirectToSignIn();

  // currentLoggedInMember 👇🏼
  const currentMember = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    },
  });
  if (!currentMember) {
    return redirect("/");
  }

  //   Here we are finding both the combination(Iinitiated or clickedMemberInitiated) of conversationExistence in DB. if no one initiated then I will initiate a conversation.
  const conversation = await getOrCreateConversation(
    currentMember.id,
    params.memberId
  );
  if (!conversation) redirect(`/servers/${params.serverId}`);

  const { memberOne, memberTwo } = conversation;
  const otherMember =
    profile.id === memberOne.profileId ? memberTwo : memberOne;

  return (
    <div className="bg-white ☐ dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        imageUrl={otherMember.profile.imageUrl || undefined}
        name={otherMember.profile.name}
        serverId={params.serverId}
        type="conversation"
      />
      {video && <MediaRoom chatId={conversation.id} video audio />}
      {!video && (
        <>
          <ChatMessages
            member={currentMember}
            name={otherMember.profile.name}
            chatId={conversation.id}
            type="conversation"
            apiUrl="/api/direct-messages" // GET
            socketUrl="/api/socket/direct-messages"
            socketQuery={{
              conversationId: conversation.id,
            }}
            paramKey="conversationId"
            paramValue={conversation.id}
          />
          <ChatInput
            name={otherMember.profile.name}
            type="conversation"
            apiUrl="/api/socket/direct-messages"
            query={{ conversationId: conversation.id }}
          />
        </>
      )}
    </div>
  );
};

export default PersonalConversation;
