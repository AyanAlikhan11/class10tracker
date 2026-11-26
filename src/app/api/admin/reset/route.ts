import { NextResponse } from "next/server";
import { getAdminDb, isAdminConfigured } from "@/lib/firebase/admin";
import { requireAdmin } from "@/lib/server/requireAdmin";

export const runtime = "nodejs";

const ACTIVITY_COLLECTIONS = [
  "student_progress",
  "study_tasks",
  "study_sessions",
  "exam_records",
  "mistakes",
  "game_scores",
];

interface ResetPayload {
  idToken?: string;
  uid?: string;
  all?: boolean;
}

async function deleteDocsForUser(uid: string): Promise<number> {
  const db = getAdminDb();
  let deleted = 0;
  for (const collectionName of ACTIVITY_COLLECTIONS) {
    const snap = await db.collection(collectionName).where("studentId", "==", uid).get();
    if (snap.empty) continue;
    let batch = db.batch();
    let ops = 0;
    for (const docSnap of snap.docs) {
      batch.delete(docSnap.ref);
      ops += 1;
      deleted += 1;
      if (ops === 450) {
        await batch.commit();
        batch = db.batch();
        ops = 0;
      }
    }
    if (ops > 0) await batch.commit();
  }
  return deleted;
}

async function deleteAllActivity(): Promise<number> {
  const db = getAdminDb();
  let deleted = 0;
  for (const collectionName of ACTIVITY_COLLECTIONS) {
    const snap = await db.collection(collectionName).get();
    if (snap.empty) continue;
    let batch = db.batch();
    let ops = 0;
    for (const docSnap of snap.docs) {
      batch.delete(docSnap.ref);
      ops += 1;
      deleted += 1;
      if (ops === 450) {
        await batch.commit();
        batch = db.batch();
        ops = 0;
      }
    }
    if (ops > 0) await batch.commit();
  }
  return deleted;
}

export async function POST(request: Request) {
  try {
    if (!isAdminConfigured()) {
      return NextResponse.json(
        { error: "Admin server is not configured. Check Firebase Admin credentials in .env.local." },
        { status: 500 }
      );
    }

    const body = (await request.json()) as ResetPayload;
    await requireAdmin(body.idToken);

    if (body.all) {
      const deleted = await deleteAllActivity();
      return NextResponse.json({ ok: true, scope: "all", deleted });
    }

    const safeUidRegex = /^[a-zA-Z0-9_\-\.]{1,128}$/;
    if (!body.uid || typeof body.uid !== "string" || !safeUidRegex.test(body.uid)) {
      return NextResponse.json({ error: "Provide a valid student uid or set all=true." }, { status: 400 });
    }

    const deleted = await deleteDocsForUser(body.uid);
    return NextResponse.json({ ok: true, scope: body.uid, deleted });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Reset request failed.";
    const status = message.startsWith("Forbidden") || message.includes("token") ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
