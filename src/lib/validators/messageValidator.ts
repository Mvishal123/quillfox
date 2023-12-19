import { z } from "zod";

export const MessageApiValidator = z.object({
  fileId: z.string(),
  message: z.string(),
});
