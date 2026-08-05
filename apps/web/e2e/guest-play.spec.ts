import { expect, test } from "@playwright/test";
import {
  solveRing,
  type Tile,
} from "../../../packages/puzzle-engine/dist/index.js";

const apiOrigin = process.env.API_ORIGIN ?? "http://localhost:3101";

test("landing CTA leads into tutorial", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "daily tiny win",
  );
  await page.getByTestId("cta-play").click();
  await expect(page.getByTestId("tutorial-demo")).toBeVisible();
  await page.getByTestId("cta-start-ring").click();
  await expect(page).toHaveURL(/\/play/);
});

test("guest can load and complete today's puzzle", async ({ page, request }) => {
  const response = await request.get(`${apiOrigin}/v1/puzzles/today`);
  expect(response.ok()).toBeTruthy();
  const puzzle = (await response.json()) as {
    id: string;
    tiles: Tile[];
    initialOrder: string[];
  };
  expect(puzzle.tiles).toHaveLength(8);
  expect(JSON.stringify(puzzle)).not.toContain("solutionOrder");
  expect(JSON.stringify(puzzle)).not.toContain("canonicalSolutionHash");

  const solutions = solveRing(puzzle.tiles, 1);
  const solution = solutions[0];
  expect(solution).toBeTruthy();

  await page.goto("/play");
  await expect(page.getByTestId("ring-board")).toBeVisible({ timeout: 15_000 });

  await page.evaluate(
    ({ puzzleId, order }) => {
      window.localStorage.setItem(
        `tadading.board.${puzzleId}`,
        JSON.stringify({ order, history: [], completed: false }),
      );
    },
    { puzzleId: puzzle.id, order: solution! },
  );

  await page.reload();
  await expect(page.getByTestId("completion")).toBeVisible({ timeout: 15_000 });
  await expect(page.getByText("Ta-da-ding!")).toBeVisible();
});

test("swap interaction updates selection", async ({ page }) => {
  await page.goto("/play");
  await expect(page.getByTestId("ring-board")).toBeVisible({ timeout: 15_000 });
  await page.getByTestId("tile-0").click();
  await expect(page.getByTestId("tile-0")).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page.getByTestId("tile-1").click();
  await expect(page.getByTestId("tile-0")).toHaveAttribute(
    "aria-pressed",
    "false",
  );
});
