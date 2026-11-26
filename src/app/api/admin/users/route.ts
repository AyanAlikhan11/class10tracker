import { NextResponse } from "next/server";
import { getAdminDb, isAdminConfigured } from "@/lib/firebase/admin";
import { requireAdmin } from "@/lib/server/requireAdmin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    if (!isAdminConfigured()) {
      return NextResponse.json(
        { error: "Admin server is not configured. Check Firebase Admin credentials in .env.local." },
        { status: 500 }
      );
    }

    const body = (await request.json()) as { idToken?: string };
    await requireAdmin(body.idToken);

    const snap = await getAdminDb().collection("users").get();
    const users = snap.docs
      .map((doc) => {
        const data = doc.data();
        return {
          uid: doc.id,
          email: String(data.email || ""),
          displayName: String(data.displayName || "Student"),
          role: String(data.role || "student"),
          createdAt: String(data.createdAt || ""),
          lastLoginAt: String(data.lastLoginAt || ""),
          dataResetVersion: Number(data.dataResetVersion || 0),
        };
      })
      .sort((a, b) => (b.lastLoginAt || b.createdAt).localeCompare(a.lastLoginAt || a.createdAt));

    return NextResponse.json({ ok: true, users });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not load users.";
    const status = message.startsWith("Forbidden") || message.includes("token") ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
