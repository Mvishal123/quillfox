import { cn } from "@/lib/utils";
import { ExtendedMessage } from "@/types/extended-message";
import { Logo } from "./Logo";
import Markdown from "react-markdown";
import { format } from "date-fns";
import { forwardRef } from "react";

interface MessageProps {
  message: ExtendedMessage;
  isNextMessageSamePerson: boolean;
}

const Message = forwardRef<HTMLDivElement, MessageProps>(
  ({ message, isNextMessageSamePerson }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-end", {
        "justify-end": message.isUserMessage,
        "justify-start": !message.isUserMessage,
      })}
    >
      <div
        className={cn(
          "flex justify-center items-center h-6 w-6 aspect-square bg-slate-800 p-1 rounded-md",
          {
            "bg-slate-300 order-1": !message.isUserMessage,
            "order-2": message.isUserMessage,
            invisible: isNextMessageSamePerson,
          }
        )}
      >
        {message.isUserMessage ? (
          <Logo.user className="fill-slate-200" stroke="1" />
        ) : (
          <Logo.foxLogo className="h-6 w-6 fill-slate-800 text-slate-300" />
        )}
      </div>
      <div
        className={cn("flex flex-col space-y-2 text-base max-w-md mx-2", {
          "order-1": message.isUserMessage,
          "order-2": !message.isUserMessage,
        })}
      >
        <div
          className={cn("px-2 py-4 rounded-lg inline-block", {
            "bg-slate-900 text-white": message.isUserMessage,
            "bg-slate-200 text-gray-900": !message.isUserMessage,
            "rounded-br-none":
              message.isUserMessage && !isNextMessageSamePerson,
            "rounded-bl-none":
              !message.isUserMessage && !isNextMessageSamePerson,
          })}
        >
          {typeof message.message === "string" ? (
            <Markdown>{message.message}</Markdown>
          ) : (
            message.message
          )}
          {message.id !== "message-loading" ? (
            <div className={cn("text-xs text-right mt-1")}>
              {format(new Date(message.createdAt), "HH:mm")}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
);

export default Message;
