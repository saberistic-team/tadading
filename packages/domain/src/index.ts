export type Result<T, E> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: E };

export function ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

export function err<E>(error: E): Result<never, E> {
  return { ok: false, error };
}

export type Clock = {
  now(): Date;
};

export const systemClock: Clock = {
  now(): Date {
    return new Date();
  },
};

export type EntityId = string & { readonly __brand: "EntityId" };

const UUID_V7_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isEntityId(value: string): value is EntityId {
  return UUID_V7_REGEX.test(value);
}

export function asEntityId(value: string): EntityId {
  if (!isEntityId(value)) {
    throw new Error(`Invalid EntityId: ${value}`);
  }
  return value;
}

/** Application-generated UUIDv7 when crypto.randomUUID supports it; otherwise sortable fallback. */
export function createEntityId(clock: Clock = systemClock): EntityId {
  const cryptoObj = globalThis.crypto;
  if (typeof cryptoObj?.randomUUID === "function") {
    const id = cryptoObj.randomUUID();
    if (isEntityId(id)) {
      return id;
    }
  }

  const now = BigInt(clock.now().getTime());
  const timeHex = now.toString(16).padStart(12, "0");
  const rand = cryptoObj?.getRandomValues?.(new Uint8Array(10)) ??
    Uint8Array.from({ length: 10 }, () => Math.floor(Math.random() * 256));

  const hex = Array.from(rand, (b) => b.toString(16).padStart(2, "0")).join("");
  const id = [
    timeHex.slice(0, 8),
    timeHex.slice(8, 12),
    `7${hex.slice(0, 3)}`,
    `${((Number.parseInt(hex.slice(3, 4), 16) & 0x3) | 0x8).toString(16)}${hex.slice(4, 7)}`,
    hex.slice(7, 19),
  ].join("-");

  return asEntityId(id);
}
