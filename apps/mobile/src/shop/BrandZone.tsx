import React from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { brand, mint, neutral, platformKey, radii, spacing } from '@medmate/theme';

import { Icon } from '../icons/Icon';
import { Text } from '../ui/Text';

const isAndroid = platformKey === 'android';

export type BrandZoneProps = {
  /** The title in the nav bar. */
  navTitle?: string;
  /** The heading under the nav bar. */
  heading: string;
  /** The line under the heading. */
  sub: string;
  onBack?: () => void;
  onHelp?: () => void;
  /** Extra content under the heading. */
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

/**
 * The brand zone.
 *
 * The forest gradient panel at the top of a screen: the nav bar with the back
 * control and the screen title, then the heading and its subtitle.
 */
export function BrandZone({
  navTitle,
  heading,
  sub,
  onBack,
  onHelp,
  children,
  style,
}: BrandZoneProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.zone, { paddingTop: insets.top }, style]}>
      <View style={styles.navBar}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back to home"
          onPress={onBack}
          hitSlop={10}
          style={styles.back}
        >
          <Icon
            name={isAndroid ? 'arrow-left' : 'chev-l'}
            size={isAndroid ? 24 : 20}
            color={neutral.surface}
            strokeWidth={isAndroid ? 2 : 2.2}
          />
          <Text variant="body" color={neutral.surface}>
            Home
          </Text>
        </Pressable>

        {navTitle ? (
          <Text variant="storeNavTitle" color={neutral.surface} style={styles.navTitle} numberOfLines={1}>
            {navTitle}
          </Text>
        ) : null}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Help and support"
          onPress={onHelp}
          style={styles.help}
        >
          <Icon name="search" size={18} color={neutral.surface} />
        </Pressable>
      </View>

      <View style={styles.content}>
        <Text variant="storeTitle" color={neutral.surface} numberOfLines={1}>
          {heading}
        </Text>
        <Text variant="countLine" color={mint[200]}>
          {sub}
        </Text>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  zone: {
    backgroundColor: brand.forest,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    paddingLeft: spacing.sm,
    paddingRight: spacing.lg,
    marginTop: spacing.sm,
  },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  navTitle: {
    flex: 1,
    textAlign: 'center',
    marginHorizontal: spacing.sm,
  },
  help: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xl,
  },
});

/** The radius the zone shares with the rest of the brand surfaces. */
export const zoneRadius = radii.huge;
