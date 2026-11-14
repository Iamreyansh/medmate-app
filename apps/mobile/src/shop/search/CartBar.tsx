import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

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
} from '@medmate/theme';

import { Icon } from '../../icons/Icon';
import { Text } from '../../ui/Text';
import { cartGoal } from '../../data/search';

const isAndroid = platformKey === 'android';

export type CartBarProps = {
  /** Items in the cart, shown in the bubble. */
  count?: number;
  onCartPress?: () => void;
};

/**
 * The bar that closes the screen.
 *
 * It carries the free-delivery goal on the left - how much more to add and
 * how far along the progress bar is - and the cart button with its count on
 * the right.
 */
export function CartBar({ count = cartGoal.count, onCartPress }: CartBarProps) {
  const progress = Math.min(1, cartGoal.progress / cartGoal.track);

  return (
    <View style={styles.wrap}>
      <View style={styles.bar}>
        <View style={styles.goalIcon}>
          <Icon name="heart" size={18} color={brand.green700} />
        </View>

        <View style={styles.goal}>
          <Text variant="strong" color={semantic.text}>
            {`Add ₹${cartGoal.remaining} → ₹0 delivery`}
          </Text>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${progress * 100}%` }]} />
          </View>
          <Text variant="resultSub" color={semantic.textMuted}>
            {cartGoal.sub}
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Cart"
          onPress={onCartPress}
          style={({ pressed }) => [styles.cartButton, { opacity: pressed ? 0.85 : 1 }]}
        >
          <Icon name="bag" size={18} color={gold[300]} />
          <Text variant="button" color={neutral.surface}>
            Cart
          </Text>
          <View style={styles.bubble}>
            <Text variant="tag" color={brand.forest}>
              {count}
            </Text>
          </View>
        </Pressable>
      </View>

      {isAndroid ? (
        <View style={styles.gestureHandle}>
          <View style={styles.handleBar} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    height: 68,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md - 2,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#D9F0E1',
    backgroundColor: neutral.surface,
    shadowColor: elevation.medium.shadowColor,
    shadowOffset: elevation.medium.shadowOffset,
    shadowRadius: elevation.medium.shadowRadius,
    shadowOpacity: elevation.medium.shadowOpacity,
    elevation: elevation.medium.elevation,
  },
  goalIcon: {
    width: 36,
    height: 36,
    borderRadius: radii.circle,
    backgroundColor: mint[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  goal: {
    flex: 1,
    gap: spacing.xs,
  },
  track: {
    height: 4,
    borderRadius: 2,
    backgroundColor: mint[100],
    overflow: 'hidden',
  },
  fill: {
    height: 4,
    borderRadius: 2,
    backgroundColor: brand.green,
  },
  cartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    height: isAndroid ? 48 : 44,
    paddingLeft: spacing.lg,
    paddingRight: spacing.md - 2,
    // Android draws the cart button as a pill.
    borderRadius: isAndroid ? radii.pill : radii.lg,
    backgroundColor: brand.forest,
  },
  bubble: {
    width: 22,
    height: 22,
    borderRadius: radii.circle,
    backgroundColor: gold[300],
    alignItems: 'center',
    justifyContent: 'center',
  },
  gestureHandle: {
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  handleBar: {
    width: 108,
    height: 4,
    borderRadius: 2,
    backgroundColor: neutral.ink,
    opacity: 0.6,
  },
});
