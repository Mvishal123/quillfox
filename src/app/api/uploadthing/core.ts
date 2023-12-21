import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";

import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { getPineconeClient } from "@/lib/pinecone";
import { error } from "console";

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
      const fileData = await db.file.create({
        data: {
          key: file.key,
          name: file.name,
          url: file.url,
          userId: metadata.userId,
          uploadStatus: "PROCESSING",
        },
      });

      try {
        const response = await fetch(fileData.url);
        const blob = await response.blob();

        const loader = new PDFLoader(blob);

        const docs = await loader.load();

        const pinecone = await getPineconeClient();

        const pineconeIndex = pinecone.index("quillfox");

        const embeddings = new OpenAIEmbeddings({
          openAIApiKey: process.env.OPENAI_API_KEY!,
        });

        console.log("EMBEDDINGS:", embeddings);

        await PineconeStore.fromDocuments(docs, embeddings, {
          pineconeIndex,
          namespace: fileData.id,
        });
        console.log("pinecone store done");

        await db.file.update({
          data: {
            uploadStatus: "DONE",
          },
          where: {
            id: fileData.id,
          },
        });

        console.log("File status updated");

        return {
          url: file.url,
        };
      } catch (error: any) {
        await db.file.update({
          where: {
            id: fileData.id,
          },

          data: {
            uploadStatus: "FAILED",
          },
        });
        console.log("[UPLOADTHING ERROR:", error);
        throw new Error(error);
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
