import React from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { brand, gold, mint, neutral, radii, semantic, spacing, status } from '@medmate/theme';

import { Icon, type IconName } from '../icons/Icon';
import { Text } from './Text';

/* -------------------------------------------------------------------------- */
/*  Status tag                                                                */
/* -------------------------------------------------------------------------- */

export type StatusTagTone = 'noPrescription' | 'prescription' | 'discount';

/**
 * The small pill that labels a row.
 *
 * `noPrescription` is the mint tag on an over-the-counter result,
 * `prescription` the red tag on a prescription one, and `discount` the gold
 * tag that carries the saving.
 */
export function StatusTag({
  label,
  tone,
  style,
}: {
  label: string;
  tone: StatusTagTone;
  style?: StyleProp<ViewStyle>;
}) {
  const isDiscount = tone === 'discount';

  return (
    <View
      style={[
        styles.statusTag,
        {
          backgroundColor:
            tone === 'noPrescription' ? mint[100] : tone === 'prescription' ? status.redBg : gold[50],
        },
        style,
      ]}
    >
      <Text
        variant={isDiscount ? 'captionStrong' : 'tag'}
        color={tone === 'noPrescription' ? brand.green700 : tone === 'prescription' ? status.red : gold.ink}
        style={styles.statusTagLabel}
      >
        {label}
      </Text>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*  Category chip                                                             */
/* -------------------------------------------------------------------------- */

/**
 * The forest chip that names the category the query sits in.
 *
 * Tapping it opens the category screen.
 */
export function CategoryChip({
  label,
  onPress,
}: {
  label: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.categoryChip, { opacity: pressed ? 0.85 : 1 }]}
    >
      <Text variant="strong" color={neutral.surface}>
        {label}
      </Text>
      <Icon name="chev-r" size={12} color={gold[300]} />
    </Pressable>
  );
}

/* -------------------------------------------------------------------------- */
/*  Outline pill                                                              */
/* -------------------------------------------------------------------------- */

/**
 * The outlined pill used for "Show 20 more of 51".
 */
export function OutlinePillButton({
  label,
  icon,
  onPress,
  style,
}: {
  label: string;
  icon?: IconName;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.outlinePill, { opacity: pressed ? 0.8 : 1 }, style]}
    >
      <Text variant="strong" color={neutral.ink2}>
        {label}
      </Text>
      {icon ? <Icon name={icon} size={14} color={neutral.ink2} /> : null}
    </Pressable>
  );
}

/* -------------------------------------------------------------------------- */
/*  Sort button                                                               */
/* -------------------------------------------------------------------------- */

/**
 * The sort chip next to the result count.
 */
export function SortButton({ onPress }: { onPress?: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.sortButton, { opacity: pressed ? 0.85 : 1 }]}
    >
      <Icon name="refill" size={14} color={neutral.ink2} />
      <Text variant="strong" color={neutral.ink2}>
        Sort
      </Text>
      <Icon name="chev-d" size={14} color={neutral.ink2} />
    </Pressable>
  );
}

/* -------------------------------------------------------------------------- */
/*  Styles                                                                    */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  statusTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.xs + 5,
    paddingVertical: spacing.xxs,
    borderRadius: radii.xs,
  },
  statusTagLabel: {
    lineHeight: 13,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    height: 30,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    backgroundColor: brand.forest,
  },
  outlinePill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs + 2,
    height: 36,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: neutral.line2,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    height: 32,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: neutral.line2,
  },
});

/** Semantic colour of the sort label, kept next to the component that uses it. */
export const sortLabelColor = semantic.textSecondary;
