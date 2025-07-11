import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import { getNextMooniversaryNumber } from "@/lib/mooniversary";
import * as Sentry from "@sentry/nextjs";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!;
const APP_SECRET_KEY = process.env.APP_SECRET_KEY!;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File;
    const password = formData.get("password") as string;
    const moonNumber = formData.get("moonNumber") as string;

    if (password !== APP_SECRET_KEY) {
      return NextResponse.json(
        { error: "lol did you forget the password" },
        { status: 401 },
      );
    }

    if (!file) {
      return NextResponse.json(
        { error: "No cute pic provided" },
        { status: 400 },
      );
    }

    if (!moonNumber) {
      return NextResponse.json(
        { error: "Moon number is required" },
        { status: 400 },
      );
    }

    // Validate moon number is not in the future
    const nextMooniversaryNumber = getNextMooniversaryNumber();
    const moonNum = parseInt(moonNumber);
    if (moonNum > nextMooniversaryNumber) {
      return NextResponse.json(
        {
          error:
            "Images can only be uploaded for the current and previous moons",
        },
        { status: 403 },
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const processedImage = await sharp(buffer)
      .rotate() // Auto-rotate based on EXIF orientation
      .resize(1200, 1200, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 90 })
      .toBuffer();

    // Create thumbnail
    const thumbnail = await sharp(buffer)
      .rotate() // Auto-rotate based on EXIF orientation
      .resize(400, 400, { fit: "cover" })
      .jpeg({ quality: 80 })
      .toBuffer();

    // Upload original image to S3
    const originalKey = `moon-${moonNumber}.jpg`;
    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: originalKey,
        Body: processedImage,
        ContentType: "image/jpeg",
      }),
    );

    // Upload thumbnail to S3
    const thumbnailKey = `moon-${moonNumber}-thumbnail.jpg`;
    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: thumbnailKey,
        Body: thumbnail,
        ContentType: "image/jpeg",
      }),
    );

    return NextResponse.json({
      success: true,
      message: "Image uploaded successfully",
      moonNumber,
    });
  } catch (error) {
    console.error("Upload error:", error);
    Sentry.captureException(error);
    return NextResponse.json(
      { error: "Failed to upload cute pic" },
      { status: 500 },
    );
  }
}
