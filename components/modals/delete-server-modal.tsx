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

import { useTransition } from "react";

import { leaveServer } from "@/actions/leave-server";
import { useRouter } from "next/navigation";
import { deleteServer } from "@/actions/delete-server";

export const DeleteServerModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const { server } = data;
  const router = useRouter();

  // create a constant which is going to watch if modal is open or not.
  const isModalOpen = isOpen && type === "deleteServer";

  const [isPending, startTransition] = useTransition();

  const onDelete = () => {
    startTransition(async () => {
      try {
        await deleteServer(server?.id);
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
          <DialogTitle className="text-2xl  text-center font-bold">
          Confirm Server Deletion
          </DialogTitle>
          <DialogDescription className=" text-zinc-500 text-center">
          Once deleted, <span className="font-semibold text-rose-500">{server?.name}</span> and everything within it will be permanently deleted and cannot be reversed.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="pt-3">
          <div className="flex items-center justify-center w-full">
            <Button
              disabled={isPending}
              variant="destructive"
              onClick={onDelete}
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
