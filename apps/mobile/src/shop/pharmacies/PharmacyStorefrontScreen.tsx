import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  brand,
  designFontScale,
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
import { useGrid } from '../../ui/layout';
import { EmptyState, FilterChip } from '../../ui/primitives';
import { useCart } from '../../state/cart';
import { useNotice } from '../../state/notice';
import { catalogue } from '../../data/catalogue';
import { offerCoupons, type Pharmacy } from '../../data/pharmacy';
import { CartBar } from '../search/CartBar';
import { NavBar } from '../BrandZone';
import { ProductCard } from '../sections';

const isAndroid = platformKey === 'android';

export type PharmacyStorefrontScreenProps = {
  /** The store on screen. */
  pharmacy: Pharmacy;
  onBack?: () => void;
  onHelp?: () => void;
  onProductPress?: (id: string) => void;
  onCouponApply?: (code: string) => void;
};

/**
 * A pharmacy storefront.
 *
 * The store's card overlaps the brand zone, then the coupons it accepts, the
 * search inside the store, the filters and the products on its shelves.
 */
export function PharmacyStorefrontScreen({
  pharmacy,
  onBack,
  onHelp,
  onProductPress,
  onCouponApply,
}: PharmacyStorefrontScreenProps) {
  const insets = useSafeAreaInsets();
  const cart = useCart();
  const notice = useNotice();
  const [filter, setFilter] = useState<'all' | 'noPrescription' | 'prescription' | 'discount'>('all');
  const [query, setQuery] = useState('');

  const grid = useGrid(3, { basis: 114 });

  const products = useMemo(() => {
    const needle = query.trim().toLowerCase();
    let list = catalogue.filter((product) => product.category !== 'Everyday essentials');
    if (filter === 'noPrescription') list = list.filter((product) => !product.rx);
    if (filter === 'prescription') list = list.filter((product) => product.rx);
    if (filter === 'discount') list = list.filter((product) => !product.rx && (product.off ?? 0) >= 15);
    if (needle) {
      list = list.filter((product) =>
        `${product.name} ${product.sub}`.toLowerCase().includes(needle),
      );
    }
    return list;
  }, [filter, query]);

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 110 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Brand zone */}
        <View style={[styles.zone, { paddingTop: insets.top }]}>
          <NavBar
            backLabel="Pharmacies"
            onBack={onBack}
            onAction={onHelp}
            actionLabel="Help"
          />
        </View>

        {/* The store card overlaps the brand zone. */}
        <View style={styles.overlap}>
          <View style={styles.storeCard}>
            <View style={styles.storeRow}>
              <View style={styles.storeAvatar}>
                <Text variant="categoryTitle" color={brand.green700}>
                  {pharmacy.initials}
                </Text>
              </View>
              <View style={styles.storeInfo}>
                <Text variant="resultSub" color={semantic.textMuted}>
                  {pharmacy.categories}
                </Text>
                <Text variant="resultSub" color={semantic.textMuted}>
                  {`${pharmacy.area} · ${pharmacy.distance} away`}
                </Text>
              </View>
              <Text variant="tag" color={brand.green700}>
                {pharmacy.open ? '● Open' : '● Closed'}
              </Text>
            </View>

            <View style={styles.deliveryRow}>
              <Text variant="strong" color={semantic.text}>
                {pharmacy.eta}
              </Text>
              <Text variant="resultSub" color={semantic.textMuted}>
                {pharmacy.openLabel}
              </Text>
              <Text variant="strong" color={semantic.text}>
                {pharmacy.noDeliveryFee ? 'No delivery fee' : 'Delivery fee applies'}
              </Text>
            </View>

            <View style={styles.dashed} />

            <View style={styles.storeFootRow}>
              <Text variant="strong" color={semantic.text}>
                {pharmacy.licence}
              </Text>
              <Text variant="resultSub" color={semantic.textMuted}>
                {pharmacy.pharmacist}
              </Text>
            </View>

            <Text variant="resultSub" color={semantic.textMuted}>
              Standard delivery time · Express 12 min for +₹25 at checkout · ₹5 handling per order
            </Text>
          </View>
        </View>

        <View style={styles.body}>
          {/* Coupons the store accepts */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.couponRow}
          >
            {offerCoupons.map((coupon) => (
              <Pressable
                key={coupon.id}
                accessibilityRole="button"
                onPress={() => onCouponApply?.(coupon.code)}
                style={({ pressed }) => [styles.coupon, { opacity: pressed ? 0.85 : 1 }]}
              >
                <View style={styles.couponIcon}>
                  <Icon name="tag" size={18} color={brand.green700} />
                </View>
                <View style={styles.couponText}>
                  <Text variant="strong" color={semantic.text}>
                    {coupon.title}
                  </Text>
                  <Text variant="resultSub" color={gold.ink}>
                    {`Use ${coupon.code} · tap to apply`}
                  </Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>

          {/* Search inside the store */}
          <View style={styles.searchBar}>
            <Icon name="search" size={18} color={semantic.textMuted} />
            <TextInput
              allowFontScaling={false}
              value={query}
              onChangeText={setQuery}
              placeholder={`Search in ${pharmacy.name}`}
              placeholderTextColor={semantic.textMuted}
              style={styles.searchInput}
              accessibilityLabel={`Search in ${pharmacy.name}`}
            />
          </View>

          {/* Filters */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
          >
            <FilterChip label="All items" selected={filter === 'all'} onPress={() => setFilter('all')} />
            <FilterChip
              label="No prescription"
              selected={filter === 'noPrescription'}
              onPress={() => setFilter('noPrescription')}
            />
            <FilterChip
              label="Prescription"
              selected={filter === 'prescription'}
              onPress={() => setFilter('prescription')}
            />
            <FilterChip
              label="15% off and more"
              selected={filter === 'discount'}
              onPress={() => setFilter('discount')}
            />
          </ScrollView>

          <Text variant="headline" color={semantic.text}>
            Everyday essentials
          </Text>

          {products.length === 0 ? (
            <EmptyState
              title="This store has nothing in that filter"
              body="Try another filter, or search the whole of MedMate."
            />
          ) : null}
          <View style={[styles.grid, { gap: grid.gap }]}>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                width={grid.width}
                onAdd={() => {
                  cart.add({ id: product.id, name: product.name, price: product.price });
                  notice.notify(`${product.name} added to the cart`);
                }}
                onPress={() => onProductPress?.(product.id)}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.chrome, { paddingBottom: insets.bottom }]}>
        <View style={styles.floatingRow}>
          <Pressable
            accessibilityRole="button"
            onPress={() => notice.notify('The category screen is next in the section')}
            style={({ pressed }) => [styles.categoriesPill, { opacity: pressed ? 0.85 : 1 }]}
          >
            <Icon name="store" size={18} color={neutral.surface} />
            <Text variant="strong" color={neutral.surface}>
              Categories
            </Text>
          </Pressable>
        </View>
        <CartBar count={cart.count} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: neutral.page,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: spacing.xxl,
  },
  zone: {
    backgroundColor: brand.forest,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  help: {
    width: 32,
    height: 32,
    borderRadius: radii.circle,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlap: {
    marginTop: -48,
    paddingHorizontal: spacing.lg,
  },
  storeCard: {
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radii.lg,
    backgroundColor: neutral.surface,
    shadowColor: elevation.medium.shadowColor,
    shadowOffset: elevation.medium.shadowOffset,
    shadowRadius: elevation.medium.shadowRadius,
    shadowOpacity: elevation.medium.shadowOpacity,
    elevation: elevation.medium.elevation,
  },
  storeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md - 2,
  },
  storeAvatar: {
    width: 56,
    height: 56,
    borderRadius: radii.lg,
    backgroundColor: mint[50],
    borderWidth: 1,
    borderColor: mint[200],
    alignItems: 'center',
    justifyContent: 'center',
  },
  storeInfo: {
    flex: 1,
    gap: spacing.xxs,
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  dashed: {
    height: 1,
    borderTopWidth: 1,
    borderStyle: 'dashed',
    borderColor: neutral.line2,
  },
  storeFootRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  body: {
    gap: 14,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  couponRow: {
    gap: spacing.md - 2,
    paddingRight: spacing.lg,
  },
  coupon: {
    width: 230,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md - 2,
    padding: spacing.md - 2,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: mint[200],
    backgroundColor: neutral.surface,
  },
  couponIcon: {
    width: 32,
    height: 32,
    borderRadius: radii.md,
    backgroundColor: mint[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  couponText: {
    flex: 1,
    gap: spacing.xxs,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: isAndroid ? spacing.md : spacing.sm,
    minHeight: isAndroid ? 56 : 44,
    paddingHorizontal: isAndroid ? spacing.lg : spacing.md,
    // Android draws the search field as a Material pill.
    borderRadius: isAndroid ? 28 : radii.lg,
    backgroundColor: neutral.surface2,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Outfit_400Regular',
    fontSize: 17 * designFontScale,
    lineHeight: 22 * designFontScale,
    color: semantic.text,
    padding: 0,
    margin: 0,
  },
  filterRow: {
    gap: spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chrome: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  floatingRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  categoriesPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    height: 44,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.pill,
    backgroundColor: brand.forest,
    shadowColor: elevation.medium.shadowColor,
    shadowOffset: elevation.medium.shadowOffset,
    shadowRadius: elevation.medium.shadowRadius,
    shadowOpacity: elevation.medium.shadowOpacity,
    elevation: elevation.medium.elevation,
  },
});
