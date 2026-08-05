import { describe, expect, it } from "vitest";
import { loadPublicEnv, loadServerEnv, toPublicBrand } from "./index.js";

describe("config", () => {
  it("loads public brand defaults", () => {
    const env = loadPublicEnv({});
    const brand = toPublicBrand(env);
    expect(brand.brandName).toBe("TadaDing");
    expect(brand.publicDomain).toBe("localhost");
    expect(brand.socialHandle).toBe("playtadading");
  });

  it("requires database and redis for server env", () => {
    expect(() =>
      loadServerEnv({
        SERVICE_NAME: "api",
      }),
    ).toThrow();

    const env = loadServerEnv({
      SERVICE_NAME: "api",
      DATABASE_URL: "postgres://tadading:tadading@localhost:5433/tadading",
      REDIS_URL: "redis://localhost:6380",
    });
    expect(env.SERVICE_NAME).toBe("api");
    expect(env.PORT).toBe(3101);
  });

  it("accepts env-driven branding overrides", () => {
    const env = loadPublicEnv({
      BRAND_NAME: "AltBrand",
      PUBLIC_DOMAIN: "example.test",
      SOCIAL_HANDLE: "playalt",
      TAGLINE: "Alt tagline",
    });
    expect(toPublicBrand(env).brandName).toBe("AltBrand");
  });
});
