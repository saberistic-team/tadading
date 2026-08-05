import { createHash, randomBytes } from "node:crypto";

export function hashOrder(order: readonly string[]): string {
  return createHash("sha256").update(order.join("|")).digest("hex");
}

export function newTraceId(): string {
  return randomBytes(8).toString("hex");
}
