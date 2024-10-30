"use client";

import { UploadDropzone } from "@/lib/uploadthing";

import { FileIcon, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface FUprops {
  endpoint: "serverImage" | "messageFile";
  onChange: (url?: string) => void;
  value: string;
}

const FileUpload = ({ endpoint, onChange, value }: FUprops) => {
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("");
  const [fileUrl, setFileUrl] = useState("");

  if (value && (fileType === "image" || value.split("@")[0] === "I")) {
    return (
      <>
        <div className="relative h-20 w-20 border border-zinc-300 rounded-full shadow-2xl">
          <Image fill src={fileUrl || value.split("@")[1]} alt="upload" className="rounded-full" />
          <button
            onClick={() => onChange("")}
            className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </>
    );
  }

  if (value && fileType !== "image") {
    return (
      <div
        className="relative flex items-center p-2 mt-2 rounded-md bg-background/10"
      >
        <FileIcon
          className="h-10 w-10 fill-indigo-200 stroke-indigo-400"
        />
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover: underline"
        >
          {fileName}
        </a>
        <button
            onClick={() => onChange("")}
            className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
      </div>
    );
  }

  return (
    <div>
      <UploadDropzone
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
          setFileType(res?.[0].type.split("/")[0]); // {image/jpg, application/pdf}
          setFileName(res?.[0].name);
          setFileUrl(res?.[0].url)

          if(res?.[0].type.split("/")[0] === "image"){
            onChange(`I@${res?.[0].url}`);
          }
          else {
            onChange(`${res?.[0].name}@P@${res?.[0].url}`); //fileName@Type@url
          }
        }}
        onUploadError={(error: Error) => {
          console.log(error.message);
          alert(error.message);
        }}
        className="cursor-pointer text-indigo-400"
      />
    </div>
  );
};

export default FileUpload;
