import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

const PROFILE_IMAGE_TYPES = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);
export const MAX_PROFILE_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

function createR2Client(): S3Client {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error("R2 credentials are not configured (R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY).");
  }
  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });
}

// Build a public URL for a stored object key.
export function generatePublicUrl(key: string): string {
  const base = process.env.R2_PUBLIC_URL;
  if (!base) throw new Error("R2_PUBLIC_URL is not configured.");
  return `${base.replace(/\/$/, "")}/${key}`;
}

// Extract the R2 object key from a full public URL. Returns null if the URL
// doesn't belong to this bucket (safe to ignore silently).
export function extractKeyFromUrl(url: string): string | null {
  const base = process.env.R2_PUBLIC_URL?.replace(/\/$/, "");
  if (!base || !url.startsWith(`${base}/`)) return null;
  return url.slice(base.length + 1);
}

export type UploadOptions = {
  allowedTypes?: Set<string>;
  maxSize?: number;
};

// Core reusable upload helper — stores any file under the given prefix folder.
// Returns the object key (not the full URL).
export async function uploadFile(
  prefix: string,
  buffer: Buffer,
  mimeType: string,
  options?: UploadOptions,
): Promise<string> {
  const allowedTypes = options?.allowedTypes ?? PROFILE_IMAGE_TYPES;
  const maxSize = options?.maxSize ?? MAX_PROFILE_IMAGE_SIZE;

  if (!allowedTypes.has(mimeType)) {
    const err = new Error(`Invalid file type "${mimeType}". Allowed: ${[...allowedTypes].join(", ")}.`);
    (err as NodeJS.ErrnoException).code = "INVALID_TYPE";
    throw err;
  }
  if (buffer.byteLength > maxSize) {
    const err = new Error(`File too large (${buffer.byteLength} bytes). Maximum: ${maxSize} bytes.`);
    (err as NodeJS.ErrnoException).code = "TOO_LARGE";
    throw err;
  }

  const extMap: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  };
  const ext = extMap[mimeType] ?? mimeType.split("/")[1] ?? "bin";
  const key = `${prefix.replace(/\/$/, "")}/${randomUUID()}.${ext}`;

  const bucket = process.env.R2_BUCKET_NAME;
  if (!bucket) throw new Error("R2_BUCKET_NAME is not configured.");

  const client = createR2Client();
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );

  return key;
}

// Delete any file by its R2 object key. Safe to call with an empty string.
export async function deleteFile(key: string): Promise<void> {
  if (!key) return;
  const bucket = process.env.R2_BUCKET_NAME;
  if (!bucket) throw new Error("R2_BUCKET_NAME is not configured.");
  const client = createR2Client();
  await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}

// ─── Profile image helpers ────────────────────────────────────────────────────

export async function uploadProfileImage(buffer: Buffer, mimeType: string): Promise<string> {
  return uploadFile("avatars", buffer, mimeType, {
    allowedTypes: PROFILE_IMAGE_TYPES,
    maxSize: MAX_PROFILE_IMAGE_SIZE,
  });
}

export async function deleteProfileImage(key: string): Promise<void> {
  return deleteFile(key);
}
