import { NextResponse } from "next/server";

const CKAN_BASE = "https://data.gov.au/data/api/3/action/datastore_search";
const RESOURCE_ID = process.env.DGAU_CHILDCARE_RESOURCE_ID; // e.g. "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"

export async function GET(req: Request) {
  if (!RESOURCE_ID) {
    return NextResponse.json({ error: "Missing DGAU_CHILDCARE_RESOURCE_ID" }, { status: 500 });
  }
  const { searchParams } = new URL(req.url);
  const postcode = (searchParams.get("postcode") || "").trim();
  const limit = Number(searchParams.get("limit") || 100);

  // Basic CKAN query by postcode; adjust "postcode" to the column name used by your chosen dataset
  const url = `${CKAN_BASE}?resource_id=${RESOURCE_ID}&limit=${limit}` +
              (postcode ? `&q=${encodeURIComponent(JSON.stringify({ postcode }))}` : "");

  const r = await fetch(url, { headers: { Accept: "application/json" }, next: { revalidate: 86400 } }); // cache 24h
  if (!r.ok) return NextResponse.json({ error: "Upstream error" }, { status: 502 });
  const json = await r.json();
  const rows = json?.result?.records || [];

  // Normalise a few likely fields; adjust mapping once you pick the dataset
  const data = rows.map((row: any) => ({
    serviceName: row.service_name || row.name || row.ServiceName,
    provider: row.provider || row.ProviderName,
    address: [row.address_1 || row.Address1, row.suburb || row.Suburb, row.state || row.State, row.postcode || row.Postcode].filter(Boolean).join(", "),
    suburb: row.suburb || row.Suburb,
    state: row.state || row.State,
    postcode: row.postcode || row.Postcode,
    approvedPlaces: row.approved_places || row.ApprovedPlaces,
    nqsRating: row.nqs_rating || row.NQS || null,
    lat: row.latitude || row.Latitude,
    lon: row.longitude || row.Longitude,
  }));

  return NextResponse.json({ rows: data });
}

