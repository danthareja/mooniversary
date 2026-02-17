import { NextRequest, NextResponse } from "next/server";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import * as Sentry from "@sentry/nextjs";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ moonNumber: string }> },
) {
  try {
    const { moonNumber } = await params;
    if (!moonNumber) {
      return NextResponse.json({ images: [] });
    }

    const prefix = `moons/${moonNumber}/`;
    const allContents: { Key?: string }[] = [];
    let continuationToken: string | undefined;

    do {
      const command = new ListObjectsV2Command({
        Bucket: BUCKET_NAME,
        Prefix: prefix,
        MaxKeys: 100,
        ContinuationToken: continuationToken,
      });
      const response = await s3Client.send(command);
      allContents.push(...(response.Contents || []));
      continuationToken = response.IsTruncated
        ? response.NextContinuationToken
        : undefined;
    } while (continuationToken);

    const keys = allContents
      .map((o) => o.Key)
      .filter((k): k is string => Boolean(k))
      .filter((k) => k.endsWith(".jpg"))
      .filter((k) => !k.endsWith(".thumbnail.jpg"));

    const images = keys.map((key) => {
      const filename = key.substring(prefix.length);
      const id = filename.replace(/\.jpg$/, "");
      return id;
    });

    images.sort((a, b) => Number(a) - Number(b));

    return NextResponse.json({ images });
  } catch (error) {
    console.error("Error listing images:", error);
    Sentry.captureException(error);
    return NextResponse.json({ images: [] }, { status: 200 });
  }
}
