"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,

  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createChannelSchema } from "@/zod-schemas";
import { useParams, useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { ChannelType } from "@prisma/client";

import { useEffect } from "react";
import { editChannel } from "@/actions/edit-channel";

export const EditChannelModal = () => {
  const router = useRouter();
  const params = useParams();

  const { isOpen, onClose, type, data } = useModal();
  const { channel, server} = data;


  // create a constant which is going to watch if modal is open or not.
  const isModalOpen = isOpen && type === "editChannel";

  const form = useForm({
    resolver: zodResolver(createChannelSchema),
    defaultValues: {
      name: "",
      type: channel?.type || ChannelType.TEXT,
    },
  });

  useEffect(()=>{
    if(channel){
      form.setValue("type", channel.type);
      form.setValue("name", channel.name);  
    }
  }, [ form, isModalOpen])

  const onSubmit = async (values: z.infer<typeof createChannelSchema>) => {
    const data = await editChannel(values, server?.id, channel?.id );
    form.reset();
    router.refresh();
    onClose();
  };
  const isLoading = form.formState.isSubmitting;

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Modify Channel
          </DialogTitle>
        </DialogHeader>
        {/* ----CONTENT----- */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
                {/* --------------------------------------------------- */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                        Channel Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter channel name"
                          disabled={isLoading}
                          className="bg-zinc-300/50 border-0 focus-visible:ring-0  text-black focus-visible:ring-offset-0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* ---------------------------------------------------- */}
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Channel Type</FormLabel>
                      <Select disabled={isLoading} onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none">
                            <SelectValue placeholder="Select a channel type" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          {
                            Object.values(ChannelType).map((type) => (
                              <SelectItem key={type} value={type} className="capitalize">
                                {type.toLowerCase()}
                              </SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>

            <DialogFooter className="px-6 py-4 bg-gray-100">
              <Button disabled={isLoading} variant="primary">
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
        {/* ----CONTENT----- */}
      </DialogContent>
    </Dialog>
  );
};
