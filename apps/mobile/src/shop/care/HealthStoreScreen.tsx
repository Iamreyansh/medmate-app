import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { brand, mint, neutral, platformKey, radii, semantic, spacing, storeAccents } from '@medmate/theme';

import { Icon } from '../../icons/Icon';
import { Text } from '../../ui/Text';
import { useContentInset, useGrid, useMeasuredWidth } from '../../ui/layout';
import { FilterChip } from '../../ui/primitives';
import { useCart } from '../../state/cart';
import { useNotice } from '../../state/notice';
import {
  careStores,
  otherStores,
  storeFooterNote,
  storeProducts,
  storeSubtitle,
  type CareStore,
} from '../../data/care';
import { BrandZone } from '../BrandZone';
import { ProductCard } from '../sections';

const isAndroid = platformKey === 'android';

export type HealthStoreScreenProps = {
  /** The store on screen. */
  store: CareStore;
  onBack?: () => void;
  onHelp?: () => void;
  onStoreChange?: (store: CareStore) => void;
  onProductPress?: (id: string) => void;
};

type SortId = 'recommended' | 'priceLow' | 'priceHigh';

/**
 * A health store.
 *
 * The store's shelf, the sort filters, the note under the grid and the other
 * stores to hop to. The design closes this screen with the system chrome
 * only, so there is no tab bar or cart bar here.
 */
export function HealthStoreScreen({
  store,
  onBack,
  onHelp,
  onStoreChange,
  onProductPress,
}: HealthStoreScreenProps) {
  const cart = useCart();
  const notice = useNotice();
  const [sort, setSort] = useState<SortId>('recommended');

  // The grid shares out the width it has: three columns survive on a phone
  // narrower than the design canvas and fill the row on a wider one. The grid
  // has no padding of its own, so it gets the width of the body it sits in.
  const gridBox = useMeasuredWidth();
  const grid = useGrid(3, { basis: 114 }, gridBox.width);
  // On a screen wider than the design the content column is centred.
  const inset = useContentInset();

  const products = useMemo(() => {
    const shelf = storeProducts(store);
    if (sort === 'priceLow') return [...shelf].sort((a, b) => a.price - b.price);
    if (sort === 'priceHigh') return [...shelf].sort((a, b) => b.price - a.price);
    return shelf;
  }, [store, sort]);

  const others = useMemo(() => otherStores(store), [store]);

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <BrandZone
          navTitle={store.name}
          heading={store.name}
          sub={storeSubtitle(store)}
          onBack={onBack}
          onHelp={onHelp}
        />

        <View style={[styles.body, { paddingHorizontal: inset }]}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
          >
            <FilterChip
              label="Recommended"
              selected={sort === 'recommended'}
              onPress={() => setSort('recommended')}
            />
            <FilterChip
              label="Price: low to high"
              selected={sort === 'priceLow'}
              onPress={() => setSort('priceLow')}
            />
            <FilterChip
              label="Price: high to low"
              selected={sort === 'priceHigh'}
              onPress={() => setSort('priceHigh')}
            />
          </ScrollView>

          <View style={[styles.grid, { gap: grid.gap }]} onLayout={gridBox.onLayout}>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                width={grid.width}
                onAdd={() => {
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
                }}
                onPress={() => onProductPress?.(product.id)}
              />
            ))}
          </View>

          <View style={styles.note}>
            <Icon name="info" size={16} color={semantic.textMuted} />
            <Text variant="resultMeta" color={semantic.textSecondary} style={styles.noteText}>
              {storeFooterNote}
            </Text>
          </View>

          <Text variant="sectionEyebrow" color={brand.green700}>
            Other health stores
          </Text>

          <View style={styles.pills}>
            {others.map((other) => {
              const accent = storeAccents[other.accent];
              return (
                <Pressable
                  key={other.id}
                  accessibilityRole="button"
                  onPress={() => onStoreChange?.(other)}
                  style={({ pressed }) => [
                    styles.pill,
                    { backgroundColor: accent.bg },
                    { opacity: pressed ? 0.85 : 1 },
                  ]}
                >
                  <Text variant="strong" color={accent.ink}>
                    {other.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>
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
  body: {
    gap: 14,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  note: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md - 2,
  },
  noteText: {
    flex: 1,
  },
  pills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  pill: {
    height: 32,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
  },
});

/** The mint the store accents sit next to. */
export const storeAccentTint = mint[200];

/** The number of stores in the app. */
export const storeCount = careStores.length;

/** Whether the screen follows the Material metrics. */
export const storeIsAndroid = isAndroid;
