import { NextResponse } from "next/server";

export function middleware(req) {
  console.log("🔥 MIDDLEWARE OK:", req.nextUrl.pathname);

  const token = req.cookies.get("token")?.value;

  if (!token) return NextResponse.next();

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-auth", "present");

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: ["/:path*"],
};
