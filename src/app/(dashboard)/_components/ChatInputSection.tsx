import { ChatContext } from "@/app/store/ChatContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import React, { useContext, useRef } from "react";

interface ChatInputProps {
  disableStatus: boolean;
}
const ChatInputSection = ({ disableStatus }: ChatInputProps) => {
  const { addMessage, isLoading, message, handleInputChange } =
    useContext(ChatContext);

  const textRef = useRef<HTMLTextAreaElement>(null);
  return (
    <div className="relative">
      <div className="absolute bottom-0 w-full flex items-center mb-2">
        <Textarea
          rows={1}
          maxRows={4}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();

              addMessage();
              textRef.current?.focus();
              textRef.current?.value;
            }
          }}
          ref={textRef}
          onChange={handleInputChange}
          autoFocus
          value={message ? message : ""}
          className="resize-none w-full focus-visible:ring-slate-800 py-3 pr-12 scrollbar-w-2 scrollbar-track-blue-lighter scrollbar-thumb-blue scrollbar-thumb-rounded"
          placeholder="Ask fox anything..."
          disabled={disableStatus}
        />
        <Button
          disabled={isLoading || disableStatus}
          variant={"dark"}
          size={"sm"}
          className="absolute right-2 text-white h-6 md:h-8 "
          onClick={() => {
            addMessage();
            textRef.current?.focus();
          }}
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInputSection;
