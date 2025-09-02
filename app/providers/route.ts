import { NextResponse } from "next/server";
import providers from "@/public/data/providers.json";

export async function GET() {
  return NextResponse.json({ providers });
}
