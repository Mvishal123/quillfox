import { AppRouter } from "@/trpc";
import { inferRouterOutputs } from "@trpc/server";

type RouterOutput = inferRouterOutputs<AppRouter>;

type OGMessageType = RouterOutput["getFileMessages"]["messages"];

type OmitedMessage = Omit<OGMessageType[number], "message">;

type NewMessageType = {
  message: string | JSX.Element;
};

export type ExtendedMessage = OmitedMessage & NewMessageType
