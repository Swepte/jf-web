import { NextResponse } from "next/server";

const windowSize = 60000;
const maxRequests = 10;
const ipRequests: Record<string, number[]> = {};

const cleanupOldRequests = (timestamps: number[]) => {
  const now = Date.now();
  return timestamps.filter((timestamp) => now - timestamp < windowSize);
};

const getIP = (req: Request): string | null => {
  const forwardedFor = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");

  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  if (realIp) return realIp.trim();

  return null;
};

export const applyRateLimit = (req: Request) => {
  const ip = getIP(req);
  console.log(ip);

  if (!ip) {
    return NextResponse.json(
      { message: "IP address not found" },
      { status: 400 }
    );
  }

  console.log(ipRequests[ip]);
  if (!ipRequests[ip]) {
    ipRequests[ip] = [];
  }

  ipRequests[ip] = cleanupOldRequests(ipRequests[ip]);
  console.log(ipRequests[ip].length);
  if (ipRequests[ip].length >= maxRequests) {
    return NextResponse.json(
      { message: "Rate limit exceeded" },
      { status: 429 }
    );
  }

  ipRequests[ip].push(Date.now());

  return null;
};
