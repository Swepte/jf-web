import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import * as path from "path";

const s3Client = new S3Client({
  region: "ap-southeast-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY as string,
    secretAccessKey: process.env.AWS_SECRET_KEY as string,
  },
});

const prismaService = new PrismaClient();
export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const applicationId = data.get("applicationId") as string;
    const cvFile = data.get("cvFile") as File;
    const otherFile = data.getAll("otherFile") as File[];
    if (!cvFile) {
      return NextResponse.json(
        { error: "No CV file uploaded" },
        { status: 400 }
      );
    }
    const find = await prismaService.applications.findFirst({
      where: {
        uuid: applicationId,
        isDeleted: false,
      },
      include: {
        Applicants: true,
      },
    });

    if (find) {
      const cvFileName = `applicants/cv-resume/${find.Applicants.firstName}-${
        find.Applicants.lastName
      }${path.extname(cvFile.name)}`;
      const params = {
        Bucket: "cryptex-job-fair",
        Key: cvFileName,
        Body: Buffer.from(await cvFile.arrayBuffer()),
        ContentType: cvFile.type,
      };
      await s3Client.send(new PutObjectCommand(params));

      if (otherFile) {
        const oF = await Promise.all(
          otherFile.map(async (v, key) => {
            const fileName = `applicants/other-files/${
              find.Applicants.firstName
            }-${find.Applicants.lastName}-${key}${path.extname(cvFile.name)}`;
            const params = {
              Bucket: "cryptex-job-fair",
              Key: fileName,
              Body: Buffer.from(await v.arrayBuffer()),
              ContentType: v.type,
            };
            await s3Client.send(new PutObjectCommand(params));

            return `${process.env.AWS_URL}/${fileName}`;
          })
        );
        return NextResponse.json(
          { cvFile: `${process.env.AWS_URL}/${cvFileName}`, otherFiles: oF },
          { status: 202 }
        );
      }
      return NextResponse.json({ cvFile: cvFileName }, { status: 202 });
    }
  } catch {
    return NextResponse.json(
      { error: "Failed to upload files" },
      { status: 500 }
    );
  }
}
