const STORAGE_KEY = "tadading.guestId";

function randomId(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function getOrCreateGuestId(): string {
  if (typeof window === "undefined") return "";
  const existing = window.localStorage.getItem(STORAGE_KEY);
  if (existing && existing.length >= 16) return existing;
  const id = randomId();
  window.localStorage.setItem(STORAGE_KEY, id);
  return id;
}
