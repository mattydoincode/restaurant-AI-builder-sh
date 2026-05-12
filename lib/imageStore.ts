"use client";

/**
 * Tiny IndexedDB wrapper for storing uploaded image Blobs.
 *
 * Schema strings reference stored images via the `idb:<id>` pseudo-URL,
 * which is resolved at render time by `useResolvedImage`.
 */

const DB_NAME = "restaurant-builder-images";
const DB_VERSION = 1;
const STORE = "images";
export const IDB_PREFIX = "idb:";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB is not available in this environment"));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error("IndexedDB open failed"));
    req.onblocked = () => reject(new Error("IndexedDB open blocked"));
  });
}

async function tx<T>(
  mode: IDBTransactionMode,
  fn: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  const db = await openDB();
  return new Promise<T>((resolve, reject) => {
    const trans = db.transaction(STORE, mode);
    const store = trans.objectStore(STORE);
    const req = fn(store);
    req.onerror = () => reject(req.error);
    trans.oncomplete = () => resolve(req.result);
    trans.onerror = () => reject(trans.error);
    trans.onabort = () => reject(trans.error ?? new Error("Transaction aborted"));
  });
}

function randomId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function isIdbRef(src: string): boolean {
  return typeof src === "string" && src.startsWith(IDB_PREFIX);
}

export function idbId(src: string): string | null {
  return isIdbRef(src) ? src.slice(IDB_PREFIX.length) : null;
}

export async function putImage(blob: Blob): Promise<string> {
  const id = randomId();
  await tx("readwrite", (store) => store.put(blob, id));
  return `${IDB_PREFIX}${id}`;
}

export async function getImageBlob(src: string): Promise<Blob | null> {
  const id = idbId(src);
  if (!id) return null;
  try {
    const value = await tx<Blob | undefined>("readonly", (store) => store.get(id));
    return value ?? null;
  } catch {
    return null;
  }
}

export async function deleteImage(src: string): Promise<void> {
  const id = idbId(src);
  if (!id) return;
  await tx("readwrite", (store) => store.delete(id));
}

export async function listIds(): Promise<string[]> {
  try {
    const keys = await tx<IDBValidKey[]>("readonly", (store) => store.getAllKeys());
    return keys.filter((k): k is string => typeof k === "string");
  } catch {
    return [];
  }
}

export function isIDBAvailable(): boolean {
  return typeof indexedDB !== "undefined";
}
