import { NextRequest, NextResponse } from "next/server";
import {
  S3Client,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getNextMooniversaryNumber } from "@/lib/mooniversary";
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
    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get("id");

    if (!moonNumber || !imageId) {
      return new NextResponse(createTransparentPixel(), {
        status: 400,
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "no-cache",
        },
      });
    }

    const key = `moons/${moonNumber}/${imageId}.jpg`;

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
    type MaybeHttpStatus = { $metadata?: { httpStatusCode?: number } };
    const httpStatusCode = (error as unknown as MaybeHttpStatus).$metadata
      ?.httpStatusCode;
    if (
      error instanceof Error &&
      (error.name === "NoSuchKey" || httpStatusCode === 404)
    ) {
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ moonNumber: string }> },
) {
  try {
    const { moonNumber } = await params;
    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get("id");
    const body = await request.json().catch(() => null);
    const password = body?.password as string | undefined;

    if (!moonNumber || !imageId) {
      return NextResponse.json(
        { error: "Missing moonNumber or imageId" },
        { status: 400 },
      );
    }

    if (!password || password !== process.env.APP_SECRET_KEY) {
      return NextResponse.json(
        { error: "lol did you forget the password again" },
        { status: 401 },
      );
    }

    const nextMooniversaryNumber = getNextMooniversaryNumber();
    const moonNum = parseInt(moonNumber);
    if (Number.isNaN(moonNum) || moonNum > nextMooniversaryNumber) {
      return NextResponse.json(
        { error: "Cannot delete future moon images" },
        { status: 403 },
      );
    }

    const originalKey = `moons/${moonNumber}/${imageId}.jpg`;
    const thumbnailKey = `moons/${moonNumber}/${imageId}.thumbnail.jpg`;

    await Promise.all([
      s3Client.send(
        new DeleteObjectCommand({
          Bucket: BUCKET_NAME,
          Key: originalKey,
        }),
      ),
      s3Client.send(
        new DeleteObjectCommand({
          Bucket: BUCKET_NAME,
          Key: thumbnailKey,
        }),
      ),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting image:", error);
    Sentry.captureException(error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 },
    );
  }
}
