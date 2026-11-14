import React, { type ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import {
  brand,
  elevation,
  gold,
  mint,
  neutral,
  platformKey,
  radii,
  semantic,
  spacing,
  type GradientToken,
} from '@medmate/theme';

import { Icon, type IconName } from '../icons/Icon';
import { Text } from './Text';

const isAndroidButton = platformKey === 'android';

/* -------------------------------------------------------------------------- */
/*  Gradient                                                                  */
/* -------------------------------------------------------------------------- */

export type GradientProps = {
  /** Gradient token from the theme. */
  token?: GradientToken;
  /** Explicit stops, overriding the token. */
  colors?: readonly string[];
  /** Corner radius. */
  radius?: number;
  /** Extra style for the wrapper. */
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
};

let gradientSeq = 0;

/**
 * A gradient-filled surface.
 *
 * React Native has no first-class gradient, so this draws one with
 * react-native-svg. Every gradient in the design is vertical, which keeps the
 * renderer cheap and the output predictable.
 */
export function Gradient({ token = 'art', colors: override, radius = 0, style, children }: GradientProps) {
  const id = `grad${(gradientSeq += 1)}`;
  const stops = override ?? DEFAULT_STOPS[token];

  return (
    <View style={[{ overflow: 'hidden', borderRadius: radius }, style]}>
      <Svg width="100%" height="100%" viewBox="0 0 1 1" preserveAspectRatio="none" style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id={id} x1="0.5" y1="0" x2="0.5" y2="1">
            {stops.map((color, index) => (
              <Stop key={`${id}-${index}`} offset={index / Math.max(stops.length - 1, 1)} stopColor={color} />
            ))}
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="1" height="1" fill={`url(#${id})`} />
      </Svg>
      {children}
    </View>
  );
}

const DEFAULT_STOPS: Record<GradientToken, readonly string[]> = {
  brand: [brand.forest, brand.green700],
  art: [mint[50], mint[200]],
  mint: [mint[50], mint[300]],
  gold: ['#F7E3A8', gold[300]],
  blush: ['#FFFFFF', '#F3D9E3'],
  lab: [mint[100], mint[200]],
};

/* -------------------------------------------------------------------------- */
/*  Art                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * The mint art tint that product photos sit on.
 *
 * The design system forbids product photos on plain white, so every product
 * image is placed on this gradient. When a photo is not available yet the tile
 * falls back to the product's initials, which is the placeholder treatment
 * used in the Figma file itself.
 */
export function ArtTile({
  size,
  width,
  height,
  radius = radii.lg,
  initials,
  photo,
  style,
}: {
  size?: number;
  width?: number;
  height?: number;
  radius?: number;
  initials?: string;
  /** Local asset for the product photo. */
  photo?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const w = width ?? size ?? 0;
  const h = height ?? size ?? 0;

  return (
    <Gradient
      token="art"
      radius={radius}
      style={[{ width: w, height: h }, style]}
    >
      {photo != null ? null : initials ? (
        <View style={styles.artInitials}>
          <Text variant="title3" color={brand.green700} style={styles.artInitialsText}>
            {initials}
          </Text>
        </View>
      ) : null}
    </Gradient>
  );
}

/* -------------------------------------------------------------------------- */
/*  Button                                                                    */
/* -------------------------------------------------------------------------- */

export type ButtonProps = {
  label: string;
  /**
   * The three buttons the design has:
   * - `filled` - green, the primary call to action
   * - `forest` - the dark button on light surfaces
   * - `gold`   - the premium action
   */
  tone?: 'filled' | 'forest' | 'gold' | 'outline';
  /** `large` is the 50pt call to action, `small` the 34pt one. */
  size?: 'small' | 'large';
  /** Leading icon. Defaults to the plus the design draws on every button. */
  icon?: IconName | null;
  /** Trailing chevron. On by default. */
  chevron?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

/**
 * A pill button.
 *
 * The design only has two tones: gold for the primary call to action and
 * forest for actions that sit on a light surface.
 */
export function Button({
  label,
  tone = 'gold',
  size = 'small',
  icon = null,
  chevron = false,
  onPress,
  style,
}: ButtonProps) {
  const isGold = tone === 'gold';
  const isOutline = tone === 'outline';
  const isLarge = size === 'large';
  const ink = isGold || isOutline ? brand.green : neutral.surface;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        isLarge ? styles.buttonLarge : styles.buttonSmall,
        {
          backgroundColor: isOutline
            ? neutral.surface
            : tone === 'filled'
              ? brand.green
              : isGold
                ? gold[300]
                : brand.forest,
          opacity: pressed ? 0.85 : 1,
        },
        isOutline ? styles.buttonOutline : null,
        style,
      ]}
    >
      {icon ? <Icon name={icon} size={18} color={ink} /> : null}
      <Text variant={isLarge ? 'button' : 'buttonSmall'} color={ink}>
        {label}
      </Text>
      {chevron ? <Icon name="chev-r" size={16} color={ink} /> : null}
    </Pressable>
  );
}

/**
 * The outlined "ADD" affordance used on product cards.
 */
export function AddButton({ label = 'ADD', onPress, style }: { label?: string; onPress?: () => void; style?: StyleProp<ViewStyle> }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.addButton,
        { opacity: pressed ? 0.7 : 1 },
        style,
      ]}
    >
      <Text variant="captionStrong" color={semantic.action}>
        {label}
      </Text>
    </Pressable>
  );
}

/* -------------------------------------------------------------------------- */
/*  Chips                                                                     */
/* -------------------------------------------------------------------------- */

export type ServiceChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

/**
 * The service tab chip that scrolls under the search bar.
 *
 * Selected chips are gold; unselected ones are a translucent white so they can
 * sit on the brand gradient.
 */
export function ServiceChip({ label, selected, onPress }: ServiceChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: selected ? gold[300] : 'rgba(255,255,255,0.12)',
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <Text variant="serviceTabLabel" color={selected ? brand.forest : neutral.surface} style={styles.chipLabel}>
        {label}
      </Text>
    </Pressable>
  );
}

export type FilterChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

/**
 * A filter pill used by the seasonal section.
 */
export function FilterChip({ label, selected, onPress }: FilterChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.filterChip,
        isAndroidButton ? styles.filterChipAndroid : styles.filterChipIOS,
        {
          backgroundColor: selected ? brand.forest : neutral.surface,
          borderColor: selected ? brand.forest : neutral.line2,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      {selected ? (
        <Icon name="check" size={isAndroidButton ? 18 : 14} color={gold[300]} />
      ) : null}
      <Text
        variant={isAndroidButton ? 'filterLabel' : 'buttonSmall'}
        color={selected ? neutral.surface : neutral.ink2}
      >
        {label}
      </Text>
    </Pressable>
  );
}

/* -------------------------------------------------------------------------- */
/*  Empty state                                                               */
/* -------------------------------------------------------------------------- */

/**
 * What a screen shows when a filter leaves nothing behind.
 *
 * Every list in the app filters live, so every list needs to say so when it
 * comes up empty.
 */
export function EmptyState({
  title,
  body,
  icon = 'search',
}: {
  title: string;
  body?: string;
  icon?: IconName;
}) {
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Icon name={icon} size={24} color={neutral.faint} />
      </View>
      <Text variant="strong" color={semantic.textSecondary} style={styles.emptyTitle}>
        {title}
      </Text>
      {body ? (
        <Text variant="resultSub" color={semantic.textMuted} style={styles.emptyBody}>
          {body}
        </Text>
      ) : null}
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*  Layout helpers                                                            */
/* -------------------------------------------------------------------------- */

/**
 * A section heading with an optional trailing link.
 */
export function SectionHeader({
  title,
  actionLabel,
  onAction,
  icon,
  style,
}: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  /** Leading badge, used by "Today's deals". */
  icon?: IconName;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.sectionHeader, style]}>
      {icon ? (
        <View style={styles.sectionBadge}>
          <Icon name={icon} size={14} color={gold[300]} />
        </View>
      ) : null}
      <Text variant="sectionTitle" color={semantic.text} style={styles.sectionTitle}>
        {title}
      </Text>
      {actionLabel ? (
        <Pressable accessibilityRole="button" onPress={onAction} style={styles.sectionLink}>
          <Text variant="linkLabel" color={semantic.action}>
            {actionLabel}
          </Text>
          <Icon name="chev-r" size={14} color={semantic.action} />
        </Pressable>
      ) : null}
    </View>
  );
}

/** A hairline rule. */
export function Divider({ style, strong }: { style?: StyleProp<ViewStyle>; strong?: boolean }) {
  return <View style={[styles.divider, { backgroundColor: strong ? neutral.line2 : neutral.line }, style]} />;
}

/** A labelled rule, used in the footer. */
export function LabelledDivider({ children }: { children: ReactNode }) {
  return (
    <View style={styles.labelledDivider}>
      <Divider strong />
      <Text variant="caption" color={semantic.textMuted}>
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  artInitials: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  artInitialsText: {
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  buttonSmall: {
    height: 34,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.pill,
  },
  buttonLarge: {
    height: 50,
    paddingHorizontal: spacing.xl,
    borderRadius: isAndroidButton ? radii.pill : radii.lg,
  },
  buttonOutline: {
    borderWidth: 1.5,
    borderColor: brand.green,
  },
  emptyState: {
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  emptyIcon: {
    width: 48,
    height: 48,
    borderRadius: radii.circle,
    backgroundColor: neutral.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    textAlign: 'center',
  },
  emptyBody: {
    textAlign: 'center',
  },
  addButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 32,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.sm,
    borderWidth: 1.5,
    borderColor: semantic.action,
    backgroundColor: neutral.surface,
  },
  chip: {
    height: 34,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    borderRadius: radii.pill,
  },
  chipLabel: {
    lineHeight: 18,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  filterChipIOS: {
    gap: spacing.xs + 2,
    height: 34,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.pill,
  },
  filterChipAndroid: {
    gap: spacing.sm,
    height: 32,
    paddingLeft: spacing.sm,
    paddingRight: spacing.lg,
    borderRadius: radii.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sectionBadge: {
    width: 26,
    height: 26,
    borderRadius: radii.circle,
    backgroundColor: brand.forest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    flexShrink: 1,
  },
  sectionLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    marginLeft: 'auto',
  },
  divider: {
    height: 1,
    width: '100%',
  },
  labelledDivider: {
    gap: spacing.xs,
  },
});

/** Elevation helpers re-exported so screens do not import the theme directly. */
export const cardShadow = elevation.medium;
export const floatingShadow = elevation.high;
