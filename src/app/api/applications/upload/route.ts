import { applyRateLimit } from "@/utils/rate-limit";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import * as path from "path";
import * as _ from "lodash";

const s3Client = new S3Client({
  region: "ap-southeast-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY as string,
    secretAccessKey: process.env.AWS_SECRET_KEY as string,
  },
});

const prismaService = new PrismaClient({ log: ["error"] });
export async function POST(request: NextRequest) {
  try {
    const rateLimitResponse = applyRateLimit(request);
    if (rateLimitResponse) return rateLimitResponse;
    const data = await request.formData();
    const applicationId = data.get("applicationId") as string;
    const cvFile = data.get("cvFile") as File;
    const otherFile = data.get("otherFile") as File | null;
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
      const cvFileName = `applicants/cv-resume/${_.upperCase(
        find.Applicants.lastName
      )}-${find.referenceNo}${path.extname(cvFile.name)}`;
      const params = {
        Bucket: "cryptex-job-fair",
        Key: cvFileName,
        Body: Buffer.from(await cvFile.arrayBuffer()),
        ContentType: cvFile.type,
      };
      await s3Client.send(new PutObjectCommand(params));

      if (otherFile && otherFile.size > 0) {
        const ofName = `applicants/other-files/${_.upperCase(
          find.Applicants.lastName
        )}-${find.referenceNo}${path.extname(otherFile.name)}`;
        const params = {
          Bucket: "cryptex-job-fair",
          Key: ofName,
          Body: Buffer.from(await otherFile.arrayBuffer()),
          ContentType: otherFile.type,
        };
        await s3Client.send(new PutObjectCommand(params));

        return NextResponse.json(
          {
            cvFile: `${process.env.AWS_URL}/${cvFileName}`,
            otherFiles: `${process.env.AWS_URL}/${ofName}`,
          },
          { status: 202 }
        );
      }
      return NextResponse.json(
        { cvFile: `${process.env.AWS_URL}/${cvFileName}` },
        { status: 202 }
      );
    }
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to upload files", e },
      { status: 500 }
    );
  }
}
