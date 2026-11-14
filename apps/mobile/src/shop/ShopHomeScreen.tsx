import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { neutral, platformMetrics, sectionGap, spacing } from '@medmate/theme';

import { useCart } from '../state/cart';
import { useNotice } from '../state/notice';
import { catalogue } from '../data/catalogue';
import { categoryList, slugFor } from '../data/category';
import {
  bestOffers,
  dealRail,
  everydayEssentials,
  orderAgain,
  serviceTabCategories,
  type Product,
} from '../data/shop';
import { BrandHero, TrustStrip } from './BrandHero';
import { BottomChrome } from './BottomChrome';
import {
  BestOffersSection,
  CareBlocks,
  CareCornersSection,
  CategoryGroups,
  CouponsSection,
  DealsSection,
  EverydayEssentialsSection,
  ForPharmaciesSection,
  HealthStoresSection,
  LabTestsSection,
  OrderAgainCard,
  PageFooter,
  PharmaciesSection,
  SeasonalSection,
} from './sections';

/** What each service tab narrows the content below it to. */
const BANNER_MESSAGES: Record<string, string> = {
  'first-order': 'Use code MEDMATE25 on your first order',
  'request-medicine': 'We will call back with the price and delivery time',
  'health-stores': 'Health stores are listed below',
};

/**
 * The Shop home screen.
 *
 * This is the entry point of the Shop section and the first screen of the
 * native app. It is a single long scroll, exactly as the Figma frame
 * composes it: the brand zone, then the content sections, then the footer,
 * with the floating bottom chrome pinned to the bottom of the viewport.
 *
 * The service tabs narrow the rails below them, the ADD buttons feed the
 * cart the cart bar counts, and every tap answers the user.
 */
export function ShopHomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const cart = useCart();
  const notice = useNotice();

  const [serviceTab, setServiceTab] = useState('All');

  /** The category the selected service tab stands for. */
  const category = serviceTabCategories[serviceTab] ?? null;

  const inCategory = useCallback(
    (product: Product) => !category || product.category === category,
    [category],
  );

  /** Add a product to the cart and say so. */
  const addToCart = useCallback(
    (product: Product) => {
      cart.add({ id: product.id, name: product.name, price: product.price });
      notice.notify(`${product.name} added to the cart`);
    },
    [cart, notice],
  );

  /** Open a product. The product page is the next screen in the section. */
  const openProduct = useCallback(
    (product: Product) => {
      notice.notify(`${product.name} - the product page is next in the section`);
    },
    [notice],
  );

  /**
   * Narrow a rail to the selected category.
   *
   * The curated rail wins when it has something in the category; otherwise
   * the rail falls back to the catalogue so a tab never looks broken.
   */
  const narrow = useCallback(
    (curated: Product[], limit = 6) => {
      if (!category) return curated;
      const matching = curated.filter(inCategory);
      if (matching.length > 0) return matching;
      return catalogue.filter((product) => product.category === category).slice(0, limit);
    },
    [category, inCategory],
  );

  const narrowed = useMemo(
    () => ({
      orderAgain: narrow(orderAgain),
      deals: narrow(dealRail),
      offers: narrow(bestOffers, 6),
      essentials: narrow(everydayEssentials),
    }),
    [narrow],
  );

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 96 }]}
        showsVerticalScrollIndicator={false}
      >
        <BrandHero
          onSearch={() => router.push({ pathname: '/search', params: { q: 'paracetamol' } })}
          onUploadRx={() => notice.notify('Upload a prescription to unlock Rx medicines')}
          onBannerPress={(id) => notice.notify(BANNER_MESSAGES[id] ?? 'Opening')}
          onServiceTabChange={setServiceTab}
        />

        <View style={styles.sections}>
          <TrustStrip />

          <CategoryGroups
            onCategoryPress={(label) => {
              const category = categoryList().find((name) => name === label);
              if (category) {
                router.push({ pathname: '/category/[slug]', params: { slug: slugFor(category) } });
                return;
              }
              notice.notify(`${label} is on the way`);
            }}
          />

          <OrderAgainCard
            products={narrowed.orderAgain}
            onAdd={addToCart}
            onPress={openProduct}
          />

          <CouponsSection
            onPress={(coupon) => notice.notify(`${coupon.code} copied`)}
          />

          <HealthStoresSection
            onPress={(store) => notice.notify(`${store.name} - the store page is next in the section`)}
          />

          <DealsSection products={narrowed.deals} onAdd={addToCart} onPress={openProduct} />

          <SeasonalSection onAdd={addToCart} onPress={openProduct} />

          <PharmaciesSection
            onPress={(store) => notice.notify(`${store.name} - the pharmacy page is next in the section`)}
          />

          <CareBlocks onAdd={addToCart} onPress={openProduct} />

          <LabTestsSection />

          <CareCornersSection />

          <BestOffersSection products={narrowed.offers} onAdd={addToCart} onPress={openProduct} />

          <EverydayEssentialsSection
            products={narrowed.essentials}
            onAdd={addToCart}
            onPress={openProduct}
          />

          <ForPharmaciesSection />
        </View>

        <View style={styles.footerWrap}>
          <PageFooter />
        </View>
      </ScrollView>

      <View style={[styles.chrome, { paddingBottom: insets.bottom }]}>
        <BottomChrome
          active="home"
          onTabPress={(id) =>
            id === 'home'
              ? router.replace('/')
              : notice.notify('The pharmacy screen is next in the section')
          }
          onChatPress={() => notice.notify('Chat opens in the next release')}
          onAdPress={() => notice.notify('New arrivals - see the seasonal picks below')}
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
  sections: {
    paddingHorizontal: spacing.lg,
    gap: sectionGap,
    paddingTop: spacing.md,
  },
  footerWrap: {
    paddingHorizontal: spacing.lg,
    paddingTop: sectionGap,
  },
  chrome: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
});

/** Reference to the platform metrics so the screen file documents its chrome. */
export const shopChrome = {
  statusBar: platformMetrics.statusBar,
  touchTarget: platformMetrics.touchTarget,
};
