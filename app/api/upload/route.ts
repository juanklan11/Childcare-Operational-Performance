import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export const runtime = "edge"; // fast & cheap on Vercel

export async function POST(req: NextRequest) {
  // Ensure the project has BLOB_READ_WRITE_TOKEN set in Vercel env
  try {
    const form = await req.formData();
    const files = form.getAll("files");

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const uploads = await Promise.all(
      files.map(async (file) => {
        if (!(file instanceof File)) {
          throw new Error("Invalid file payload");
        }
        const arrayBuffer = await file.arrayBuffer();
        const blob = await put(`audits/${Date.now()}-${file.name}`, arrayBuffer, {
          access: "public",
          contentType: file.type || "application/octet-stream",
        });
        return {
          name: file.name,
          size: file.size,
          type: file.type,
          url: blob.url,
        };
      })
    );

    return NextResponse.json({ items: uploads }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Upload failed" },
      { status: 500 }
    );
  }
}
