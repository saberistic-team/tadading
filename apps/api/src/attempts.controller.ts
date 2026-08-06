import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Headers,
  Inject,
  NotFoundException,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import {
  completeAttemptRequestSchema,
  hintRequestSchema,
  saveAttemptStateRequestSchema,
  startAttemptRequestSchema,
} from "@tadading/contracts";
import { AttemptsService } from "./attempts.service.js";
import { hashGuestId } from "./guest.js";
import { GUEST_HMAC_SECRET } from "./tokens.js";

@Controller("v1")
export class AttemptsController {
  constructor(
    private readonly attempts: AttemptsService,
    @Inject(GUEST_HMAC_SECRET) private readonly guestHmacSecret: string,
  ) {}

  private guestHash(guestId?: string): string | null {
    if (!guestId || guestId.length < 16) return null;
    return hashGuestId(guestId, this.guestHmacSecret);
  }

  @Post("puzzles/:puzzleId/attempts")
  async start(
    @Param("puzzleId") puzzleId: string,
    @Body() body: unknown,
    @Headers("x-tadading-guest-id") guestId?: string,
  ) {
    const parsed = startAttemptRequestSchema.safeParse(body);
    if (!parsed.success) {
      return { ok: false, reason: "invalid_body" };
    }
    try {
      return await this.attempts.start({
        puzzleId,
        guestIdHash: this.guestHash(guestId),
        clientAttemptId: parsed.data.clientAttemptId,
        clientVersion: parsed.data.clientVersion,
        initialOrder: parsed.data.initialOrder,
      });
    } catch (error) {
      if (error instanceof Error && error.message === "puzzle_not_found") {
        throw new NotFoundException("Puzzle not found");
      }
      throw error;
    }
  }

  @Put("attempts/:attemptId/state")
  async saveState(
    @Param("attemptId") attemptId: string,
    @Body() body: unknown,
    @Headers("x-tadading-guest-id") guestId?: string,
  ) {
    const parsed = saveAttemptStateRequestSchema.safeParse(body);
    if (!parsed.success) {
      return { ok: false, reason: "invalid_body" };
    }
    try {
      return await this.attempts.saveState({
        attemptId,
        guestIdHash: this.guestHash(guestId),
        currentOrder: parsed.data.currentOrder,
        moves: parsed.data.moves,
        ...(parsed.data.hintCount !== undefined
          ? { hintCount: parsed.data.hintCount }
          : {}),
      });
    } catch (error) {
      if (error instanceof Error && error.message === "attempt_not_found") {
        throw new NotFoundException("Attempt not found");
      }
      if (error instanceof Error && error.message === "forbidden") {
        throw new ForbiddenException();
      }
      throw error;
    }
  }

  @Post("attempts/:attemptId/complete")
  async complete(
    @Param("attemptId") attemptId: string,
    @Body() body: unknown,
    @Headers("x-tadading-guest-id") guestId?: string,
  ) {
    const parsed = completeAttemptRequestSchema.safeParse(body);
    if (!parsed.success) {
      return { ok: false, reason: "invalid_body" };
    }
    return this.attempts.complete({
      attemptId,
      guestIdHash: this.guestHash(guestId),
      order: parsed.data.order,
      moves: parsed.data.moves,
      hintCount: parsed.data.hintCount,
      durationMs: parsed.data.durationMs,
    });
  }

  @Post("attempts/:attemptId/hint")
  async hint(
    @Param("attemptId") attemptId: string,
    @Body() body: unknown,
    @Headers("x-tadading-guest-id") guestId?: string,
  ) {
    const parsed = hintRequestSchema.safeParse(body);
    if (!parsed.success) {
      return { ok: false, reason: "invalid_body" };
    }
    try {
      return await this.attempts.hint({
        attemptId,
        guestIdHash: this.guestHash(guestId),
        currentOrder: parsed.data.currentOrder,
      });
    } catch (error) {
      if (error instanceof Error && error.message === "attempt_not_found") {
        throw new NotFoundException("Attempt not found");
      }
      throw error;
    }
  }

  @Get("attempts/:attemptId")
  async getAttempt(
    @Param("attemptId") attemptId: string,
    @Headers("x-tadading-guest-id") guestId?: string,
  ) {
    try {
      return await this.attempts.getAttempt(
        attemptId,
        this.guestHash(guestId),
      );
    } catch (error) {
      if (error instanceof Error && error.message === "attempt_not_found") {
        throw new NotFoundException("Attempt not found");
      }
      if (error instanceof Error && error.message === "forbidden") {
        throw new ForbiddenException();
      }
      throw error;
    }
  }
}
