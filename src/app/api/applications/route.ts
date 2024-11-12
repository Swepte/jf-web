import { applyRateLimit } from "@/utils/rate-limit";
import { PrismaClient } from "@prisma/client";
import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";
import * as yup from "yup";

const prismaService = new PrismaClient();
const postSchema = yup.object({
  positions: yup.array(yup.string()).required("Position is required."),
  Applicants: yup
    .object({
      firstName: yup.string().required("Firstname is required."),
      middleName: yup.string().optional(),
      lastName: yup.string().required("Lastname is required."),
      mobileNo: yup.array(yup.string()).required("Mobile No is required."),
      phoneNo: yup.array(yup.string()).optional(),
      address: yup.array(yup.string()).required("Address is required."),
      degree: yup.string().optional(),
      email: yup.string().email("Invalid email address").required(),
      university: yup.string().optional(),
    })
    .required("Applicants information is required"),
});

export async function POST(request: NextRequest) {
  try {
    const rateLimitResponse = applyRateLimit(request);
    if (rateLimitResponse) return rateLimitResponse;
    const data = await request.json();
    await postSchema.validate(data, { abortEarly: false });
    const { Applicants: applicants, ...app } = data;
    const code = await generateCode();
    const isExist = await isApplicantExisting(data?.Applicants?.email);
    const a = await prismaService.applications.create({
      data: {
        ...app,
        referenceNo: code,
        applicantId: isExist ? isExist.uuid : undefined,
        Applicants: isExist
          ? undefined
          : {
              create: applicants,
            },
      },
      include: {
        Applicants: true,
      },
    });
    return NextResponse.json(
      {
        data: {
          uuid: a.uuid,
          reference: a.referenceNo,
          ...data,
        },
        success: true,
        message: "Form submitted successfully!",
      },
      {
        status: HttpStatusCode.Accepted,
      }
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
    return NextResponse.json(
      { error: "Failed to create application" },
      { status: 500 }
    );
  }
}

async function generateCode() {
  const find = await prismaService.applications.findFirst({
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

async function isApplicantExisting(email: string) {
  const app = prismaService.applicants.findFirst({
    where: {
      isDeleted: false,
      email: email,
    },
  });

  return app;
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    const rateLimitResponse = applyRateLimit(request);
    if (rateLimitResponse) return rateLimitResponse;
    if (id) {
      const a = await prismaService.applications.findMany({
        where: {
          uuid: id || undefined,
        },
        include: {
          Applicants: true,
        },
      });
      return NextResponse.json({ data: a }, { status: 200 });
    }
    return NextResponse.json(
      { error: "Missing applicationID in the request body." },
      { status: 500 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to find application" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { uuid, ...data } = await request.json();
    const rateLimitResponse = applyRateLimit(request);
    if (rateLimitResponse) return rateLimitResponse;
    if (uuid) {
      const a = await prismaService.applicants.update({
        data: {
          ...data,
          updatedAt: new Date(),
        },
        where: {
          uuid,
        },
      });
      return NextResponse.json({
        data: a,
        success: true,
        message: "Data updated successfully!",
      });
    }
    return NextResponse.json({ error: "UUID is required." }, { status: 500 });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return NextResponse.json(
      { error: "Failed to update application" },
      { status: 500 }
    );
  }
}
