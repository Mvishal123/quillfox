import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { TRPCError, initTRPC } from "@trpc/server";

const t = initTRPC.create();
const middleware = t.middleware;

const isAuthorized = middleware(async (opts) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  console.log("[USER MIDDLEWARE]", user);
  

  if (!user || !user.id) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return opts.next({
    ctx: {
      user: user.email,
      userId: user.id,
    },
  });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const authProcedure = t.procedure.use(isAuthorized);
