import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import {
  brand,
  mint,
  neutral,
  radii,
  semantic,
  spacing,
} from '@medmate/theme';

import { Icon } from '../icons/Icon';
import { Text } from '../ui/Text';
import { TagPill } from '../ui/blocks';
import { promises, tagline } from './data';

/**
 * The pieces the onboarding screens share.
 */

/**
 * The wordmark and the line under it.
 *
 * The sign-in screens put it at the top of the brand zone; the ones that
 * follow put it in the corner.
 */
export function Wordmark({
  size = 'large',
  tone = 'light',
}: {
  /** `large` is the login zone, `small` the corner on the later screens. */
  size?: 'large' | 'small';
  /** `light` is on the brand zone, `dark` on white. */
  tone?: 'light' | 'dark';
}) {
  const ink = tone === 'light' ? neutral.surface : semantic.text;
  const sub = tone === 'light' ? mint[200] : semantic.textMuted;

  return (
    <View style={styles.wordmark}>
      <Text
        variant={size === 'large' ? 'pharmacyTitle' : 'titleLarge'}
        color={ink}
        style={size === 'large' ? styles.wordmarkLarge : undefined}
      >
        MedMate
      </Text>
      <Text variant="eyebrow" color={sub}>
        {tagline}
      </Text>
    </View>
  );
}

/** The three promises on the login zone. */
export function PromiseStrip() {
  return (
    <View style={styles.promises}>
      {promises.map((promise) => (
        <View key={promise.title} style={styles.promise}>
          <Icon name={promise.icon} size={20} color={neutral.surface} />
          <Text variant="eyebrow" color={neutral.surface}>
            {promise.title}
          </Text>
          <Text variant="eyebrow" color={mint[300]}>
            {promise.body}
          </Text>
        </View>
      ))}
    </View>
  );
}

/**
 * The row that detects where the shopper is.
 *
 * It is used on the location screen and on the address form.
 */
export function DetectRow({
  title,
  body,
  action = 'Detect',
  onPress,
}: {
  title: string;
  body: string;
  action?: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.detect, pressed ? { opacity: 0.9 } : null]}
    >
      <View style={styles.detectIcon}>
        <Icon name="pin" size={22} color={neutral.surface} />
      </View>
      <View style={styles.detectText}>
        <Text variant="subheadline" color={semantic.text}>
          {title}
        </Text>
        <Text variant="caption" color={semantic.textMuted}>
          {body}
        </Text>
      </View>
      <Text variant="footnoteEmphasized" color={brand.green}>
        {action}
      </Text>
    </Pressable>
  );
}

/**
 * A box the shopper ticks.
 */
export function ConsentTick({
  label,
  note,
  checked,
  onPress,
  required = true,
}: {
  label: string;
  note: string;
  checked: boolean;
  onPress?: () => void;
  required?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      onPress={onPress}
      style={({ pressed }) => [styles.tick, pressed ? { opacity: 0.9 } : null]}
    >
      <View style={[styles.tickBox, checked ? styles.tickBoxOn : null]}>
        {checked ? <Icon name="check" size={14} color={neutral.surface} /> : null}
      </View>
      <View style={styles.tickText}>
        <Text variant="buttonSmall" color={semantic.text}>
          {label}
        </Text>
        <Text variant="caption" color={semantic.textMuted}>
          {note}
        </Text>
      </View>
    </Pressable>
  );
}

/** The tag on the address the order goes to. */
export function DeliveringHereTag() {
  return (
    <TagPill
      label="DELIVERING HERE"
      tone="gold"
    />
  );
}

const styles = StyleSheet.create({
  wordmark: {
    gap: 2,
  },
  wordmarkLarge: {
    letterSpacing: -1.19,
  },
  promises: {
    flexDirection: 'row',
    borderRadius: radii.xl,
    backgroundColor: brand.forest,
    overflow: 'hidden',
  },
  promise: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingVertical: spacing.md,
  },
  detect: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: neutral.line,
    backgroundColor: neutral.surface,
  },
  detectIcon: {
    width: 44,
    height: 44,
    borderRadius: radii.mdPlus,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: brand.forest,
  },
  detectText: {
    flex: 1,
    gap: 2,
  },
  tick: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  tickBox: {
    width: 22,
    height: 22,
    borderRadius: radii.circle,
    borderWidth: 1.5,
    borderColor: neutral.line2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tickBoxOn: {
    backgroundColor: brand.green,
    borderColor: brand.green,
  },
  tickText: {
    flex: 1,
    gap: 2,
  },
});
