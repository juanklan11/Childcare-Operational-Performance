import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  if (!req.nextUrl.pathname.startsWith("/dashboard")) return NextResponse.next();
  const auth = req.headers.get("authorization");
  const realm = 'Basic realm="Secure Area"';
  if (!auth) return new NextResponse("Auth required", { status: 401, headers: { "WWW-Authenticate": realm } });
  const [scheme, encoded] = auth.split(" ");
  if (scheme !== "Basic" || !encoded) return new NextResponse("Invalid auth", { status: 401, headers: { "WWW-Authenticate": realm } });
  const [user, pass] = Buffer.from(encoded, "base64").toString().split(":");
  if (user !== process.env.DASH_USER || pass !== process.env.DASH_PASS) {
    return new NextResponse("Forbidden", { status: 401, headers: { "WWW-Authenticate": realm } });
  }
  return NextResponse.next();
}
export const config = { matcher: ["/dashboard/:path*"] };
