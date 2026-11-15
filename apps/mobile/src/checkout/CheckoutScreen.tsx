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

import { catalogue } from '../data/catalogue';
import { offerCoupons } from '../data/pharmacy';
import { Icon } from '../icons/Icon';
import { useCart } from '../state/cart';
import { useCheckout } from '../state/checkout';
import { CouponSheet, type SheetCoupon } from '../overlays/CouponSheet';
import { Text } from '../ui/Text';
import { ArtTile, Button, EmptyState, Gradient } from '../ui/primitives';
import { useContentInset } from '../ui/layout';
import {
  AddOnCard,
  BillLine,
  CardRail,
  ChoiceTile,
  CheckoutSteps,
  CouponChip,
  DashedRule,
  FoldRow,
  IconTile,
  NoteRow,
  PharmacyOptionCard,
  QuantityStepper,
  SectionCard,
  StepBadge,
  TagPill,
} from './parts';
import {
  cashNote,
  checkoutCoupons,
  checkoutTotals,
  couponFootnote,
  deliverySpeeds,
  deliverySpeedNote,
  lineTotal,
  pharmacyMeta,
  pharmacyOptions,
  prescriptionChoices,
  prescriptionNote,
  savedAddress,
  unavailableChoices,
  unavailableNote,
} from './data';
import { useSeedBasket } from './useSeedBasket';

const isAndroid = platformKey === 'android';

/** The add-ons the frame puts under the basket. */
const ADD_ON_IDS = ['amrutanjan-cold-rub', 'hansaplast', 'gubb-cotton-balls'];

export type CheckoutScreenProps = {
  onBack?: () => void;
  onHelp?: () => void;
  onComparePharmacies?: () => void;
  onChangeAddress?: () => void;
  onAddItems?: () => void;
  onAddPrescription?: () => void;
  onPlaceOrder?: () => void;
  onInstructions?: () => void;
};

/**
 * The cart.
 *
 * The Figma `03 Checkout / Cart` frame is one long page of numbered
 * decisions: the medicines, where it goes, which pharmacy fills it, the
 * prescription, the speed, what happens if something is missing, the coupons,
 * the bill and the payment method. Each is a card, and the shopper works down
 * them.
 */
export function CheckoutScreen({
  onBack,
  onHelp,
  onComparePharmacies,
  onChangeAddress,
  onAddItems,
  onAddPrescription,
  onPlaceOrder,
  onInstructions,
}: CheckoutScreenProps) {
  const insets = useSafeAreaInsets();
  const inset = useContentInset();
  const cart = useCart();
  const checkout = useCheckout();

  // Open the screen with the basket the design is drawn with.
  useSeedBasket();

  const pharmacy =
    pharmacyOptions.find((option) => option.id === checkout.pharmacyId) ?? pharmacyOptions[0];
  const speed =
    deliverySpeeds.find((option) => option.id === checkout.speedId) ?? deliverySpeeds[1];

  const totals = useMemo(
    () =>
      checkoutTotals(cart.lines, {
        deliveryFee: pharmacy.deliveryFee,
        speedFee: speed.id === 'standard' ? 0 : speed.fee,
      }),
    [cart.lines, pharmacy.deliveryFee, speed.id, speed.fee],
  );

  const addOns = useMemo(
    () =>
      ADD_ON_IDS.map((id) => catalogue.find((item) => item.id === id)).filter(
        (item): item is NonNullable<typeof item> => Boolean(item),
      ),
    [],
  );

  const [couponsOpen, setCouponsOpen] = useState(false);
  const rxLines = cart.lines.filter((line) => line.rx);
  const paymentLabel =
    checkout.paymentId === 'cod' ? 'Cash' : checkout.paymentId === 'upi' ? 'UPI' : 'Card';

  // The label widths are the ones the Figma frame draws them at.
  /** The coupons the sheet offers, in the shape the sheet draws them. */
  const sheetCoupons: SheetCoupon[] = useMemo(
    () =>
      offerCoupons.map((coupon) => ({
        id: coupon.id,
        stub: coupon.big,
        stubLabel: coupon.unit,
        code: coupon.code,
        title: coupon.title,
        body: coupon.requirement,
        saving:
          coupon.id === 'medmate25'
            ? 'Save ₹27 · on health products only'
            : coupon.id === 'flat50'
              ? 'Add ₹291 more of health products. Prescription medicines don’t count.'
              : 'Delivery is already ₹0 on this order',
        best: coupon.best,
        applied: checkout.couponId === coupon.id,
      })),
    [checkout.couponId],
  );

  const steps = [
    { id: 'cart', label: 'Cart', labelWidth: 27, done: totals.products > 0 },
    { id: 'pharmacy', label: 'Pharmacy', labelWidth: 61, done: totals.products > 0 },
    { id: 'rx', label: 'Rx', labelWidth: 15 },
    { id: 'pay', label: 'Pay', labelWidth: 23 },
  ];

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: insets.bottom + 170 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Brand zone */}
        <Gradient token="brand" radius={radii.huge} style={styles.zone}>
          <View style={[styles.zoneInner, { paddingTop: insets.top }]}>
            {/* Nav bar */}
            <View style={[styles.navBar, { paddingHorizontal: inset }]}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Back"
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
                {/* The design says "Product" because the frame was drawn from
                    a product page. The cart is reached from the shop. */}
                <Text variant="body" color={neutral.surface}>
                  Shop
                </Text>
              </Pressable>
              <Text variant="storeNavTitle" color={neutral.surface}>
                Checkout
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

            {/* Zone content */}
            <View style={[styles.zoneContent, { paddingHorizontal: inset }]}>
              <Text variant="caption" color={mint[200]}>
                {`${totals.products} items · ${pharmacy.name}`}
              </Text>
              <CheckoutSteps steps={steps} />
            </View>
          </View>
        </Gradient>

        <View style={[styles.content, { paddingHorizontal: inset }]}>
          {cart.lines.length === 0 ? (
            <View style={styles.empty}>
              <EmptyState
                title="Your basket is empty"
                body="Add a medicine and it will show up here, ready to check out."
                icon="bag"
              />
              <Button
                label="Browse medicines"
                tone="outline"
                onPress={onAddItems}
                style={styles.emptyButton}
              />
            </View>
          ) : null}

          {/* 1 · Your medicines ------------------------------------------- */}
          <SectionCard>
            <View style={styles.cardHead}>
              <View style={styles.headTitle}>
                <StepBadge number={1} />
                <Text variant="headline" color={semantic.text}>
                  Your medicines
                </Text>
              </View>
              <Pressable
                accessibilityRole="button"
                onPress={onAddItems}
                style={({ pressed }) => [styles.headLink, pressed ? { opacity: 0.8 } : null]}
              >
                <Icon name="plus" size={16} color={semantic.text} />
                <Text variant="footnoteEmphasized" color={semantic.text}>
                  Add items
                </Text>
              </Pressable>
            </View>

            {cart.lines.map((line, index) => (
              <View key={line.id}>
                {index > 0 ? <View style={styles.divider} /> : null}
                <View style={styles.line}>
                  <ArtTile
                    width={56}
                    height={56}
                    radius={radii.lg}
                    initials={line.initials}
                  />
                  <View style={styles.lineText}>
                    <View style={styles.lineTitle}>
                      <Text
                        variant="subheadlineEmphasized"
                        color={semantic.text}
                        numberOfLines={2}
                        style={styles.lineName}
                      >
                        {line.name}
                      </Text>
                      {line.rx ? <TagPill label="Rx" tone="muted" /> : null}
                    </View>
                    <Text variant="caption" color={semantic.textMuted} numberOfLines={1}>
                      {line.sub}
                    </Text>
                    <View style={styles.linePrice}>
                      <Text variant="price" color={semantic.text}>
                        {`₹${lineTotal(line)}`}
                      </Text>
                      {!line.rx && line.mrp ? (
                        <>
                          <Text variant="caption" color={semantic.textMuted} style={styles.mrp}>
                            {`₹${line.mrp * line.quantity}`}
                          </Text>
                          <Text variant="caption" color={semantic.savings}>
                            {`${line.off ?? 0}% off`}
                          </Text>
                        </>
                      ) : null}
                      {line.quantity > 1 ? (
                        <Text variant="caption" color={semantic.textMuted}>
                          {`· ₹${line.price} each`}
                        </Text>
                      ) : null}
                    </View>
                    {line.rx ? (
                      <View style={styles.rxRow}>
                        <TagPill label="Prescription needed" />
                        <Pressable
                          accessibilityRole="button"
                          onPress={onAddPrescription}
                          hitSlop={6}
                        >
                          <Text variant="footnoteEmphasized" color={semantic.text}>
                            Add prescription
                          </Text>
                        </Pressable>
                      </View>
                    ) : null}
                  </View>
                  <QuantityStepper
                    quantity={line.quantity}
                    onChange={(quantity) => cart.setQuantity(line.id, quantity)}
                  />
                </View>
              </View>
            ))}

            <NoteRow icon="shield">
              {`Prices set by ${pharmacy.name}; packed by its registered pharmacist.`}
            </NoteRow>
          </SectionCard>

          {/* Add before you check out -------------------------------------- */}
          <View style={styles.section}>
            <Text variant="buttonSmall" color={semantic.text}>
              Add before you check out
            </Text>
            <CardRail>
              {addOns.map((product) => (
                <AddOnCard
                  key={product.id}
                  name={product.name}
                  price={`₹${product.price}`}
                  initials={product.name.slice(0, 2).toUpperCase()}
                />
              ))}
            </CardRail>
          </View>

          {/* 2 · Deliver to ------------------------------------------------ */}
          <SectionCard>
            <View style={styles.cardHead}>
              <View style={styles.headTitle}>
                <StepBadge number={2} />
                <Text variant="headline" color={semantic.text}>
                  Deliver to
                </Text>
              </View>
              <Pressable
                accessibilityRole="button"
                onPress={onChangeAddress}
                hitSlop={6}
              >
                <Text variant="footnoteEmphasized" color={semantic.text}>
                  Change
                </Text>
              </Pressable>
            </View>

            <View style={styles.addressRow}>
              <IconTile name={savedAddress.icon} size={20} box={40} radius={radii.lg} />
              <View style={styles.addressText}>
                <Text variant="subheadlineEmphasized" color={semantic.text}>
                  {savedAddress.label}
                </Text>
                <Text variant="caption" color={semantic.textMuted} numberOfLines={2}>
                  {checkout.address}
                </Text>
              </View>
            </View>

            <View style={styles.plainRow}>
              <Icon name="user" size={14} color={semantic.textMuted} />
              <Text variant="caption" color={semantic.textMuted} style={styles.plainText}>
                {`Receiver: ${savedAddress.receiver} · ${savedAddress.phone}`}
              </Text>
            </View>

            <View style={styles.divider} />

            <Pressable
              accessibilityRole="button"
              onPress={onInstructions}
              style={({ pressed }) => [styles.plainRow, pressed ? { opacity: 0.85 } : null]}
            >
              <Icon name="edit" size={14} color={semantic.textMuted} />
              <Text variant="footnoteEmphasized" color={semantic.text} style={styles.plainText}>
                Add instructions for the rider
              </Text>
              <Icon name="chev-d" size={16} color={semantic.textMuted} />
            </Pressable>
          </SectionCard>

          {/* 3 · Choose your pharmacy --------------------------------------- */}
          <View style={styles.section}>
            <View style={styles.cardHead}>
              <View style={styles.headTitle}>
                <StepBadge number={3} />
                <Text variant="headline" color={semantic.text}>
                  Choose your pharmacy
                </Text>
              </View>
              <Pressable
                accessibilityRole="button"
                onPress={onComparePharmacies}
                hitSlop={6}
                style={({ pressed }) => [styles.headLink, pressed ? { opacity: 0.8 } : null]}
              >
                <Text variant="footnoteEmphasized" color={semantic.text}>
                  Sort &amp; compare
                </Text>
                <Icon name="chev-r" size={14} color={semantic.text} />
              </Pressable>
            </View>

            <Text variant="caption" color={semantic.textMuted}>
              Totals include offers, delivery and the ₹5 handling charge. Lowest first.
            </Text>

            {pharmacyOptions.slice(0, 3).map((option) => {
              const optionTotals = checkoutTotals(cart.lines, {
                deliveryFee: option.deliveryFee,
              });
              return (
                <PharmacyOptionCard
                  key={option.id}
                  option={option}
                  selected={option.id === pharmacy.id}
                  total={`₹${optionTotals.total}`}
                  meta={pharmacyMeta(option)}
                  onPress={() => checkout.setPharmacyId(option.id)}
                />
              );
            })}

            <Pressable
              accessibilityRole="button"
              onPress={onComparePharmacies}
              style={({ pressed }) => [styles.compareRow, pressed ? { opacity: 0.85 } : null]}
            >
              <Text variant="footnoteEmphasized" color={semantic.text}>
                Compare prices by shop
              </Text>
            </Pressable>
          </View>

          {/* 4 · Your prescription ------------------------------------------ */}
          <SectionCard style={styles.prescriptionCard}>
            <View style={styles.headTitle}>
              <StepBadge number={4} />
              <Text variant="headline" color={semantic.text}>
                Your prescription
              </Text>
            </View>

            <View style={styles.rxHead}>
              <View style={styles.rxTile}>
                <Text variant="titleLargeMedium" color={brand.green700}>
                  Rx
                </Text>
              </View>
              <View style={styles.rxHeadText}>
                <Text variant="headline" color={semantic.text}>
                  You need a prescription
                </Text>
                <Text variant="caption" color={semantic.textMuted}>
                  {`for ${rxLines.length} medicine${rxLines.length === 1 ? '' : 's'} in your cart`}
                </Text>
              </View>
            </View>

            <View style={styles.rxOptions}>
              {prescriptionChoices.map((choice) => {
                const selected = choice.id === checkout.prescriptionId;
                return (
                  <Pressable
                    key={choice.id}
                    accessibilityRole="radio"
                    accessibilityState={{ selected }}
                    onPress={() => checkout.setPrescriptionId(choice.id)}
                    style={({ pressed }) => [
                      styles.rxOption,
                      selected ? styles.rxOptionOn : null,
                      pressed ? { opacity: 0.92 } : null,
                    ]}
                  >
                    <View style={styles.rxOptionHead}>
                      <IconTile name={choice.icon} size={18} box={36} radius={radii.mdPlus} />
                      <View style={styles.rxRadio}>
                        <View
                          style={[
                            styles.radio,
                            selected ? styles.radioOn : null,
                          ]}
                        >
                          {selected ? (
                            <Icon name="check" size={12} color={neutral.surface} />
                          ) : null}
                        </View>
                      </View>
                    </View>
                    <Text variant="caption" color={semantic.textMuted}>
                      {choice.eyebrow}
                    </Text>
                    <Text variant="buttonSmall" color={semantic.text}>
                      {choice.title}
                    </Text>
                    <Text variant="caption" color={semantic.textMuted} numberOfLines={2}>
                      {choice.body}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <NoteRow icon="phone" tone="muted">
              {prescriptionNote}
            </NoteRow>
          </SectionCard>

          {/* 5 · Delivery speed --------------------------------------------- */}
          <SectionCard>
            <View style={styles.headTitle}>
              <StepBadge number={5} />
              <Text variant="headline" color={semantic.text}>
                Delivery speed
              </Text>
            </View>

            <View style={styles.choiceRow}>
              {deliverySpeeds.map((option) => {
                const selected = option.id === checkout.speedId;
                return (
                  <Pressable
                    key={option.id}
                    accessibilityRole="radio"
                    accessibilityState={{ selected }}
                    onPress={() => checkout.setSpeedId(option.id)}
                    style={({ pressed }) => [
                      styles.speed,
                      selected ? styles.speedOn : null,
                      pressed ? { opacity: 0.92 } : null,
                    ]}
                  >
                    <Icon
                      name={option.icon}
                      size={20}
                      color={selected ? brand.green700 : semantic.textMuted}
                    />
                    <Text variant="buttonSmall" color={semantic.text} numberOfLines={1}>
                      {option.label}
                    </Text>
                    <Text variant="caption" color={semantic.textMuted} numberOfLines={1}>
                      {option.eta}
                    </Text>
                    <Text variant="footnoteEmphasized" color={semantic.text}>
                      {option.fee === 0 ? '₹0' : `₹${option.fee}`}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text variant="caption" color={semantic.textMuted}>
              {deliverySpeedNote}
            </Text>
          </SectionCard>

          {/* If an item is unavailable --------------------------------------- */}
          <SectionCard>
            <Text variant="headline" color={semantic.text}>
              If an item is unavailable
            </Text>
            <View style={styles.choiceRow}>
              {unavailableChoices.map((option) => (
                <ChoiceTile
                  key={option.id}
                  label={option.label}
                  icon={option.icon}
                  selected={option.id === checkout.unavailableId}
                  onPress={() => checkout.setUnavailableId(option.id)}
                />
              ))}
            </View>
            <Text variant="caption" color={semantic.textMuted}>
              {unavailableNote}
            </Text>
          </SectionCard>

          {/* Offers and coupons --------------------------------------------- */}
          <SectionCard>
            <View style={styles.cardHead}>
              <Text variant="headline" color={semantic.text}>
                Offers and coupons
              </Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => setCouponsOpen(true)}
                style={styles.headLink}
              >
                <Text variant="footnoteEmphasized" color={semantic.text}>
                  View all
                </Text>
                <Icon name="chev-r" size={14} color={semantic.text} />
              </Pressable>
            </View>

            <CardRail>
              {checkoutCoupons.map((coupon) => (
                <CouponChip
                  key={coupon.id}
                  code={coupon.code}
                  body={coupon.body}
                  best={coupon.best}
                  onPress={() =>
                    checkout.setCouponId(
                      checkout.couponId === coupon.id ? undefined : coupon.id,
                    )
                  }
                />
              ))}
            </CardRail>

            <Text variant="caption" color={semantic.textMuted}>
              {couponFootnote}
            </Text>
          </SectionCard>

          {/* 6 · Check your bill -------------------------------------------- */}
          <SectionCard>
            <View style={styles.headTitle}>
              <StepBadge number={6} />
              <Text variant="headline" color={semantic.text}>
                Check your bill
              </Text>
            </View>

            <BillLine
              icon="bag"
              label={`Medicines (${totals.products} items)`}
              value={`₹${totals.items}`}
            />
            <BillLine
              icon="scooter"
              label={`Delivery · ${speed.label}`}
              value={totals.delivery === 0 ? 'No delivery fee' : `₹${totals.delivery}`}
            />
            <BillLine icon="box" label="Handling charge" value={`₹${totals.handling}`} />

            <DashedRule />

            <View style={styles.totalRow}>
              <Text variant="headline" color={semantic.text} style={styles.billLabel}>
                To pay
              </Text>
              <Text variant="amount" color={semantic.text}>
                {`₹${totals.total}`}
              </Text>
            </View>

            <View style={styles.savingsRow}>
              <Icon name="tag" size={16} color={semantic.savings} />
              <Text variant="caption" color={semantic.textSecondary}>
                {`You save ₹${totals.saving} on health products`}
              </Text>
            </View>

            <FoldRow label="Item-wise bill and licence" />
            <FoldRow label="What do these charges mean?" />
          </SectionCard>

          {/* 7 · Payment method --------------------------------------------- */}
          <SectionCard>
            <View style={styles.headTitle}>
              <StepBadge number={7} />
              <Text variant="headline" color={semantic.text}>
                Payment method
              </Text>
            </View>

            <View style={styles.choiceRow}>
              {[
                { id: 'cod', label: 'Cash on delivery', icon: 'cash' as const },
                { id: 'upi', label: 'UPI', icon: 'upi' as const, badge: 'Soon' },
                { id: 'card', label: 'Card', icon: 'card' as const, badge: 'Soon' },
              ].map((option) => (
                <ChoiceTile
                  key={option.id}
                  label={option.label}
                  icon={option.icon}
                  badge={option.badge}
                  selected={option.id === checkout.paymentId}
                  onPress={() => checkout.setPaymentId(option.id)}
                />
              ))}
            </View>

            <NoteRow icon="cash">{cashNote(totals.total)}</NoteRow>
          </SectionCard>

          {/* Policy ---------------------------------------------------------- */}
          <SectionCard>
            <View style={styles.policyRow}>
              <Icon name="shield" size={16} color={semantic.textMuted} />
              <Text variant="caption" color={semantic.textMuted} style={styles.policyText}>
                Prescription medicines go out only after a pharmacist verifies your
                prescription. The pharmacy confirms your items next, and you see any change
                before it applies. Cancel free until packing starts.
              </Text>
            </View>
            <FoldRow label="Cancellation, refunds and payments" />
          </SectionCard>
        </View>
      </ScrollView>

      {/* Bottom bar ------------------------------------------------------- */}
      <CouponSheet
        visible={couponsOpen}
        coupons={sheetCoupons}
        onClose={() => setCouponsOpen(false)}
        onApply={(id) => checkout.setCouponId(id)}
      />

      <View style={[styles.actionBar, { paddingBottom: insets.bottom + spacing.sm }]}>
        <View style={[styles.actionInner, { paddingHorizontal: inset }]}>
          <Pressable
            accessibilityRole="button"
            onPress={onChangeAddress}
            style={({ pressed }) => [styles.deliveringRow, pressed ? { opacity: 0.85 } : null]}
          >
            <Icon name="pin" size={14} color={semantic.textMuted} />
            <Text variant="caption" color={semantic.textMuted} numberOfLines={1} style={styles.deliveringText}>
              {`Delivering to ${savedAddress.label} · ${pharmacy.eta} · ${checkout.instructions}`}
            </Text>
            <Icon name="chev-r" size={14} color={semantic.textMuted} />
          </Pressable>

          <View style={styles.actionRow}>
            <View style={styles.totalStack}>
              <Text variant="captionStrong" color={semantic.textMuted}>
                {`To pay · ${paymentLabel}`}
              </Text>
              <Text variant="amount" color={semantic.text}>
                {`₹${totals.total}`}
              </Text>
              <Text variant="captionStrong" color={semantic.savings}>
                {`Saving ₹${totals.saving}`}
              </Text>
            </View>
            <Button
              label="Place order"
              tone="filled"
              size="large"
              icon="bag"
              chevron
              onPress={onPlaceOrder}
              style={styles.placeOrder}
            />
          </View>

          <Text variant="caption" color={semantic.textMuted}>
            A doctor calls after you order, or upload a prescription later
          </Text>
        </View>
      </View>
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
    paddingBottom: spacing.md,
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
    gap: spacing.sm,
    paddingTop: spacing.sm,
  },
  content: {
    gap: spacing.lg,
    paddingTop: spacing.lg,
  },
  section: {
    gap: spacing.md,
  },
  empty: {
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xl,
  },
  emptyButton: {
    paddingHorizontal: spacing.xl,
  },

  /* Cards -------------------------------------------------------------- */
  cardHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  headTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  headLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: neutral.line,
  },

  /* Basket lines ------------------------------------------------------- */
  line: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  lineText: {
    flex: 1,
    gap: 2,
  },
  lineTitle: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
  },
  lineName: {
    flex: 1,
  },
  linePrice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    flexWrap: 'wrap',
  },
  mrp: {
    textDecorationLine: 'line-through',
  },
  rxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.xs,
  },

  /* Address ------------------------------------------------------------ */
  addressRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  addressText: {
    flex: 1,
    gap: 2,
  },
  plainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  plainText: {
    flex: 1,
  },

  /* Pharmacy ----------------------------------------------------------- */
  compareRow: {
    height: 44,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: neutral.line,
    backgroundColor: neutral.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Prescription ------------------------------------------------------- */
  prescriptionCard: {
    borderRadius: radii.xxl,
  },
  rxHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  rxTile: {
    width: 44,
    height: 44,
    borderRadius: radii.lg,
    backgroundColor: mint[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  rxHeadText: {
    flex: 1,
    gap: 2,
  },
  rxOptions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  rxOption: {
    flex: 1,
    gap: spacing.xs,
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: neutral.line,
    backgroundColor: neutral.surface,
  },
  rxOptionOn: {
    borderColor: brand.green700,
    backgroundColor: mint[50],
  },
  rxOptionHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  rxRadio: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: radii.circle,
    borderWidth: 1.5,
    borderColor: neutral.line2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOn: {
    backgroundColor: brand.green700,
    borderColor: brand.green700,
  },

  /* Choices ------------------------------------------------------------ */
  choiceRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  speed: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: neutral.line,
    backgroundColor: neutral.surface,
  },
  speedOn: {
    borderColor: brand.green700,
    backgroundColor: mint[50],
  },

  /* Bill --------------------------------------------------------------- */
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  billLabel: {
    flex: 1,
  },
  savingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.md,
    backgroundColor: gold[50],
  },
  policyRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  policyText: {
    flex: 1,
  },

  /* Bottom bar --------------------------------------------------------- */
  actionBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: neutral.surface,
    borderTopWidth: 1,
    borderTopColor: neutral.line,
  },
  actionInner: {
    gap: spacing.sm,
    paddingTop: spacing.md,
  },
  deliveringRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  deliveringText: {
    flex: 1,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  totalStack: {
    gap: 2,
  },
  placeOrder: {
    flex: 1,
  },
});
