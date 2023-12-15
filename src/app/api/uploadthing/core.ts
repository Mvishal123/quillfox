import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

const auth = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return null;
  }
  return user;
};

export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileCount: 1, maxFileSize: "4MB" } })
    .middleware(async () => {
      const user = await auth();

      if (!user) throw new Error("Unauthorized");

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await db.file.create({
        data: {
          key: file.key,
          name: file.name,
          url: file.url,
          userId: metadata.userId,
        },
      });

      return {
        url: file.url,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
