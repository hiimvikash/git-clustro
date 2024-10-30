// ONLY FOR ADMINS

"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { ServerWithMembersWithProfiles } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserAvator } from "@/components/user-avatar";
import {
  Check,
  Gavel,
  Loader2,
  MoreVertical,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
} from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MemberRole } from "@prisma/client";
import { onRoleChange } from "@/actions/change-member-role";
import { useRouter } from "next/navigation";
import { onDeleteMember } from "@/actions/delete-member";


const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
  ADMIN: <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />,
};

export const ManageMemberModal = () => {
  const router = useRouter();
  const { isOpen, onClose, onOpen, type, data } = useModal();

  // create a constant which is going to watch if modal is open or not.
  const isModalOpen = isOpen && type === "members";
  const { server } = data as { server: ServerWithMembersWithProfiles };
  // -----------------------------------------------------------------------

  const [loadingId, setLoadingId] = useState("");

  const handleRoleChange = async (memberId: string, role: MemberRole, serverId: string) =>{
    try {
      setLoadingId(memberId);
      const updatedServer = await onRoleChange(memberId, role, serverId);
      console.log(updatedServer);
      onOpen("members", { server: updatedServer });
      router.refresh();
    } catch (error) {
      console.error("Error updating member role:", error);
    } finally {
      setLoadingId("");
    }
  }
  const handleKick = async (memberId: string, serverId: string) =>{
    try {
      setLoadingId(memberId);
      const updatedServer = await onDeleteMember(memberId, serverId);
      console.log(updatedServer);
      onOpen("members", { server: updatedServer });
      router.refresh();
    } catch (error) {
      console.error("Error deleting member role:", error);
    } finally {
      setLoadingId("");
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Manage Members
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            {server?.members?.length} Members
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="mt-8 max-h-[420px] pr-6">
          {server?.members?.map((member) => (
            <div key={member.id} className="flex items-center gap-x-2 mb-6">
              <UserAvator src={member.profile.imageUrl || undefined} />

              {/* ------------------------------------------------------------------ */}
              <div className="flex flex-col gap-y-1">
                <div className="flex items-center text-sm font-semibold">
                  {member.profile.name}
                  {roleIconMap[member.role]}
                </div>
                <p className="text-xs text-zinc-500">{member.profile.email}</p>
              </div>
              {/* ------------------------------------------------------------------ */}
              {server.profileId !== member.profileId &&
                loadingId !== member.id && (
                  <div className="ml-auto">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreVertical className="h-4 w-4 text-zinc-500" />
                      </DropdownMenuTrigger>

                      <DropdownMenuContent side="left">
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className="flex items-center">
                            <ShieldQuestion className="w-4 h-4 mr-2" />
                            <span>Role</span>
                          </DropdownMenuSubTrigger>

                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem onClick={()=>{
                                if(member.role !== "GUEST"){
                                  handleRoleChange(member.id, "GUEST", server.id);
                                }
                              }}>
                                <Shield className="h-4 w-4 mr-2" />
                                Guest
                                {member.role === "GUEST" && (
                                  <Check className="h-4 w-4 ml-auto" />
                                )}
                              </DropdownMenuItem>


                              <DropdownMenuItem onClick={()=>{
                                if(member.role !== "MODERATOR"){
                                  handleRoleChange(member.id, "MODERATOR", server.id);
                                }
                              }}>
                                <ShieldCheck className="h-4 w-4 mr-2" />
                                Moderator
                                {member.role === "MODERATOR" && (
                                  <Check className="h-4 w-4 ml-auto" />
                                )}
                              </DropdownMenuItem>

                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator/>

                        <DropdownMenuItem onClick={()=> {handleKick(member.id, server.id)}}>
                          <Gavel className="h-4 w-4 mr-2"/>
                          Kick
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}

                {
                  loadingId === member.id && (
                    <Loader2 className="animate-spin text-zinc-500 ml-auto w-4 h-4"/>
                  )
                }
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
