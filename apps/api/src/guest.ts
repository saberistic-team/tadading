import { createHmac } from "node:crypto";

export function hashGuestId(guestId: string, secret: string): string {
  return createHmac("sha256", secret).update(guestId, "utf8").digest("hex");
}
