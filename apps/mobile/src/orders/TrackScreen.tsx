import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  brand,
  mint,
  neutral,
  radii,
  semantic,
  spacing,
} from '@medmate/theme';

import { Icon } from '../icons/Icon';
import { useOrders } from '../state/orders';
import { Text } from '../ui/Text';
import { ArtTile, Button } from '../ui/primitives';
import { useContentInset } from '../ui/layout';
import { CancelOrderDialog, StageStepper, TrackMap } from './parts';
import {
  cancelReason,
  orderPharmacy,
  orderTotal,
  stageCopy,
  trackingNote,
  whenItArrives,
} from './data';

export type TrackScreenProps = {
  orderId?: string;
  onBack?: () => void;
  onHelp?: () => void;
  onCancel?: (orderId: string) => void;
  onConfirmCancel?: (orderId: string) => void;
  onItems?: () => void;
  onHome?: () => void;
};

/**
 * Track an order.
 *
 * The Figma draws this four times - waiting, on the way, late and cancelled -
 * but the frames are the same screen with a different order in it: the map is
 * the same and the panel below it says where the order has got to. So this
 * is one screen driven by the order's stage.
 */
export function TrackScreen({
  orderId,
  onBack,
  onHelp,
  onCancel,
  onConfirmCancel,
  onItems,
  onHome,
}: TrackScreenProps) {
  const insets = useSafeAreaInsets();
  const inset = useContentInset();
  const store = useOrders();
  const [confirming, setConfirming] = useState(false);

  const order = useMemo(
    () =>
      store.orders.find((entry) => entry.id === orderId) ?? store.orders[0],
    [store.orders, orderId],
  );

  if (!order) return null;

  const pharmacy = orderPharmacy(order);
  const copy = stageCopy[order.stage];
  const total = orderTotal(order);

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xl }}
        showsVerticalScrollIndicator={false}
      >
        {/* The map ------------------------------------------------------- */}
        <TrackMap order={order} onBack={onBack} onHelp={onHelp} />

        {/* The panel ----------------------------------------------------- */}
        <View style={[styles.panel, { paddingHorizontal: inset }]}>
          <View style={styles.grabber}>
            <View style={styles.grabBar} />
          </View>

          <View style={styles.header}>
            <Text variant="eyebrow" color={brand.green700}>
              {copy.eyebrow}
            </Text>
            <Text variant="orderHeadline" color={brand.forest}>
              {copy.headline}
            </Text>
            <Text variant="footnote" color={semantic.textSecondary}>
              {copy.body}
            </Text>
          </View>

          <StageStepper stage={order.stage} />

          {/* What is happening now. */}
          <View style={styles.statusCard}>
            <View style={styles.statusIcon}>
              <Icon name={copy.status.icon} size={20} color={brand.green700} />
            </View>
            <View style={styles.statusText}>
              <Text variant="buttonSmall" color={semantic.text}>
                {copy.status.title}
              </Text>
              <Text variant="caption" color={semantic.textMuted}>
                {copy.status.body}
              </Text>
              <Text variant="caption" color={brand.green700}>
                {copy.status.meta}
              </Text>
            </View>
          </View>

          {/* Where it comes from, who dispenses it and where it goes. */}
          <View style={styles.rows}>
            <View style={styles.row}>
              <ArtTile
                width={36}
                height={36}
                radius={radii.mdPlus}
                initials={pharmacy.initials}
              />
              <View style={styles.rowText}>
                <Text variant="caption" color={semantic.textMuted}>
                  Pickup
                </Text>
                <Text variant="buttonSmall" color={semantic.text} numberOfLines={1}>
                  {pharmacy.name}
                </Text>
              </View>
              <Text variant="footnoteEmphasized" color={brand.green}>
                Store
              </Text>
            </View>

            <View style={styles.separator} />

            <View style={styles.row}>
              <View style={styles.rowIcon}>
                <Icon name="shield" size={18} color={brand.green700} />
              </View>
              <View style={styles.rowText}>
                <Text variant="footnoteEmphasized" color={semantic.text} numberOfLines={2}>
                  {`Drug licence ${pharmacy.licence ?? 'KA-BLR-20B/21B 118744'}`}
                </Text>
                <Text variant="caption" color={semantic.textMuted} numberOfLines={2}>
                  {`Registered pharmacist ${pharmacy.pharmacist ?? 'Meena Rao'} · Reg. KSPC 41208`}
                </Text>
              </View>
            </View>

            <View style={styles.separator} />

            <View style={styles.row}>
              <View style={styles.rowIcon}>
                <Icon name="home" size={18} color={brand.green700} />
              </View>
              <View style={styles.rowText}>
                <Text variant="footnoteEmphasized" color={semantic.text}>
                  Deliver to · Home
                </Text>
                <Text variant="caption" color={semantic.textMuted} numberOfLines={2}>
                  {order.address}
                </Text>
                <Text variant="caption" color={semantic.textMuted}>
                  {`${order.receiver} · ${order.phone}`}
                </Text>
              </View>
            </View>

            <View style={styles.separator} />

            <View style={styles.row}>
              <View style={styles.rowIcon}>
                <Icon name="id" size={18} color={brand.green700} />
              </View>
              <View style={styles.rowText}>
                <Text variant="caption" color={semantic.textMuted}>
                  {`Order number · placed ${order.placedAt.replace('Today, ', '')}`}
                </Text>
                <Text variant="footnoteEmphasized" color={semantic.text}>
                  {`#${order.id}`}
                </Text>
              </View>
              <Pressable accessibilityRole="button" hitSlop={8}>
                <Text variant="footnoteEmphasized" color={brand.green}>
                  Copy
                </Text>
              </Pressable>
            </View>
          </View>

          {/* What is in the order. */}
          <Pressable
            accessibilityRole="button"
            onPress={onItems}
            style={({ pressed }) => [styles.itemsRow, pressed ? { opacity: 0.92 } : null]}
          >
            <View style={styles.itemsThumbs}>
              {order.lines.slice(0, 3).map((line) => (
                <ArtTile
                  key={line.id}
                  width={36}
                  height={36}
                  radius={radii.lg}
                  initials={line.initials}
                />
              ))}
            </View>
            <View style={styles.itemsText}>
              <Text variant="buttonSmall" color={semantic.text}>
                {`${order.lines.length} items · ₹${total}`}
              </Text>
              <Text variant="caption" color={semantic.textMuted} numberOfLines={1}>
                {`${order.payment} · ${order.speed}`}
              </Text>
            </View>
            <Icon name="chev-d" size={16} color={semantic.textMuted} />
          </Pressable>

          {/* What to check when it arrives. */}
          <View style={styles.arrives}>
            <View style={styles.arrivesHead}>
              <Icon name="shield" size={16} color={semantic.text} />
              <Text variant="buttonSmall" color={semantic.text}>
                When it arrives
              </Text>
            </View>
            {whenItArrives.map((line) => (
              <View key={line} style={styles.arrivesLine}>
                <Icon name="check" size={16} color={brand.green700} />
                <Text variant="footnote" color={semantic.textSecondary} style={styles.arrivesText}>
                  {line}
                </Text>
              </View>
            ))}
          </View>

          {/* Help. */}
          <Pressable
            accessibilityRole="button"
            onPress={onHelp}
            style={({ pressed }) => [styles.helpRow, pressed ? { opacity: 0.92 } : null]}
          >
            <View style={styles.rowIcon}>
              <Icon name="help" size={18} color={brand.green700} />
            </View>
            <View style={styles.rowText}>
              <Text variant="buttonSmall" color={semantic.text}>
                Something not right?
              </Text>
              <Text variant="caption" color={semantic.textMuted} numberOfLines={2}>
                Missing or wrong item, broken seal, late order, payment
              </Text>
            </View>
            <Icon name="chev-r" size={16} color={semantic.textMuted} />
          </Pressable>

          {/* The actions. */}
          <View style={styles.actions}>
            {order.stage === 'cancelled' ? null : (
              <Button
                label="Cancel order"
                tone="outline"
                size="large"
                icon="x"
                chevron
                onPress={() => setConfirming(true)}
                style={styles.action}
              />
            )}
            <Button
              label="Back to home"
              tone="filled"
              size="large"
              icon="home"
              chevron
              onPress={onHome}
              style={styles.action}
            />
          </View>

          <Text variant="caption" color={semantic.textMuted}>
            {trackingNote}
          </Text>
        </View>
      </ScrollView>

      <CancelOrderDialog
        visible={confirming}
        orderId={order.id}
        reason={cancelReason(order, total)}
        onKeep={() => setConfirming(false)}
        onCancel={() => {
          setConfirming(false);
          onCancel?.(order.id);
          onConfirmCancel?.(order.id);
        }}
      />
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
  panel: {
    gap: spacing.md,
    paddingTop: spacing.md,
  },
  grabber: {
    alignItems: 'center',
  },
  grabBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: neutral.line2,
  },
  header: {
    gap: spacing.xs,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: neutral.line,
    backgroundColor: neutral.surface,
  },
  statusIcon: {
    width: 44,
    height: 44,
    borderRadius: radii.circle,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: mint[100],
  },
  statusText: {
    flex: 1,
    gap: 2,
  },
  rows: {
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: neutral.line,
    backgroundColor: neutral.surface,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: radii.mdPlus,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: mint[100],
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  separator: {
    height: 1,
    marginLeft: 60,
    backgroundColor: neutral.line,
  },
  itemsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: neutral.line,
    backgroundColor: neutral.surface,
  },
  itemsThumbs: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  itemsText: {
    flex: 1,
    gap: 2,
  },
  arrives: {
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: neutral.line,
    backgroundColor: neutral.surface,
  },
  arrivesHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  arrivesLine: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  arrivesText: {
    flex: 1,
  },
  helpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: neutral.line,
    backgroundColor: neutral.surface,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  action: {
    flex: 1,
    // The two actions sit side by side, so they need less padding than the
    // full width buttons to keep their labels on one line.
    paddingHorizontal: spacing.md,
  },
});
