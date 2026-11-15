import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  brand,
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
import { useContentInset, useGrid, useMeasuredWidth } from '../../ui/layout';
import { EmptyState, FilterChip } from '../../ui/primitives';
import { useCart } from '../../state/cart';
import { useNotice } from '../../state/notice';
import { initialsOf } from '../../data/catalogue';
import {
  brandChips,
  categoryCounts,
  categoryFooterNote,
  categoryList,
  categorySorts,
  checkoutNote,
  filterByBrand,
  filterByPrescription,
  filterByPrice,
  priceBands,
  productsInCategory,
  sortCategoryProducts,
  type PrescriptionFilterId,
  type PriceBandId,
} from '../../data/category';
import { ProductCard } from '../sections';
import { CartBar } from '../search/CartBar';
import { SortSheet } from '../SortSheet';

const isAndroid = platformKey === 'android';

export type CategoryScreenProps = {
  /** The category to show. */
  category: string;
  onBack?: () => void;
  onSearch?: () => void;
  onCategoryChange?: (category: string) => void;
  onProductPress?: (id: string) => void;
  /** Opens the cart. */
  onCartPress?: () => void;
};

/**
 * The category screen.
 *
 * A brand zone with the category and its counts, a rail of sibling
 * categories, the filter card, and the products as a grid or a list.
 *
 * Every count is derived from the catalogue, so the numbers always describe
 * the products that are on screen.
 */
export function CategoryScreen({
  category,
  onBack,
  onSearch,
  onCategoryChange,
  onProductPress,
  onCartPress,
}: CategoryScreenProps) {
  const insets = useSafeAreaInsets();
  const cart = useCart();
  const notice = useNotice();

  const [prescription, setPrescription] = useState<PrescriptionFilterId>('all');
  const [priceBand, setPriceBand] = useState<PriceBandId>('any');
  const [brandFilter, setBrandFilter] = useState<string | null>(null);
  const [sort, setSort] = useState<string>('relevance');
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');

  // The grid shares out the width it has, so three columns survive on a
  // phone narrower than the design canvas and fill the row on a wider one.
  const gridBox = useMeasuredWidth(spacing.lg);
  const grid = useGrid(3, { basis: 114 }, gridBox.width);
  // On a screen wider than the design the content column is centred.
  const inset = useContentInset();
  const [sortOpen, setSortOpen] = useState(false);

  /** Every product in the category, before any filter. */
  const inCategory = useMemo(() => productsInCategory(category), [category]);
  const counts = useMemo(() => categoryCounts(inCategory), [inCategory]);

  /** The products after the filters, sorted. */
  const products = useMemo(() => {
    const byPrescription = filterByPrescription(inCategory, prescription);
    const byPrice = filterByPrice(byPrescription, priceBand);
    const byBrand = filterByBrand(byPrice, brandFilter);
    return sortCategoryProducts(byBrand, sort as never);
  }, [inCategory, prescription, priceBand, brandFilter, sort]);

  const brands = useMemo(() => brandChips(inCategory), [inCategory]);
  const siblings = useMemo(() => categoryList(), []);

  const addToCart = (product: (typeof inCategory)[number]) => {
    cart.add({
                    id: product.id,
                    name: product.name,
                    sub: product.sub,
                    price: product.price,
                    mrp: product.mrp,
                    off: product.off,
                    rx: product.rx,
                  });
    notice.notify(`${product.name} added to the cart`);
  };

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 110 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Brand zone */}
        <View style={[styles.zone, { paddingTop: insets.top }]}>
          <View style={styles.zoneInner}>
            {/* Nav bar */}
            <View style={[styles.navBar, { paddingRight: inset }]}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Back to home"
                onPress={onBack ?? (() => notice.notify('Back to the shop'))}
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
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Help and support"
                onPress={onSearch ?? (() => notice.notify('Search is one tap away'))}
                style={styles.helpButton}
              >
                <Icon name="search" size={18} color={neutral.surface} />
              </Pressable>
            </View>

            {/* Zone content */}
            <View style={[styles.zoneContent, { paddingLeft: inset }]}>
              <View style={styles.zoneText}>
                <Text variant="sectionEyebrow" color={gold[300]} style={styles.eyebrow}>
                  Category
                </Text>
                <Text variant="categoryTitle" color={neutral.surface}>
                  {category}
                </Text>
                <Text variant="countLine" color={neutral.surface}>
                  {`${counts.total} products · ${counts.brands} brands`}
                </Text>
                <Text variant="resultSub" color={mint[200]}>
                  {`${counts.noPrescription} without prescription · ${counts.prescription} need a prescription`}
                </Text>
                <View style={styles.checkoutRow}>
                  <Icon name="bolt" size={14} color={gold[300]} />
                  <Text variant="resultSub" color={gold[300]}>
                    {checkoutNote}
                  </Text>
                </View>
              </View>
              {inCategory[0] ? (
                <View style={[styles.zoneArt, { top: insets.top + 63 }]}>
                  <View style={styles.zoneArtTile}>
                    <Text variant="categoryTitle" color={brand.green700} style={styles.zoneArtInitials}>
                      {initialsOf(inCategory[0].name)}
                    </Text>
                  </View>
                </View>
              ) : null}
            </View>
          </View>
        </View>

        {/* Sibling categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.rail, { paddingHorizontal: inset }]}
        >
          {siblings.map((name) => {
            const selected = name === category;
            return (
              <Pressable
                key={name}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => onCategoryChange?.(name)}
                style={styles.railItem}
              >
                <View style={[styles.railPhoto, selected && styles.railPhotoSelected]}>
                  <Text variant="tileLabel" color={brand.green700}>
                    {initialsOf(name)}
                  </Text>
                </View>
                <Text variant="tileLabel" color={semantic.text} style={styles.railLabel}>
                  {name}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Filters */}
        <View style={[styles.filters, { marginHorizontal: inset }]}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
          >
            <FilterChip
              label="Sort"
              onPress={() => setSortOpen(true)}
              selected={false}
            />
            <FilterChip
              label={`All ${counts.total}`}
              selected={prescription === 'all'}
              onPress={() => setPrescription('all')}
            />
            <FilterChip
              label={`No prescription ${counts.noPrescription}`}
              selected={prescription === 'noPrescription'}
              onPress={() => setPrescription('noPrescription')}
            />
            <FilterChip
              label={`Prescription ${counts.prescription}`}
              selected={prescription === 'prescription'}
              onPress={() => setPrescription('prescription')}
            />
          </ScrollView>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
          >
            {priceBands.map((band) => (
              <FilterChip
                key={band.id}
                label={band.label}
                selected={priceBand === band.id}
                onPress={() => setPriceBand(band.id)}
              />
            ))}
          </ScrollView>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
          >
            <Text variant="strong" color={neutral.ink2} style={styles.brandsLabel}>
              Brands
            </Text>
            {brands.map((chip) => (
              <FilterChip
                key={chip.brand}
                label={`${chip.brand} ${chip.count}`}
                selected={brandFilter === chip.brand}
                onPress={() => setBrandFilter(brandFilter === chip.brand ? null : chip.brand)}
              />
            ))}
            <FilterChip
              label={`All ${counts.brands}`}
              selected={brandFilter === null}
              onPress={() => setBrandFilter(null)}
            />
          </ScrollView>
        </View>

        {/* Count + layout switch */}
        <View style={[styles.metaRow, { paddingHorizontal: inset }]}>
          <Text variant="countLine" color={semantic.text}>
            {`${products.length} products`}
          </Text>
          {isAndroid ? (
            <View style={styles.segmentedOutline}>
              {(['grid', 'list'] as const).map((option) => (
                <Pressable
                  key={option}
                  accessibilityRole="button"
                  accessibilityState={{ selected: layout === option }}
                  onPress={() => setLayout(option)}
                  style={styles.segmentOutline}
                >
                  <Text
                    variant="strong"
                    color={layout === option ? neutral.surface : neutral.ink2}
                  >
                    {option === 'grid' ? 'Grid' : 'List'}
                  </Text>
                </Pressable>
              ))}
            </View>
          ) : (
            <View style={styles.segmented}>
              {(['grid', 'list'] as const).map((option) => (
                <Pressable
                  key={option}
                  accessibilityRole="button"
                  accessibilityState={{ selected: layout === option }}
                  onPress={() => setLayout(option)}
                  style={[styles.segment, layout === option && styles.segmentActive]}
                >
                  <Text
                    variant="strong"
                    color={layout === option ? semantic.text : neutral.ink2}
                  >
                    {option === 'grid' ? 'Grid' : 'List'}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {/* Products */}
        {products.length === 0 ? (
          <EmptyState
            title="No products match these filters"
            body="Try another filter, or clear the price band and the brand."
          />
        ) : null}
        {layout === 'grid' && products.length > 0 ? (
          <View style={[styles.grid, { gap: grid.gap }]} onLayout={gridBox.onLayout}>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                width={grid.width}
                onAdd={() => addToCart(product)}
                onPress={() => onProductPress?.(product.id)}
              />
            ))}
          </View>
        ) : products.length > 0 ? (
          <View style={[styles.list, { paddingHorizontal: inset }]}>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                width={undefined}
                onAdd={() => addToCart(product)}
                onPress={() => onProductPress?.(product.id)}
              />
            ))}
          </View>
        ) : null}

        <Text variant="resultSub" color={semantic.textMuted} style={[styles.footerNote, { paddingHorizontal: inset }]}>
          {categoryFooterNote}
        </Text>
      </ScrollView>

      <View style={[styles.cartBar, { paddingBottom: insets.bottom }]}>
        <CartBar count={cart.count} onCartPress={onCartPress} />
      </View>

      <SortSheet
        visible={sortOpen}
        options={categorySorts}
        active={sort}
        onSelect={(id) => {
          setSort(id);
          setSortOpen(false);
        }}
        onClose={() => setSortOpen(false)}
      />
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
    gap: 14,
    paddingTop: 0,
  },
  zone: {
    backgroundColor: brand.forest,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
  },
  zoneInner: {
    paddingTop: 0,
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
  helpButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoneContent: {
    // The product art sits in the right of the zone, so the text column keeps
    // the width the design gives it.
    paddingLeft: spacing.lg,
    paddingBottom: spacing.xl,
  },
  zoneText: {
    width: 237,
    gap: spacing.xs,
  },
  eyebrow: {
    lineHeight: 13,
  },
  checkoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xxs,
  },
  zoneArt: {
    position: 'absolute',
    right: 8,
    width: 120,
    alignItems: 'flex-end',
  },
  zoneArtTile: {
    width: 120,
    height: 120,
    borderRadius: radii.huge,
    borderWidth: 1,
    borderColor: mint[200],
    backgroundColor: mint[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoneArtInitials: {
    lineHeight: 34,
  },
  rail: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  railItem: {
    width: 68,
    alignItems: 'center',
    gap: spacing.xs + 2,
  },
  railPhoto: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: mint[200],
    backgroundColor: mint[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  railPhotoSelected: {
    borderWidth: 2,
    borderColor: brand.forest,
  },
  railLabel: {
    textAlign: 'center',
  },
  filters: {
    marginHorizontal: spacing.lg,
    padding: spacing.md,
    gap: spacing.md - 2,
    borderRadius: isAndroid ? 16 : radii.xl,
    borderWidth: 1,
    borderColor: mint[200],
    backgroundColor: neutral.surface,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  brandsLabel: {
    marginRight: spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
  },
  segmented: {
    flexDirection: 'row',
    padding: 2,
    borderRadius: 9,
    backgroundColor: neutral.surface3,
  },
  segment: {
    minWidth: 57,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
  },
  segmentActive: {
    backgroundColor: neutral.surface,
    shadowColor: '#14201A',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    shadowOpacity: 0.12,
    elevation: 2,
  },
  segmentedOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 2,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: neutral.muted,
  },
  segmentOutline: {
    minWidth: 57,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.pill,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  list: {
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  footerNote: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
  },
  cartBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});
