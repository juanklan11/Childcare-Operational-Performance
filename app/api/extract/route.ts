// app/api/extract/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createRequire } from "module";

export const runtime = "nodejs";           // pdf-parse needs Node, not Edge
export const dynamic = "force-dynamic";
export const maxDuration = 60;

type LoadedFile = { buf: Buffer; type: string; filename: string };

// ---------- helpers ---------------------------------------------------------

async function loadFromMultipart(req: NextRequest): Promise<LoadedFile | null> {
  const ct = req.headers.get("content-type") || "";
  if (!ct.includes("multipart/form-data")) return null;

  const form = await req.formData();
  const file = form.get("file") as File | null;
  const url = (form.get("url") || form.get("blobUrl"))?.toString();

  if (file) {
    const ab = await file.arrayBuffer();
    return {
      buf: Buffer.from(ab),
      type: file.type || "application/octet-stream",
      filename: file.name || "upload",
    };
  }

  if (url) return await loadFromUrl(url);
  return null;
}

async function loadFromJson(req: NextRequest): Promise<LoadedFile | null> {
  const ct = req.headers.get("content-type") || "";
  if (!ct.includes("application/json")) return null;
  const body = await req.json().catch(() => null) as null | { url?: string };
  if (body?.url) return await loadFromUrl(body.url);
  return null;
}

async function loadFromQuery(req: NextRequest): Promise<LoadedFile | null> {
  const url = new URL(req.url).searchParams.get("url");
  if (!url) return null;
  return await loadFromUrl(url);
}

async function loadFromUrl(url: string): Promise<LoadedFile> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch file (HTTP ${res.status})`);
  const ab = await res.arrayBuffer();
  const type = res.headers.get("content-type") || "application/octet-stream";
  const filename = decodeURIComponent(url.split("/").pop()!.split("?")[0] || "remote-file");
  return { buf: Buffer.from(ab), type, filename };
}

function extractKeyInfo(text: string) {
  const grab = (re: RegExp) => (text.match(re)?.[1] || "").replace(/[, ]/g, "");
  const asNumber = (v: string) => (v ? Number(v) : undefined);

  return {
    nmi: text.match(/NMI[:\s-]*([A-Z0-9]{6,})/i)?.[1],
    mirn: text.match(/MIRN[:\s-]*([0-9]{6,})/i)?.[1],
    electricity_kwh: asNumber(grab(/([0-9][0-9,.\s]{0,12})\s*kwh\b/i)),
    gas_mj: asNumber(grab(/([0-9][0-9,.\s]{0,12})\s*mj\b/i)),
    water_kl: asNumber(grab(/([0-9][0-9,.\s]{0,12})\s*k[lL]\b/i)),
    emissions_tco2e: asNumber(grab(/([0-9][0-9,.\s]{0,12})\s*(tco2e|t-co2e)\b/i)),
    has_pv: /pv|photovoltaic|inverter/i.test(text),
  };
}

// ---------- route -----------------------------------------------------------

export async function POST(req: NextRequest) {
  try {
    // Resolve a file from: multipart, JSON {url}, or ?url=
    const loaded =
      (await loadFromMultipart(req)) ||
      (await loadFromJson(req)) ||
      (await loadFromQuery(req));

    if (!loaded) {
      return NextResponse.json(
        { ok: false, error: "No file provided. Upload a file or pass a ?url= (Blob URL) to this endpoint." },
        { status: 400 }
      );
    }

    const { buf, type, filename } = loaded;

    let text = "";
    const lower = filename.toLowerCase();

    if (type.includes("pdf") || lower.endsWith(".pdf")) {
      // Require at runtime so Next never bundles pdf-parse (prevents ENOENT)
      const require = createRequire(import.meta.url);
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const pdfParse = require("pdf-parse") as (b: Buffer) => Promise<{ text: string }>;
      const parsed = await pdfParse(buf);
      text = (parsed?.text || "").slice(0, 200_000);
    } else if (type.includes("csv") || lower.endsWith(".csv") || type.includes("text")) {
      text = buf.toString("utf8");
    } else {
      return NextResponse.json({
        ok: true,
        meta: { filename, contentType: type, size: buf.length },
        note: "Unsupported file type for text extraction; only PDF/CSV/TXT handled.",
      });
    }

    const keyInfo = extractKeyInfo(text);

    return NextResponse.json({
      ok: true,
      meta: { filename, contentType: type, size: buf.length },
      preview: text.slice(0, 4000),
      keyInfo,
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || "Extraction failed." }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  // Support GET /api/extract?url=...
  return POST(req);
}
