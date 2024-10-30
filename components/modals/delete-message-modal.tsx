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
import qs from "query-string"
import { Button } from "@/components/ui/button";

import { useTransition } from "react";


import axios from "axios";


export const DeleteMessageModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const { apiUrl, query } = data;


  // create a constant which is going to watch if modal is open or not.
  const isModalOpen = isOpen && type === "deleteMessage";

  const [isPending, startTransition] = useTransition();

  const onDelete = () => {
    startTransition(async () => {
      try {
        const url = qs.stringifyUrl({
          url: apiUrl || "",
          query
        });
        await axios.delete(url);
        onClose();
      } catch (error) {
        console.log(error);
      }
    });
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl  text-center font-bold">
          Confirm Message Deletion
          </DialogTitle>
          <DialogDescription className=" text-zinc-500 text-center">
          Once deleted, <span className="font-semibold text-rose-500">message</span> will be permanently deleted and cannot be reversed.
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
