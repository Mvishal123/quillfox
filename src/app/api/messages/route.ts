import { db } from "@/db";
import { MessageApiValidator } from "@/lib/validators/messageValidator";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/dist/types/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  // pdf ai logic

  if (!user)
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );

  MessageApiValidator.parse(body);

  const { fileId, message } = body;

  await db.message.create({
    data: {
      fileId,
      message,
      isUserMessage: true,
      userId: user.id,
    },
  });

  //message by ai
}
