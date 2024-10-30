"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Copy, CopyCheck, RefreshCw } from "lucide-react";
import { useOrigin } from "@/hooks/use-origin";
import {  useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { updateServerInviteCode } from "@/actions/update-server-invite-code";

export const InviteModal = () => {
  const { isOpen, onClose, onOpen, type, data } = useModal();
  const origin = useOrigin();

  // create a constant which is going to watch if modal is open or not.
  const isModalOpen = isOpen && type === "invite";
  // --------------------------------------------
  const { server } = data;
  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;
  const [copied, setCopied] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };
  // ---------------------------
  const [isPending, startTransition] = useTransition();


  const onNew = () => {
    startTransition(async () => {
      try {
        const updatedServer = await updateServerInviteCode(server?.id);
        onOpen("invite", { server: updatedServer });
      } catch (error) {
        console.error("Error updating invite code:", error);
      }
    });
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white ☐ text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Invite Friends
          </DialogTitle>
        </DialogHeader>

        <div className="p-6">
          <Label className="uppercase text-xs font-bold text-zing-500 dark:text-secondary/70">
            Server invite link
          </Label>

          <div className="flex items-center mt-2 gap-x-2">
            <Input
              className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
              value={inviteUrl}
              disabled={isPending}
            />
            <Button size="icon" onClick={onCopy} disabled={isPending}>
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>

          <Button
            variant="link"
            size="sm"
            className="text-xs ☐ text-zinc-500 mt-4"
            onClick={onNew}
          >
            Generate a new link
            <RefreshCw className={cn(
              "w-4 h-4 ml-2",
              isPending && "animate-spin"
            )} />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
