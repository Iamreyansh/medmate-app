import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  brand,
  gold,
  mint,
  neutral,
  radii,
  semantic,
  spacing,
} from '@medmate/theme';

import { Icon } from '../icons/Icon';
import { useCart } from '../state/cart';
import { useCheckout } from '../state/checkout';
import { Text } from '../ui/Text';
import { ArtTile, Button, Gradient } from '../ui/primitives';
import { useContentInset } from '../ui/layout';
import { BillLine, DashedRule, IconTile, NoteRow, TagPill } from './parts';
import {
  checkoutTotals,
  lineTotal,
  pharmacyOptions,
  savedAddress,
} from './data';
import { useSeedBasket } from './useSeedBasket';

/** The order number the confirmation carries. */
const ORDER_ID = 'MM-20341';

export type PaymentSuccessScreenProps = {
  onTrackOrder?: () => void;
  onDoctorCall?: () => void;
  onHelp?: () => void;
  onTurnOnUpdates?: () => void;
};

/**
 * The order confirmation.
 *
 * The Figma `03 Checkout / Payment success` frame is the last step of the
 * checkout. It opens on a green panel with the amount, then a card that
 * overlaps it with the order, the arrival time and the one step still to
 * do, and below that what happens next and the full bill.
 */
export function PaymentSuccessScreen({
  onTrackOrder,
  onDoctorCall,
  onHelp,
  onTurnOnUpdates,
}: PaymentSuccessScreenProps) {
  const insets = useSafeAreaInsets();
  const inset = useContentInset();
  const cart = useCart();
  const checkout = useCheckout();
  useSeedBasket();

  const pharmacy =
    pharmacyOptions.find((option) => option.id === checkout.pharmacyId) ?? pharmacyOptions[0];

  const totals = useMemo(
    () => checkoutTotals(cart.lines, { deliveryFee: pharmacy.deliveryFee }),
    [cart.lines, pharmacy.deliveryFee],
  );

  const paymentLabel =
    checkout.paymentId === 'cod'
      ? 'Cash on Delivery'
      : checkout.paymentId === 'upi'
        ? 'UPI'
        : 'Card';

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: insets.bottom + 150 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero ---------------------------------------------------------- */}
        <Gradient token="brand" radius={radii.huge} style={styles.hero}>
          <View style={[styles.heroInner, { paddingTop: insets.top + spacing.lg }]}>
            <View style={styles.tick}>
              <View style={styles.tickInner}>
                <Icon name="check" size={32} color={brand.forest} strokeWidth={2.4} />
              </View>
            </View>
            <Text variant="eyebrow" color={gold[300]}>
              Order placed
            </Text>
            <Text variant="displayPrice" color={neutral.surface}>
              {`₹${totals.total}`}
            </Text>
            <Text variant="caption" color={mint[200]}>
              {`${paymentLabel} · pay when it arrives · placed 30 Oct, 4:12 pm`}
            </Text>
          </View>
        </Gradient>

        {/* The card that overlaps the hero -------------------------------- */}
        <View style={[styles.overlapWrap, { paddingHorizontal: inset }]}>
          <View style={styles.overlapCard}>
            <View style={styles.orderHead}>
              <ArtTile
                width={40}
                height={40}
                radius={radii.lg}
                initials={pharmacy.initials}
              />
              <View style={styles.orderHeadText}>
                <View style={styles.orderIdRow}>
                  <Text variant="buttonSmall" color={semantic.text}>
                    {`Order #${ORDER_ID}`}
                  </Text>
                  {cart.lines.some((line) => line.rx) ? (
                    <Icon name="rx-doc" size={14} color={semantic.textMuted} />
                  ) : null}
                </View>
                <Text variant="caption" color={semantic.textMuted}>
                  {`${totals.products} items · ${pharmacy.name}`}
                </Text>
              </View>
              <TagPill label="Placed" tone="mint" />
            </View>

            <View style={styles.thumbs}>
              {cart.lines.map((line) => (
                <ArtTile
                  key={line.id}
                  width={44}
                  height={44}
                  radius={radii.lg}
                  initials={line.initials}
                />
              ))}
            </View>

            <View style={styles.arriving}>
              <Icon name="bolt" size={18} color={gold[300]} />
              <View style={styles.arrivingText}>
                <Text variant="buttonSmall" color={semantic.text}>
                  {`Arriving in ${pharmacy.eta}`}
                </Text>
                <Text variant="caption" color={semantic.textMuted}>
                  Standard delivery · starts once your prescription is verified
                </Text>
              </View>
              <Pressable
                accessibilityRole="button"
                onPress={onTrackOrder}
                hitSlop={8}
                style={styles.trackLink}
              >
                <Text variant="footnoteEmphasized" color={semantic.text}>
                  Track
                </Text>
                <Icon name="chev-r" size={14} color={semantic.text} />
              </Pressable>
            </View>

            <View style={styles.oneMoreStep}>
              <View style={styles.oneMoreHead}>
                <IconTile name="steth" size={16} box={32} radius={radii.md} />
                <Text variant="buttonSmall" color={semantic.text} style={styles.oneMoreTitle}>
                  One more step: verify your prescription
                </Text>
              </View>
              <Text variant="caption" color={semantic.textMuted}>
                Need a consultation? Talk to a registered doctor, or upload a prescription
                you already have. The doctor decides independently whether a prescription is
                right for you.
              </Text>
              <Pressable accessibilityRole="button" onPress={onDoctorCall} hitSlop={6}>
                <Text variant="footnoteEmphasized" color={semantic.text}>
                  Or upload a prescription instead
                </Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Content ------------------------------------------------------- */}
        <View style={[styles.content, { paddingHorizontal: inset }]}>
          {/* What happens next */}
          <View style={styles.card}>
            <Text variant="headline" color={semantic.text}>
              What happens next
            </Text>
            {[
              {
                icon: 'steth' as const,
                title: 'Your prescription is verified',
                body: 'By a pharmacist check, or a registered doctor after a call',
              },
              {
                icon: 'box' as const,
                title: 'Packed and checked',
                body: 'The pharmacy packs prescription medicines once that is done',
              },
              {
                icon: 'scooter' as const,
                title: 'On its way',
                body: 'A rider brings it to your door',
              },
            ].map((step) => (
              <View key={step.title} style={styles.nextRow}>
                <IconTile name={step.icon} size={18} box={36} radius={radii.mdPlus} />
                <View style={styles.nextText}>
                  <Text variant="subheadlineEmphasized" color={semantic.text}>
                    {step.title}
                  </Text>
                  <Text variant="caption" color={semantic.textMuted}>
                    {step.body}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Order details */}
          <View style={styles.card}>
            <Text variant="headline" color={semantic.text}>
              Order details
            </Text>

            {cart.lines.map((line) => (
              <View key={line.id} style={styles.orderLine}>
                <ArtTile
                  width={40}
                  height={40}
                  radius={radii.md}
                  initials={line.initials}
                />
                <View style={styles.orderLineText}>
                  <View style={styles.orderLineTitle}>
                    <Text
                      variant="footnoteEmphasized"
                      color={semantic.text}
                      numberOfLines={1}
                      style={styles.orderLineName}
                    >
                      {line.name}
                    </Text>
                    {line.rx ? <TagPill label="Rx" tone="muted" /> : null}
                  </View>
                  <Text variant="caption" color={semantic.textMuted}>
                    {`Qty ${line.quantity}`}
                  </Text>
                </View>
                <Text variant="footnoteEmphasized" color={semantic.text}>
                  {`₹${lineTotal(line)}`}
                </Text>
              </View>
            ))}

            <View style={styles.divider} />

            <BillLine label="Item total" value={`₹${totals.items}`} />
            <BillLine
              label="Delivery · Standard"
              value={totals.delivery === 0 ? 'No delivery fee' : `₹${totals.delivery}`}
            />
            <BillLine label="Handling charge" value={`₹${totals.handling}`} />

            <DashedRule />

            <View style={styles.totalRow}>
              <Text variant="headline" color={semantic.text} style={styles.totalLabel}>
                To pay on delivery
              </Text>
              <Text variant="amount" color={semantic.text}>
                {`₹${totals.total}`}
              </Text>
            </View>

            <NoteRow icon="cash" tone="muted">
              {`Keep ₹${totals.total} ready for the rider.`}
            </NoteRow>

            <View style={styles.detailRow}>
              <Text variant="caption" color={semantic.textMuted}>
                Deliver to
              </Text>
              <Text variant="caption" color={semantic.textSecondary}>
                {`${savedAddress.label} · ${checkout.address} · ${savedAddress.receiver}`}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text variant="caption" color={semantic.textMuted}>
                Instructions
              </Text>
              <Text variant="caption" color={semantic.textSecondary}>
                {`${checkout.instructions} · If unavailable: call me first`}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text variant="caption" color={semantic.textMuted}>
                Sold by
              </Text>
              <Text variant="caption" color={semantic.textSecondary}>
                {`${pharmacy.name} · ${pharmacy.area} · Drug licence ${pharmacy.licence ?? 'KA-BLR-20B/21B 118744'} · Pharmacist ${pharmacy.pharmacist ?? 'Meena Rao (KSPC 41208)'}`}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text variant="caption" color={semantic.textMuted}>
                Payment
              </Text>
              <Text variant="caption" color={semantic.textSecondary}>
                {paymentLabel}
              </Text>
            </View>
          </View>

          {/* The reward */}
          <View style={styles.reward}>
            <IconTile name="gift" size={20} box={40} radius={radii.lg} />
            <View style={styles.rewardText}>
              <Text variant="buttonSmall" color={semantic.text}>
                You earned ₹15 MedMate Money
              </Text>
              <Text variant="caption" color={semantic.textMuted}>
                Wallet balance ₹15
              </Text>
            </View>
          </View>

          {/* Cancellation and help */}
          <View style={styles.card}>
            <Text variant="headline" color={semantic.text}>
              Cancellation and help
            </Text>
            <Text variant="caption" color={semantic.textSecondary}>
              You can cancel free of charge until the pharmacy starts packing, from the
              tracking screen. Any MedMate Money used goes back to your wallet.
            </Text>
            <View style={styles.helpRow}>
              <Pressable
                accessibilityRole="button"
                onPress={onHelp}
                style={({ pressed }) => [
                  styles.helpChip,
                  pressed ? { opacity: 0.9 } : null,
                ]}
              >
                <Text variant="buttonSmall" color={semantic.text}>
                  Help centre
                </Text>
              </Pressable>
              <Pressable accessibilityRole="button" onPress={onHelp} hitSlop={6}>
                <Text variant="footnoteEmphasized" color={semantic.text}>
                  Refund policy
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Live updates */}
          <Pressable
            accessibilityRole="button"
            onPress={onTurnOnUpdates}
            style={({ pressed }) => [styles.updates, pressed ? { opacity: 0.92 } : null]}
          >
            <IconTile name="bell" size={20} box={40} radius={radii.lg} />
            <View style={styles.updatesText}>
              <Text variant="buttonSmall" color={semantic.text}>
                Get live order updates
              </Text>
              <Text variant="caption" color={semantic.textMuted}>
                Know when your order is packed and on the way
              </Text>
            </View>
            <Text variant="footnoteEmphasized" color={semantic.text}>
              Turn on
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Action bar ------------------------------------------------------ */}
      <View style={[styles.actionBar, { paddingBottom: insets.bottom + spacing.sm }]}>
        <View style={[styles.actionInner, { paddingHorizontal: inset }]}>
          <Button
            label="Request a doctor call"
            tone="forest"
            size="large"
            icon="steth"
            chevron
            onPress={onDoctorCall}
          />
          <Button
            label="Track order"
            tone="filled"
            size="large"
            icon="pin"
            chevron
            onPress={onTrackOrder}
          />
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
  hero: {
    borderBottomLeftRadius: radii.huge,
    borderBottomRightRadius: radii.huge,
    overflow: 'hidden',
  },
  heroInner: {
    alignItems: 'center',
    gap: spacing.xs,
    paddingBottom: spacing.huge,
  },
  tick: {
    width: 96,
    height: 96,
    borderRadius: radii.circle,
    backgroundColor: gold[300],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  tickInner: {
    width: 72,
    height: 72,
    borderRadius: radii.circle,
    backgroundColor: neutral.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* The overlapping card ------------------------------------------------ */
  overlapWrap: {
    marginTop: -spacing.huge + spacing.sm,
  },
  overlapCard: {
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: neutral.line,
    backgroundColor: neutral.surface,
  },
  orderHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  orderHeadText: {
    flex: 1,
    gap: 2,
  },
  orderIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  thumbs: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  arriving: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.lg,
    backgroundColor: mint[50],
  },
  arrivingText: {
    flex: 1,
    gap: 2,
  },
  trackLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  oneMoreStep: {
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radii.lg,
    backgroundColor: neutral.surface2,
  },
  oneMoreHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  oneMoreTitle: {
    flex: 1,
  },

  /* Content ------------------------------------------------------------- */
  content: {
    gap: spacing.lg,
    paddingTop: spacing.lg,
  },
  card: {
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: neutral.line,
    backgroundColor: neutral.surface,
  },
  nextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  nextText: {
    flex: 1,
    gap: 2,
  },
  orderLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  orderLineText: {
    flex: 1,
    gap: 2,
  },
  orderLineTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  orderLineName: {
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: neutral.line,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  totalLabel: {
    flex: 1,
  },
  detailRow: {
    gap: 2,
  },
  reward: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: gold[200],
    backgroundColor: gold[50],
  },
  rewardText: {
    flex: 1,
    gap: 2,
  },
  helpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  helpChip: {
    height: 34,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: neutral.line,
    backgroundColor: neutral.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  updates: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: neutral.line,
    backgroundColor: neutral.surface,
  },
  updatesText: {
    flex: 1,
    gap: 2,
  },

  /* Action bar ---------------------------------------------------------- */
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
});
