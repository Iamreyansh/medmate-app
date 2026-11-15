/**
 * Spacing scale. Every gap, pad and inset comes from here.
 *
 * The scale is a 4pt grid. Values that are not on the grid are a bug.
 */
export const spacing = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
  giant: 48,
} as const;

export type Spacing = typeof spacing;
export type SpacingToken = keyof Spacing;

/**
 * Horizontal page gutter. Screens use this and nothing else.
 *
 * Both platforms use a 16pt/dp side margin, so this is not platform specific.
 */
export const gutter = spacing.lg;

/** Vertical rhythm between stacked content sections. */
export const sectionGap = spacing.xxl;

/** Corner radii, taken from the Figma screens. */
export const radii = {
  none: 0,
  xs: 6,
  sm: 8,
  md: 10,
  mdPlus: 11,
  lg: 12,
  /** The card radius the prescriptions, health and account screens use. */
  card: 14,
  xl: 16,
  xxl: 18,
  xxxl: 20,
  huge: 24,
  pill: 999,
  circle: 9999,
} as const;

export type Radii = typeof radii;
export type RadiusToken = keyof Radii;

/** Hairline border width. */
export const hairline = 1;
