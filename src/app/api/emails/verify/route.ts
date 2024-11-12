import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import * as yup from "yup";
import * as argon from "argon2";
import { applyRateLimit } from "@/utils/rate-limit";
import { post } from "@/utils/http";

const postSchema = yup.object({
  code: yup.number().required("Code is missing."),
  email: yup.string().email().required("Email is missing."),
});

const prismaService = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { code, email } = await request.json();
    const rateLimitResponse = applyRateLimit(request);
    if (rateLimitResponse) return rateLimitResponse;
    await postSchema.validate({ code, email });
    const find = await prismaService.authenticationCodes.findFirst({
      select: {
        uuid: true,
        code: true,
        retry: true,
      },
      where: {
        email: email,
        isDeleted: false,
      },
    });

    if (!find) {
      throw new Error();
    }
    await verifyCode(find.uuid, find.retry, email, find.code, code);
    await prismaService.authenticationCodes.update({
      data: {
        isDeleted: true,
      },
      where: {
        uuid: find.uuid,
      },
    });
    return NextResponse.json({ message: "Authenticated" }, { status: 202 });
  } catch {
    return NextResponse.json(
      { message: "Authentication Failed." },
      { status: 500 }
    );
  }
}

async function verifyCode(
  authId: string,
  retry: number,
  email: string,
  hashedCode: string,
  code: string
) {
  const secret = process.env.ARG_SECRET;
  if (!secret) {
    throw new Error();
  }
  const verify = await argon.verify(hashedCode, code, {
    secret: Buffer.from(secret),
  });

  if (!verify) {
    if (retry >= 3) {
      await post("/api/emails", {
        recipientEmail: email,
      });
      throw new Error(
        "Max retry reached, authentication code will be regenerated."
      );
    }
    await prismaService.authenticationCodes.update({
      data: {
        retry: retry + 1,
      },
      where: {
        uuid: authId,
      },
    });
    throw new Error();
  }

  return true;
}
