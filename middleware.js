import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  //   const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  //   if (req.nextUrl.pathname.startsWith("/admin")) {
  //     // If not logged in or not admin, redirect to login
  //     if (!token || token.isAdmin !== true) {
  //       const loginUrl = new URL("/auth/login", req.url);
  //       loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
  //       return NextResponse.redirect(loginUrl);
  //     }
  //   }
  //   return NextResponse.next();
}
// export const config = {
//   matcher: ["/admin/:path*"],
// };
