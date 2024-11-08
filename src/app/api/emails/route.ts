import TemplateMail from "@/template/email-temp";
import { sendEmail } from "@/utils/mail.utils";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { recipientName = "JAMILLE", recipientEmail } = await request.json();
  const sender = {
    name: "JOB APPLICATION FORM",
    address: "no-reply@example.com",
  };
  const receipients = [
    {
      name: recipientName,
      address: recipientEmail,
    },
  ];

  try {
    const result = await sendEmail({
      sender,
      receipients,
      subject: "REFERENCE NO",
      message: "69696969",
      html: TemplateMail("69696969"),
    });
    return Response.json({
      accepted: result.accepted,
    });
  } catch (e) {
    return Response.json({ message: e }, { status: 500 });
  }
}
