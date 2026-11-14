/**
 * The Outfit type scales.
 *
 * Both platforms ship the same family but different scales, exactly as the
 * Figma design system records them:
 *
 * - iOS  — "iOS type scale · Outfit"
 * - Android — "Android M3 type scale · Outfit"
 *
 * Sizes are the Figma font sizes in points/dp; line heights are the Figma
 * line-height values. Letter spacing is the Figma `letterSpacing` in points
 * (positive for the uppercase eyebrow, negative for large titles).
 */

/** Font weights available in Outfit, keyed by the Figma weight number. */
export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
} as const;

export type FontWeight = (typeof fontWeight)[keyof typeof fontWeight];

/**
 * Font family per weight.
 *
 * `@expo-google-fonts/outfit` registers one family per weight, so the family
 * name follows the weight rather than being a single "Outfit" face.
 */
export const fontFamily = {
  '400': 'Outfit_400Regular',
  '500': 'Outfit_500Medium',
  '600': 'Outfit_600SemiBold',
  '700': 'Outfit_700Bold',
  '800': 'Outfit_800ExtraBold',
} as const satisfies Record<FontWeight, string>;

export type TypeStyle = {
  /** Font size in pt/dp. */
  fontSize: number;
  /** Line height in pt/dp. */
  lineHeight: number;
  /** Font weight. */
  fontWeight: FontWeight;
  /** Letter spacing in pt/dp. */
  letterSpacing: number;
  /** Uppercase transform. */
  textTransform?: 'uppercase';
};

/** iOS type scale. */
export const iosType = {
  largeTitle: { fontSize: 34, lineHeight: 41, fontWeight: '700', letterSpacing: -0.34 },
  largeTitleHeavy: { fontSize: 34, lineHeight: 41, fontWeight: '800', letterSpacing: -0.68 },
  title1: { fontSize: 28, lineHeight: 34, fontWeight: '700', letterSpacing: -0.42 },
  title2: { fontSize: 22, lineHeight: 28, fontWeight: '700', letterSpacing: -0.22 },
  title3: { fontSize: 20, lineHeight: 25, fontWeight: '600', letterSpacing: -0.1 },
  headline: { fontSize: 17, lineHeight: 22, fontWeight: '600', letterSpacing: -0.085 },
  body: { fontSize: 17, lineHeight: 22, fontWeight: '400', letterSpacing: 0 },
  callout: { fontSize: 16, lineHeight: 21, fontWeight: '600', letterSpacing: 0 },
  subheadline: { fontSize: 15, lineHeight: 20, fontWeight: '400', letterSpacing: 0 },
  subheadlineEmphasized: { fontSize: 15, lineHeight: 20, fontWeight: '600', letterSpacing: 0 },
  footnote: { fontSize: 13, lineHeight: 18, fontWeight: '400', letterSpacing: 0 },
  footnoteEmphasized: { fontSize: 13, lineHeight: 18, fontWeight: '600', letterSpacing: 0 },
  caption1: { fontSize: 12, lineHeight: 16, fontWeight: '500', letterSpacing: 0 },
  caption2: { fontSize: 11, lineHeight: 13, fontWeight: '500', letterSpacing: 0 },
  /** 11pt semibold - the small labels the screens use for tags and pills. */
  captionStrong: { fontSize: 11, lineHeight: 13, fontWeight: '600', letterSpacing: 0 },
  eyebrow: { fontSize: 11, lineHeight: 13, fontWeight: '700', letterSpacing: 0.66, textTransform: 'uppercase' },
  price: { fontSize: 17, lineHeight: 22, fontWeight: '800', letterSpacing: 0 },
  amount: { fontSize: 20, lineHeight: 25, fontWeight: '800', letterSpacing: -0.1 },
  button: { fontSize: 17, lineHeight: 22, fontWeight: '600', letterSpacing: 0 },
  buttonSmall: { fontSize: 15, lineHeight: 20, fontWeight: '600', letterSpacing: 0 },
  tabLabel: { fontSize: 10, lineHeight: 12, fontWeight: '500', letterSpacing: 0 },
  tag: { fontSize: 10, lineHeight: 13, fontWeight: '800', letterSpacing: 0 },
  statusBarTime: { fontSize: 17, lineHeight: 22, fontWeight: '600', letterSpacing: 0 },
  /** Screen footer headline. */
  footer: { fontSize: 44, lineHeight: 46, fontWeight: '800', letterSpacing: -0.88 },
  /** Hero wordmark. */
  wordmark: { fontSize: 26, lineHeight: 26, fontWeight: '700', letterSpacing: -0.91 },
} as const satisfies Record<string, TypeStyle>;

/** Material 3 type scale, used on Android. */
export const m3Type = {
  displaySmall: { fontSize: 36, lineHeight: 44, fontWeight: '800', letterSpacing: -0.72 },
  headlineMedium: { fontSize: 28, lineHeight: 36, fontWeight: '700', letterSpacing: -0.28 },
  headlineSmall: { fontSize: 24, lineHeight: 32, fontWeight: '700', letterSpacing: -0.24 },
  titleLarge: { fontSize: 22, lineHeight: 28, fontWeight: '700', letterSpacing: -0.11 },
  titleLargeMedium: { fontSize: 20, lineHeight: 28, fontWeight: '600', letterSpacing: 0 },
  titleMedium: { fontSize: 16, lineHeight: 24, fontWeight: '600', letterSpacing: 0 },
  bodyLarge: { fontSize: 16, lineHeight: 24, fontWeight: '400', letterSpacing: 0 },
  bodyLargeEmphasized: { fontSize: 16, lineHeight: 24, fontWeight: '500', letterSpacing: 0 },
  bodyMedium: { fontSize: 14, lineHeight: 20, fontWeight: '400', letterSpacing: 0 },
  labelLarge: { fontSize: 14, lineHeight: 20, fontWeight: '600', letterSpacing: 0 },
  bodySmall: { fontSize: 12, lineHeight: 16, fontWeight: '400', letterSpacing: 0 },
  bodySmallMedium: { fontSize: 12, lineHeight: 16, fontWeight: '500', letterSpacing: 0 },
  labelMedium: { fontSize: 12, lineHeight: 16, fontWeight: '600', letterSpacing: 0 },
  labelSmall: { fontSize: 11, lineHeight: 16, fontWeight: '600', letterSpacing: 0 },
  /** Android counterpart of the iOS 11pt semibold caption. */
  captionSmall: { fontSize: 11, lineHeight: 16, fontWeight: '600', letterSpacing: 0 },
  overline: { fontSize: 11, lineHeight: 16, fontWeight: '700', letterSpacing: 0.88, textTransform: 'uppercase' },
  price: { fontSize: 16, lineHeight: 24, fontWeight: '800', letterSpacing: 0 },
  amount: { fontSize: 20, lineHeight: 28, fontWeight: '800', letterSpacing: 0 },
  button: { fontSize: 14, lineHeight: 20, fontWeight: '600', letterSpacing: 0.14 },
  buttonSmall: { fontSize: 12, lineHeight: 16, fontWeight: '600', letterSpacing: 0.12 },
  navLabel: { fontSize: 12, lineHeight: 16, fontWeight: '600', letterSpacing: 0 },
  tag: { fontSize: 10, lineHeight: 14, fontWeight: '800', letterSpacing: 0 },
  statusBarTime: { fontSize: 14, lineHeight: 20, fontWeight: '500', letterSpacing: 0 },
  footer: { fontSize: 44, lineHeight: 46, fontWeight: '800', letterSpacing: -0.88 },
  wordmark: { fontSize: 26, lineHeight: 26, fontWeight: '700', letterSpacing: -0.91 },
} as const satisfies Record<string, TypeStyle>;

export type IosTypeToken = keyof typeof iosType;
export type M3TypeToken = keyof typeof m3Type;

/**
 * Cross-platform type roles.
 *
 * A role resolves to the iOS token on iOS and the Material 3 token on
 * Android, so a screen can ask for `sectionTitle` without branching.
 */
export const typeRoles = {
  sectionTitle: { ios: 'title2', m3: 'titleLarge' },
  sectionEyebrow: { ios: 'eyebrow', m3: 'overline' },
  cardTitle: { ios: 'title3', m3: 'titleLargeMedium' },
  cardName: { ios: 'subheadlineEmphasized', m3: 'labelLarge' },
  body: { ios: 'body', m3: 'bodyLarge' },
  bodyStrong: { ios: 'headline', m3: 'bodyLargeEmphasized' },
  caption: { ios: 'caption1', m3: 'bodySmall' },
  captionStrong: { ios: 'captionStrong', m3: 'captionSmall' },
  tag: { ios: 'tag', m3: 'tag' },
  price: { ios: 'price', m3: 'price' },
  amount: { ios: 'amount', m3: 'amount' },
  button: { ios: 'buttonSmall', m3: 'buttonSmall' },
  navLabel: { ios: 'tabLabel', m3: 'navLabel' },
  /** The trailing "See all" link on a section header. */
  linkLabel: { ios: 'footnoteEmphasized', m3: 'labelLarge' },
  /** Semibold 13/15pt label - sort, counts, secondary actions. */
  strong: { ios: 'footnoteEmphasized', m3: 'labelLarge' },
  /** Filter chip label. */
  filterLabel: { ios: 'subheadlineEmphasized', m3: 'labelLarge' },
  /** Product name inside a result row. */
  resultName: { ios: 'callout', m3: 'titleMedium' },
  /** Result meta line - result counts, delivery notes. */
  resultMeta: { ios: 'footnote', m3: 'bodyMedium' },
  /** Secondary line under a product name. */
  resultSub: { ios: 'caption1', m3: 'bodySmallMedium' },
  /** A small semibold label, e.g. the category tile caption. */
  tileLabel: { ios: 'captionStrong', m3: 'captionSmall' },
} as const satisfies Record<string, { ios: IosTypeToken; m3: M3TypeToken }>;

export type TypeRole = keyof typeof typeRoles;
