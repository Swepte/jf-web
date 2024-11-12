// app/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { applyRateLimit } from "./utils/rate-limit";

export function middleware(req: NextRequest) {
  console.log(req.url);
  if (req.url.startsWith("/api/")) {
    return applyRateLimit(req);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/",
};
