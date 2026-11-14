import React from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { brand, gold, mint, neutral, platformKey, radii, spacing } from '@medmate/theme';

import { Icon, type IconName } from '../icons/Icon';
import { Text } from '../ui/Text';

const isAndroid = platformKey === 'android';

export type NavBarProps = {
  /** The label under the back chevron, e.g. "Home". */
  backLabel?: string;
  /** The title in the middle of the bar. */
  title?: string;
  onBack?: () => void;
  /** The trailing action. */
  onAction?: () => void;
  /** The icon of the trailing action. */
  actionIcon?: IconName;
  /** The trailing action label, shown in gold on iOS. */
  actionLabel?: string;
};

/**
 * The nav bar of a brand zone.
 *
 * iOS draws a back chevron with a label and a gold action label beside a
 * translucent button; Android draws two circular icon buttons instead.
 */
export function NavBar({
  backLabel,
  title,
  onBack,
  onAction,
  actionIcon = 'search',
  actionLabel,
}: NavBarProps) {
  if (isAndroid) {
    return (
      <View style={styles.navBar}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          onPress={onBack}
          style={styles.navCircle}
        >
          <Icon name="arrow-left" size={24} color={neutral.surface} />
        </Pressable>
        {title ? (
          <Text variant="storeNavTitle" color={neutral.surface} style={styles.navTitle}>
            {title}
          </Text>
        ) : null}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Help and support"
          onPress={onAction}
          style={styles.navCircle}
        >
          <Icon name={actionIcon} size={24} color={neutral.surface} />
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.navBar}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Back"
        onPress={onBack}
        hitSlop={10}
        style={styles.back}
      >
        <Icon name="chev-l" size={20} color={neutral.surface} strokeWidth={2.2} />
        {backLabel ? (
          <Text variant="body" color={neutral.surface}>
            {backLabel}
          </Text>
        ) : null}
      </Pressable>
      {title ? (
        <Text variant="storeNavTitle" color={neutral.surface} style={styles.navTitle} numberOfLines={1}>
          {title}
        </Text>
      ) : null}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Help and support"
        onPress={onAction}
        style={styles.help}
      >
        <Icon name={actionIcon} size={18} color={neutral.surface} />
      </Pressable>
      {actionLabel ? (
        <Text variant="body" color={gold[300]}>
          {actionLabel}
        </Text>
      ) : null}
    </View>
  );
}

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
      <NavBar
        backLabel="Home"
        title={navTitle}
        onBack={onBack}
        onAction={onHelp}
        actionLabel="Help"
      />

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
  navCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
