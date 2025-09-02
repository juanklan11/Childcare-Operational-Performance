import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

// Minimal CSV parser that copes with quoted commas
function parseCSV(text: string): Record<string, string>[] {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = lines[0]
    .replace(/^\uFEFF/, "") // strip BOM if present
    .split(",")
    .map((h) => h.trim());

  return lines.slice(1).map((line) => {
    const cells: string[] = [];
    let buf = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          buf += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === "," && !inQuotes) {
        cells.push(buf);
        buf = "";
      } else {
        buf += ch;
      }
    }
    cells.push(buf);

    const row: Record<string, string> = {};
    headers.forEach((h, idx) => (row[h] = (cells[idx] ?? "").trim()));
    return row;
  });
}

// Map whatever columns the CSV has into the table shape the UI expects
function toLeadRow(r: Record<string, string>) {
  const serviceName =
    r.serviceName || r.Service || r.service || r.name || r.Name || "";
  const provider =
    r.provider || r.Provider || r.organisation || r.org || r.contact_ph || "";
  const address =
    r.address || r.Address || r.coordinates || r.suburb || r.town || "";
  return { serviceName, provider, address };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "25", 10);

  try {
    const filePath = path.join(
      process.cwd(),
      "public",
      "data",
      "childcare-centres.csv"
    );
    const csv = await fs.readFile(filePath, "utf8");
    const raw = parseCSV(csv);
    const rows = raw.map(toLeadRow).filter((r) => r.serviceName).slice(0, limit);

    return NextResponse.json({
      rows,
      note: "Loaded from /public/data/childcare-centres.csv",
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        rows: [],
        error: err.message,
        note:
          "CSV not found or unreadable. Ensure /public/data/childcare-centres.csv exists in the repo.",
      },
      { status: 500 }
    );
  }
}
