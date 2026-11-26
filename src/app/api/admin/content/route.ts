import { NextResponse } from "next/server";
import { getAdminDb, isAdminConfigured } from "@/lib/firebase/admin";
import { requireAdmin } from "@/lib/server/requireAdmin";

export const runtime = "nodejs";

const ALLOWED_COLLECTIONS = new Set([
  "subjects",
  "chapters",
  "pyq_papers",
  "game_questions",
]);

interface ContentPayload {
  idToken?: string;
  collection?: string;
  id?: string;
  data?: Record<string, unknown>;
  action?: "save" | "delete";
}

export async function POST(request: Request) {
  try {
    if (!isAdminConfigured()) {
      return NextResponse.json(
        { error: "Admin server is not configured. Check Firebase Admin credentials in .env.local." },
        { status: 500 }
      );
    }

    const body = (await request.json()) as ContentPayload;
    await requireAdmin(body.idToken);

    const collectionName = body.collection || "";
    if (!ALLOWED_COLLECTIONS.has(collectionName)) {
      return NextResponse.json({ error: "Invalid content collection." }, { status: 400 });
    }
    if (!body.id || typeof body.id !== "string") {
      return NextResponse.json({ error: "A valid document id is required." }, { status: 400 });
    }

    const now = new Date().toISOString();
    const ref = getAdminDb().collection(collectionName).doc(body.id);

    if (body.action === "delete") {
      await ref.set({ isDeleted: true, updatedAt: now }, { merge: true });
      return NextResponse.json({ ok: true, id: body.id, action: "deleted" });
    }

    if (!body.data || typeof body.data !== "object") {
      return NextResponse.json({ error: "Content data is required." }, { status: 400 });
    }

    await ref.set(
      {
        ...body.data,
        id: body.id,
        isDeleted: false,
        updatedAt: now,
        createdAt: body.data.createdAt || now,
      },
      { merge: true }
    );

    return NextResponse.json({ ok: true, id: body.id, action: "saved" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Content request failed.";
    const status = message.startsWith("Forbidden") || message.includes("token")
      ? 403
      : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
