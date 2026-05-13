import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import * as repo from "@/lib/repositories/profile";
import {
  uploadProfileImage,
  deleteProfileImage,
  generatePublicUrl,
  extractKeyFromUrl,
} from "@/lib/storage";

export const runtime = "nodejs";

// POST /api/profile/avatar
// Accepts multipart/form-data with an "image" field.
// Uploads to R2, deletes the previous image, and updates the DB.
export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response;

  try {
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json(
        { message: "Очаква се multipart/form-data с поле 'image'." },
        { status: 400 },
      );
    }

    const file = formData.get("image");
    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { message: "Полето 'image' не е намерено в заявката." },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    let key: string;
    try {
      key = await uploadProfileImage(buffer, file.type);
    } catch (err) {
      const code = (err as { code?: string }).code;
      if (code === "INVALID_TYPE") {
        return NextResponse.json(
          { message: "Невалиден тип файл. Позволени: jpg, jpeg, png, webp." },
          { status: 400 },
        );
      }
      if (code === "TOO_LARGE") {
        return NextResponse.json(
          { message: "Файлът е твърде голям. Максимум 5 MB." },
          { status: 400 },
        );
      }
      throw err;
    }

    // Fire-and-forget: delete old R2 object after the new upload succeeds.
    const existing = await repo.getByUserId(auth.payload.sub);
    if (existing?.avatarUrl) {
      const oldKey = extractKeyFromUrl(existing.avatarUrl);
      if (oldKey) {
        deleteProfileImage(oldKey).catch((e) =>
          console.warn("Failed to delete old avatar from R2:", e),
        );
      }
    }

    const avatarUrl = generatePublicUrl(key);
    const profile = await repo.updateByUserId(auth.payload.sub, { avatarUrl });
    return NextResponse.json({ profile }, { status: 200 });
  } catch (err) {
    console.error("POST /api/profile/avatar", err);
    return NextResponse.json({ message: "Сървърна грешка." }, { status: 500 });
  }
}

// DELETE /api/profile/avatar
// Removes the user's avatar from R2 and clears it in the DB.
export async function DELETE(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response;

  try {
    const existing = await repo.getByUserId(auth.payload.sub);
    if (existing?.avatarUrl) {
      const key = extractKeyFromUrl(existing.avatarUrl);
      if (key) {
        deleteProfileImage(key).catch((e) =>
          console.warn("Failed to delete avatar from R2:", e),
        );
      }
    }

    const profile = await repo.updateByUserId(auth.payload.sub, { avatarUrl: null });
    return NextResponse.json({ profile }, { status: 200 });
  } catch (err) {
    console.error("DELETE /api/profile/avatar", err);
    return NextResponse.json({ message: "Сървърна грешка." }, { status: 500 });
  }
}
