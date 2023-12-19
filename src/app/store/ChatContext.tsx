import { useMutation } from "@tanstack/react-query";
import React, { createContext, useState } from "react";

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

  const { mutate: sendMessage } = useMutation({
    mutationFn: async ({ message }: { message: string | null }) => {
      const res = await fetch("/api/message", {
        method: "POST",
        body: JSON.stringify({
          fileId,
          message,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to send message");
      }

      return res;
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
