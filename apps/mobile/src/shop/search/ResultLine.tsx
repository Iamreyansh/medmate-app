import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { elevation, neutral, platformKey, radii, semantic, spacing } from '@medmate/theme';

import { Icon } from '../../icons/Icon';
import { Text } from '../../ui/Text';
import { StatusTag } from '../../ui/chips';
import { ArtTile } from '../../ui/primitives';
import { initialsOf, type SearchResult } from '../../data/search';

const isAndroid = platformKey === 'android';

export type ResultLineProps = {
  result: SearchResult;
  onAdd?: () => void;
  onPress?: () => void;
};

/**
 * One row of the result list.
 *
 * The tag, the name, the price and the pack description sit on the left; the
 * art tile with the ADD button sits on the right, with the button overlapping
 * the bottom of the photo exactly as the design does.
 *
 * Prescription rows show the selling price only - no strike-through MRP and
 * no discount.
 */
export function ResultLine({ result, onAdd, onPress }: ResultLineProps) {
  return (
    <View style={styles.line}>
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [styles.stack, { opacity: pressed ? 0.92 : 1 }]}
      >
        <View style={styles.stackInner}>
        <StatusTag
          label={result.rx ? 'Prescription' : 'No prescription'}
          tone={result.rx ? 'prescription' : 'noPrescription'}
        />
        <Text variant="resultName" color={semantic.text} numberOfLines={2}>
          {result.name}
        </Text>
        <View style={styles.priceRow}>
          <Text variant="price" color={semantic.text}>
            {`₹${result.price.toLocaleString('en-IN')}`}
          </Text>
          {!result.rx && result.mrp ? (
            <Text variant="resultSub" color={semantic.textMuted} style={styles.mrp}>
              {`₹${result.mrp.toLocaleString('en-IN')}`}
            </Text>
          ) : null}
          {!result.rx && result.off ? (
            <StatusTag label={`${result.off}% OFF`} tone="discount" />
          ) : null}
        </View>
        <Text variant="resultSub" color={semantic.textMuted} numberOfLines={2}>
          {result.sub}
        </Text>
        </View>
      </Pressable>

      <View style={styles.photoBlock}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={result.name}
          onPress={onPress}
          style={({ pressed }) => [{ opacity: pressed ? 0.92 : 1 }]}
        >
          <ArtTile
            width={112}
            height={104}
            radius={radii.xl}
            initials={initialsOf(result.name)}
            style={styles.photo}
          />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Add ${result.name} to the cart`}
          onPress={onAdd}
          hitSlop={8}
          style={({ pressed }) => [
            styles.add,
            {
              opacity: pressed ? 0.85 : 1,
              shadowColor: elevation.low.shadowColor,
              shadowOffset: elevation.low.shadowOffset,
              shadowRadius: elevation.low.shadowRadius,
              shadowOpacity: elevation.low.shadowOpacity,
              elevation: elevation.low.elevation,
            },
          ]}
        >
          <Text variant="strong" color={semantic.action}>
            ADD
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

/**
 * The card that holds the result rows.
 *
 * The design wraps the list in one white card with a hairline border and a
 * rule between the rows.
 */
export function ResultsCard({ children }: { children: React.ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}

/** The rule that separates two rows inside the card. */
export function ResultDivider() {
  return <View style={styles.divider} />;
}

/** The "show more" affordance that closes the card. */
export function ShowMoreRow({
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
      style={({ pressed }) => [styles.showMore, { opacity: pressed ? 0.85 : 1 }]}
    >
      <Text variant="strong" color={neutral.ink2}>
        {label}
      </Text>
      <Icon name="chev-d" size={14} color={neutral.ink2} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: isAndroid ? 16 : radii.xl,
    borderWidth: 1,
    borderColor: '#D9F0E1',
    backgroundColor: neutral.surface,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  line: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  stack: {
    flex: 1,
  },
  stackInner: {
    gap: spacing.xs,
    paddingVertical: spacing.xxs,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
  },
  mrp: {
    textDecorationLine: 'line-through',
  },
  photoBlock: {
    width: 112,
    height: 120,
    alignItems: 'center',
  },
  photo: {
    borderWidth: 1,
    borderColor: '#D9F0E1',
  },
  add: {
    position: 'absolute',
    top: 90,
    left: 18,
    width: 76,
    height: 30,
    borderRadius: radii.sm,
    borderWidth: 1.5,
    borderColor: semantic.action,
    backgroundColor: neutral.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    marginVertical: spacing.md,
    backgroundColor: neutral.line,
  },
  showMore: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs + 2,
    alignSelf: 'center',
    height: 36,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: neutral.line2,
  },
});
