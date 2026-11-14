import { useWindowDimensions } from 'react-native';

import { gutter, spacing } from '@medmate/theme';

export type GridLayout = {
  /** The width of one item, including the space it takes in the row. */
  slot: number;
  /** The width of the item itself. */
  width: number;
  /** The gap between the items. */
  gap: number;
};

/**
 * Work out a grid that fits the screen it is on.
 *
 * The Figma frames are drawn at 393pt (iOS) and 412dp (Android). A phone is
 * often narrower than either, so a grid of fixed-width cards stops fitting and
 * wraps into a ragged second row. This measures the space the grid actually
 * has and shares it out, keeping the column count the design asks for and
 * shrinking the cards (and their art) just enough to fit.
 */
export function useGrid(
  columns: number,
  options: {
    /** The width the design gives an item. */
    basis: number;
    /** The gap the design uses. */
    gap?: number;
    /** The smallest gap to fall back to before the cards start shrinking. */
    minGap?: number;
  } = { basis: 114 },
): GridLayout {
  const { width } = useWindowDimensions();
  const available = Math.max(0, width - gutter * 2);
  const gap = options.gap ?? spacing.sm;
  const minGap = options.minGap ?? spacing.sm;

  const needed = options.basis * columns + gap * (columns - 1);
  if (available >= needed) {
    // There is room: keep the designed card and the designed gap.
    return { slot: options.basis, width: options.basis, gap };
  }

  // Not enough room: tighten the gap first.
  const gapRoom = available - options.basis * columns;
  const tightGap =
    gapRoom >= minGap * (columns - 1)
      ? Math.min(gap, Math.floor(gapRoom / (columns - 1)))
      : minGap;

  if (options.basis * columns + tightGap * (columns - 1) <= available) {
    return { slot: options.basis, width: options.basis, gap: tightGap };
  }

  // Still not enough: the cards give up the width.
  const cardWidth = Math.max(72, (available - tightGap * (columns - 1)) / columns);
  return { slot: cardWidth, width: cardWidth, gap: tightGap };
}

/**
 * The width of a block that fills the screen minus the gutters.
 */
export function useContentWidth(): number {
  const { width } = useWindowDimensions();
  return Math.max(0, width - gutter * 2);
}
