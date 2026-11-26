import { db } from "./config";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  QueryConstraint,
  DocumentData,
} from "firebase/firestore";

export async function fetchDocById<T = DocumentData>(collectionName: string, id: string): Promise<T | null> {
  if (!db) return null;
  const docRef = doc(db, collectionName, id);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as T;
}

export async function upsertDoc<T extends Record<string, any>>(collectionName: string, id: string, data: T): Promise<void> {
  if (!db) throw new Error("Firestore is not initialized.");
  const docRef = doc(db, collectionName, id);
  await setDoc(docRef, data, { merge: true });
}

export async function updateDocField<T extends Record<string, any>>(collectionName: string, id: string, data: Partial<T>): Promise<void> {
  if (!db) throw new Error("Firestore is not initialized.");
  const docRef = doc(db, collectionName, id);
  await updateDoc(docRef, data as any);
}

export async function removeDoc(collectionName: string, id: string): Promise<void> {
  if (!db) throw new Error("Firestore is not initialized.");
  const docRef = doc(db, collectionName, id);
  await deleteDoc(docRef);
}

export async function queryDocs<T = DocumentData>(collectionName: string, ...constraints: QueryConstraint[]): Promise<T[]> {
  if (!db) return [];
  const colRef = collection(db, collectionName);
  const q = query(colRef, ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as T));
}

/**
 * Realtime subscription for a Firestore query. Returns an unsubscribe function.
 * This keeps the UI in sync with the database without manual refreshes.
 */
export function subscribeDocs<T = DocumentData>(
  collectionName: string,
  constraints: QueryConstraint[],
  onData: (rows: T[]) => void,
  onError?: (error: Error) => void
): () => void {
  if (!db) {
    onData([]);
    return () => {};
  }
  const colRef = collection(db, collectionName);
  const q = query(colRef, ...constraints);
  return onSnapshot(
    q,
    (snap) => {
      onData(snap.docs.map((d) => ({ id: d.id, ...d.data() } as T)));
    },
    (error) => {
      if (onError) onError(error as Error);
      else console.error(`Realtime subscription failed for ${collectionName}:`, error);
    }
  );
}

export { where, orderBy, limit };
