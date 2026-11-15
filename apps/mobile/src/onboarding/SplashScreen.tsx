import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { gold, mint, neutral, radii, spacing } from '@medmate/theme';

import { Text } from '../ui/Text';
import { Gradient } from '../ui/primitives';
import { madeIn, tagline } from './data';

export type SplashScreenProps = {
  /** How long the splash stays up before it hands over. */
  onDone?: () => void;
  /** How long the splash stays up, in milliseconds. */
  duration?: number;
};

/**
 * The splash.
 *
 * The Figma `01 Onboarding / Splash` frame: the wordmark on the brand
 * gradient, with the glow behind it and the heartbeat under it.
 */
export function SplashScreen({ onDone, duration = 1400 }: SplashScreenProps) {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const timer = setTimeout(() => onDone?.(), duration);
    return () => clearTimeout(timer);
  }, [duration, onDone]);

  return (
    <Gradient token="brand" radius={0} style={styles.root}>
      <View style={[styles.centre, { paddingTop: insets.top }]}>
        {/* The glow behind the wordmark. */}
        <View style={styles.glow} />

        <Text variant="splashWordmark" color={neutral.surface}>
          MedMate
        </Text>

        <Svg width={168} height={24} viewBox="0 0 168 24">
          <Path
            d="M0 12h46l8-9 10 18 10-14 8 5h86"
            stroke={mint[200]}
            strokeWidth={2}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>

        <Text variant="eyebrow" color={mint[200]}>
          {tagline}
        </Text>
        <Text variant="caption" color={mint[300]}>
          {madeIn}
        </Text>
      </View>
    </Gradient>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  centre: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  glow: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: radii.circle,
    backgroundColor: gold[300],
    opacity: 0.18,
  },
});
