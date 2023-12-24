import { db } from "@/db";
import { MessageApiValidator } from "@/lib/validators/messageValidator";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { getPineconeClient } from "@/lib/pinecone";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { openai } from "@/lib/openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user)
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );

  MessageApiValidator.parse(body); //backend zod input validation. If !success throws error. No need to handle seperately

  const { fileId, message } = body;

  await db.message.create({
    data: {
      fileId,
      message,
      isUserMessage: true,
      userId: user.id,
    },
  }); //create user msg in the db

  // Vectorize the incoming message
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY!,
  });

  const pinecone = await getPineconeClient(); //client for vector database
  const pineconeIndex = pinecone.Index("quillfox");//index to connect to our database

  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
    namespace: fileId,
  });

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

  //format the message in the format accepted by openai api
  const formattedMessages = prevMessges.map((msg) => ({
    role: msg.isUserMessage ? ("user" as const) : ("assistant" as const),
    content: msg.message,
  }));

  //prompting chatgpt
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    temperature: 0,
    stream: true,

    messages: [
      {
        role: "system",
        content:
          "Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format.",
      },
      {
        role: "user",
        content: `Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.
          
    \n----------------\n
    
    PREVIOUS CONVERSATION:
    ${formattedMessages.map((message) => {
      if (message.role === "user") return `User: ${message.content}\n`;
      return `Assistant: ${message.content}\n`;
    })}
    
    \n----------------\n
    
    CONTEXT:
    ${results.map((r) => r.pageContent).join("\n\n")}
    
    USER INPUT: ${message}`,
      },
    ],
  });


  //api to stream the message as in chatgpt. 
  const stream = OpenAIStream(response, {
    async onCompletion(completion) {
      await db.message.create({
        data: {
          message: completion,
          isUserMessage: false,
          fileId,
          userId: user.id,
        },
      });
    },
  });
  return new StreamingTextResponse(stream);
}
