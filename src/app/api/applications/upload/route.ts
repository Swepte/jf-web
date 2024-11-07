import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const applicationId = data.get("applicationId") as string;
    const cvFile = data.get("cvFile") as File;
    const otherFile = data.getAll("otherFile") as File[];
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create application" },
      { status: 500 }
    );
  }
}
