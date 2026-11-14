import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { neutral, semantic, spacing } from '@medmate/theme';

import { Text } from '../../ui/Text';
import { useContentInset, useGrid, useMeasuredWidth } from '../../ui/layout';
import { EmptyState, FilterChip } from '../../ui/primitives';
import { useCart } from '../../state/cart';
import { useNotice } from '../../state/notice';
import {
  newArrivalCategories,
  newArrivalFooterNote,
  newArrivalSubtitle,
  newArrivals,
  newArrivalsIn,
} from '../../data/newArrivals';
import { BottomChrome } from '../BottomChrome';
import { BrandZone } from '../BrandZone';
import { ProductCard } from '../sections';

export type NewArrivalsScreenProps = {
  onBack?: () => void;
  onHelp?: () => void;
  onProductPress?: (id: string) => void;
};

/**
 * New arrivals.
 *
 * The newest products on the catalogue with a filter per category, the way
 * the design draws it. The filters are derived from the new arrivals
 * themselves, so every chip leads somewhere.
 */
export function NewArrivalsScreen({
  onBack,
  onHelp,
  onProductPress,
}: NewArrivalsScreenProps) {
  const insets = useSafeAreaInsets();
  const cart = useCart();
  const notice = useNotice();
  const [category, setCategory] = useState<string | null>(null);

  // The grid shares out the width it has: three columns survive on a phone
  // narrower than the design canvas and fill the row on a wider one. The grid
  // has no padding of its own, so it gets the width of the body it sits in.
  const gridBox = useMeasuredWidth();
  const grid = useGrid(3, { basis: 114 }, gridBox.width);
  // On a screen wider than the design the content column is centred.
  const inset = useContentInset();

  const categories = useMemo(() => newArrivalCategories(), []);
  const products = useMemo(
    () => (category ? newArrivalsIn(category) : newArrivals()),
    [category],
  );

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 110 }]}
        showsVerticalScrollIndicator={false}
      >
        <BrandZone
          navTitle="New arrivals"
          heading="New on MedMate"
          sub={newArrivalSubtitle()}
          onBack={onBack}
          onHelp={onHelp}
        />

        <View style={[styles.body, { paddingHorizontal: inset }]}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
          >
            <FilterChip label="All" selected={category === null} onPress={() => setCategory(null)} />
            {categories.map((name) => (
              <FilterChip
                key={name}
                label={name}
                selected={category === name}
                onPress={() => setCategory(name)}
              />
            ))}
          </ScrollView>

          {products.length === 0 ? (
            <EmptyState
              title="Nothing new in this category yet"
              body="New products land every week - try another category."
            />
          ) : null}
          <View style={[styles.grid, { gap: grid.gap }]} onLayout={gridBox.onLayout}>
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

          <Text variant="resultSub" color={semantic.textMuted}>
            {newArrivalFooterNote}
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.chrome, { paddingBottom: insets.bottom }]}>
        <BottomChrome
          active="home"
          onTabPress={(id) =>
            id === 'home' ? undefined : notice.notify('The pharmacy screen is next in the section')
          }
          onChatPress={() => notice.notify('Chat opens in the next release')}
          onAdPress={() => notice.notify('You are already looking at the newest arrivals')}
        />
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
  chrome: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});
