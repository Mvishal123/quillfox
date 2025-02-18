import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";

import { getPineconeClient } from "@/lib/pinecone";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { PineconeStore } from "@langchain/pinecone";

const f = createUploadthing();

const auth = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return null;
  }
  return user;
};

const middleware = async () => {
  const user = await auth();
  const isUserSubscribed = await getUserSubscriptionPlan();
  const { isSubscribed } = isUserSubscribed;

  if (!user) throw new Error("Unauthorized");

  return { userId: user.id, isSubscribed };
};

const onUploadComplete = async ({
  metadata,
  file,
}: {
  metadata: Awaited<ReturnType<typeof middleware>>;
  file: { name: string; key: string; url: string };
}) => {
  const fileExist = await db.file.findFirst({
    where: {
      id: file.key,
    },
  });

  if (fileExist) return { url: file.url };

  const fileData = await db.file.create({
    data: {
      key: file.key,
      name: file.name,
      url: file.url,
      userId: metadata.userId,
      uploadStatus: "PROCESSING",
    },
  });

  console.log("FILE DATA:", fileData);

  try {
    const response = await fetch(fileData.url); //getting the file to work with (PDF)
    console.log("RESPONSE:", response);

    const blob = await response.blob(); //Binary Large Object
    const loader = new PDFLoader(blob);
    const docs = await loader.load();

    // const pagesPerPdf = docs.length;

    // const isSubscribed = metadata.isSubscribed;

    // const isProPageExceeeded =
    //   pagesPerPdf > PLANS.find((plan) => plan.name === "Pro")!.pagesPerPdf;
    // const isFreePageExceeded =
    //   pagesPerPdf > PLANS.find((plan) => plan.name === "Free")!.pagesPerPdf;

    // if (
    //   (isSubscribed && isProPageExceeeded) ||
    //   (!isSubscribed && isFreePageExceeded)
    // ) {
    // await db.file.update({
    //   where: {
    //     id: fileData.id,
    //   },
    //   data: {
    //     uploadStatus: "FAILED",
    //   },
    // });
    // }

    const pinecone = await getPineconeClient();
    const pineconeIndex = pinecone.index("quillfox");

    // ---VECTORIZE THE DOCS---

    const embeddings = new GoogleGenerativeAIEmbeddings({
      model: "text-embedding-004",
      apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY!,
    }) as unknown as any;

    console.log("EMBEDDINGS GOOGLE API:", embeddings);

    // const embedResults = await embeddings.embedQuery(
    //   docs.map((content) => content).join(" ")
    // );

    // console.log("EMBEDDINGS:", embedResults);

    // await pineconeIndex.namespace(fileData.id).upsert([
    //   {
    //     id: fileData.id,
    //     values: embedResults,
    //   },
    // ]);

    await  PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex,
      namespace: fileData.id,
    });

    console.log("EMBEDDINGS STORED IN PINECONE");

    await db.file.update({
      data: {
        uploadStatus: "DONE",
      },
      where: {
        id: fileData.id,
      },
    });

    console.log("FILE STATUS UPDATED");

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
    console.log("[UPLOADTHING ERROR]:", error);
    throw new Error(error);
  }
};

export const ourFileRouter = {
  freePdfUploader: f({ pdf: { maxFileCount: 1, maxFileSize: "4MB" } })
    .middleware(middleware)
    .onUploadComplete(onUploadComplete),
  proPdfUploader: f({ pdf: { maxFileCount: 1, maxFileSize: "16MB" } })
    .middleware(middleware)
    .onUploadComplete(onUploadComplete),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
