import { z } from "zod";
import { authProcedure, publicProcedure, router } from "./trpc";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { db } from "@/db";
import { TRPCError } from "@trpc/server";

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

  deleteFile: authProcedure.input(
      z.object({
        id: z.string(),
      })
    ).mutation(async ({ ctx, input }) => {
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
