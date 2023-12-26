"use client";

import React from "react";
import ChatSection from "./ChatSection";
import ChatInputSection from "./ChatInputSection";
import { trpc } from "@/app/_trpc/trpc-client";
import { ChevronLeft, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ChatContext, ChatContextProvider } from "@/store/ChatContext";

interface ChatSectionProps {
  fileId: string;
}

const ChatContainer = ({ fileId }: ChatSectionProps) => {
  const { data, isLoading } = trpc.getFileUploadStatus.useQuery(
    { fileId },
    {
      retry: false,
      // refetchInterval: (data) =>
      //   data === "DONE" || data === "FAILED" ? false : 500,
    }
  );

  if (isLoading) {
    return (
      <div className="relative min-h-[100vh-1rem] h-full w-full">
        <div className="flex flex-col h-full w-full items-center justify-center">
          <Loader2 className="text-primary animate-spin mb-2" />
          <p className="font-semibold">Loading...</p>
          <p className="font-light">We're preparing your PDF.</p>
        </div>
        <ChatInputSection disableStatus={isLoading} />
      </div>
    );
  }
  if (data?.status === "PROCESSING") {
    return (
      <div className="relative max-h-[100vh-10rem] h-full w-full ">
        <div className="flex flex-col h-full w-full items-center justify-center">
          <Loader2 className="text-primary animate-spin mb-2" />
          <p className="font-semibold">Loading...</p>
          <p className="font-light">Almost done.</p>
        </div>
        <ChatInputSection disableStatus={isLoading} />
      </div>
    );
  }
  if (data?.status === "FAILED") {
    return (
      <div className="relative min-h-[100vh-1rem] h-full w-full ">
        <div className="flex flex-col h-full w-full items-center justify-center">
          <XCircle className="text-primary border-red-400  w-8 h-8 mb-2" />
          <p className="font-semibold">
            Your subscription: <span className="text-green-500">FREE</span>
          </p>
          <p className="font-light">Supports PDF file with upto 5 pages</p>
          <div className="mt-4 flex items-center gap-12">
            <Link
              href="/dashboard"
              className={buttonVariants({ variant: "ghost", size: "sm" })}
            >
              <ChevronLeft />
              Back
            </Link>
            <Link
              href="/pricing"
              className={buttonVariants({
                variant: "ghost",
                size: "sm",
                className:
                  "bg-gradient-to-r from-red-500 to-red-700 text-white font-bold py-2 px-4 rounded-full hover:from-red-400 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50",
              })}
            >
              Upgrade
            </Link>
          </div>
        </div>
      </div>
    );
  }
  // if (data) {
  //   return (
  //     <div className="relative min-h-[100vh-1rem] h-full w-full ">
  //       <div className="flex flex-col h-full w-full items-center justify-center">
  //         <Loader2 className="text-primary animate-spin mb-2" />
  //         <p className="font-semibold">Loading...</p>
  //         <p className="font-light">We're preparing your PDF.</p>
  //       </div>
  //     </div>
  //   );
  // }
  if (isLoading) {
    return (
      <div className="relative min-h-[100vh-1rem] h-full w-full ">
        <div className="flex flex-col h-full w-full items-center justify-center">
          <Loader2 className="text-primary animate-spin mb-2" />
          <p className="font-semibold">Loading...</p>
          <p className="font-light">We're preparing your PDF.</p>
        </div>
      </div>
    );
  }
  return (
    <ChatContextProvider fileId={fileId}>
      <div className="px-6 py-4 flex flex-col h-full w-full">
        <div className="flex-1">
          <ChatSection fileId={fileId} />
        </div>
        <div className="w-full">
          <ChatInputSection disableStatus={isLoading} />
        </div>
      </div>
    </ChatContextProvider>
  );
};

export default ChatContainer;
