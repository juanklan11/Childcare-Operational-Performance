import { NextResponse } from "next/server";
import path from "path";
import { readFile } from "fs/promises";

type Row = Record<string, string>;

function splitCSVLine(line: string): string[] {
  // Split on commas not inside double-quotes
  const re = /,(?=(?:[^"]*"[^"]*")*[^"]*$)/g;
  return line
    .split(re)
    .map((s) => s.trim().replace(/^"|"$/g, "")); // trim + strip outer quotes
}

function parseCSV(text: string): Row[] {
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) return [];
  const headers = splitCSVLine(lines[0]).map((h) => h.trim());
  return lines.slice(1).map((ln) => {
    const cols = splitCSVLine(ln);
    const obj: Row = {};
    headers.forEach((h, i) => (obj[h] = cols[i] ?? ""));
    return obj;
  });
}

function findKey(obj: Row, guesses: string[]): string | undefined {
  const keys = Object.keys(obj).map((k) => k.toLowerCase());
  for (const g of guesses) {
    const i = keys.findIndex((k) => k === g || k.includes(g));
    if (i >= 0) return Object.keys(obj)[i];
  }
}

function bandAuditNeed(services: number) {
  if (services >= 200) return "Very High";
  if (services >= 100) return "High";
  if (services >= 30)  return "Medium";
  return "Low";
}

async function readChildcareCSV(): Promise<{ rows: Row[]; source: string }> {
  const candidates = [
    "public/data/childcare-centres.csv",
    "app/public/data/childcare-centres.csv", // fallback if file still in /app
  ];
  let lastErr: any;
  for (const rel of candidates) {
    try {
      const p = path.join(process.cwd(), rel);
      const txt = await readFile(p, "utf8");
      return { rows: parseCSV(txt), source: rel };
    } catch (e) {
      lastErr = e;
    }
  }
  throw new Error(`CSV not found in ${candidates.join(" or ")}. Last error: ${String(lastErr)}`);
}

export async function GET() {
  try {
    const { rows, source } = await readChildcareCSV();
    if (!rows.length) return NextResponse.json({ rows: [], note: "CSV empty", source });

    // detect columns
    const pk = findKey(rows[0], ["provider", "operator", "approvedprovider", "serviceprovider"])!;
    const sk = findKey(rows[0], ["service", "servicename", "name"])!;
    const addrK = findKey(rows[0], ["address", "street", "location"]) ?? "";
    const stateK = findKey(rows[0], ["state", "st"]) ?? "";

    if (!pk || !sk) {
      return NextResponse.json(
        { error: "Missing required columns (provider/service). Check CSV headers.", headers: Object.keys(rows[0]), source },
        { status: 400 },
      );
    }

    // aggregate by provider
    const map = new Map<
      string,
      { provider: string; services: number; states: Set<string>; sample: { name: string; address?: string }[] }
    >();

    for (const r of rows) {
      const provider = (r[pk] || "").trim();
      const svc = (r[sk] || "").trim();
      if (!provider || !svc) continue;
      if (!map.has(provider)) map.set(provider, { provider, services: 0, states: new Set(), sample: [] });
      const agg = map.get(provider)!;
      agg.services += 1;
      if (stateK && r[stateK]) agg.states.add((r[stateK] || "").trim());
      if (agg.sample.length < 3) agg.sample.push({ name: svc, address: addrK ? r[addrK] : undefined });
    }

    const providers = Array.from(map.values())
      .map((p) => ({
        provider: p.provider,
        services: p.services,
        states: Array.from(p.states).sort(),
        audit_need: bandAuditNeed(p.services),
        sampleCentres: p.sample,
      }))
      .sort((a, b) => b.services - a.services);

    return NextResponse.json({
      updatedAt: new Date().toISOString(),
      source,
      count: providers.length,
      rows: providers,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || String(e) }, { status: 500 });
  }
}
