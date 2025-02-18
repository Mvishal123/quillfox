import { useMutation } from "@tanstack/react-query";
import React, { createContext, useRef, useState } from "react";
import axios from "axios";
import { trpc } from "@/app/_trpc/trpc-client";
import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query-message";
import { toast } from "@/components/ui/use-toast";

interface ChatType {
  addMessage: () => void;
  message: null | string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
}

export const ChatContext = createContext<ChatType>({
  addMessage: () => {},
  message: null,
  handleInputChange: (e) => {},
  isLoading: false,
});

export const ChatContextProvider = ({
  fileId,
  children,
}: {
  fileId: string;
  children: React.ReactNode;
}) => {
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const backupMessage = useRef<string | null>("");

  const utils = trpc.useUtils();

  const { mutate: sendMessage } = useMutation({
    mutationFn: async ({ message }: { message: string | null }) => {
      setIsLoading(true);
      const res = await axios.post("/api/messages", {
        fileId,
        message,
      }); //using axios instead of tRPC coz we need to stream the message

      if (!res) {
        throw new Error("Failed to send message");
      }

      return res.data;
    },

    onMutate: async ({ message }) => {
      backupMessage.current = message ?? "";
      setMessage("");

      await utils.getFileMessages.cancel();

      const prevPages = utils.getFileMessages.getInfiniteData(); // to get the currently cached data

      utils.getFileMessages.setInfiniteData(
        { limit: INFINITE_QUERY_LIMIT, fileId },
        (old) => {
          if (!old) {
            return {
              pages: [],
              pageParams: [],
            };
          }

          let newPage = [...old.pages];
          let newestPage = newPage[0]!;

          newestPage.messages = [
            {
              createdAt: new Date().toISOString(),
              isUserMessage: true,
              id: crypto.randomUUID(),
              message: message ?? "",
            },
            ...newestPage.messages,
          ]; // adding optimistic message to client

          newPage[0] = newestPage;
          return {
            ...old,
            pages: newPage,
          };
        }
      );

      setIsLoading(true);
      return {
        prevPages: prevPages?.pages.flatMap((page) => page.messages) ?? [],
      };
    },

    // here underscore states that the parameters are unused.
    onError: (_, __, ctx) => {
      utils.getFileMessages.setData(
        { fileId },
        { messages: ctx?.prevPages ?? [] }
      );
    },

    onSuccess: async (response) => {
      setIsLoading(false);

      // Update the UI with the AI response
      utils.getFileMessages.setInfiniteData(
        { fileId, limit: INFINITE_QUERY_LIMIT },
        (oldPages) => {
          if (!oldPages) {
            return {
              pages: [],
              pageParams: [],
            };
          }

          let updatedPages = oldPages.pages.map((page, index) => {
            if (index === 0) {
              return {
                ...page,
                messages: [
                  {
                    id: crypto.randomUUID(),
                    createdAt: new Date().toISOString(),
                    message: response.message,
                    isUserMessage: false,
                  },
                  ...page.messages,
                ],
              };
            }
            return page;
          });

          return { ...oldPages, pages: updatedPages };
        }
      );
    },

    onSettled: async () => {
      setIsLoading(false);
      await utils.getFileMessages.invalidate({ fileId });
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const addMessage = () => sendMessage({ message });

  return (
    <ChatContext.Provider
      value={{ message, isLoading, addMessage, handleInputChange }}
    >
      {children}
    </ChatContext.Provider>
  );
};
