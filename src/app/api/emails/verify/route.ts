import TemplateMail from "@/template/email-temp";
import { sendEmail } from "@/utils/mail.utils";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import * as yup from "yup";

const postSchema = yup.object({
  code: yup.number().required("Code is missing."),
  email: yup.string().email().required("Email is missing."),
});

const prismaService = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { code, email } = await request.json();
    await postSchema.validate({ code, email });
    const find = await prismaService.authenticationCodes.findFirst({
      select: {
        uuid: true,
        code: true,
      },
      where: {
        email: email,
        code: code,
      },
    });

    if (find) {
      await prismaService.authenticationCodes.update({
        data: {
          isDeleted: true,
        },
        where: {
          uuid: find.uuid,
        },
      });
      return NextResponse.json({ message: "Authenticated" }, { status: 202 });
    }
    return NextResponse.json(
      { error: "Authentication Failed." },
      { status: 401 }
    );
  } catch (e) {
    return NextResponse.json({ message: e }, { status: 500 });
  }
}
