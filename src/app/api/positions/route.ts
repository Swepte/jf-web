import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { applyRateLimit } from "@/utils/rate-limit";

const prismaService = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const rateLimitResponse = applyRateLimit(request);
    if (rateLimitResponse) return rateLimitResponse;

    const positions = await prismaService.positions.findMany({
      select: {
        uuid: true,
        department: true,
        value: true,
      },
      where: {
        isDeleted: false,
        status: "OPEN",
      },
      orderBy: {
        department: "desc",
      },
    });

    return NextResponse.json(
      {
        data: positions,
      },
      { status: 202 }
    );
  } catch {
    return NextResponse.json({ message: "There's an error." }, { status: 500 });
  }
}
