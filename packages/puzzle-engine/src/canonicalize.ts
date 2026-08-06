/** Dihedral D8 canonical form for an 8-tile ring (rotations + reflections). */
export function canonicalizeRing(tileIds: readonly string[]): string[] {
  if (tileIds.length !== 8) {
    throw new Error(`Expected 8 tile ids, got ${tileIds.length}`);
  }

  const variants: string[][] = [];
  for (let rot = 0; rot < 8; rot += 1) {
    const rotated = [...tileIds.slice(rot), ...tileIds.slice(0, rot)];
    variants.push(rotated);
    variants.push([...rotated].reverse());
  }

  variants.sort((a, b) => a.join("|").localeCompare(b.join("|")));
  return variants[0]!;
}

export function ringsEqualUpToSymmetry(
  a: readonly string[],
  b: readonly string[],
): boolean {
  return canonicalizeRing(a).join("|") === canonicalizeRing(b).join("|");
}
