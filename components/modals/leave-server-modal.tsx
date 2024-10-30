"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";

import { Button } from "@/components/ui/button";

import {  useTransition } from "react";

import { leaveServer } from "@/actions/leave-server";
import { useRouter } from "next/navigation";

export const LeaveServerModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const { server } = data
  const router = useRouter();

  // create a constant which is going to watch if modal is open or not.
  const isModalOpen = isOpen && type === "leaveServer";

  const [isPending, startTransition] = useTransition();

  const onLeave = () => {
    startTransition(async () => {
      try {
        await leaveServer(server?.id);
        onClose();
        router.refresh();
        router.push("/");
      } catch (error) {
        console.error("Error while leaving the server", error);
      }
    });
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center font-bold">
            Goodbye to '{server?.name}' ?
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Once you leave{" "}
            <span className="font-semibold text-indigo-500">
              {server?.name}
            </span>
            , you'll need an invite to return. Proceed?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="flex items-center justify-between">
            <Button disabled={isPending} variant="destructive" onClick={onLeave}>
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
