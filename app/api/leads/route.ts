// app/api/leads/route.ts
import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

// tiny CSV parser that respects simple quoted values
function parseCSV(text: string) {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines[0].split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map(h => h.replace(/^"|"$/g, "").trim());
  return lines.slice(1).map(line => {
    const cols = line.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map(c => c.replace(/^"|"$/g, "").trim());
    const row: Record<string,string> = {};
    headers.forEach((h, i) => { row[h] = cols[i] ?? ""; });
    return row;
  });
}

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public", "data", "childcare-centres.csv");
    const csv = await readFile(filePath, "utf8");
    const rows = parseCSV(csv);

    // map common header names → UI fields
    const mapped = rows.map((r, i) => ({
      serviceName: r.serviceName || r.service || r.name || `Service ${i + 1}`,
      provider:    r.provider    || r.organisation || r.operator || r.owner || "",
      address:     r.address     || r.location || r.coordinates || "",
    }));

    return NextResponse.json({ rows: mapped });
  } catch (err) {
    return NextResponse.json(
      { rows: [], note: "CSV not found or unreadable at /public/data/childcare-centres.csv" },
      { status: 200 }
    );
  }
}
