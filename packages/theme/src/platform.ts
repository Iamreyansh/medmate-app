/**
 * Platform metrics.
 *
 * The brand is identical on both platforms; only the system chrome changes.
 * These numbers come straight from the Figma "Platform rules" table:
 *
 *                     iOS              Android
 *   Device frame      393 x 852 pt     412 x 915 dp
 *   Status bar        54 pt            24 dp
 *   Side margin       16 pt            16 dp
 *   Touch target      44 x 44 pt       48 x 48 dp
 *   Bottom bar        49 + 34 pt       80 + 24 dp
 */
import { Platform } from 'react-native';

export type PlatformKey = 'ios' | 'android';

/**
 * The platform the app is running on.
 *
 * On device this is simply iOS or Android. The web preview has no platform of
 * its own, so it mirrors the iOS design unless `EXPO_PUBLIC_PLATFORM` says
 * otherwise - set it to `android` to check the Material metrics in a browser.
 */
const override = process.env.EXPO_PUBLIC_PLATFORM;

export const platformKey: PlatformKey =
  override === 'ios' || override === 'android'
    ? override
    : Platform.OS === 'web'
      ? 'ios'
      : Platform.OS === 'ios'
        ? 'ios'
        : 'android';

export const metrics = {
  ios: {
    /** Design width of the reference device. */
    width: 393,
    /** Height of the status bar (Dynamic Island). */
    statusBar: 54,
    /** Side margin. */
    gutter: 16,
    /** Minimum touch target. */
    touchTarget: 44,
    /** Height of the floating tab bar shell. */
    tabBar: 68,
    /** Height of the home indicator strip below the tab bar. */
    homeIndicator: 34,
    /** Height of the pill that holds the tab icons. */
    tabPillHeight: 56,
    /** Width of the home indicator handle. */
    handleWidth: 134,
    /** Type scale family. */
    type: 'ios' as const,
  },
  android: {
    width: 412,
    statusBar: 24,
    gutter: 16,
    touchTarget: 48,
    tabBar: 68,
    /** Height of the gesture-handle strip below the navigation bar. */
    homeIndicator: 24,
    tabPillHeight: 56,
    /** Width of the gesture handle. */
    handleWidth: 108,
    type: 'm3' as const,
  },
} as const;

export type Metrics = (typeof metrics)['ios'] | (typeof metrics)['android'];

/** Metrics for the platform the app is running on. */
export const platformMetrics: Metrics = metrics[platformKey];
