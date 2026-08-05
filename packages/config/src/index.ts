import { z } from "zod";

const nonEmpty = z.string().trim().min(1);

export const publicBrandSchema = z.object({
  brandName: nonEmpty,
  publicDomain: nonEmpty,
  socialHandle: nonEmpty,
  tagline: nonEmpty,
});

export type PublicBrand = z.infer<typeof publicBrandSchema>;

export const publicEnvSchema = z.object({
  BRAND_NAME: nonEmpty.default("TadaDing"),
  PUBLIC_DOMAIN: nonEmpty.default("localhost"),
  SOCIAL_HANDLE: nonEmpty.default("playtadading"),
  TAGLINE: nonEmpty.default("Your daily tiny win."),
  WEB_ORIGIN: z.string().url().default("http://localhost:3100"),
  API_ORIGIN: z.string().url().default("http://localhost:3101"),
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;

const connectionString = z
  .string()
  .trim()
  .min(1)
  .refine(
    (value) =>
      value.startsWith("postgres://") ||
      value.startsWith("postgresql://") ||
      value.startsWith("redis://") ||
      value.startsWith("rediss://") ||
      URL.canParse(value),
    "Invalid connection string",
  );

export const serverEnvSchema = publicEnvSchema.extend({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  SERVICE_NAME: nonEmpty,
  DATABASE_URL: connectionString,
  REDIS_URL: connectionString,
  PORT: z.coerce.number().int().positive().default(3101),
  HEALTH_PORT: z.coerce.number().int().positive().optional(),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

export function loadPublicEnv(
  env: NodeJS.ProcessEnv = process.env,
): PublicEnv {
  return publicEnvSchema.parse(env);
}

export function loadServerEnv(
  env: NodeJS.ProcessEnv = process.env,
): ServerEnv {
  return serverEnvSchema.parse(env);
}

export function toPublicBrand(env: PublicEnv): PublicBrand {
  return publicBrandSchema.parse({
    brandName: env.BRAND_NAME,
    publicDomain: env.PUBLIC_DOMAIN,
    socialHandle: env.SOCIAL_HANDLE,
    tagline: env.TAGLINE,
  });
}
