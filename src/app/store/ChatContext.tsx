import { useMutation } from "@tanstack/react-query";
import React, { createContext, useState } from "react";
import axios from "axios";

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
