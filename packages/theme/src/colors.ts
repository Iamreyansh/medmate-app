/**
 * The MedMate colour variables.
 *
 * Values are taken verbatim from the Figma design system
 * ("MedMate native · Design system" → Colour variables) so the native app and
 * the design file can never drift apart.
 *
 * Naming follows the Figma variables exactly: `brand/*`, `mint/*`, `gold/*`,
 * `neutral/*`, `status/*`. A hex literal inside a screen or component is a
 * bug — reach for `colors` instead.
 */

/** Brand ramps. */
export const brand = {
  forest: '#1B3D29',
  green: '#2F7D52',
  green700: '#256B46',
  gold: '#D9A648',
  mint: '#8FD4A8',
} as const;

/** Mint ramp — art tints, health-day pills, selected chips. */
export const mint = {
  50: '#F4FBF6',
  100: '#E9F6EE',
  200: '#D9F0E1',
  300: '#BDE5CB',
  400: '#8FD4A8',
} as const;

/** Gold ramp — savings, coupons, seasonal accents. */
export const gold = {
  50: '#FDF8EA',
  100: '#FAEDC9',
  200: '#F2D996',
  300: '#D9A648',
  ink: '#855B0C',
} as const;

/** Neutral ramp — text, rules, surfaces. */
export const neutral = {
  ink: '#14201A',
  ink2: '#3B4842',
  muted: '#65726B',
  faint: '#9AA59F',
  line2: '#D5DDD8',
  line: '#E7ECE9',
  surface: '#FFFFFF',
  surface2: '#F5F8F6',
  surface3: '#EDF2EF',
  page: '#F4F8F5',
} as const;

/** Status colours. */
export const status = {
  red: '#C2392D',
  redBg: '#FCECE9',
} as const;

/**
 * Per-health-store accent pairs.
 *
 * Each health store tile owns a tinted background and a matching ink so the
 * six stores stay visually distinct without inventing new brand colours.
 */
export const storeAccents = {
  ortho: { bg: '#EAF3FB', ink: '#1F5E8C' },
  baby: { bg: '#FFF1E6', ink: '#A4541B' },
  women: { bg: '#FBEFF4', ink: '#9B2F5E' },
  diabetes: { bg: '#EEF4EA', ink: '#256B46' },
  heart: { bg: '#FDECEC', ink: '#C2392D' },
  elderly: { bg: '#FDF8EA', ink: '#855B0C' },
} as const;

export type StoreAccentKey = keyof typeof storeAccents;

/** Flat colour map, keyed the way Figma names its variables. */
export const colors = {
  ...brand,
  ...mint,
  ...gold,
  ...neutral,
  ...status,
} as const;

export type Colors = typeof colors;

/**
 * Semantic roles used by screens.
 *
 * Prefer these over the raw ramps when a surface has a job to do; fall back to
 * the ramps for one-off accents.
 */
export const semantic = {
  /** Page background behind all content. */
  page: neutral.page,
  /** Card / sheet background. */
  surface: neutral.surface,
  /** Secondary card background. */
  surfaceMuted: neutral.surface2,
  /** Sunken background (art tints behind product photos). */
  surfaceSunken: neutral.surface3,

  /** Primary text. */
  text: neutral.ink,
  /** Secondary text. */
  textSecondary: neutral.ink2,
  /** Tertiary text. */
  textMuted: neutral.muted,
  /** Quaternary / disabled text. */
  textFaint: neutral.faint,
  /** Text on brand-filled surfaces. */
  textOnBrand: '#FFFFFF',
  /** Text on the gold button fill. */
  textOnGold: brand.forest,

  /** Hairline rules and card borders. */
  border: neutral.line,
  borderStrong: neutral.line2,

  /** Brand action colour (green that sells). */
  action: brand.green,
  actionPressed: brand.green700,
  /** Forest anchors — headers, dark surfaces. */
  anchor: brand.forest,
  /** Gold — savings and premium accents. */
  savings: gold.ink,
  savingsFill: gold[300],

  /** Mint — art tint and health-day chrome. */
  tint: mint[50],
  tintBorder: mint[200],
  tintStrong: mint[100],

  /** Danger. */
  danger: status.red,
  dangerMuted: status.redBg,

  /** Scrim behind modals. */
  scrim: 'rgba(20, 32, 26, 0.55)',
} as const;

export type Semantic = typeof semantic;

/**
 * Gradients used across the app.
 *
 * `stops` is ordered from the gradient start to the gradient end; React Native
 * renders `start` at the top-left and `end` at the bottom-right by default.
 */
export const gradients = {
  /** Brand zone behind the hero — forest to green. */
  brand: { colors: [brand.forest, brand.green700], start: { x: 0.5, y: 0 }, end: { x: 0.5, y: 1 } },
  /** Art tint behind product photos. */
  art: { colors: [mint[50], mint[200]], start: { x: 0.5, y: 0 }, end: { x: 0.5, y: 1 } },
  /** Mint tint used by the "request a medicine" banner. */
  mint: { colors: [mint[50], mint[300]], start: { x: 0.5, y: 0 }, end: { x: 0.5, y: 1 } },
  /** Gold card used by the first-order banner. */
  gold: { colors: ['#F7E3A8', gold[300]], start: { x: 0.5, y: 0 }, end: { x: 0.5, y: 1 } },
  /** Blush card used by the health-stores banner. */
  blush: { colors: ['#FFFFFF', '#F3D9E3'], start: { x: 0.5, y: 0 }, end: { x: 0.5, y: 1 } },
  /** Lab-tests card. */
  lab: { colors: [mint[100], mint[200]], start: { x: 0.5, y: 0 }, end: { x: 0.5, y: 1 } },
} as const;

export type GradientToken = keyof typeof gradients;
