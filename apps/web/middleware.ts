import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only guard dashboard routes
  if (!pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  // Simple check: require presence of our session cookie
  const sessionCookie = req.cookies.get("session")?.value;
  if (!sessionCookie) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// This config ensures the middleware runs on all dashboard pages.
export const config = {
  matcher: ["/dashboard/:path*"],
};
