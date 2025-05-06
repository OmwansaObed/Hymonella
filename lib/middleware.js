// middleware.js
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

const adminPaths = ["/admin", "/admin/dashboard"];

export async function middleware(request) {
  const token = await getToken({ req: request });

  const isAdminRoute = adminPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isAdminRoute) {
    if (!token || !token.isAdmin) {
      const url = request.nextUrl.clone();
      url.pathname = "/unauthorized"; // You can also redirect to login or homepage
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"], // Only run middleware on admin routes
};
