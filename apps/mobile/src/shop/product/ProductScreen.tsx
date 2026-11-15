import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useContentInset } from '../../ui/layout';

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
import { Button, EmptyState, Gradient } from '../../ui/primitives';
import { useCart } from '../../state/cart';
import { useNotice } from '../../state/notice';
import { catalogue, findProduct, initialsOf } from '../../data/catalogue';
import {
  badgesFor,
  disclaimer,
  mrpLine,
  productDetail,
  rxNotice,
  savingsLabel,
} from '../../data/product';
import {
  AvailabilityBlock,
  CouponStrip,
  DetailsTabs,
  PrescriptionBlock,
  ReturnsCard,
  SellerCard,
  SimilarProducts,
  WhereToGetCard,
} from './ProductSections';

const isAndroid = platformKey === 'android';

export type ProductScreenProps = {
  /** The catalogue id of the product. */
  productId: string;
  onBack?: () => void;
  onSearch?: () => void;
  onShare?: () => void;
  onFavourite?: () => void;
  onUploadPrescription?: () => void;
  onCouponApply?: (code: string) => void;
  onSimilarPress?: (id: string) => void;
  onPharmacyPress?: (name: string) => void;
};

/**
 * A product page.
 *
 * The image area with the floating actions, then the sheet that slides over
 * it: the price, the availability, the stores that have it, the coupons, the
 * detail tabs, the seller, the returns policy and the similar products. The
 * action bar is pinned to the bottom.
 *
 * A prescription medicine follows the same layout with the prescription
 * notice, the prescription block, and no discount anywhere.
 */
export function ProductScreen({
  productId,
  onBack,
  onSearch,
  onShare,
  onFavourite,
  onUploadPrescription,
  onCouponApply,
  onSimilarPress,
  onPharmacyPress,
}: ProductScreenProps) {
  const insets = useSafeAreaInsets();
  // On a screen wider than the design the content column is centred.
  const inset = useContentInset();
  const cart = useCart();
  const notice = useNotice();

  const { width } = useWindowDimensions();
  // The product photo takes 240pt on the design canvas and scales down with
  // the screen so it never crowds the edges on a small phone.
  const photoSize = Math.min(240, width - spacing.lg * 2 - spacing.xxl);

  const product = findProduct(productId);
  const detail = useMemo(() => (product ? productDetail(product) : null), [product]);

  if (!product || !detail) {
    return (
      <View style={styles.root}>
        <View style={styles.missingTop}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back"
            onPress={onBack}
            style={styles.missingBack}
          >
            <Icon name="chev-l" size={20} color={semantic.text} strokeWidth={2.2} />
          </Pressable>
        </View>
        <EmptyState
          title="This product is no longer available"
          body="It may have been replaced by a newer pack. Search for the medicine again, or ask MedMate to source it for you."
        />
      </View>
    );
  }

  const badges = badgesFor(product, detail);
  const savings = savingsLabel(product);
  const similar = detail.similar
    .map((id) => catalogue.find((candidate) => candidate.id === id))
    .filter((candidate): candidate is NonNullable<typeof candidate> => Boolean(candidate));

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Image area */}
        <Gradient token="art" radius={0} style={styles.imageArea}>
          {/* The product photo sits on the mint tint; until the photos land it
              is a white card with the initials on it. */}
          <View style={[styles.photo, { width: photoSize, height: photoSize }]}>
            <View style={styles.photoCard}>
              <Text variant="categoryTitle" color={brand.green700}>
                {initialsOf(product.name)}
              </Text>
            </View>
          </View>

          <View style={[styles.floating, { top: insets.top + spacing.sm }]}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Back"
              onPress={onBack}
              style={styles.iconTap}
            >
              <View style={styles.iconButton}>
                <Icon
                  name={isAndroid ? 'arrow-left' : 'chev-l'}
                  size={20}
                  color={semantic.text}
                  strokeWidth={2.2}
                />
              </View>
            </Pressable>
            <View style={styles.iconButtons}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Search"
                onPress={onSearch}
                style={styles.iconTap}
              >
                <View style={styles.iconButton}>
                  <Icon name="search" size={18} color={semantic.text} />
                </View>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Save for later"
                onPress={onFavourite}
                style={styles.iconTap}
              >
                <View style={styles.iconButton}>
                  <Icon name="heart" size={18} color={semantic.text} />
                </View>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Share"
                onPress={onShare}
                style={styles.iconTap}
              >
                <View style={styles.iconButton}>
                  <Icon name="share" size={18} color={semantic.text} />
                </View>
              </Pressable>
            </View>
          </View>
        </Gradient>

        {/* The sheet slides over the image area. */}
        <View style={[styles.sheet, { paddingHorizontal: inset }]}>
          {!product.rx && product.off ? (
            <View style={styles.offTab}>
              <Icon name="percent" size={12} color={brand.forest} />
              <Text variant="tag" color={brand.forest}>
                {`${product.off}% OFF`}
              </Text>
            </View>
          ) : null}

          <View style={styles.header}>
            <Text variant="sectionEyebrow" color={brand.green700} numberOfLines={1}>
              {`${detail.manufacturer} · ${product.category}`}
            </Text>
            <Text variant="storeTitle" color={semantic.text}>
              {product.name}
            </Text>
            <Text variant="resultMeta" color={semantic.textSecondary}>
              {`Contains ${detail.contains}`}
            </Text>
            <Text variant="resultSub" color={semantic.textMuted}>
              {detail.pack}
            </Text>
          </View>

          <View style={styles.badges}>
            {badges.map((badge) => (
              <View key={badge.key} style={[styles.badge, { backgroundColor: badge.background }]}>
                {badge.icon ? <Icon name={badge.icon} size={12} color={badge.color} /> : null}
                <Text variant="tag" color={badge.color}>
                  {badge.label}
                </Text>
              </View>
            ))}
          </View>

          {product.rx ? (
            <Text variant="resultSub" color={statusRed}>
              {rxNotice}
            </Text>
          ) : null}

          <View style={styles.priceRow}>
            <Text variant="displayPrice" color={semantic.text}>
              {`₹${product.price.toLocaleString('en-IN')}`}
            </Text>
            {!product.rx && product.mrp ? (
              <Text variant="bodyStrong" color={neutral.faint} style={styles.mrp}>
                {`₹${product.mrp.toLocaleString('en-IN')}`}
              </Text>
            ) : null}
            {savings ? (
              <View style={styles.savingsTag}>
                <Text variant="tag" color={brand.green700}>
                  {savings}
                </Text>
              </View>
            ) : null}
          </View>

          <Text variant="resultSub" color={semantic.textMuted}>
            {mrpLine(product)}
          </Text>

          <AvailabilityBlock count={6} />

          <WhereToGetCard
            detail={detail}
            count={6}
            onPharmacyPress={(pharmacy) => onPharmacyPress?.(pharmacy.name)}
          />

          {product.rx ? (
            <PrescriptionBlock onUpload={onUploadPrescription} />
          ) : (
            <CouponStrip
              coupons={detail.coupons}
              onApply={(coupon) => onCouponApply?.(coupon.code)}
            />
          )}

          <DetailsTabs product={product} detail={detail} />

          <SellerCard detail={detail} isRx={product.rx} />

          <ReturnsCard onPolicy={() => notice.notify('The policy opens in the next release')} onHelp={() => notice.notify('Help opens in the next release')} />

          <SimilarProducts
            products={similar}
            onPress={(other) => onSimilarPress?.(other.id)}
            onAdd={(other) => {
              cart.add({
                    id: other.id,
                    name: other.name,
                    sub: other.sub,
                    price: other.price,
                    mrp: other.mrp,
                    off: other.off,
                    rx: other.rx,
                  });
              notice.notify(`${other.name} added to the cart`);
            }}
          />

          <Text variant="resultSub" color={semantic.textMuted} style={styles.disclaimer}>
            {disclaimer}
          </Text>
        </View>
      </ScrollView>

      {/* The action bar */}
      <View
        style={[
          styles.actionBar,
          { paddingBottom: insets.bottom + spacing.sm, paddingHorizontal: inset },
        ]}
      >
        <View style={styles.buyRow}>
          <View style={styles.buyPrice}>
            <Text variant="amount" color="#65726B">
              {`from ₹${product.price.toLocaleString('en-IN')}`}
            </Text>
            {product.rx ? (
              <Text variant="resultSub" color={semantic.textMuted}>
                Rx · prescription needed
              </Text>
            ) : product.mrp ? (
              <Text variant="resultSub" color={semantic.textMuted}>
                {`MRP ₹${product.mrp.toLocaleString('en-IN')}`}
              </Text>
            ) : null}
          </View>
          <Button
            label="Add to cart"
            tone="filled"
            size="large"
            onPress={() => {
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
            style={styles.addButton}
          />
        </View>
      </View>
    </View>
  );
}

const statusRed = '#C2392D';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: neutral.surface,
  },
  scroll: {
    flex: 1,
  },
  imageArea: {
    height: 340,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: spacing.xxl,
  },
  photo: {
    width: 240,
    height: 240,
  },
  photoCard: {
    flex: 1,
    borderRadius: radii.huge,
    borderWidth: 1,
    borderColor: mint[200],
    backgroundColor: neutral.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floating: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  /** A 48pt tap area around the 40pt button the design draws. */
  iconTap: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: radii.circle,
    backgroundColor: neutral.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: elevation.medium.shadowColor,
    shadowOffset: elevation.medium.shadowOffset,
    shadowRadius: elevation.medium.shadowRadius,
    shadowOpacity: elevation.medium.shadowOpacity,
    elevation: elevation.medium.elevation,
  },
  sheet: {
    marginTop: -24,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: 14,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: neutral.surface,
  },
  offTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md - 2,
    paddingVertical: spacing.xs,
    borderRadius: radii.sm,
    backgroundColor: gold[300],
  },
  header: {
    gap: spacing.xs,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs + 2,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.xs + 5,
    paddingVertical: spacing.xxs,
    borderRadius: radii.xs,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  mrp: {
    textDecorationLine: 'line-through',
  },
  savingsTag: {
    paddingHorizontal: spacing.xs + 5,
    paddingVertical: spacing.xxs,
    borderRadius: radii.xs,
    backgroundColor: mint[100],
  },
  disclaimer: {
    paddingTop: spacing.xs,
  },
  missingTop: {
    paddingTop: spacing.lg,
    paddingLeft: spacing.lg,
  },
  missingBack: {
    width: 40,
    height: 40,
    borderRadius: radii.circle,
    backgroundColor: neutral.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: neutral.line,
    backgroundColor: neutral.surface,
  },
  buyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  buyPrice: {
    flex: 1,
    gap: spacing.xxs,
  },
  addButton: {
    minWidth: 153,
  },
});

/** The mint the image area sits on. */
export const imageAreaTint = mint[50];
