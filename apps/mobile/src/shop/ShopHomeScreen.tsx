import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { neutral, platformMetrics, sectionGap, spacing } from '@medmate/theme';

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

/**
 * The Shop home screen.
 *
 * This is the entry point of the Shop section and the first screen of the
 * native app. It is a single long scroll, exactly as the Figma frame
 * composes it: the brand zone, then the content sections, then the footer,
 * with the floating bottom chrome pinned to the bottom of the viewport.
 *
 * Content comes from `src/data/shop` - the screen never hard-codes a string.
 */
export function ShopHomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 96 }]}
        showsVerticalScrollIndicator={false}
      >
        <BrandHero onSearch={() => router.push({ pathname: '/search', params: { q: 'paracetamol' } })} />

        <View style={styles.sections}>
          <TrustStrip />

          <CategoryGroups />

          <OrderAgainCard />

          <CouponsSection />

          <HealthStoresSection />

          <DealsSection />

          <SeasonalSection />

          <PharmaciesSection />

          <CareBlocks />

          <LabTestsSection />

          <CareCornersSection />

          <BestOffersSection />

          <EverydayEssentialsSection />

          <ForPharmaciesSection />
        </View>

        <View style={styles.footerWrap}>
          <PageFooter />
        </View>
      </ScrollView>

      <View style={[styles.chrome, { paddingBottom: insets.bottom }]}>
        <BottomChrome active="home" />
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
