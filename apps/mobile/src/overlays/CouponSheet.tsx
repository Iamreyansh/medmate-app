import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { brand, gold, neutral, radii, semantic, spacing } from '@medmate/theme';

import { Icon } from '../icons/Icon';
import { Text } from '../ui/Text';
import { Sheet } from './parts';

/** A coupon that can be applied. */
export type SheetCoupon = {
  id: string;
  /** The big figure on the stub, e.g. "25%". */
  stub: string;
  /** The label under it, e.g. "OFF". */
  stubLabel: string;
  /** The code. */
  code: string;
  /** The headline. */
  title: string;
  /** The line under it. */
  body: string;
  /** The saving, e.g. "Save ₹27 · on health products only". */
  saving: string;
  /** The badge on the code. */
  best?: boolean;
  /** It is the coupon that is on now. */
  applied?: boolean;
};

export type CouponSheetProps = {
  visible: boolean;
  coupons: SheetCoupon[];
  onClose?: () => void;
  onApply?: (id: string) => void;
};

/**
 * The coupon sheet.
 *
 * The Figma `08 Overlays / Coupon sheet` frame: the sheet over the cart with
 * the three coupons that can be applied and the note about how they work.
 */
export function CouponSheet({ visible, coupons, onClose, onApply }: CouponSheetProps) {
  return (
    <Sheet visible={visible} title="Offers and coupons" onClose={onClose}>
      <View style={styles.rows}>
        {coupons.map((coupon) => (
          <Pressable
            key={coupon.id}
            accessibilityRole="button"
            accessibilityState={{ selected: !!coupon.applied }}
            onPress={() => {
              onApply?.(coupon.id);
              onClose?.();
            }}
            style={({ pressed }) => [styles.row, pressed ? { opacity: 0.92 } : null]}
          >
            <View style={styles.stub}>
              <Text variant="price" color={gold[300]}>
                {coupon.stub}
              </Text>
              <Text variant="tag" color={gold[300]}>
                {coupon.stubLabel}
              </Text>
            </View>

            <View style={styles.body}>
              <View style={styles.codeRow}>
                <Text variant="buttonSmall" color={semantic.text}>
                  {coupon.code}
                </Text>
                {coupon.best ? (
                  <View style={styles.best}>
                    <Text variant="tag" color={neutral.surface}>
                      Best
                    </Text>
                  </View>
                ) : null}
                {coupon.applied ? (
                  <Icon name="check" size={16} color={brand.green} />
                ) : null}
              </View>
              <Text variant="caption" color={semantic.text}>
                {coupon.title}
              </Text>
              <Text variant="caption" color={semantic.textMuted}>
                {coupon.body}
              </Text>
              <Text variant="caption" color={semantic.textMuted}>
                {coupon.saving}
              </Text>
            </View>

            <View style={styles.apply}>
              <Text variant="buttonSmall" color={brand.green}>
                Apply
              </Text>
            </View>
          </Pressable>
        ))}

        <Text variant="caption" color={semantic.textMuted} style={styles.note}>
          One coupon per order. Coupons never apply to prescription medicines. The ₹5 handling
          charge still applies.
        </Text>
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  rows: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: neutral.line,
    backgroundColor: neutral.surface,
  },
  stub: {
    width: 72,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    backgroundColor: brand.forest,
  },
  body: {
    flex: 1,
    gap: 2,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  best: {
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 1,
    borderRadius: radii.xs,
    backgroundColor: brand.forest,
  },
  apply: {
    height: 32,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: brand.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  note: {
    marginTop: spacing.xs,
  },
});
