/**
 * Elevation.
 *
 * The Figma file uses three shadows, all of them the same ink (#14201A) at
 * different opacities. React Native shadows are platform specific, so each
 * elevation carries both an iOS shadow and an Android elevation.
 */

export type Elevation = {
  /** iOS: shadow offset, blur radius, colour. */
  shadowOffset: { width: number; height: number };
  shadowRadius: number;
  shadowOpacity: number;
  /** Android: material elevation level. */
  elevation: number;
  /** The ink every MedMate shadow uses. */
  shadowColor: string;
};

const INK = '#14201A';

export const elevation = {
  /** Flat - no shadow. */
  none: {
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 0,
    shadowOpacity: 0,
    elevation: 0,
    shadowColor: INK,
  },
  /** Product tile ADD button. */
  low: {
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    shadowOpacity: 0.06,
    elevation: 1,
    shadowColor: INK,
  },
  /** Hero banners and product photos. */
  medium: {
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 10,
    shadowOpacity: 0.1,
    elevation: 3,
    shadowColor: INK,
  },
  /** Floating tab bar and chat tile. */
  high: {
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 24,
    shadowOpacity: 0.16,
    elevation: 8,
    shadowColor: INK,
  },
} as const satisfies Record<string, Elevation>;

export type ElevationToken = keyof typeof elevation;
