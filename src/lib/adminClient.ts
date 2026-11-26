import { auth } from "@/lib/firebase/config";

async function postJson<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const currentUser = auth?.currentUser;
  if (!currentUser) {
    throw new Error("You must be signed in as an administrator.");
  }
  const idToken = await currentUser.getIdToken();
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...body, idToken }),
  });
  const json = (await response.json()) as T & { error?: string };
  if (!response.ok) {
    throw new Error(json.error || "Admin request failed.");
  }
  return json;
}

export const AdminClient = {
  saveContent(collection: string, id: string, data: Record<string, unknown>) {
    return postJson<{ ok: boolean }>("/api/admin/content", {
      collection,
      id,
      data,
      action: "save",
    });
  },

  deleteContent(collection: string, id: string) {
    return postJson<{ ok: boolean }>("/api/admin/content", {
      collection,
      id,
      action: "delete",
    });
  },

  listUsers() {
    return postJson<{ users: Array<Record<string, unknown>> }>("/api/admin/users", {});
  },

  resetStudent(uid: string) {
    return postJson<{ ok: boolean; deleted: number }>("/api/admin/reset", { uid });
  },

  resetAll() {
    return postJson<{ ok: boolean; deleted: number }>("/api/admin/reset", { all: true });
  },
};
