import { handleAuth } from "@kinde-oss/kinde-auth-nextjs/server";
import { clear } from "console";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  return handleAuth();
}