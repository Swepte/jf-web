import TemplateMail from "@/template/email-temp";
import { sendEmail } from "@/utils/mail.utils";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import * as yup from "yup";

const prismaService = new PrismaClient();

const postSchema = yup.object({
  recepientEmail: yup.string().email().required(),
});

export async function POST(request: NextRequest) {
  try {
    const { recipientEmail } = await request.json();
    await postSchema.validate({ recipientEmail });
    const sender = {
      name: "Authentication Code",
      address: "no-reply@example.com",
    };

    const receipients = [
      {
        name: "Applicant",
        address: recipientEmail,
      },
    ];

    const find = await prismaService.authenticationCodes.findFirst({
      orderBy: {
        id: "desc",
      },
      where: {
        isDeleted: false,
      },
    });

    if (find) {
      const pad = (find.id + 1)
        .toString()
        .padStart(6, Math.floor(Math.random() * 99999999).toString());

      const result = await sendEmail({
        sender,
        receipients,
        subject: "Cryptex Authentication Code",
        message: pad,
        html: TemplateMail(pad),
      });

      await prismaService.authenticationCodes.create({
        data: {
          email: recipientEmail,
          code: pad,
        },
      });

      return NextResponse.json(
        {
          id: result.messageId,
          message: result.accepted,
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Email sending failed, please try again." },
      { status: 500 }
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
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
