import { db } from "@/db";
import { MessageApiValidator } from "@/lib/validators/messageValidator";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import { gemini } from "@/lib/gemini";
import { getPineconeClient } from "@/lib/pinecone";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PineconeStore } from "@langchain/pinecone";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user)
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );

  MessageApiValidator.parse(body);
  const { fileId, message } = body;

  const embeddingsNew = new GoogleGenerativeAIEmbeddings({
    model: "text-embedding-004",
    apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY!,
  });

  const pinecone = await getPineconeClient(); //client for vector database
  const pineconeIndex = pinecone.Index("quillfox"); //index to connect to our database

  const vectorStore = await PineconeStore.fromExistingIndex(embeddingsNew, {
    pineconeIndex,
    namespace: fileId,
  });

  console.log("MESSAGE:", message);

  const results = await vectorStore.similaritySearch(message, 4);

  const prevMessges = await db.message.findMany({
    where: {
      fileId: fileId,
      userId: user.id,
    },
    orderBy: {
      createdAt: "asc",
    },
    take: 8,
  });

  const historyMessages = prevMessges.map((msg) => ({
    role: msg.isUserMessage ? ("user" as const) : ("model" as const),
    parts: [{ text: msg.message }],
  }));

  const prompt = `
  \n-----------------\n
   ROLE:
  - You are Quillfox an helpful study buddy on whom students rely on. You help students to study from docs easier. Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format.
   - Use the history to know the context of the previous conversation. If not needed, ignore it. 
   - IMPORTANT: Stick only to the PDF content to answer the question no deviations.
   - The user and model messages are given in HISTORY sectiona and the context of the PDF is given in the CONTEXT section.
   - The current user message is given in USER INPUT section.
   - return answers in markdown format.
   \n----------------\n
   HISTORY:
   ${historyMessages.map((message) => {
     if (message.role === "user") return `User: ${message.parts[0].text}\n`;
     return `Assistant: ${message.parts[0].text}\n`;
   })}
   \n----------------\n
   CONTEXT:
   ${results.map((r) => r.pageContent).join("\n\n")}
   \n----------------\n
   USER INPUT: ${message}
  `;

  const result = await gemini.generateContent(prompt);
  const aiMessage = result.response.text();

  await db.message.create({
    data: {
      fileId,
      message,
      isUserMessage: true,
      userId: user.id,
    },
  });

  await db.message.create({
    data: {
      fileId,
      message: aiMessage,
      isUserMessage: false,
      userId: user.id,
    },
  });

  return NextResponse.json({
    message: aiMessage,
  });
}
