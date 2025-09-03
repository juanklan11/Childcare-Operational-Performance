import { NextRequest, NextResponse } from "next/server";

function unauthorized(realm = 'Basic realm="Secure Area"') {
  return new NextResponse("Auth required", { status: 401, headers: { "WWW-Authenticate": realm } });
}

function parseBasicAuth(header: string | null) {
  if (!header) return null;
  const [scheme, encoded] = header.split(" ");
  if (scheme !== "Basic" || !encoded) return null;
  const [user, pass] = Buffer.from(encoded, "base64").toString().split(":");
  return { user, pass };
}

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Guard sets
  const isClient = path.startsWith("/dashboard");
  const isAdmin = path.startsWith("/leads") || path.startsWith("/providers") || path.startsWith("/auditor");

  if (!isClient && !isAdmin) return NextResponse.next();

  const creds = parseBasicAuth(req.headers.get("authorization"));
  const realm = isAdmin ? 'Basic realm="Admin Area"' : 'Basic realm="Client Area"';

  if (!creds) return unauthorized(realm);

  if (isClient) {
    if (creds.user === process.env.DASH_USER && creds.pass === process.env.DASH_PASS) return NextResponse.next();
    return unauthorized(realm);
  }

  if (isAdmin) {
    if (creds.user === process.env.ADMIN_USER && creds.pass === process.env.ADMIN_PASS) return NextResponse.next();
    return unauthorized(realm);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/leads/:path*", "/providers/:path*", "/auditor/:path*"],
};
