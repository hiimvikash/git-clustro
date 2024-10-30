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

import FileUpload from "@/components/file-upload";
import { messageFileSchema } from "@/zod-schemas";
import { createServer } from "@/actions/create-server";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import qs from "query-string";
import axios from "axios";




export const MessageFileModal = () => {
  
    const router = useRouter();
    const {isOpen, onClose, type, data} = useModal();
    const {apiUrl, query} = data;

    // create a constant which is going to watch if modal is open or not.
    const isModalOpen = isOpen && type === "messageFile";

    

  const form = useForm({
    resolver: zodResolver(messageFileSchema),
    defaultValues: {
      fileUrl : ""
    },
  });

  
  const onSubmit = async (values: z.infer<typeof messageFileSchema>) => {

    try {
      const url = qs.stringifyUrl({
        url : apiUrl || "",
        query
      })
      await axios.post(url, {
        ...values,
        content : values.fileUrl
      })
      form.reset();
      router.refresh();
      handleClose();
      
    } catch (error) {
      console.log(error);
    }

  };
  const isLoading = form.formState.isSubmitting;

  const handleClose = ()=>{
    form.reset();
    onClose();
  }
  
  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white ☐ text-black p-0 overflow-hidden">
        
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Add an attachment
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Send a file as a message.
          </DialogDescription>
        </DialogHeader>
        {/* ----CONTENT----- */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
              <div className="space-y-8 px-6">
                  <div className="flex item-center justify-center text-center">
                      <FormField
                          control={form.control}
                          name = "fileUrl"
                          render={({ field }) => (
                          <FormItem>
                            <FormControl>
                                <FileUpload
                                endpoint = "messageFile"
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

              </div>

            <DialogFooter className="px-6 py-4 bg-gray-100">
                <Button disabled={isLoading} variant="primary">Send</Button>
            </DialogFooter>
          </form>
        </Form>
        {/* ----CONTENT----- */}
      </DialogContent>
    </Dialog>
  );
};
