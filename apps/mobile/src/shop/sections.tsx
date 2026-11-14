import React from 'react';
import { Pressable, ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import {
  brand,
  elevation,
  gold,
  mint,
  neutral,
  radii,
  semantic,
  spacing,
  storeAccents,
  type StoreAccentKey,
} from '@medmate/theme';

import { Icon } from '../icons/Icon';
import { Text } from '../ui/Text';
import { useContentWidth, useGrid, useMeasuredWidth } from '../ui/layout';
import {
  AddButton,
  ArtTile,
  Divider,
  Gradient,
  SectionHeader,
} from '../ui/primitives';
import { careStores, storeProducts } from '../data/care';
import {
  careCorners,
  categoryGroups,
  couponFootnote,
  coupons,
  dealOfTheDay,
  dealRail,
  everydayEssentials,
  bestOffers,
  forPharmacies,
  footer,
  footerLinks,
  initialsOf,
  labTests,
  orderAgain,
  pharmacies,
  prescriptionNote,
  reorderBanner,
  seasonal,
  type HealthStore,
  type Product,
  type Store,
} from '../data/shop';

/* -------------------------------------------------------------------------- */
/*  Shared bits                                                               */
/* -------------------------------------------------------------------------- */

/** The padding a product card carries. */
const CARD_PADDING = spacing.xs + 2;

/** The border a product card carries. */
const CARD_BORDER = 1;

/** The width of a product card in the horizontal rails. */
const RAIL_CARD_WIDTH = 132;

/**
 * The width the content box of a card really has.
 *
 * A card's children live inside its padding and its border, so anything
 * sized from the card's outer width spills past the edge. This is the width
 * that is actually available to them.
 */
function contentBox(width: number, padding: number, border: number): number {
  return Math.max(0, width - padding * 2 - border * 2);
}

/** A horizontal rail with a fixed gap between items. */
function Rail({
  children,
  gap = spacing.md,
  style,
}: {
  children: React.ReactNode;
  gap?: number;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[{ gap }, style]}
    >
      {children}
    </ScrollView>
  );
}

/**
 * A rail that says so when a filter leaves it empty.
 *
 * The service tabs narrow the rails below, and a category with nothing in it
 * should read as empty rather than as a broken layout.
 */
function FilteredRail({
  products,
  render,
  emptyLabel = 'Nothing in this category yet',
}: {
  products: Product[];
  render: (product: Product) => React.ReactNode;
  emptyLabel?: string;
}) {
  if (products.length === 0) {
    return (
      <View style={styles.emptyRail}>
        <Text variant="resultSub" color={semantic.textMuted}>
          {emptyLabel}
        </Text>
      </View>
    );
  }

  return <Rail>{products.map(render)}</Rail>;
}

/** The discount tag that sits on the art tile. */
function OffTag({ label }: { label: string }) {
  return (
    <View style={styles.offTag}>
      <Text variant="tag" color={brand.forest}>
        {label}
      </Text>
    </View>
  );
}

/**
 * The price row.
 *
 * Prescription items show the selling price only - never a strike-through
 * MRP and never a discount.
 */
function PriceRow({ product, priceSize = 'price' }: { product: Product; priceSize?: 'price' | 'amount' }) {
  return (
    <View style={styles.priceRow}>
      <Text variant={priceSize} color={semantic.text} style={styles.price}>
        {`₹${product.price.toLocaleString('en-IN')}`}
      </Text>
      {!product.rx && product.mrp ? (
        <Text variant="caption" color={semantic.textMuted} style={styles.mrp}>
          {`₹${product.mrp.toLocaleString('en-IN')}`}
        </Text>
      ) : null}
    </View>
  );
}

/** The delivery window under a product name. */
function DeliveryLine({ eta }: { eta?: string }) {
  if (!eta) return null;
  return (
    <View style={styles.etaRow}>
      <Icon name="scooter" size={12} color={brand.green700} />
      <Text variant="captionStrong" color={brand.green700}>
        {eta}
      </Text>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*  Product card                                                              */
/* -------------------------------------------------------------------------- */

export type ProductCardProps = {
  product: Product;
  /** Card width. The art tile and the ADD button follow the card width. */
  width?: number;
  /** Opens the product. */
  onPress?: () => void;
  /** Adds the product to the cart. */
  onAdd?: () => void;
};

/**
 * A product card.
 *
 * Used by the horizontal rails and by the "Best offers" grid. The card keeps
 * the Figma proportions: a square art tint on the mint gradient, the pack
 * size, the name, the delivery window, the price and the ADD button.
 *
 * A card without an explicit width fills the row it sits in and measures
 * itself. Without a width of any kind the card would be sized by its longest
 * line of text, so a long product name drags the card out past the art tile
 * and past the card's own border instead of wrapping inside it.
 */
export function ProductCard({ product, width, onPress, onAdd }: ProductCardProps) {
  const box = useMeasuredWidth();
  const cardWidth = width ?? box.width;

  // The art is sized from the card's content box - its width minus the
  // padding and the border - so it can never spill past the card edge.
  const inner = contentBox(cardWidth, CARD_PADDING, CARD_BORDER);
  const art = Math.min(120, inner || 120);

  return (
    <View
      style={[styles.productCard, width ? { width } : null]}
      onLayout={box.onLayout}
    >
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [{ opacity: pressed ? 0.92 : 1 }]}
      >
      <View style={{ width: art, height: art }}>
        <ArtTile
          width={art}
          height={art}
          radius={radii.lg}
          initials={initialsOf(product.name)}
        />
        {!product.rx && product.off ? <OffTag label={`${product.off}% OFF`} /> : null}
      </View>

      <View style={styles.productInfo}>
        <Text variant="captionStrong" color={semantic.textMuted} numberOfLines={1}>
          {product.sub}
        </Text>
        <Text variant="footnoteEmphasized" color={semantic.text} numberOfLines={2}>
          {product.name}
        </Text>
        <DeliveryLine eta={product.eta} />
        <PriceRow product={product} />
      </View>
      </Pressable>

      <AddButton style={styles.productAdd} onPress={onAdd} />
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*  Product tile (2 x 2 seasonal grid)                                         */
/* -------------------------------------------------------------------------- */

export type ProductTileProps = {
  product: Product;
  width?: number;
  /** Opens the product. */
  onPress?: () => void;
  /** Adds the product to the cart. */
  onAdd?: () => void;
};

/**
 * The wider product tile used by the seasonal 2 x 2 grid: a full-bleed photo
 * band with the discount tag and the ADD affordance on top of it, then the
 * details underneath.
 */
export function ProductTile({ product, width = 174, onPress, onAdd }: ProductTileProps) {
  const photoHeight = 132;
  // The photo band runs to the inside edge of the tile's border. Sizing it
  // from the tile's outer width pushes it past the rounded corner, where the
  // tile's own overflow rule clips it.
  const band = contentBox(width, 0, CARD_BORDER);

  return (
    <View style={[styles.productTile, { width }]}>
      <View style={{ width: band, height: photoHeight }}>
        <Pressable
          accessibilityRole="button"
          onPress={onPress}
          style={({ pressed }) => [{ opacity: pressed ? 0.92 : 1 }]}
        >
          <ArtTile
            width={band}
            height={photoHeight}
            radius={0}
            initials={initialsOf(product.name)}
          />
        </Pressable>
        {!product.rx && product.off ? <OffTag label={`${product.off}% OFF`} /> : null}
        {/* The ADD affordance sits on the photo, bottom right, like the design. */}
        <AddButton label="ADD" onPress={onAdd ?? onPress} style={styles.tileAdd} />
      </View>
      <View style={styles.tileInfo}>
        <Text variant="cardName" color={semantic.text} numberOfLines={2}>
          {product.name}
        </Text>
        <Text variant="caption" color={semantic.textMuted} numberOfLines={1}>
          {product.sub}
        </Text>
        <PriceRow product={product} />
      </View>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*  Categories                                                                */
/* -------------------------------------------------------------------------- */

/**
 * The category grid.
 *
 * Four columns of 76pt tiles with a 19pt gap, wrapping onto as many rows as
 * the group needs. On a screen wider than the design the tiles grow into the
 * extra room so the row always fills the page instead of sitting against the
 * left edge with a gap on the right.
 */
function CategoryGrid({
  categories,
  onPress,
}: {
  categories: { id: string; label: string; initials: string }[];
  onPress?: (label: string) => void;
}) {
  // Four across, whatever the width: the tiles tighten before they wrap.
  const box = useMeasuredWidth();
  const grid = useGrid(4, { basis: 76, gap: 19, minGap: 8, maxBasis: 96 }, box.width);

  return (
    <View
      style={[styles.categoryGrid, { gap: grid.gap }]}
      onLayout={box.onLayout}
    >
      {categories.map((category) => (
        <Pressable
          key={category.id}
          accessibilityRole="button"
          onPress={() => onPress?.(category.label)}
          style={[styles.category, { width: grid.width }]}
        >
          <ArtTile
            width={grid.width}
            height={grid.width}
            radius={18}
            initials={category.initials}
            style={styles.categoryArt}
          />
          <Text
            variant="tileLabel"
            color={semantic.text}
            style={styles.categoryLabel}
            numberOfLines={2}
          >
            {category.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

/**
 * The health stores, with their shelves resolved from the catalogue.
 */
function careStoreShelves(): HealthStore[] {
  return careStores.map((store) => ({
    id: store.id,
    name: store.name,
    sub: store.sub,
    accent: store.accent,
    products: storeProducts(store),
  }));
}

/** The three category groups of the Shop screen. */
export function CategoryGroups({ onCategoryPress }: { onCategoryPress?: (label: string) => void }) {
  return (
    <>
      {categoryGroups.map((group) => (
        <View key={group.title} style={styles.section}>
          <SectionHeader title={group.title} actionLabel="See all" />
          <CategoryGrid categories={group.categories} onPress={onCategoryPress} />
        </View>
      ))}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Order again                                                               */
/* -------------------------------------------------------------------------- */

/** "Order again" - the products you bought last time, ready to re-add. */
export function OrderAgainCard({
  products = orderAgain,
  onAdd,
  onPress,
}: {
  products?: Product[];
  onAdd?: (product: Product) => void;
  onPress?: (product: Product) => void;
}) {
  return (
    <View style={styles.section}>
      <SectionHeader title="Order again" actionLabel="My orders" />
      <View style={styles.orderAgainCard}>
        {products.length === 0 ? (
          <Text variant="resultSub" color={semantic.textMuted} style={styles.orderEmpty}>
            Nothing in this category yet
          </Text>
        ) : null}
        {products.map((product, index) => (
          <View key={product.id}>
            {index > 0 ? <Divider /> : null}
            <View style={styles.orderRow}>
              <ArtTile
                width={56}
                height={56}
                radius={radii.lg}
                initials={initialsOf(product.name)}
              />
              <View style={styles.orderInfo}>
                <Text variant="cardName" color={semantic.text} numberOfLines={2}>
                  {product.name}
                </Text>
                <Text variant="caption" color={semantic.textMuted} numberOfLines={1}>
                  {product.sub}
                </Text>
                <View style={styles.orderPriceRow}>
                  <Text variant="footnoteEmphasized" color={semantic.text} style={styles.price}>
                    {`₹${product.price.toLocaleString('en-IN')}`}
                  </Text>
                  {product.mrp ? (
                    <Text variant="caption" color={semantic.textMuted} style={styles.mrp}>
                      {`₹${product.mrp.toLocaleString('en-IN')}`}
                    </Text>
                  ) : null}
                  {product.off ? (
                    <Text variant="captionStrong" color={semantic.savings} style={styles.price}>
                      {`${product.off}% OFF`}
                    </Text>
                  ) : null}
                </View>
              </View>
              <AddButton style={styles.orderAdd} onPress={() => onAdd?.(product)} />
            </View>
          </View>
        ))}
        <Divider />
        <Pressable accessibilityRole="button" style={styles.reorderRow}>
          <View style={styles.reorderIcon}>
            <Icon name="refill" size={20} color={brand.green700} />
          </View>
          <View style={styles.reorderInfo}>
            <Text variant="cardName" color={semantic.text}>
              {reorderBanner.title}
            </Text>
            <Text variant="caption" color={semantic.textMuted}>
              {reorderBanner.sub}
            </Text>
          </View>
          <Icon name="chev-r" size={18} color={semantic.textMuted} />
        </Pressable>
      </View>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*  Coupons                                                                   */
/* -------------------------------------------------------------------------- */

/** A coupon card with a perforation and a notch, like a paper ticket. */
function CouponCard({
  coupon,
  onPress,
}: {
  coupon: (typeof coupons)[number];
  onPress?: (coupon: (typeof coupons)[number]) => void;
}) {
  const isForest = coupon.tone === 'forest';

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress?.(coupon)}
      style={[
        styles.coupon,
        isForest ? styles.couponForest : styles.couponGold,
      ]}
    >
      <View style={styles.couponBig}>
        <Text variant="amount" color={isForest ? gold[300] : brand.forest} style={styles.couponBigText}>
          {coupon.big}
        </Text>
        <Text variant="tag" color={isForest ? mint[300] : gold.ink}>
          OFF
        </Text>
      </View>

      <View
        style={[
          styles.perforation,
          { backgroundColor: isForest ? 'rgba(255,255,255,0.25)' : gold[200] },
        ]}
      />

      <View style={styles.couponText}>
        <View
          style={[
            styles.codeChip,
            { borderColor: isForest ? gold[300] : brand.forest },
          ]}
        >
          <Text variant="tag" color={isForest ? gold[300] : brand.forest}>
            {coupon.code}
          </Text>
        </View>
        <Text variant="caption" color={isForest ? neutral.surface : neutral.ink2} numberOfLines={2}>
          {coupon.desc}
        </Text>
      </View>

      <View style={styles.notch} />
    </Pressable>
  );
}

/** The coupons rail plus the one-coupon-per-order footnote. */
export function CouponsSection({
  onPress,
}: {
  onPress?: (coupon: (typeof coupons)[number]) => void;
}) {
  return (
    <View style={styles.section}>
      <SectionHeader title="Offers & coupons" actionLabel="See all" />
      <Rail>
        {coupons.map((coupon) => (
          <CouponCard key={coupon.id} coupon={coupon} onPress={onPress} />
        ))}
      </Rail>
      <Text variant="caption" color={semantic.textMuted}>
        {couponFootnote}
      </Text>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*  Health stores                                                             */
/* -------------------------------------------------------------------------- */

/** One tinted health-store tile with three product photos. */
function HealthStoreTile({
  store,
  width,
  onPress,
}: {
  store: HealthStore;
  width: number;
  onPress?: (store: HealthStore) => void;
}) {
  const accent = storeAccents[store.accent];
  // The three photos share the tile's content box. They shrink together
  // rather than the third one hanging over the edge of the card.
  const inner = Math.max(0, width - spacing.md * 2);
  const slot = Math.min(46, Math.max(28, (inner - spacing.xs * 2) / 3));
  const slotHeight = Math.round((slot * 64) / 46);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress?.(store)}
      style={[styles.storeTile, { width, backgroundColor: accent.bg }]}
    >
      <Text variant="buttonSmall" color={accent.ink} numberOfLines={2}>
        {store.name}
      </Text>
      <Text variant="caption" color={semantic.textSecondary} numberOfLines={2}>
        {store.sub}
      </Text>
      <View style={styles.storeCollage}>
        {[0, 1, 2].map((index) => (
          <View key={index} style={[styles.storeSlot, { width: slot, height: slotHeight }]}>
            <ArtTile
              width={slot}
              height={slotHeight}
              radius={radii.md}
              initials={initialsOf(store.products[index]?.name ?? store.name)}
            />
          </View>
        ))}
      </View>
    </Pressable>
  );
}

/** The "Health stores" grid - two columns of tinted tiles. */
export function HealthStoresSection({
  onPress,
}: {
  onPress?: (store: HealthStore) => void;
}) {
  const box = useMeasuredWidth();
  const grid = useGrid(2, { basis: 174, gap: spacing.md, maxBasis: 230 }, box.width);

  return (
    <View style={styles.section}>
      <SectionHeader title="Health stores" />
      <View style={[styles.storeGrid, { gap: grid.gap }]} onLayout={box.onLayout}>
        {careStoreShelves().map((store) => (
          <HealthStoreTile
            key={store.id}
            store={store}
            width={grid.width}
            onPress={onPress}
          />
        ))}
      </View>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*  Deals                                                                     */
/* -------------------------------------------------------------------------- */

/** "Today's deals" - the deal of the day plus a rail of products. */
export function DealsSection({
  products = dealRail,
  onAdd,
  onPress,
}: {
  products?: Product[];
  onAdd?: (product: Product) => void;
  onPress?: (product: Product) => void;
}) {
  const product = dealOfTheDay.product;

  return (
    <View style={styles.section}>
      <SectionHeader title="Today’s deals" icon="bolt" />

      <View style={styles.dealCard}>
        <View style={styles.dealArt}>
          <ArtTile width={136} height={136} radius={radii.xl} initials={initialsOf(product.name)} />
          {!product.rx && product.off ? <OffTag label={`${product.off}% OFF`} /> : null}
        </View>
        <View style={styles.dealInfo}>
          <Text variant="eyebrow" color={semantic.savings}>
            {dealOfTheDay.eyebrow}
          </Text>
          <Text variant="buttonSmall" color={semantic.text} numberOfLines={2}>
            {product.name}
          </Text>
          <Text variant="captionStrong" color={semantic.textMuted}>
            {product.sub}
          </Text>
          <DeliveryLine eta={product.eta} />
          <PriceRow product={product} />
          <AddButton style={styles.dealAdd} onPress={() => onAdd?.(product)} />
        </View>
      </View>

      <FilteredRail
        products={products}
        render={(item) => (
          <ProductCard
            key={item.id}
            product={item}
            width={RAIL_CARD_WIDTH}
            onAdd={() => onAdd?.(item)}
            onPress={() => onPress?.(item)}
          />
        )}
      />
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*  Seasonal                                                                  */
/* -------------------------------------------------------------------------- */

/** "Seasonal picks" - filters plus a 2 x 2 grid of product tiles. */
export function SeasonalSection({
  products = seasonal.products,
  onAdd,
  onPress,
}: {
  products?: Product[];
  onAdd?: (product: Product) => void;
  onPress?: (product: Product) => void;
}) {
  const [filter, setFilter] = React.useState(0);
  const box = useMeasuredWidth();
  const grid = useGrid(2, { basis: 174, gap: spacing.md, maxBasis: 230 }, box.width);

  return (
    <View style={styles.section}>
      <View style={styles.seasonalHead}>
        <Text variant="sectionEyebrow" color="#1F5E8C">
          {seasonal.eyebrow}
        </Text>
        <Text variant="sectionTitle" color={semantic.text}>
          {seasonal.title}
        </Text>
        <Text variant="footnote" color={semantic.textSecondary}>
          {seasonal.body}
        </Text>
      </View>

      <Rail>
        {seasonal.filters.map((label, index) => (
          <Pressable
            key={label}
            accessibilityRole="button"
            accessibilityState={{ selected: index === filter }}
            onPress={() => setFilter(index)}
            style={[
              styles.filterChip,
              index === filter ? styles.filterChipOn : styles.filterChipOff,
            ]}
          >
            {index === filter ? <Icon name="check" size={14} color={gold[300]} /> : null}
            <Text variant="buttonSmall" color={index === filter ? neutral.surface : neutral.ink2}>
              {label}
            </Text>
          </Pressable>
        ))}
      </Rail>

      <View style={[styles.seasonalGrid, { gap: grid.gap }]} onLayout={box.onLayout}>
        {products.map((product) => (
          <ProductTile
            key={product.id}
            product={product}
            width={grid.width}
            onAdd={() => onAdd?.(product)}
            onPress={() => onPress?.(product)}
          />
        ))}
      </View>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*  Pharmacies                                                                */
/* -------------------------------------------------------------------------- */

/** A pharmacy card: avatar, name, locality, delivery tag and perks. */
function PharmacyCard({
  store,
  onPress,
}: {
  store: Store;
  onPress?: (store: Store) => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress?.(store)}
      style={styles.pharmacyCard}
    >
      <View style={styles.pharmacyTop}>
        <View style={styles.pharmacyAvatar}>
          <Text variant="footnoteEmphasized" color={brand.forest}>
            {store.initials}
          </Text>
        </View>
        <View style={styles.pharmacyInfo}>
          <Text variant="footnoteEmphasized" color={semantic.text} numberOfLines={1}>
            {store.name}
          </Text>
          <Text variant="caption" color={semantic.textMuted} numberOfLines={1}>
            {store.locality}
          </Text>
        </View>
      </View>

      <View style={styles.pharmacyMeta}>
        <View style={styles.etaPill}>
          <Text variant="captionStrong" color={brand.green700}>
            {`● ${store.eta}`}
          </Text>
        </View>
        {store.perk ? (
          <Text variant="caption" color={semantic.textMuted} style={styles.perkText}>
            {`· ${store.perk}`}
          </Text>
        ) : null}
      </View>

      <View style={styles.dashedDivider} />

      <View style={styles.perkRow}>
        <Icon name="tag" size={14} color={semantic.savings} />
        <Text variant="caption" color={semantic.savings} style={styles.perkText}>
          {store.perkLabel}
        </Text>
      </View>
    </Pressable>
  );
}

/** "Pharmacies near you" - a rail of pharmacy cards. */
export function PharmaciesSection({
  onPress,
}: {
  onPress?: (store: Store) => void;
}) {
  return (
    <View style={styles.section}>
      <SectionHeader title="Pharmacies near you" actionLabel="See all" />
      <Rail>
        {pharmacies.map((store) => (
          <PharmacyCard key={store.id} store={store} onPress={onPress} />
        ))}
      </Rail>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*  Care blocks                                                               */
/* -------------------------------------------------------------------------- */

/**
 * A care block: a tinted store header followed by a 2 column product grid.
 */
export function CareBlock({
  store,
  onAdd,
  onPress,
}: {
  store: HealthStore;
  onAdd?: (product: Product) => void;
  onPress?: (product: Product) => void;
}) {
  const box = useMeasuredWidth(0, useContentWidth() - 26);
  // The grid sits inside the block's own padding, so the width it has to
  // share out is the block's content box, not the page.
  const grid = useGrid(2, { basis: 163, maxBasis: 220 }, box.width);
  const accent = storeAccents[store.accent];

  return (
    <View style={styles.careBlock}>
      <View style={[styles.careHeader, { backgroundColor: accent.bg }]}>
        <View style={styles.careHeaderIcon}>
          <Icon name="steth" size={20} color={accent.ink} />
        </View>
        <View style={styles.careHeaderInfo}>
          <Text variant="buttonSmall" color={accent.ink} numberOfLines={1}>
            {store.name}
          </Text>
          <Text variant="caption" color={semantic.textSecondary} numberOfLines={2}>
            {store.sub}
          </Text>
        </View>
        <Pressable accessibilityRole="button">
          <Text variant="captionStrong" color={accent.ink}>
            See all
          </Text>
        </Pressable>
      </View>

      <View style={styles.careBody}>
        <View style={[styles.careGrid, { gap: grid.gap }]} onLayout={box.onLayout}>
          {store.products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              width={grid.width}
              onAdd={() => onAdd?.(product)}
              onPress={() => onPress?.(product)}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

/** The three care blocks (ortho, baby, women) with their product grids. */
export function CareBlocks({
  onAdd,
  onPress,
}: {
  onAdd?: (product: Product) => void;
  onPress?: (product: Product) => void;
}) {
  return (
    <>
      {careStoreShelves()
        .slice(0, 3)
        .map((store) => (
          <View key={store.id} style={styles.section}>
            <CareBlock store={store} onAdd={onAdd} onPress={onPress} />
          </View>
        ))}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Lab tests + care corners                                                  */
/* -------------------------------------------------------------------------- */

/** The "Lab tests at home" promo card. */
export function LabTestsSection() {
  return (
    <View style={styles.section}>
      <Gradient token="lab" radius={radii.xxl} style={styles.labCard}>
        <View style={styles.labInfo}>
          <Text variant="sectionEyebrow" color={brand.green700}>
            {labTests.eyebrow}
          </Text>
          <Text variant="sectionTitle" color={semantic.text}>
            {labTests.title}
          </Text>
          <Text variant="footnote" color={semantic.textSecondary}>
            {labTests.body}
          </Text>
          <View style={styles.comingSoonTag}>
            <Text variant="captionStrong" color={gold[300]}>
              {labTests.tag}
            </Text>
          </View>
        </View>
        <View style={styles.labIcon}>
          <Icon name="flask" size={32} color={semantic.text} />
        </View>
      </Gradient>
    </View>
  );
}

/** The compact "care corner" cards: diabetes, heart, elderly. */
export function CareCornersSection({
  onPress,
}: {
  onPress?: (corner: (typeof careCorners)[number]) => void;
}) {
  return (
    <View style={styles.careCornerList}>
      {careCorners.map((corner) => {
        const accent = storeAccents[corner.accent as StoreAccentKey];
        return (
          <Pressable
            key={corner.id}
            accessibilityRole="button"
            onPress={() => onPress?.(corner)}
            style={[styles.careCorner, { backgroundColor: accent.bg }]}
          >
            <View style={styles.careCornerInfo}>
              <Text variant="bodyStrong" color={accent.ink} numberOfLines={1}>
                {corner.name}
              </Text>
              <Text variant="caption" color={semantic.textSecondary} numberOfLines={2}>
                {corner.sub}
              </Text>
              <View style={styles.careCornerLink}>
                <Text variant="linkLabel" color={accent.ink}>
                  Shop now
                </Text>
                <Icon name="chev-r" size={14} color={accent.ink} />
              </View>
            </View>
            <View style={styles.careCornerPhotos}>
              {corner.photos.map((photo, index) => (
                <View
                  key={photo}
                  style={[styles.careCornerPhoto, index === 1 && styles.careCornerPhotoOverlap]}
                >
                  <ArtTile width={79} height={79} radius={11} initials={initialsOf(photo)} />
                </View>
              ))}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*  Offer grids + rails                                                       */
/* -------------------------------------------------------------------------- */

/** "Best offers near you" - a three column grid. */
export function BestOffersSection({
  products = bestOffers,
  onAdd,
  onPress,
}: {
  products?: Product[];
  onAdd?: (product: Product) => void;
  onPress?: (product: Product) => void;
}) {
  const box = useMeasuredWidth();
  const grid = useGrid(3, { basis: 114 }, box.width);

  return (
    <View style={styles.section}>
      <SectionHeader title="Best offers near you" actionLabel="See all" />
      <View style={[styles.offerGrid, { gap: grid.gap }]} onLayout={box.onLayout}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            width={grid.width}
            onAdd={() => onAdd?.(product)}
            onPress={() => onPress?.(product)}
          />
        ))}
      </View>
    </View>
  );
}

/** "Everyday essentials" - a rail plus the prescription nudge. */
export function EverydayEssentialsSection({
  products = everydayEssentials,
  onAdd,
  onPress,
}: {
  products?: Product[];
  onAdd?: (product: Product) => void;
  onPress?: (product: Product) => void;
}) {
  return (
    <View style={styles.section}>
      <SectionHeader title="Everyday essentials" actionLabel="See all" />
      <FilteredRail
        products={products}
        render={(product) => (
          <ProductCard
            key={product.id}
            product={product}
            width={RAIL_CARD_WIDTH}
            onAdd={() => onAdd?.(product)}
            onPress={() => onPress?.(product)}
          />
        )}
      />
      <View style={styles.prescriptionNote}>
        <Icon name="shield" size={16} color={brand.green700} />
        <Text variant="caption" color={semantic.textSecondary} style={styles.prescriptionText}>
          {prescriptionNote}
        </Text>
      </View>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*  Partner + footer                                                          */
/* -------------------------------------------------------------------------- */

/** The "For pharmacies" call to action. */
export function ForPharmaciesSection() {
  return (
    <View style={styles.section}>
      <View style={styles.partnerCard}>
        <Text variant="sectionEyebrow" color={gold[300]}>
          {forPharmacies.eyebrow}
        </Text>
        <Text variant="sectionTitle" color={neutral.surface}>
          {forPharmacies.title}
        </Text>
        <Text variant="footnote" color={mint[200]}>
          {forPharmacies.body}
        </Text>
        <Pressable accessibilityRole="button" style={styles.partnerButton}>
          <Icon name="plus" size={18} color={brand.forest} />
          <Text variant="buttonSmall" color={brand.forest}>
            {forPharmacies.action}
          </Text>
          <Icon name="chev-r" size={16} color={brand.forest} />
        </Pressable>
      </View>
    </View>
  );
}

/** The page footer. */
export function PageFooter() {
  return (
    <View style={styles.footer}>
      <Text variant="footer" color={neutral.line2} style={styles.footerHeadline}>
        {footer.headline}
      </Text>
      <View style={styles.madeWith}>
        <Text variant="caption" color={semantic.textMuted}>
          {footer.madeWith}
        </Text>
        <Icon name="heart" size={12} color={semantic.danger} />
        <Text variant="caption" color={semantic.textMuted}>
          {footer.place}
        </Text>
      </View>
      <Divider strong />
      <View style={styles.footerLinks}>
        {footerLinks.map((link) => (
          <Pressable key={link} accessibilityRole="button" style={styles.footerLink}>
            <Text variant="footnote" color={semantic.textSecondary}>
              {link}
            </Text>
          </Pressable>
        ))}
      </View>
      <Divider strong />
      <Text variant="bodyStrong" color={semantic.textFaint}>
        {footer.brand}
      </Text>
      <Text variant="caption" color={semantic.textMuted}>
        {footer.legal}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  /* Sections ------------------------------------------------------------- */
  section: {
    gap: 14,
  },
  emptyRail: {
    height: 64,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: neutral.line2,
    backgroundColor: neutral.surface2,
  },

  /* Product card --------------------------------------------------------- */
  productCard: {
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: neutral.line,
    backgroundColor: neutral.surface,
    padding: spacing.xs + 2,
    gap: spacing.xs,
  },
  productInfo: {
    gap: spacing.xxs,
    paddingHorizontal: spacing.xxs,
    paddingBottom: spacing.sm,
  },
  productAdd: {
    alignSelf: 'stretch',
    // The button sits at the foot of the card. A title that runs to two lines
    // would otherwise push it down, so the buttons in a row of cards would
    // not line up with each other.
    marginTop: 'auto',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    // On a narrow card the struck-through MRP drops to its own line rather
    // than pushing out past the card edge.
    flexWrap: 'wrap',
    gap: spacing.xs + 2,
  },
  price: {
    // React Native does not shrink row children by default, so a long price
    // pair would push out of the card. The price gives way instead.
    flexShrink: 1,
  },
  mrp: {
    flexShrink: 1,
    textDecorationLine: 'line-through',
  },
  etaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  offTag: {
    position: 'absolute',
    top: 0,
    left: 0,
    paddingHorizontal: spacing.xs + 3,
    paddingVertical: spacing.xxs,
    borderTopLeftRadius: radii.xl,
    borderBottomRightRadius: radii.md,
    backgroundColor: gold[300],
  },

  /* Product tile --------------------------------------------------------- */
  productTile: {
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: neutral.line,
    backgroundColor: neutral.surface,
    overflow: 'hidden',
  },
  tileInfo: {
    gap: spacing.xxs,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md - 2,
    paddingBottom: spacing.md,
  },
  tileAdd: {
    position: 'absolute',
    right: spacing.sm,
    bottom: spacing.sm,
    width: 60,
    backgroundColor: neutral.surface,
    shadowColor: elevation.low.shadowColor,
    shadowOffset: elevation.low.shadowOffset,
    shadowRadius: elevation.low.shadowRadius,
    shadowOpacity: elevation.low.shadowOpacity,
    elevation: elevation.low.elevation,
  },

  /* Categories ----------------------------------------------------------- */
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 19,
  },
  category: {
    alignItems: 'center',
    gap: spacing.xs + 2,
  },
  categoryArt: {
    borderWidth: 1,
    borderColor: mint[200],
  },
  categoryLabel: {
    textAlign: 'center',
  },

  /* Order again ---------------------------------------------------------- */
  orderAgainCard: {
    borderRadius: radii.huge,
    borderWidth: 1,
    borderColor: neutral.line,
    backgroundColor: neutral.surface,
    paddingVertical: spacing.xxs,
  },
  orderEmpty: {
    paddingHorizontal: spacing.md - 2,
    paddingVertical: spacing.md,
  },
  orderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.md - 2,
    paddingVertical: spacing.sm,
  },
  orderInfo: {
    flex: 1,
    gap: spacing.xxs,
  },
  orderPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.xs + 2,
  },
  orderAdd: {
    width: 64,
  },
  reorderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.md - 2,
    paddingVertical: spacing.md,
  },
  reorderIcon: {
    width: 40,
    height: 40,
    borderRadius: radii.lg,
    backgroundColor: mint[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  reorderInfo: {
    flex: 1,
  },

  /* Coupons -------------------------------------------------------------- */
  coupon: {
    width: 220,
    // The description wraps, so the ticket grows rather than spilling out of
    // its own edges.
    minHeight: 92,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    paddingLeft: spacing.md,
    paddingRight: spacing.lg + 2,
    borderRadius: radii.xl,
  },
  couponForest: {
    backgroundColor: brand.forest,
  },
  couponGold: {
    backgroundColor: gold[50],
    borderWidth: 1,
    borderColor: gold[100],
  },
  couponBig: {
    width: 58,
    alignItems: 'center',
  },
  couponBigText: {
    lineHeight: 25,
  },
  perforation: {
    width: 1,
    height: 60,
  },
  couponText: {
    flex: 1,
    gap: spacing.xs,
  },
  codeChip: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: radii.xs,
    paddingHorizontal: spacing.xs + 4,
    paddingVertical: spacing.xxs,
  },
  notch: {
    position: 'absolute',
    right: -9,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: mint[50],
  },

  /* Health stores -------------------------------------------------------- */
  storeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  storeTile: {
    // The height is a floor, not a lid: a store name that wraps grows the
    // tile instead of spilling out of the bottom of it.
    minHeight: 156,
    borderRadius: radii.xxl,
    padding: spacing.md,
    gap: spacing.sm,
  },
  storeCollage: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: 'auto',
  },
  storeSlot: {
    borderRadius: radii.md,
    backgroundColor: neutral.surface,
    overflow: 'hidden',
    justifyContent: 'center',
  },

  /* Deals ---------------------------------------------------------------- */
  dealCard: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md - 2,
    borderRadius: radii.huge,
    borderWidth: 1,
    borderColor: neutral.line,
    backgroundColor: neutral.surface,
  },
  dealArt: {
    width: 136,
    height: 136,
  },
  dealInfo: {
    flex: 1,
    gap: spacing.xxs,
  },
  dealAdd: {
    alignSelf: 'stretch',
    // The button sits at the foot of the card, whatever the title takes.
    marginTop: 'auto',
  },

  /* Seasonal ------------------------------------------------------------- */
  seasonalHead: {
    gap: spacing.xxs,
  },
  seasonalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    height: 34,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.pill,
    borderWidth: 1,
  },
  filterChipOn: {
    backgroundColor: brand.forest,
    borderColor: brand.forest,
  },
  filterChipOff: {
    backgroundColor: neutral.surface,
    borderColor: neutral.line2,
  },

  /* Pharmacies ----------------------------------------------------------- */
  pharmacyCard: {
    width: 268,
    // A floor, not a lid: the meta row can wrap on a narrow card.
    minHeight: 138,
    gap: spacing.md - 2,
    padding: spacing.md,
    borderRadius: radii.xxl,
    borderWidth: 1,
    borderColor: mint[200],
    backgroundColor: neutral.surface,
  },
  pharmacyTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md - 2,
  },
  pharmacyAvatar: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: mint[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  pharmacyInfo: {
    flex: 1,
    gap: spacing.xxs,
  },
  pharmacyMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
  },
  etaPill: {
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: spacing.xxs,
    borderRadius: radii.pill,
    backgroundColor: mint[100],
  },
  dashedDivider: {
    height: 1,
    borderTopWidth: 1,
    borderStyle: 'dashed',
    borderColor: neutral.line2,
  },
  perkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
  },
  perkText: {
    // The row gives way rather than pushing past the card edge.
    flexShrink: 1,
  },

  /* Care blocks ---------------------------------------------------------- */
  careBlock: {
    borderRadius: radii.huge,
    borderWidth: 1,
    borderColor: neutral.line,
    backgroundColor: neutral.surface,
    overflow: 'hidden',
  },
  careHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
  },
  careHeaderIcon: {
    width: 40,
    height: 40,
    borderRadius: radii.lg,
    backgroundColor: neutral.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  careHeaderInfo: {
    flex: 1,
    gap: spacing.xxs,
  },
  careBody: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  careGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },

  /* Lab tests + care corners --------------------------------------------- */
  labCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
  },
  labInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  labIcon: {
    width: 64,
    height: 64,
    borderRadius: radii.circle,
    backgroundColor: neutral.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  comingSoonTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.xs + 5,
    paddingVertical: spacing.xxs,
    borderRadius: radii.xs,
    backgroundColor: brand.forest,
  },
  careCornerList: {
    gap: spacing.md,
  },
  careCorner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md - 2,
    padding: spacing.lg,
    borderRadius: radii.xxl,
  },
  careCornerInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  careCornerLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    marginTop: spacing.xxs,
  },
  careCornerPhotos: {
    // The second photo overlaps the first, so the box has to be wide enough
    // to hold both of them.
    width: 135,
    height: 90,
  },
  careCornerPhoto: {
    position: 'absolute',
    top: 10,
    left: 0,
    borderWidth: 1,
    borderColor: mint[200],
    borderRadius: 11,
    overflow: 'hidden',
  },
  careCornerPhotoOverlap: {
    top: 4,
    left: 56,
  },

  /* Offers --------------------------------------------------------------- */
  offerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  prescriptionNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  prescriptionText: {
    flex: 1,
  },

  /* Partner + footer ----------------------------------------------------- */
  partnerCard: {
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: radii.xxl,
    backgroundColor: brand.forest,
  },
  partnerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    alignSelf: 'flex-start',
    height: 34,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.pill,
    backgroundColor: gold[300],
    marginTop: spacing.xs,
  },
  footer: {
    gap: spacing.md,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxl,
  },
  footerHeadline: {
    lineHeight: 46,
  },
  madeWith: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  footerLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  footerLink: {
    width: '48%',
  },
});
