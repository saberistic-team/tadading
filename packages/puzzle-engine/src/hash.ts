import { createHash, createHmac } from "node:crypto";
import { canonicalizeRing } from "./canonicalize.js";

export function hashCanonicalSolution(tileIds: readonly string[]): string {
  const canonical = canonicalizeRing(tileIds).join("|");
  return createHash("sha256").update(canonical).digest("hex");
}

export function hmacDailySeed(
  secret: string,
  publicationDay: string,
  difficulty: string,
  generatorVersion: string,
): string {
  return createHmac("sha256", secret)
    .update(`${publicationDay}:${difficulty}:${generatorVersion}`, "utf8")
    .digest("hex");
}
