import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs"; // PDF parsing requires Node runtime

// simple heuristic fallback (no AI key)
function quickHeuristic(text: string) {
  const nmi = text.match(/\bNMI[:\s-]*([A-Z0-9]{10,11})/i)?.[1] || null;
  const mirn = text.match(/\bMIRN[:\s-]*([0-9]{8,12})/i)?.[1] || null;
  const pvkw = text.match(/\b(PV|Solar)[^\n]{0,30}(\d{1,3}\.?[\d\/-]?\d*)\s*kW/i)?.[2] || null;
  const waterKL = text.match(/\bWater[^\n]{0,25}(\d{2,5})\s*kL/i)?.[1] || null;

  const bullet = [
    nmi ? `Detected NMI: ${nmi}` : null,
    mirn ? `Detected MIRN: ${mirn}` : null,
    pvkw ? `PV size about ${pvkw} kW` : null,
    waterKL ? `Water ~ ${waterKL} kL (from text)` : null,
  ].filter(Boolean) as string[];

  return { bullet_summary: bullet, fields: { nmi, mirn, pv_kw: pvkw ? Number(pvkw) : null, annual_water_kl_guess: waterKL ? Number(waterKL) : null } };
}

export async function POST(req: NextRequest) {
  try {
    const { url, name, contentType } = (await req.json()) as {
      url: string;
      name?: string;
      contentType?: string;
    };
    if (!url) return NextResponse.json({ ok: false, error: "Missing file url" }, { status: 400 });

    // fetch file bytes
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`Cannot fetch file (${resp.status})`);
    const ab = await resp.arrayBuffer();
    const buf = Buffer.from(ab);

    const lower = `${name || ""}`.toLowerCase();
    const type = (contentType || "").toLowerCase();

    let text = "";

    if (type.includes("pdf") || lower.endsWith(".pdf")) {
      const pdfParse = (await import("pdf-parse")).default as any;
      const parsed = await pdfParse(buf);
      text = (parsed?.text || "").slice(0, 120_000); // cap
    } else if (type.includes("csv") || lower.endsWith(".csv")) {
      const { parse } = await import("csv-parse/sync");
      const rows = parse(buf.toString("utf8"), { columns: true, skip_empty_lines: true });
      text = JSON.stringify(rows).slice(0, 120_000);
    } else if (type.startsWith("text/") || lower.endsWith(".txt")) {
      text = buf.toString("utf8").slice(0, 120_000);
    } else {
      return NextResponse.json(
        { ok: false, error: "Unsupported file type. Use PDF, CSV, or TXT." },
        { status: 415 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    // If no OpenAI API key, return a useful heuristic summary instead
    if (!apiKey) {
      const { bullet_summary, fields } = quickHeuristic(text);
      return NextResponse.json({
        ok: true,
        model: "local-fallback",
        bullet_summary,
        fields,
        rawTextChars: text.length,
      });
    }

    // OpenAI extraction (JSON mode)
    const OpenAI = (await import("openai")).default;
    const client = new OpenAI({ apiKey });

    const system = `
You are a building performance auditor. Extract structured fields from documents (bills, drawings notes, CSV logs) for Australian childcare centres.
Return clean JSON with keys:
{
  "site_name": string | null,
  "address": string | null,
  "nmi": string | null,
  "mirn": string | null,
  "billing_months": number | null,
  "elec_kwh_total_12mo": number | null,
  "gas_mj_total_12mo": number | null,
  "water_kl_total_12mo": number | null,
  "pv_size_kw": number | null,
  "inverters": string[] | null,
  "submeters": string[] | null,
  "rated_area_m2": number | null,
  "hours": { "open": string | null, "close": string | null } | null,
  "waste_streams": string[] | null,
  "ieq_metrics": { "co2_median_ppm": number | null, "co2_95th_ppm": number | null } | null,
  "risks_or_gaps": string[] | null
}
Also return a short "bullet_summary" array describing 4–6 key points for the dashboard. If a field is unknown, set it to null.
`.trim();

    const user = `
Source: ${name || "uploaded file"} (${contentType || "unknown"}).
Extract from the following text (truncated if long):

"""${text}"""
`.trim();

    const chat = await client.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.2,
    });

    const content = chat.choices?.[0]?.message?.content || "{}";
    let parsed: any = {};
    try {
      parsed = JSON.parse(content);
    } catch {}

    return NextResponse.json({
      ok: true,
      model: "gpt-4o-mini",
      ...parsed,
      rawTextChars: text.length,
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || "Extraction error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, message: "AI extractor ready" });
}
