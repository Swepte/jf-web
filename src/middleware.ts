import { NextResponse, NextRequest } from "next/server";

import { auth } from "./app/api/auth/auth";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const session = await auth();
  console.log(session ? "authorize" : "not authorize");
  console.log(session);

  if (!session && path === "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (session && path === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return null;

  return null;
}
// export const config = {
//   matcher: ['/((?!login).*)'],
// };
