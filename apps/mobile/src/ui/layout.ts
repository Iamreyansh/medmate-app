import { useCallback, useState } from 'react';
import { useWindowDimensions, type LayoutChangeEvent } from 'react-native';

import { gutter, spacing } from '@medmate/theme';

export type GridLayout = {
  /** The width one item takes in the row, its own width plus the gap. */
  slot: number;
  /** The width of the item itself. */
  width: number;
  /** The gap between the items. */
  gap: number;
};

/**
 * The widest the page content is allowed to get.
 *
 * The Figma frames are phone frames (393pt on iOS, 412dp on Android). On a
 * larger screen the page stops growing at this width and the content column
 * is centred instead, so the layout keeps its proportions and the leftover
 * space is shared evenly on both sides rather than piling up on the right.
 */
export const maxContentWidth = 480;

/**
 * The width of the content column on this screen.
 *
 * On a phone this is the screen minus the page gutters. On a wider screen it
 * is capped, so the column can be centred.
 */
export function useContentWidth(): number {
  const { width } = useWindowDimensions();
  return Math.max(0, Math.min(width - gutter * 2, maxContentWidth));
}

/**
 * The horizontal padding that keeps the content column on the page.
 *
 * It is the page gutter on a phone. On a wider screen it grows so that the
 * content column is centred, which is what stops a grid from sitting against
 * the left edge with a gap on the right.
 */
export function useContentInset(): number {
  const { width } = useWindowDimensions();
  return Math.max(gutter, (width - maxContentWidth) / 2);
}

/**
 * Measure the content box of a view.
 *
 * A grid only distributes space correctly if it knows how wide the box it
 * sits in really is. That box is not always the page: a grid can live inside
 * a card that has its own padding, so the width is measured rather than
 * guessed from the window.
 *
 * `paddingHorizontal` is the padding the measured view carries, so the value
 * that comes back is the width available to the children.
 */
export function useMeasuredWidth(paddingHorizontal = 0, fallback = 0) {
  const [width, setWidth] = useState(0);

  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const measured = event.nativeEvent.layout.width - paddingHorizontal * 2;
      setWidth((previous) => (Math.abs(previous - measured) < 0.5 ? previous : measured));
    },
    [paddingHorizontal],
  );

  return { width: width || fallback, onLayout };
}

/**
 * Work out a grid that fits the space it has.
 *
 * The Figma frames are drawn at 393pt (iOS) and 412dp (Android). A phone is
 * often narrower than either, so a grid of fixed-width cards stops fitting and
 * wraps into a ragged second row. This measures the space the grid actually
 * has and shares it out, keeping the column count the design asks for.
 *
 * The sharing works in both directions:
 *
 * - Too narrow: the gap tightens first, then the cards give up the width.
 * - Wider than the design: the cards grow and the gap takes what is left, so
 *   the row fills the box exactly. A row that stops short of the right edge
 *   is what makes a wide screen look lopsided.
 *
 * `available` is the measured width of the container. When it is not known
 * yet the window is used as an estimate, which is right for the grids that
 * sit directly in the page gutter.
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
    /** The widest an item may get on a screen bigger than the design. */
    maxBasis?: number;
    /** The widest the gap may get when the cards cannot absorb the space. */
    maxGap?: number;
  } = { basis: 114 },
  available?: number,
): GridLayout {
  const windowWidth = useContentWidth();
  // A hair of slack. The layout engine lays out in whole pixels and rounds a
  // fractional width up, so a row sized to exactly the width of its box can
  // come out a pixel wider and drop its last card onto a line of its own.
  const space = Math.max(0, (available && available > 0 ? available : windowWidth) - 1);

  const gap = options.gap ?? spacing.sm;
  const minGap = options.minGap ?? spacing.sm;
  const maxBasis = options.maxBasis ?? Math.round(options.basis * 1.35);
  const maxGap = options.maxGap ?? gap * 2;

  const needed = options.basis * columns + gap * (columns - 1);

  if (space >= needed) {
    // There is room. The cards grow towards the space first, then the gap
    // takes whatever is left, so the row fills the box edge to edge.
    //
    // Every number here is a whole number. A fractional card width is rounded
    // up when it is laid out, which pushes the row a pixel past the box and
    // drops the last card onto a line of its own - a row of one card with
    // the rest of the width empty.
    const rawWidth = Math.min(maxBasis, (space - gap * (columns - 1)) / columns);
    const width = Math.max(1, Math.floor(rawWidth));
    const budget = space - width * columns;
    const sharedGap =
      columns > 1
        ? Math.min(maxGap, Math.floor(budget / (columns - 1)))
        : gap;
    return { slot: width + sharedGap, width, gap: sharedGap };
  }

  // Not enough room: tighten the gap first.
  const gapRoom = space - options.basis * columns;
  const tightGap =
    gapRoom >= minGap * (columns - 1)
      ? Math.min(gap, Math.floor(gapRoom / (columns - 1)))
      : minGap;

  if (options.basis * columns + tightGap * (columns - 1) <= space) {
    return { slot: options.basis + tightGap, width: options.basis, gap: tightGap };
  }

  // Still not enough: the cards give up the width.
  // The floor keeps a card tappable and legible; below it the row wraps.
  const width = Math.max(56, Math.floor((space - tightGap * (columns - 1)) / columns));
  return { slot: width + tightGap, width, gap: tightGap };
}
