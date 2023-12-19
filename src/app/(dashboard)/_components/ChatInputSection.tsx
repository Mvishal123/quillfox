import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import React from "react";

interface ChatInputProps {
  disableStatus: boolean;
}
const ChatInputSection = ({ disableStatus }: ChatInputProps) => {
  return (
    <div className="relative">
      <div className="absolute bottom-0 w-full flex items-center mb-2">
        <Textarea
          rows={1}
          maxRows={4}
          autoFocus
          className="resize-none w-full focus-visible:ring-slate-800 pr-12 scrollbar-w-2 scrollbar-track-blue-lighter scrollbar-thumb-blue scrollbar-thumb-rounded"
          placeholder="Ask fox anything..."
          disabled={disableStatus}
        />
        <Button
          variant={"dark"}
          size={"sm"}
          className="absolute right-2 text-white h-6 md:h-9 "
        >
          <Send className="w-4 h-4"/>
        </Button>
      </div>
    </div>
  );
};

export default ChatInputSection;
