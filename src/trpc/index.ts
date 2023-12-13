import { z } from "zod";
import { publicProcedure, router } from "./trpc";
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
});

export type AppRouter = typeof appRouter;
