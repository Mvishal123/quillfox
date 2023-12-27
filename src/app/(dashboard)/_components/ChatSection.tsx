"use client";

import { trpc } from "@/app/_trpc/trpc-client";
import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query-message";
import { Loader2, MessageSquare } from "lucide-react";
import React, { useContext } from "react";
import Message from "./Message";
import { ChatContext } from "@/store/ChatContext";

const ChatSection = ({ fileId }: { fileId: string }) => {
  const { data, isLoading } = trpc.getFileMessages.useInfiniteQuery(
    {
      limit: INFINITE_QUERY_LIMIT,
      fileId,
    },
    {
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
      keepPreviousData: true,
    }
  );

  const messages = data?.pages.flatMap((msg) => msg.messages);

  const loadingMessage = {
    createdAt: new Date().toISOString(),
    id: "message-loading",
    isUserMessage: false,
    message: (
      <span>
        <Loader2 className="h-3 w-3 animate-spin" />
      </span>
    ),
  };

  const { isLoading: isAIThinking } = useContext(ChatContext);
  const combinedMessage = [
    ...(isAIThinking ? [loadingMessage] : []),
    ...(messages ? messages : []),
  ];

  return (
    <div className="flex h-[calc(100vh-5rem)] lg:h-[calc(100vh-10rem)] flex-col-reverse p-3 pb-20 lg:pb-0 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrolbar-track-blue-lighter scrollbar-w-2 scrolling-touch bg-slate-50">
      {combinedMessage && combinedMessage.length > 0 ? (
        <div className="flex flex-col-reverse gap-4">
          {combinedMessage.map((msg, i) => {
            const isNextMsgSamePerson =
              combinedMessage[i]?.isUserMessage ===
              combinedMessage[i - 1]?.isUserMessage;
            if (i === combinedMessage.length - 1) {
              return (
                <Message
                  message={msg}
                  isNextMessageSamePerson={isNextMsgSamePerson}
                />
              );
            } else {
              return (
                <Message
                  message={msg}
                  isNextMessageSamePerson={isNextMsgSamePerson}
                />
              );
            }
          })}
        </div>
      ) : isLoading ? (
        <div></div>
      ) : (
        <div className="h-full flex flex-col gap-4 justify-center items-center">
          <MessageSquare className="h-6 w-6 text-slate-800" />
          <p>All set</p>
          <p>Start chatting with you doc</p>
        </div>
      )}
    </div>
  );
};

export default ChatSection;
