import { DecodedIdToken } from "firebase-admin/auth";
import { getAdminAuth, getAdminDb, isAdminConfigured } from "@/lib/firebase/admin";

const ADMIN_ROLES = ["admin", "super_admin", "content_admin", "support_admin"];

function getConfiguredAdminEmails(): string[] {
  return (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().replace(/^["']|["']$/g, "").toLowerCase())
    .filter(Boolean);
}

/**
 * Verifies a Firebase ID token and confirms the caller is an administrator.
 * Admin status is granted by custom claim, Firestore profile role, or the
 * configured NEXT_PUBLIC_ADMIN_EMAILS allowlist.
 */
export async function requireAdmin(idToken?: string): Promise<DecodedIdToken> {
  if (!isAdminConfigured()) {
    throw new Error("Firebase Admin is not configured on the server.");
  }
  if (!idToken) {
    throw new Error("Missing authentication token.");
  }

  const decoded = await getAdminAuth().verifyIdToken(idToken);
  const claims = decoded as DecodedIdToken & { admin?: boolean; role?: string };
  const claimRole = typeof claims.role === "string" ? claims.role.toLowerCase() : "";

  if (claims.admin === true || ADMIN_ROLES.includes(claimRole)) {
    return decoded;
  }

  if (decoded.email && getConfiguredAdminEmails().includes(decoded.email.toLowerCase())) {
    return decoded;
  }

  const userSnap = await getAdminDb().collection("users").doc(decoded.uid).get();
  const profileRole = String(userSnap.data()?.role || "").toLowerCase();
  if (ADMIN_ROLES.includes(profileRole)) {
    return decoded;
  }

  throw new Error("Forbidden: administrator privileges required.");
}
