import { NextRequest, NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import * as Sentry from "@sentry/nextjs";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!;

const createTransparentPixel = () => {
  const transparentPng = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI9jU77mgAAAABJRU5ErkJggg==",
    "base64",
  );
  return transparentPng;
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ moonNumber: string }> },
) {
  try {
    const { moonNumber } = await params;

    if (!moonNumber) {
      return new NextResponse(createTransparentPixel(), {
        status: 400,
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "no-cache",
        },
      });
    }

    const key = `moon-${moonNumber}.jpg`;

    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    const response = await s3Client.send(command);

    if (!response.Body) {
      return new NextResponse(createTransparentPixel(), {
        status: 404,
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "no-cache",
        },
      });
    }

    const buffer = await response.Body.transformToByteArray();

    const headers: Record<string, string> = {
      "Content-Type": "image/jpeg",
    };

    if (response.ETag) {
      headers["ETag"] = response.ETag;
    }

    if (response.LastModified) {
      headers["Last-Modified"] = response.LastModified.toUTCString();
    }

    return new NextResponse(buffer, { headers });
  } catch (error) {
    if (error instanceof Error && error.name === "NoSuchKey") {
      return new NextResponse(createTransparentPixel(), {
        status: 404,
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "no-cache",
        },
      });
    }

    console.error("Error retrieving image:", error);
    Sentry.captureException(error);

    return new NextResponse(createTransparentPixel(), {
      status: 500,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-cache",
      },
    });
  }
}
