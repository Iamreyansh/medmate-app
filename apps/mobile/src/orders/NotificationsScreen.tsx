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
import { AlertsOffCard, NotificationCard, SegmentedControl } from './parts';
import {
  notificationTabCounts,
  notificationTabs,
  notificationsInTab,
  notificationsNote,
  type NotificationTab,
} from './data';

const isAndroid = platformKey === 'android';

export type NotificationsScreenProps = {
  onBack?: () => void;
  onMarkAllRead?: () => void;
  onOpen?: (orderId: string) => void;
};

/**
 * Notifications.
 *
 * The Figma `04 Orders / Notifications` frame is a large title over the count
 * of new updates, a segmented control that overlaps it, and the alerts that
 * are switched on or off.
 */
export function NotificationsScreen({
  onBack,
  onMarkAllRead,
  onOpen,
}: NotificationsScreenProps) {
  const insets = useSafeAreaInsets();
  const inset = useContentInset();
  const store = useOrders();
  const [tab, setTab] = useState<NotificationTab>('all');

  const counts = useMemo(
    () => notificationTabCounts(store.notifications),
    [store.notifications],
  );
  const shown = useMemo(
    () => notificationsInTab(store.notifications, tab),
    [store.notifications, tab],
  );
  const unread = store.notifications.filter((item) => item.unread).length;

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xl }}
        showsVerticalScrollIndicator={false}
      >
        {/* Brand zone ---------------------------------------------------- */}
        <Gradient token="brand" radius={radii.huge} style={styles.zone}>
          <View style={[styles.zoneInner, { paddingTop: insets.top }]}>
            <View style={[styles.navBar, { paddingHorizontal: inset }]}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Back to home"
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
                  Home
                </Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={onMarkAllRead ?? store.markAllRead}
                style={styles.help}
              >
                <Text variant="body" color={neutral.surface}>
                  Mark all read
                </Text>
                <Icon name="bell" size={18} color={neutral.surface} />
              </Pressable>
            </View>

            <View style={[styles.titleRow, { paddingHorizontal: inset }]}>
              <Text variant="pharmacyTitle" color={neutral.surface}>
                Notifications
              </Text>
            </View>

            <View style={[styles.zoneContent, { paddingHorizontal: inset }]}>
              <Text variant="headlineMedium" color={neutral.surface}>
                {`${unread} new update${unread === 1 ? '' : 's'}`}
              </Text>
              <Text variant="footnote" color={mint[200]}>
                Your orders, prescriptions and medicine reminders
              </Text>
            </View>
          </View>
        </Gradient>

        {/* The segmented control overlaps the zone. --------------------- */}
        <View style={[styles.overlap, { paddingHorizontal: inset }]}>
          <View style={styles.overlapCard}>
            <SegmentedControl
              tabs={notificationTabs}
              active={tab}
              counts={counts}
              onChange={(id) => setTab(id as NotificationTab)}
            />
          </View>
        </View>

        {/* The notifications --------------------------------------------- */}
        <View style={[styles.content, { paddingHorizontal: inset }]}>
          <AlertsOffCard
            value={store.alertsOn}
            onChange={store.setAlertsOn}
          />

          {shown.length === 0 ? (
            <View style={styles.empty}>
              <Text variant="headline" color={semantic.textSecondary}>
                Nothing here yet
              </Text>
              <Text variant="caption" color={semantic.textMuted}>
                Updates about your orders and prescriptions show up here.
              </Text>
            </View>
          ) : (
            <>
              <Text variant="eyebrow" color={brand.green700}>
                Today
              </Text>
              {shown.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onPress={() =>
                    notification.orderId ? onOpen?.(notification.orderId) : undefined
                  }
                />
              ))}
            </>
          )}

          <View style={styles.noteRow}>
            <Icon name="check" size={14} color={semantic.textMuted} />
            <Text variant="caption" color={semantic.textMuted}>
              That’s everything for now
            </Text>
          </View>

          <View style={styles.noteRow}>
            <Icon name="info" size={14} color={semantic.textMuted} />
            <Text variant="caption" color={semantic.textMuted} style={styles.noteText}>
              {notificationsNote}
            </Text>
          </View>
        </View>
      </ScrollView>
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
    // The segmented control overlaps the zone, so the zone keeps enough
    // padding for the line of copy above it to stay clear of it.
    paddingBottom: spacing.xxl,
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
  zoneContent: {
    gap: spacing.xs,
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
    gap: spacing.md,
    paddingTop: spacing.lg,
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
