import { ChannelType } from "@prisma/client";
import * as z from "zod" 

export const createServerSchema = z.object({
    name : z.string().min(1, {
      message: "Server name is required.",
    }),
  
    imageUrl : z.string().min(1, {
      message: "Server image is required.",
    }),
  });
export const messageFileSchema = z.object({
    fileUrl : z.string().min(1, {
      message: "Server image is required.",
    }),
  });

  export const createChannelSchema = z.object({
    name : z.string().min(1, {
      message: "Channel name is required.",
    }).refine(name => name.toLowerCase() !== "general", {
      message : "Channel name cannot be 'general'"
    }),
    type : z.nativeEnum(ChannelType)
  });

  export const editChatItemSchema = z.object({
    content : z.string().min(1)
  })