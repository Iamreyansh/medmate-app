import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  brand,
  mint,
  neutral,
  platformKey,
  radii,
  semantic,
  spacing,
} from '@medmate/theme';

import { Icon } from '../icons/Icon';
import { useCart } from '../state/cart';
import { useCheckout } from '../state/checkout';
import { Text } from '../ui/Text';
import { Gradient } from '../ui/primitives';
import { useContentInset } from '../ui/layout';
import { FoldRow, NoteRow, PharmacyOptionCard } from './parts';
import {
  checkoutTotals,
  closedPharmacy,
  compareFilters,
  compareNote,
  compareRxNote,
  compareDisclaimer,
  licensedPharmacies,
  pharmacyMeta,
  pharmacyOptions,
} from './data';
import { useSeedBasket } from './useSeedBasket';

const isAndroid = platformKey === 'android';

export type ComparePharmaciesScreenProps = {
  onBack?: () => void;
  onHelp?: () => void;
  onUsePharmacy?: (id: string) => void;
};

/**
 * Compare pharmacies.
 *
 * The Figma `03 Checkout / Compare pharmacies` frame lists every pharmacy that
 * can fill the order, what the basket comes to at each one and how long each
 * of them will take. The shopper picks one and goes back to the cart.
 */
export function ComparePharmaciesScreen({
  onBack,
  onHelp,
  onUsePharmacy,
}: ComparePharmaciesScreenProps) {
  const insets = useSafeAreaInsets();
  const inset = useContentInset();
  const cart = useCart();
  const checkout = useCheckout();
  const [filter, setFilter] = useState('recommended');
  useSeedBasket();

  const chosen =
    pharmacyOptions.find((option) => option.id === checkout.pharmacyId) ?? pharmacyOptions[0];

  const chosenTotals = useMemo(
    () => checkoutTotals(cart.lines, { deliveryFee: chosen.deliveryFee }),
    [cart.lines, chosen.deliveryFee],
  );

  const options = useMemo(() => {
    const list = [...pharmacyOptions];
    if (filter === 'fastest') {
      list.sort((a, b) => a.eta.localeCompare(b.eta));
    } else if (filter === 'lowest') {
      list.sort(
        (a, b) =>
          checkoutTotals(cart.lines, { deliveryFee: a.deliveryFee }).total -
          checkoutTotals(cart.lines, { deliveryFee: b.deliveryFee }).total,
      );
    }
    return list;
  }, [filter, cart.lines]);

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xl }}
        showsVerticalScrollIndicator={false}
      >
        {/* Brand zone */}
        <Gradient token="brand" radius={radii.huge} style={styles.zone}>
          <View style={[styles.zoneInner, { paddingTop: insets.top }]}>
            <View style={[styles.navBar, { paddingHorizontal: inset }]}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Back to checkout"
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
                  Checkout
                </Text>
              </Pressable>
              <Text variant="storeNavTitle" color={neutral.surface}>
                Choose a pharmacy
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Help and support"
                onPress={onHelp}
                style={styles.helpButton}
              >
                <Icon name="bell" size={18} color={neutral.surface} />
              </Pressable>
            </View>

            <View style={[styles.zoneContent, { paddingHorizontal: inset }]}>
              <Text variant="storeTitle" color={neutral.surface}>
                {`${pharmacyOptions.length} ways to get your order`}
              </Text>
              <Text variant="caption" color={mint[200]}>
                {`${chosenTotals.products} items in your cart · ${pharmacyOptions.length} options with everything in stock`}
              </Text>
            </View>
          </View>
        </Gradient>

        <View style={[styles.content, { paddingHorizontal: inset }]}>
          {/* The pharmacy that is chosen right now. */}
          <View style={styles.chosen}>
            <Icon name="check" size={16} color={brand.green700} />
            <Text variant="caption" color={semantic.textSecondary} style={styles.chosenText}>
              {`Now chosen: ${chosen.name} · ₹${chosenTotals.total} to pay`}
            </Text>
          </View>

          {/* Filters */}
          <View style={styles.filters}>
            {compareFilters.map((option) => {
              const selected = option.id === filter;
              return (
                <Pressable
                  key={option.id}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => setFilter(option.id)}
                  style={({ pressed }) => [
                    styles.filter,
                    selected ? styles.filterOn : null,
                    pressed ? { opacity: 0.9 } : null,
                  ]}
                >
                  <Text
                    variant="footnoteEmphasized"
                    color={selected ? neutral.surface : semantic.textSecondary}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text variant="caption" color={semantic.textMuted}>
            {compareNote}
          </Text>

          {/* The options */}
          {options.map((option) => {
            const totals = checkoutTotals(cart.lines, { deliveryFee: option.deliveryFee });
            const isChosen = option.id === chosen.id;
            return (
              <PharmacyOptionCard
                key={option.id}
                option={option}
                selected={isChosen}
                total={`₹${totals.total}`}
                meta={pharmacyMeta(option)}
                onPress={() => {
                  checkout.setPharmacyId(option.id);
                  onUsePharmacy?.(option.id);
                }}
              />
            );
          })}

          {/* The pharmacy that cannot be compared. */}
          <View style={styles.closedRow}>
            <Icon name="clock" size={16} color={semantic.textMuted} />
            <Text variant="caption" color={semantic.textMuted} style={styles.closedText}>
              {`Closed now and not compared: ${closedPharmacy.name} (${closedPharmacy.opens}).`}
            </Text>
          </View>

          <NoteRow icon="rx-doc">{compareRxNote}</NoteRow>

          {/* How the options are compared. */}
          <FoldRow label="How we compare" icon="info" />
          <View style={styles.explainer}>
            {licensedPharmacies.map((line) => (
              <View key={line} style={styles.explainerRow}>
                <Icon name="check" size={14} color={brand.green700} />
                <Text variant="caption" color={semantic.textSecondary} style={styles.explainerText}>
                  {line}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.closedRow}>
            <Icon name="info" size={16} color={semantic.textMuted} />
            <Text variant="caption" color={semantic.textMuted} style={styles.closedText}>
              {compareDisclaimer}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: semantic.page,
  },
  scroll: {
    flex: 1,
  },
  zone: {
    borderBottomLeftRadius: radii.huge,
    borderBottomRightRadius: radii.huge,
    overflow: 'hidden',
  },
  zoneInner: {
    paddingBottom: spacing.lg,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
  },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  helpButton: {
    width: 32,
    height: 32,
    borderRadius: radii.circle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoneContent: {
    gap: spacing.xs,
    paddingTop: spacing.md,
  },
  content: {
    gap: spacing.md,
    paddingTop: spacing.lg,
  },
  chosen: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: mint[200],
    backgroundColor: mint[50],
  },
  chosenText: {
    flex: 1,
  },
  filters: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  filter: {
    height: 34,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: neutral.line,
    backgroundColor: neutral.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterOn: {
    backgroundColor: brand.forest,
    borderColor: brand.forest,
  },
  closedRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  closedText: {
    flex: 1,
  },
  explainer: {
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radii.md,
    backgroundColor: neutral.surface,
    borderWidth: 1,
    borderColor: neutral.line,
  },
  explainerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  explainerText: {
    flex: 1,
  },
});
