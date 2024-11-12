import TemplateMail from "@/template/email-temp";
import { sendEmail } from "@/utils/mail.utils";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import * as yup from "yup";
import * as argon from "argon2";
import { applyRateLimit } from "@/utils/rate-limit";

const prismaService = new PrismaClient({ log: ["error"] });

const postSchema = yup.object({
  recipientEmail: yup.string().email().required(),
});

export async function POST(request: NextRequest) {
  try {
    const { recipientEmail } = await request.json();
    const rateLimitResponse = applyRateLimit(request);
    if (rateLimitResponse) return rateLimitResponse;
    await postSchema.validate({ recipientEmail });

    const sender = {
      name: "Authentication Code",
      address: "no-reply@example.com",
    };

    const recipients = [
      {
        name: "Applicant",
        address: recipientEmail,
      },
    ];

    await prismaService.authenticationCodes.deleteMany({
      where: {
        isDeleted: false,
        email: recipientEmail,
      },
    });

    const generatedCode = await generateCode();

    const result = await sendEmail({
      sender,
      recipients,
      subject: "Cryptex Authentication Code",
      message: generatedCode,
      html: TemplateMail(generatedCode),
    });

    await prismaService.authenticationCodes.create({
      data: {
        email: recipientEmail,
        code: await hash(generatedCode),
      },
    });

    return NextResponse.json(
      {
        id: result.messageId,
        message: result.accepted,
      },
      { status: 202 }
    );
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const errorDetails = error.inner.map((err) => ({
        path: err.path,
        message: err.message,
      }));

      return NextResponse.json(
        { error: "Validation failed", details: errorDetails },
        { status: 400 }
      );
    }
    return NextResponse.json({ message: "There's an error." }, { status: 500 });
  }
}

async function hash(code: string) {
  const secret = process.env.ARG_SECRET;
  if (!secret) {
    throw new Error("ARG_SECRET environment variable is not set.");
  }

  const hash = await argon.hash(code, {
    type: argon.argon2id,
    secret: Buffer.from(secret),
  });

  return hash;
}

async function generateCode() {
  const find = await prismaService.authenticationCodes.findFirst({
    orderBy: {
      id: "desc",
    },
    where: {
      isDeleted: false,
    },
  });

  return (find?.id || 0 + 1)
    .toString()
    .padStart(6, Math.floor(Math.random() * 99999999).toString());
}
