"use client";
 
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useEffect, useState } from "react";

import FileUpload from "@/components/file-upload";
import { createServerSchema } from "@/zod-schemas";
import { createServer } from "@/actions/create-server";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { editServer } from "@/actions/edit-server";




export const EditServerModal = () => {
  
    const router = useRouter();
    const {isOpen, onClose, type, data : {server}} = useModal();

    // create a constant which is going to watch if modal is open or not.
    const isModalOpen = isOpen && type === "editServer";

    

  const form = useForm({
    resolver: zodResolver(createServerSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });

  useEffect(()=>{
    if(server){
      form.setValue("name", server.name)
      form.setValue("imageUrl", server.imageUrl)
    }
  }, [server, form]);

  
  const onSubmit = async (values: z.infer<typeof createServerSchema>) => {
    const data = await editServer(values, server?.id);
    console.log(data);
    form.reset();
    router.refresh();
    onClose();
  };
  const isLoading = form.formState.isSubmitting;
  
  return (
    <Dialog open={isModalOpen} onOpenChange={()=>{onClose()}}>
      <DialogContent className="bg-white ☐ text-black p-0 overflow-hidden">
        
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Customize your server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Give your server a personality with a name and an image. You can
            always change it later.
          </DialogDescription>
        </DialogHeader>
        {/* ----CONTENT----- */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
              <div className="space-y-8 px-6">
                  <div className="flex item-center justify-center text-center">
                      <FormField
                          control={form.control}
                          name = "imageUrl"
                          render={({ field }) => (
                          <FormItem>
                            <FormControl>
                                <FileUpload
                                endpoint = "serverImage"
                                onChange = {field.onChange}
                                value = {field.value}
                                />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                  </div>
                {/* ------------------ */}
                    <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">Server Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter server name" 
                            disabled={isLoading}
                            className="bg-zinc-300/50 border-0 focus-visible:ring-0  text-black focus-visible:ring-offset-0"
                            {...field} />
                        </FormControl>
                        <FormDescription>
                            This is your public display server name.
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
              </div>

            <DialogFooter className="px-6 py-4 bg-gray-100">
                <Button disabled={isLoading} variant="primary">Save</Button>
            </DialogFooter>
          </form>
        </Form>
        {/* ----CONTENT----- */}
      </DialogContent>
    </Dialog>
  );
};
