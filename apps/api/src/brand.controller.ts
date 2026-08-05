import { Controller, Get, Inject } from "@nestjs/common";
import type { PublicBrand } from "@tadading/config";
import { PUBLIC_BRAND } from "./tokens.js";

@Controller("v1/brand")
export class BrandController {
  constructor(@Inject(PUBLIC_BRAND) private readonly brand: PublicBrand) {}

  @Get()
  getBrand(): PublicBrand {
    return this.brand;
  }
}
