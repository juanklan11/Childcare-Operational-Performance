import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

// Run on the Edge for fast, cheap uploads
export const runtime = "edge";

function sanitizeName(name: string) {
  return name.replace(/[^a-z0-9.\-_\s]/gi, "_");
}

export async function POST(req: NextRequest) {
  try {
    // Accept multipart/form-data with one or many files under field name "files"
    const form = await req.formData();
    const files = form.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files received" }, { status: 400 });
    }

    const today = new Date().toISOString().slice(0, 10);
    const token = process.env.BLOB_READ_WRITE_TOKEN; // optional on Vercel; used locally if set

    const uploaded: Array<{
      url: string;
      pathname: string;
      size: number;
      contentType: string;
      originalName: string;
    }> = [];

    for (const file of files) {
      // Basic guardrails (50 MB default per file – adjust as needed)
      const MAX_BYTES = 50 * 1024 * 1024;
      if (file.size > MAX_BYTES) {
        return NextResponse.json(
          { error: `File ${file.name} exceeds 50MB limit` },
          { status: 413 }
        );
      }

      const safeName = sanitizeName(file.name);
      const key = `audits/${today}/${crypto.randomUUID()}-${safeName}`;

      // Upload to Vercel Blob (public access so you can preview images/PDFs)
      const blob = await put(key, file, {
        access: "public",
        contentType: file.type || "application/octet-stream",
        token
      });

      uploaded.push({
        url: blob.url,
        pathname: blob.pathname,
        size: file.size,
        contentType: file.type || "application/octet-stream",
        originalName: file.name
      });
    }

    return NextResponse.json({ ok: true, uploaded }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Upload failed" },
      { status: 500 }
    );
  }
}

// Optional: allow a quick GET health check
export async function GET() {
  return NextResponse.json({ ok: true, message: "Upload endpoint ready" });
}
