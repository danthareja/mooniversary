#!/usr/bin/env node
/*
  Migration: Move legacy S3 image keys to new per-moon folder scheme.
  - From: moon-{moonNumber}.jpg and moon-{moonNumber}-thumbnail.jpg
  - To:   moons/{moonNumber}/{timestamp}.jpg and moons/{moonNumber}/{timestamp}.thumbnail.jpg

  Environment variables required:
  - AWS_REGION
  - AWS_ACCESS_KEY_ID
  - AWS_SECRET_ACCESS_KEY
  - AWS_S3_BUCKET_NAME

  Usage:
    node scripts/migrate-images.mjs
*/

import { config } from "dotenv";
config();

import {
  S3Client,
  ListObjectsV2Command,
  CopyObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";

const region = process.env.AWS_REGION || "us-east-1";
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const bucket = process.env.AWS_S3_BUCKET_NAME;

if (!accessKeyId || !secretAccessKey || !bucket) {
  console.error(
    "Missing AWS env vars: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_S3_BUCKET_NAME",
  );
  process.exit(1);
}

const s3 = new S3Client({
  region,
  credentials: { accessKeyId, secretAccessKey },
});

async function listAll(prefix) {
  const results = [];
  let ContinuationToken = undefined;
  do {
    const resp = await s3.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: prefix,
        ContinuationToken,
      }),
    );
    (resp.Contents || []).forEach((o) => o.Key && results.push(o.Key));
    ContinuationToken = resp.IsTruncated
      ? resp.NextContinuationToken
      : undefined;
  } while (ContinuationToken);
  return results;
}

async function migrateOne(moonNumber) {
  const legacyOriginal = `moon-${moonNumber}.jpg`;
  const legacyThumb = `moon-${moonNumber}-thumbnail.jpg`;

  // Check existence
  const exists = async (Key) => {
    try {
      await s3.send(new HeadObjectCommand({ Bucket: bucket, Key }));
      return true;
    } catch {
      return false;
    }
  };

  const hasOriginal = await exists(legacyOriginal);
  const hasThumb = await exists(legacyThumb);
  if (!hasOriginal && !hasThumb) return false;

  // Choose an id (timestamp)
  const imageId = Date.now().toString();
  const newOriginal = `moons/${moonNumber}/${imageId}.jpg`;
  const newThumb = `moons/${moonNumber}/${imageId}.thumbnail.jpg`;

  if (hasOriginal) {
    await s3.send(
      new CopyObjectCommand({
        Bucket: bucket,
        CopySource: `/${bucket}/${legacyOriginal}`,
        Key: newOriginal,
        ContentType: "image/jpeg",
        MetadataDirective: "REPLACE",
      }),
    );
    await s3.send(
      new DeleteObjectCommand({ Bucket: bucket, Key: legacyOriginal }),
    );
    console.log(`Moved ${legacyOriginal} -> ${newOriginal}`);
  }

  if (hasThumb) {
    await s3.send(
      new CopyObjectCommand({
        Bucket: bucket,
        CopySource: `/${bucket}/${legacyThumb}`,
        Key: newThumb,
        ContentType: "image/jpeg",
        MetadataDirective: "REPLACE",
      }),
    );
    await s3.send(
      new DeleteObjectCommand({ Bucket: bucket, Key: legacyThumb }),
    );
    console.log(`Moved ${legacyThumb} -> ${newThumb}`);
  }

  return true;
}

async function main() {
  // Find all legacy keys
  const originals = await listAll("moon-");
  const moonNumbers = new Set();
  originals.forEach((key) => {
    const m = key.match(/^moon-(\d+)(-thumbnail)?\.jpg$/);
    if (m) moonNumbers.add(m[1]);
  });

  const sorted = Array.from(moonNumbers).sort((a, b) => Number(a) - Number(b));
  let migrated = 0;
  for (const moon of sorted) {
    const moved = await migrateOne(moon);
    if (moved) migrated += 1;
  }
  console.log(`Done. Migrated ${migrated} moon(s).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
