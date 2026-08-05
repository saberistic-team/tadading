import {
  Body,
  Controller,
  Get,
  Headers,
  Inject,
  NotFoundException,
  Param,
  Post,
} from "@nestjs/common";
import {
  completePuzzleRequestSchema,
  type PublicPuzzleDto,
} from "@tadading/contracts";
import { hashGuestId } from "./guest.js";
import { PuzzlesService } from "./puzzles.service.js";
import { GUEST_HMAC_SECRET } from "./tokens.js";

@Controller("v1/puzzles")
export class PuzzlesController {
  constructor(
    private readonly puzzles: PuzzlesService,
    @Inject(GUEST_HMAC_SECRET) private readonly guestHmacSecret: string,
  ) {}

  @Get("today")
  async today(
    @Headers("x-tadading-guest-id") guestId?: string,
  ): Promise<PublicPuzzleDto & { guestIdHash?: string }> {
    const puzzle = await this.puzzles.getToday();
    if (guestId && guestId.length >= 16) {
      return {
        ...puzzle,
        guestIdHash: hashGuestId(guestId, this.guestHmacSecret).slice(0, 16),
      };
    }
    return puzzle;
  }

  @Post(":id/complete")
  async complete(
    @Param("id") id: string,
    @Body() body: unknown,
  ): Promise<{ ok: boolean; reason?: string }> {
    const parsed = completePuzzleRequestSchema.safeParse(body);
    if (!parsed.success) {
      return { ok: false, reason: "invalid_body" };
    }
    const result = await this.puzzles.complete(id, parsed.data.order);
    if (!result.ok && result.reason === "puzzle_not_found") {
      throw new NotFoundException("Puzzle not found");
    }
    return result;
  }
}
