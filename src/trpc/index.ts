import { z } from "zod";
import { authProcedure, publicProcedure, router } from "./trpc";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { db } from "@/db";
import { TRPCError } from "@trpc/server";
import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query-message";

export const appRouter = router({
  authChecker: publicProcedure.query(async () => {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const isUser = await db.user.findUnique({
      where: {
        id: user.id,
      },
    });

    if (!isUser) {
      await db.user.create({
        data: {
          id: user.id,
          email: user.email!,
        },
      });
    }

    return {
      success: true,
      message: "Authorized",
    };
  }),

  getUserFiles: authProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;
    return await db.file.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),

  getFileMessages: authProcedure
    .input(
      z.object({
        fileId: z.string(),
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ? input.limit : INFINITE_QUERY_LIMIT;
      const file = await db.file.findFirst({
        where: {
          userId: ctx.userId,
          id: input.fileId,
        },
      });

      if (!file) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const messages = await db.message.findMany({
        take: limit + 1,
        where: {
          fileId: input.fileId,
          userId: ctx.userId,
        },
        orderBy: {
          createdAt: "asc",
        },
        cursor: input.cursor ? { id: input.cursor } : undefined,
        select: {
          createdAt: true,
          id: true,
          isUserMessage: true,
          message: true,
        },
      });

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (messages.length > limit) {
        const nextMessage = messages.pop();
        nextCursor = nextMessage?.id;
      }

      return {
        messages,
        nextCursor,
      };
    }),

  getFileUploadStatus: authProcedure
    .input(z.object({ fileId: z.string() }))
    .query(async ({ input, ctx }) => {
      const file = await db.file.findFirst({
        where: {
          id: input.fileId,
          userId: ctx.userId,
        },
      });

      if (!file) return { status: "PROCESSING" as const };

      return {
        status: file.uploadStatus,
      };
    }),

  getFile: authProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { getUser } = getKindeServerSession();
      const user = await getUser();

      if (!user) throw new TRPCError({ code: "UNAUTHORIZED" });

      const file = await db.file.findFirst({
        where: {
          key: input.key,
          userId: user.id,
        },
      });

      if (!file) throw new TRPCError({ code: "NOT_FOUND" });

      return {
        file,
      };
    }),

  deleteFile: authProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const courseId = input.id;

      const file = await db.file.delete({
        where: {
          id: courseId,
          userId,
        },
      });

      if (!file) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return {
        success: true,
        message: "File deleted",
      };
    }),
});

export type AppRouter = typeof appRouter;
