import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import {
  brand,
  elevation,
  gold,
  mint,
  neutral,
  radii,
  semantic,
  spacing,
} from '@medmate/theme';

import { Icon } from '../../icons/Icon';
import { Text } from '../../ui/Text';
import type { CatalogueProduct } from '../../data/catalogue';
import {
  pharmacistNote,
  pharmacistNoteRx,
  pricingNote,
  returnPoints,
  rxBlockBody,
  rxBlockTitle,
  type ProductCoupon,
  type ProductDetail,
  type ProductPharmacy,
} from '../../data/product';
import { ProductCard } from '../sections';

/* -------------------------------------------------------------------------- */
/*  Availability                                                              */
/* -------------------------------------------------------------------------- */

/** The forest strip that says how fast the product arrives. */
export function AvailabilityBlock({ count }: { count: number }) {
  return (
    <View style={styles.availability}>
      <View style={styles.availabilityIcon}>
        <Icon name="bolt" size={18} color={neutral.surface} />
      </View>
      <View style={styles.availabilityText}>
        <Text variant="strong" color={neutral.surface}>
          {`Available at ${count} pharmacies near you`}
        </Text>
        <Text variant="resultSub" color={mint[200]}>
          Fastest in 32–47 min · Express in 12 min at checkout
        </Text>
      </View>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*  Where to get it                                                           */
/* -------------------------------------------------------------------------- */

function PharmacyRow({
  pharmacy,
  onPress,
}: {
  pharmacy: ProductPharmacy;
  onPress?: (pharmacy: ProductPharmacy) => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress?.(pharmacy)}
      style={({ pressed }) => [styles.pharmacyRow, { opacity: pressed ? 0.85 : 1 }]}
    >
      <View style={styles.pharmacyAvatar}>
        <Text variant="tag" color={brand.forest}>
          {pharmacy.initials}
        </Text>
      </View>
      <View style={styles.pharmacyInfo}>
        <Text variant="strong" color={semantic.text}>
          {pharmacy.name}
        </Text>
        <Text variant="resultSub" color={semantic.textMuted}>
          {pharmacy.distance}
        </Text>
        <Text variant="resultSub" color={semantic.textMuted}>
          {pharmacy.perk}
        </Text>
      </View>
      <Text variant="price" color={semantic.text}>
        {`₹${pharmacy.price.toLocaleString('en-IN')}`}
      </Text>
    </Pressable>
  );
}

/** The card listing the stores that have the product. */
export function WhereToGetCard({
  detail,
  count,
  onPharmacyPress,
}: {
  detail: ProductDetail;
  count: number;
  onPharmacyPress?: (pharmacy: ProductPharmacy) => void;
}) {
  return (
    <View style={styles.card}>
      <Text variant="headline" color={semantic.text}>
        Where to get it
      </Text>
      {detail.pharmacies.map((pharmacy) => (
        <PharmacyRow key={pharmacy.name} pharmacy={pharmacy} onPress={onPharmacyPress} />
      ))}
      <Pressable accessibilityRole="button" style={styles.showAll}>
        <Text variant="strong" color={semantic.action}>
          {`Show all ${count} pharmacies`}
        </Text>
        <Icon name="chev-r" size={14} color={semantic.action} />
      </Pressable>
      <Text variant="resultSub" color={semantic.textMuted}>
        {pricingNote}
      </Text>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*  Coupons                                                                   */
/* -------------------------------------------------------------------------- */

/** The coupons that apply to this product. */
export function CouponStrip({
  coupons,
  onApply,
}: {
  coupons: ProductCoupon[];
  onApply?: (coupon: ProductCoupon) => void;
}) {
  if (coupons.length === 0) return null;

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.couponRow}>
      {coupons.map((coupon) => (
        <Pressable
          key={coupon.code}
          accessibilityRole="button"
          onPress={() => onApply?.(coupon)}
          style={({ pressed }) => [styles.coupon, { opacity: pressed ? 0.85 : 1 }]}
        >
          <Icon name="tag" size={18} color={gold[300]} />
          <View style={styles.couponText}>
            <Text variant="strong" color={semantic.text}>
              {coupon.desc}
            </Text>
            <Text variant="resultSub" color={gold.ink}>
              {`${coupon.code} · tap to apply`}
            </Text>
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );
}

/* -------------------------------------------------------------------------- */
/*  Prescription                                                              */
/* -------------------------------------------------------------------------- */

/** The block that explains a prescription medicine and offers the upload. */
export function PrescriptionBlock({ onUpload }: { onUpload?: () => void }) {
  return (
    <View style={styles.prescriptionBlock}>
      <Text variant="headline" color={semantic.text}>
        {rxBlockTitle}
      </Text>
      <Text variant="resultMeta" color={semantic.textSecondary}>
        {rxBlockBody}
      </Text>
      <Pressable accessibilityRole="button" onPress={onUpload} style={styles.prescriptionLink}>
        <Icon name="rx-up" size={16} color={semantic.action} />
        <Text variant="strong" color={semantic.action}>
          Upload prescription
        </Text>
      </Pressable>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*  Details tabs                                                              */
/* -------------------------------------------------------------------------- */

const TABS = ['Overview', 'How to use', 'Safety', 'FAQs'] as const;

type TabId = (typeof TABS)[number];

/**
 * The segmented control and the card under it.
 *
 * The design draws the control; the cards it switches between are the
 * product detail rows and the copy for each tab.
 */
export function DetailsTabs({
  product,
  detail,
}: {
  product: CatalogueProduct;
  detail: ProductDetail;
}) {
  const [tab, setTab] = useState<TabId>('Overview');

  return (
    <>
      <View style={styles.tabs}>
        {TABS.map((id) => (
          <Pressable
            key={id}
            accessibilityRole="tab"
            accessibilityState={{ selected: tab === id }}
            onPress={() => setTab(id)}
            style={[styles.tab, tab === id && styles.tabActive]}
          >
            <Text
              variant="strong"
              color={tab === id ? semantic.text : neutral.ink2}
              style={styles.tabLabel}
            >
              {id}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.card}>
        {tab === 'Overview' ? <OverviewCard product={product} detail={detail} /> : null}
        {tab === 'How to use' ? (
          <View style={styles.tabBody}>
            <Text variant="headline" color={semantic.text}>
              How to use
            </Text>
            <Text variant="resultMeta" color={semantic.textSecondary}>
              {detail.use}
            </Text>
          </View>
        ) : null}
        {tab === 'Safety' ? (
          <View style={styles.tabBody}>
            <Text variant="headline" color={semantic.text}>
              Safety
            </Text>
            <Text variant="resultMeta" color={semantic.textSecondary}>
              {detail.safety}
            </Text>
          </View>
        ) : null}
        {tab === 'FAQs' ? (
          <View style={styles.tabBody}>
            {detail.faqs.map((faq) => (
              <View key={faq.q} style={styles.faq}>
                <Text variant="strong" color={semantic.text}>
                  {faq.q}
                </Text>
                <Text variant="resultMeta" color={semantic.textSecondary}>
                  {faq.a}
                </Text>
              </View>
            ))}
          </View>
        ) : null}
      </View>
    </>
  );
}

/** The product detail rows. */
function OverviewCard({
  product,
  detail,
}: {
  product: CatalogueProduct;
  detail: ProductDetail;
}) {
  const rows: [string, string][] = [
    ['Salt and strength', detail.salt],
    ['Pack size', detail.pack],
    ['Form', detail.form],
    ['Prescription', product.rx ? 'Required' : 'Not required'],
    ['Marketed by', detail.manufacturer],
    ['MRP', product.mrp ? `₹${product.mrp.toLocaleString('en-IN')} (inclusive of all taxes)` : '—'],
    [
      'Expiry',
      'At least 6 months left at dispatch, or the pharmacy tells you first',
    ],
  ];

  return (
    <View style={styles.tabBody}>
      <Text variant="headline" color={semantic.text}>
        Product details
      </Text>
      {rows.map(([label, value]) => (
        <View key={label} style={styles.detailRow}>
          <Text variant="resultMeta" color={semantic.textSecondary} style={styles.detailLabel}>
            {label}
          </Text>
          <Text variant="strong" color={semantic.text} style={styles.detailValue}>
            {value}
          </Text>
        </View>
      ))}
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*  Seller, returns, similar                                                  */
/* -------------------------------------------------------------------------- */

/** The card that says who sells it. */
export function SellerCard({ detail, isRx }: { detail: ProductDetail; isRx: boolean }) {
  return (
    <View style={styles.card}>
      <Text variant="headline" color={semantic.text}>
        Sold by
      </Text>
      <View style={styles.sellerRow}>
        <View style={styles.pharmacyAvatar}>
          <Text variant="tag" color={brand.forest}>
            HF
          </Text>
        </View>
        <Text variant="strong" color={semantic.text}>
          HealthFirst Chemist
        </Text>
      </View>
      <Text variant="resultSub" color={semantic.textMuted}>
        {detail.licence}
      </Text>
      <Text variant="resultSub" color={semantic.textMuted}>
        {detail.pharmacist}
      </Text>
      <Text variant="resultSub" color={semantic.textMuted}>
        {detail.locality}
      </Text>
      <Text variant="resultSub" color={semantic.textSecondary}>
        {isRx ? pharmacistNoteRx : pharmacistNote}
      </Text>
    </View>
  );
}

/** The card with the returns policy. */
export function ReturnsCard({ onPolicy, onHelp }: { onPolicy?: () => void; onHelp?: () => void }) {
  return (
    <View style={styles.card}>
      <Text variant="headline" color={semantic.text}>
        Returns and refunds
      </Text>
      {returnPoints.map((point) => (
        <View key={point} style={styles.bullet}>
          <View style={styles.bulletDot} />
          <Text variant="resultMeta" color={semantic.textSecondary} style={styles.bulletText}>
            {point}
          </Text>
        </View>
      ))}
      <View style={styles.linkRow}>
        <Pressable accessibilityRole="button" onPress={onPolicy}>
          <Text variant="strong" color={semantic.action}>
            Payments and refunds policy
          </Text>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={onHelp}>
          <Text variant="strong" color={semantic.action}>
            Help
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

/** The rail of other products. */
export function SimilarProducts({
  products,
  onPress,
  onAdd,
}: {
  products: CatalogueProduct[];
  onPress?: (product: CatalogueProduct) => void;
  onAdd?: (product: CatalogueProduct) => void;
}) {
  return (
    <View style={styles.similar}>
      <Text variant="headline" color={semantic.text}>
        Similar products
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.similarRow}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            width={132}
            onPress={() => onPress?.(product)}
            onAdd={() => onAdd?.(product)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*  Styles                                                                    */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  availability: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.lg,
    backgroundColor: brand.forest,
  },
  availabilityIcon: {
    width: 36,
    height: 36,
    borderRadius: radii.circle,
    backgroundColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  availabilityText: {
    flex: 1,
    gap: spacing.xxs,
  },
  card: {
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: mint[200],
    backgroundColor: neutral.surface,
  },
  pharmacyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md - 2,
  },
  pharmacyAvatar: {
    width: 40,
    height: 40,
    borderRadius: radii.lg,
    backgroundColor: mint[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  pharmacyInfo: {
    flex: 1,
    gap: spacing.xxs,
  },
  showAll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  couponRow: {
    gap: spacing.md - 2,
  },
  coupon: {
    width: 240,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md - 2,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md - 2,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: gold[300],
    backgroundColor: gold[50],
  },
  couponText: {
    flex: 1,
    gap: spacing.xxs,
  },
  prescriptionBlock: {
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: mint[200],
    backgroundColor: neutral.surface,
  },
  prescriptionLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  tabs: {
    flexDirection: 'row',
    padding: 2,
    borderRadius: 9,
    backgroundColor: neutral.surface3,
  },
  tab: {
    flex: 1,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
  },
  tabActive: {
    backgroundColor: neutral.surface,
    shadowColor: elevation.medium.shadowColor,
    shadowOffset: elevation.medium.shadowOffset,
    shadowRadius: elevation.medium.shadowRadius,
    shadowOpacity: elevation.medium.shadowOpacity,
    elevation: elevation.medium.elevation,
  },
  tabLabel: {
    fontSize: 13,
    lineHeight: 18,
  },
  tabBody: {
    gap: spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  detailLabel: {
    width: 120,
  },
  detailValue: {
    flex: 1,
  },
  faq: {
    gap: spacing.xs,
  },
  sellerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md - 2,
  },
  bullet: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  bulletDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 6,
    backgroundColor: neutral.faint,
  },
  bulletText: {
    flex: 1,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  similar: {
    gap: spacing.md,
  },
  similarRow: {
    gap: spacing.md,
    paddingRight: spacing.lg,
  },
});
