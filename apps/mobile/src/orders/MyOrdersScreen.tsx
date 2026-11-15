import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  brand,
  mint,
  neutral,
  platformKey,
  radii,
  semantic,
  spacing,
} from '@medmate/theme';

import { Icon } from '../icons/Icon';
import { useOrders } from '../state/orders';
import { Text } from '../ui/Text';
import { Gradient } from '../ui/primitives';
import { useContentInset } from '../ui/layout';
import { BottomChrome } from '../shop/BottomChrome';
import { OrderCard, SegmentedControl } from './parts';
import {
  orderTabCounts,
  orderTabs,
  ordersInTab,
  ordersNote,
  type OrderTab,
} from './data';

const isAndroid = platformKey === 'android';

export type MyOrdersScreenProps = {
  onBack?: () => void;
  onHelp?: () => void;
  onTrack?: (orderId: string) => void;
  onCancel?: (orderId: string) => void;
  onVerify?: (orderId: string) => void;
  onTabPress?: (id: string) => void;
  onChatPress?: () => void;
};

/**
 * My orders.
 *
 * The Figma `04 Orders / My orders` frame is a large title over the order
 * counts, a segmented control that overlaps it, and the orders grouped by
 * month.
 */
export function MyOrdersScreen({
  onBack,
  onHelp,
  onTrack,
  onCancel,
  onVerify,
  onTabPress,
  onChatPress,
}: MyOrdersScreenProps) {
  const insets = useSafeAreaInsets();
  const inset = useContentInset();
  const store = useOrders();
  const [tab, setTab] = useState<OrderTab>('active');

  const counts = useMemo(() => orderTabCounts(store.orders), [store.orders]);
  const shown = useMemo(() => ordersInTab(store.orders, tab), [store.orders, tab]);

  const spent = useMemo(
    () =>
      store.orders
        .filter((order) => order.stage === 'delivered')
        .reduce((total, order) => total + order.lines.reduce((sum, line) => sum + line.price * line.quantity, 0), 0),
    [store.orders],
  );

  // The orders are grouped under the month they were placed in.
  const groups = useMemo(() => {
    const byMonth = new Map<string, typeof shown>();
    for (const order of shown) {
      const month = order.placedAt.includes(',')
        ? 'October 2026'
        : order.placedAt.split(' ')[0] + ' 2026';
      const bucket = byMonth.get(month) ?? [];
      bucket.push(order);
      byMonth.set(month, bucket);
    }
    return [...byMonth.entries()];
  }, [shown]);

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: insets.bottom + 110 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Brand zone ---------------------------------------------------- */}
        <Gradient token="brand" radius={radii.huge} style={styles.zone}>
          <View style={[styles.zoneInner, { paddingTop: insets.top }]}>
            <View style={[styles.navBar, { paddingHorizontal: inset }]}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Back to account"
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
                <Text variant="body" color={neutral.surface}>
                  Account
                </Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Help and support"
                onPress={onHelp}
                style={styles.help}
              >
                <Text variant="body" color={neutral.surface}>
                  Help
                </Text>
                <Icon name="bell" size={18} color={neutral.surface} />
              </Pressable>
            </View>

            <View style={[styles.titleRow, { paddingHorizontal: inset }]}>
              <Text variant="pharmacyTitle" color={neutral.surface}>
                My orders
              </Text>
            </View>

            <View style={[styles.stats, { paddingHorizontal: inset }]}>
              {[
                { value: String(counts.all), label: 'Orders' },
                { value: String(counts.active), label: 'Active' },
                { value: `₹${spent}`, label: 'Spent on delivered' },
              ].map((stat, index) => (
                <React.Fragment key={stat.label}>
                  {index > 0 ? <View style={styles.statRule} /> : null}
                  <View style={styles.stat}>
                    <Text variant="headlineMedium" color={neutral.surface}>
                      {stat.value}
                    </Text>
                    <Text variant="caption" color={mint[200]} numberOfLines={1}>
                      {stat.label}
                    </Text>
                  </View>
                </React.Fragment>
              ))}
            </View>
          </View>
        </Gradient>

        {/* The segmented control overlaps the zone. --------------------- */}
        <View style={[styles.overlap, { paddingHorizontal: inset }]}>
          <View style={styles.overlapCard}>
            <SegmentedControl
              tabs={orderTabs}
              active={tab}
              counts={counts}
              onChange={(id) => setTab(id as OrderTab)}
            />
          </View>
        </View>

        {/* The orders ---------------------------------------------------- */}
        <View style={[styles.content, { paddingHorizontal: inset }]}>
          {groups.length === 0 ? (
            <View style={styles.empty}>
              <Text variant="headline" color={semantic.textSecondary}>
                No orders here yet
              </Text>
              <Text variant="caption" color={semantic.textMuted}>
                Orders you place will show up on this screen.
              </Text>
            </View>
          ) : null}

          {groups.map(([month, list]) => (
            <View key={month} style={styles.group}>
              {/* The month label is on the light page, so it is the brand
                  green rather than the gold the brand zone uses. */}
              <Text variant="eyebrow" color={brand.green700}>
                {month}
              </Text>
              {list.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onTrack={() => onTrack?.(order.id)}
                  onCancel={() => onCancel?.(order.id)}
                  onVerify={() => onVerify?.(order.id)}
                  onHelp={onHelp}
                />
              ))}
            </View>
          ))}

          <View style={styles.noteRow}>
            <Icon name="shield" size={14} color={semantic.textMuted} />
            <Text variant="caption" color={semantic.textMuted} style={styles.noteText}>
              {ordersNote}
            </Text>
          </View>
        </View>
      </ScrollView>

      <BottomChrome active="" onTabPress={onTabPress} onChatPress={onChatPress} />
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
    paddingBottom: spacing.lg,
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
  help: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  titleRow: {
    height: 52,
    justifyContent: 'center',
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 74,
  },
  stat: {
    flex: 1,
    gap: 2,
  },
  statRule: {
    width: 1,
    height: 32,
    marginHorizontal: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  overlap: {
    marginTop: -spacing.xl,
  },
  overlapCard: {
    padding: spacing.sm,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: neutral.line,
    backgroundColor: neutral.surface,
  },
  content: {
    gap: spacing.lg,
    paddingTop: spacing.lg,
  },
  group: {
    gap: spacing.md,
  },
  empty: {
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xl,
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  noteText: {
    flex: 1,
  },
});
