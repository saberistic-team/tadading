import { loadPublicEnv, toPublicBrand } from "@tadading/config";

export function getPublicBrand() {
  return toPublicBrand(loadPublicEnv(process.env));
}
