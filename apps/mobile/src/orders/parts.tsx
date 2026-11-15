import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Switch, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  brand,
  gold,
  mint,
  neutral,
  radii,
  semantic,
  spacing,
  status,
} from '@medmate/theme';

import { Icon } from '../icons/Icon';
import { Text } from '../ui/Text';
import { ArtTile, Button } from '../ui/primitives';
import {
  orderSteps,
  orderStep,
  orderTotal,
  stageCopy,
  type AppNotification,
  type Order,
  type OrderStep,
} from './data';
import { orderPharmacy } from './data';

/**
 * The pieces the order screens share.
 *
 * They are drawn from the Figma `04 Orders` frames and they use the same
 * tokens as the rest of the app, so the orders sit in the same design
 * language as the shop and the checkout.
 */

/* -------------------------------------------------------------------------- */
/*  Controls                                                                  */
/* -------------------------------------------------------------------------- */

/** A tabbed control, e.g. Active / Delivered / Cancelled / All. */
export function SegmentedControl({
  tabs,
  active,
  counts,
  onChange,
}: {
  tabs: readonly { id: string; label: string }[];
  active: string;
  /** The number shown after each label. */
  counts?: Record<string, number>;
  onChange?: (id: string) => void;
}) {
  return (
    <View style={styles.segmentTrack}>
      {tabs.map((tab) => {
        const selected = tab.id === active;
        const count = counts?.[tab.id];
        return (
          <Pressable
            key={tab.id}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            onPress={() => onChange?.(tab.id)}
            style={({ pressed }) => [
              styles.segment,
              selected ? styles.segmentOn : null,
              pressed ? { opacity: 0.9 } : null,
            ]}
          >
            <Text
              variant="footnoteEmphasized"
              color={selected ? semantic.text : semantic.textSecondary}
              numberOfLines={1}
            >
              {count === undefined ? tab.label : `${tab.label} ${count}`}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*  Map                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * The map on the tracking screen.
 *
 * This is a placeholder. The Figma frame draws a flat stylised map, and this
 * reproduces its footprint with plain blocks: the pharmacy pin, the home pin
 * and the controls over it. When the backend arrives the blocks are replaced
 * by real tiles, so only this component changes.
 */
export function TrackMap({
  order,
  onBack,
  onHelp,
}: {
  order: Order;
  onBack?: () => void;
  onHelp?: () => void;
}) {
  const insets = useSafeAreaInsets();
  const pharmacy = orderPharmacy(order);

  return (
    <View style={styles.map}>
      {/* The flat blocks the design draws. */}
      <View style={[styles.mapBlock, styles.mapBase]} />
      <View style={[styles.mapBlock, styles.mapBandTop]} />
      <View style={[styles.mapBlock, styles.mapBandBottom]} />
      <View style={[styles.mapBlock, styles.mapRailLeft]} />
      <View style={[styles.mapBlock, styles.mapRailRight]} />
      <View style={[styles.mapBlock, styles.mapPark]} />
      <View style={[styles.mapBlock, styles.mapBlockA]} />
      <View style={[styles.mapBlock, styles.mapBlockB]} />
      <View style={[styles.mapBlock, styles.mapBlockC]} />

      {/* The pharmacy and the home. */}
      <View style={[styles.mapPin, styles.pharmacyPin]}>
        <Text variant="captionStrong" color={semantic.text}>
          {pharmacy.initials}
        </Text>
      </View>
      <View style={[styles.mapPin, styles.homePin]}>
        <Icon name="home" size={20} color={neutral.surface} />
      </View>

      {/* The controls over the map. */}
      <View style={[styles.mapControls, { top: insets.top + spacing.lg }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          onPress={onBack}
          style={({ pressed }) => [styles.mapButton, pressed ? { opacity: 0.85 } : null]}
        >
          <Icon name="chev-l" size={18} color={semantic.text} />
        </Pressable>

        <View style={styles.mapPill}>
          <View style={styles.liveDot} />
          <Text variant="footnoteEmphasized" color={semantic.text}>
            {`Live · #${order.id}`}
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Help"
          onPress={onHelp}
          style={({ pressed }) => [styles.mapPill, styles.mapHelp, pressed ? { opacity: 0.85 } : null]}
        >
          <Text variant="footnoteEmphasized" color={brand.green}>
            Help
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*  Stages                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * The four steps an order moves through.
 *
 * A step the order has reached is gold, one it has passed is forest, and one
 * it has not reached yet is grey.
 */
export function StageStepper({ stage }: { stage: Order['stage'] }) {
  const current = orderStep(stage);
  const [width, setWidth] = useState(0);

  // The four labels need 334pt between them, which is more than a narrow
  // screen has. Rather than cut the labels short, the stepper drops to the
  // circles and names the step the order is on underneath.
  const compact = width > 0 && width < 300;
  const currentStep = orderSteps.find((step) => step.id === current);

  return (
    <View
      style={styles.stageStepper}
      onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
    >
      <View style={styles.stageRow}>
        {orderSteps.map((step, index) => {
          const passed = isPassed(current, step.id);
          const reached = passed || step.id === current;
          const last = index === orderSteps.length - 1;

          return (
            <React.Fragment key={step.id}>
              <View style={[styles.stage, compact ? styles.stageCompact : null]}>
                <View
                  style={[
                    styles.stageCircle,
                    passed ? styles.stageCirclePassed : null,
                    reached && !passed ? styles.stageCircleReached : null,
                  ]}
                >
                  <Icon
                    name={step.icon}
                    size={14}
                    color={
                      reached ? (passed ? neutral.surface : brand.forest) : semantic.textMuted
                    }
                  />
                </View>
                {compact ? null : (
                  <Text
                    variant="captionStrong"
                    color={step.id === current ? semantic.text : semantic.textMuted}
                    numberOfLines={1}
                  >
                    {step.label}
                  </Text>
                )}
              </View>

              {last ? null : (
                <View style={styles.stageBar}>
                  <View
                    style={[
                      styles.stageBarLine,
                      passed ? styles.stageBarLineDone : null,
                    ]}
                  />
                </View>
              )}
            </React.Fragment>
          );
        })}
      </View>

      {compact ? (
        <Text variant="captionStrong" color={semantic.text} numberOfLines={1}>
          {`${currentStep?.label ?? ''} · step ${orderSteps.findIndex((step) => step.id === current) + 1} of ${orderSteps.length}`}
        </Text>
      ) : null}
    </View>
  );
}

/** Has the order got past this step? */
function isPassed(current: OrderStep, step: OrderStep): boolean {
  const order = orderSteps.map((entry) => entry.id);
  return order.indexOf(step) < order.indexOf(current);
}

/* -------------------------------------------------------------------------- */
/*  Order card                                                                */
/* -------------------------------------------------------------------------- */

/** The strip at the top of an order card that says where it has got to. */
export function LiveStrip({
  order,
  onTrack,
}: {
  order: Order;
  onTrack?: () => void;
}) {
  const copy = stageCopy[order.stage];
  const current = orderStep(order.stage);
  const index = orderSteps.findIndex((step) => step.id === current);

  return (
    <View style={styles.liveStrip}>
      <View style={styles.liveRow}>
        <View style={styles.liveDot} />
        <Text variant="buttonSmall" color={neutral.surface} numberOfLines={1} style={styles.liveTitle}>
          {order.stage === 'waiting' && order.rxNeeded ? 'Prescription needed' : copy.eyebrow}
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={onTrack}
          hitSlop={8}
          style={({ pressed }) => [styles.liveLink, pressed ? { opacity: 0.85 } : null]}
        >
          <Text variant="footnoteEmphasized" color={gold[300]}>
            Track
          </Text>
          <Icon name="chev-r" size={14} color={gold[300]} />
        </Pressable>
      </View>

      <View style={styles.progress}>
        {orderSteps.map((step, i) => (
          <View
            key={step.id}
            style={[
              styles.progressSegment,
              i <= index ? styles.progressSegmentDone : null,
            ]}
          />
        ))}
      </View>

      <Text variant="caption" color={mint[200]} numberOfLines={1}>
        {order.stage === 'waiting' && order.rxNeeded
          ? 'Verify by a doctor call or upload a prescription'
          : copy.body}
      </Text>
    </View>
  );
}

/** The card on the orders list. */
export function OrderCard({
  order,
  onTrack,
  onCancel,
  onVerify,
  onHelp,
}: {
  order: Order;
  onTrack?: () => void;
  onCancel?: () => void;
  onVerify?: () => void;
  onHelp?: () => void;
}) {
  const pharmacy = orderPharmacy(order);
  const total = orderTotal(order);
  const names = order.lines.map((line) => line.name).join(', ');

  return (
    <View style={styles.orderCard}>
      <LiveStrip order={order} onTrack={onTrack} />

      <View style={styles.orderBody}>
        <View style={styles.orderRow}>
          <ArtTile
            width={40}
            height={40}
            radius={radii.lg}
            initials={pharmacy.initials}
          />
          <View style={styles.orderStack}>
            <Text variant="buttonSmall" color={semantic.text} numberOfLines={1}>
              {pharmacy.name}
            </Text>
            <Text variant="caption" color={semantic.textMuted} numberOfLines={1}>
              {`#${order.id} · ${order.placedAt}`}
            </Text>
          </View>
        </View>

        <View style={styles.orderRow}>
          <View style={styles.orderThumbs}>
            {order.lines.slice(0, 3).map((line) => (
              <ArtTile
                key={line.id}
                width={40}
                height={40}
                radius={radii.lg}
                initials={line.initials}
              />
            ))}
          </View>
          <Text variant="caption" color={semantic.textMuted} numberOfLines={2} style={styles.orderNames}>
            {names}
          </Text>
        </View>

        {order.rxNeeded ? (
          <View style={styles.rxTag}>
            <Icon name="rx-doc" size={12} color={brand.green700} />
            <Text variant="tag" color={brand.green700}>
              Rx needed
            </Text>
          </View>
        ) : null}

        <View style={styles.dashed} />

        <View style={styles.orderRow}>
          <View style={styles.orderStack}>
            <Text variant="amount" color={semantic.text}>
              {`₹${total}`}
            </Text>
            <Text variant="caption" color={semantic.textMuted} numberOfLines={1}>
              {`${order.lines.length} items · ${order.payment} · ${order.speed}`}
            </Text>
          </View>
          <View style={styles.orderLinks}>
            <Pressable
              accessibilityRole="button"
              onPress={onHelp}
              style={styles.orderLink}
            >
              <Icon name="help" size={14} color={semantic.text} />
              <Text variant="footnoteEmphasized" color={semantic.text}>
                Help
              </Text>
            </Pressable>
            <Pressable accessibilityRole="button" onPress={onTrack} style={styles.orderLink}>
              <Icon name="rx-doc" size={14} color={semantic.text} />
              <Text variant="footnoteEmphasized" color={semantic.text}>
                Bill
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.orderButtons}>
          <Button
            label="Cancel"
            tone="outline"
            size="large"
            icon="x"
            chevron
            onPress={onCancel}
            style={styles.orderButton}
          />
          {order.rxNeeded ? (
            <Button
              label="Verify Rx"
              tone="filled"
              size="large"
              icon="rx-doc"
              chevron
              onPress={onVerify}
              style={styles.orderButton}
            />
          ) : (
            <Button
              label="Track order"
              tone="filled"
              size="large"
              icon="pin"
              chevron
              onPress={onTrack}
              style={styles.orderButton}
            />
          )}
        </View>
      </View>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*  Notifications                                                             */
/* -------------------------------------------------------------------------- */

/** The card that turns the alerts on. */
export function AlertsOffCard({
  onChange,
  value,
}: {
  value: boolean;
  onChange?: (value: boolean) => void;
}) {
  return (
    <View style={styles.alertsCard}>
      <View style={styles.alertsTile}>
        <Icon name="bell" size={20} color={neutral.surface} />
      </View>
      <View style={styles.alertsText}>
        <Text variant="buttonSmall" color={neutral.surface}>
          Alerts are off
        </Text>
        <Text variant="caption" color={mint[200]}>
          Turn on to hear when your order moves
        </Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        accessibilityLabel="Order alerts"
        trackColor={{ false: neutral.line2, true: brand.green }}
        thumbColor={neutral.surface}
      />
    </View>
  );
}

/** One notification. */
export function NotificationCard({
  notification,
  onPress,
}: {
  notification: AppNotification;
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.notification, pressed ? { opacity: 0.94 } : null]}
    >
      <View style={styles.notificationTile}>
        <View style={styles.notificationIcon}>
          <Icon name={notification.icon} size={20} color={neutral.surface} />
        </View>
        {notification.unread ? <View style={styles.unreadDot} /> : null}
      </View>

      <View style={styles.notificationBody}>
        <View style={styles.notificationHead}>
          <Text variant="buttonSmall" color={semantic.text} numberOfLines={2} style={styles.notificationTitle}>
            {notification.title}
          </Text>
          <Text variant="captionStrong" color={semantic.textMuted}>
            {notification.time}
          </Text>
        </View>
        <Text variant="caption" color={semantic.textMuted} numberOfLines={1}>
          {notification.body}
        </Text>
        {notification.action ? (
          <View style={styles.notificationLink}>
            <Text variant="footnoteEmphasized" color={semantic.text}>
              {notification.action}
            </Text>
            <Icon name="chev-r" size={14} color={semantic.text} />
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

/* -------------------------------------------------------------------------- */
/*  Cancel order                                                              */
/* -------------------------------------------------------------------------- */

/**
 * The alert that asks before an order is cancelled.
 *
 * The Figma frame puts it over the tracking screen, so it is a modal rather
 * than a sheet.
 */
export function CancelOrderDialog({
  visible,
  orderId,
  reason,
  onKeep,
  onCancel,
}: {
  visible: boolean;
  orderId: string;
  reason: string;
  onKeep?: () => void;
  onCancel?: () => void;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onKeep}
    >
      <View style={styles.scrim}>
        <View style={styles.alert} accessibilityViewIsModal accessibilityRole="alert">
          <View style={styles.alertContent}>
            <Text variant="headline" color={semantic.text}>
              {`Cancel order #${orderId}?`}
            </Text>
            <Text variant="footnote" color={semantic.textSecondary}>
              {reason}
            </Text>
          </View>

          <View style={styles.alertDivider} />

          <View style={styles.alertActions}>
            <Pressable
              accessibilityRole="button"
              onPress={onKeep}
              style={({ pressed }) => [styles.alertAction, pressed ? { opacity: 0.85 } : null]}
            >
              <Text variant="button" color={semantic.text}>
                Keep Order
              </Text>
            </Pressable>
            <View style={styles.alertRule} />
            <Pressable
              accessibilityRole="button"
              onPress={onCancel}
              style={({ pressed }) => [styles.alertAction, pressed ? { opacity: 0.85 } : null]}
            >
              <Text variant="button" color={semantic.danger}>
                Cancel Order
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

/* -------------------------------------------------------------------------- */
/*  Styles                                                                    */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  /* Controls ---------------------------------------------------------- */
  segmentTrack: {
    flexDirection: 'row',
    gap: spacing.xs,
    height: 32,
    // The segments are 28pt tall inside a 32pt track, so the track carries
    // 2pt of padding - any more and the labels sit outside it.
    padding: spacing.xxs,
    borderRadius: radii.md,
    backgroundColor: neutral.surface3,
  },
  segment: {
    flex: 1,
    height: 28,
    borderRadius: radii.xs + 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
  },
  segmentOn: {
    backgroundColor: neutral.surface,
  },

  /* Map ---------------------------------------------------------------- */
  map: {
    height: 426,
    overflow: 'hidden',
    backgroundColor: neutral.surface3,
  },
  mapBlock: {
    position: 'absolute',
  },
  mapBase: {
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: neutral.surface3,
  },
  mapBandTop: {
    left: 0,
    top: 94,
    right: 0,
    height: 43,
    backgroundColor: neutral.surface2,
  },
  mapBandBottom: {
    left: 0,
    top: 298,
    right: 0,
    height: 34,
    backgroundColor: neutral.surface2,
  },
  mapRailLeft: {
    left: 86,
    top: 0,
    width: 31,
    bottom: 0,
    backgroundColor: neutral.surface2,
  },
  mapRailRight: {
    left: 244,
    top: 0,
    width: 31,
    bottom: 0,
    backgroundColor: neutral.surface2,
  },
  mapPark: {
    left: 141,
    top: 153,
    width: 90,
    height: 70,
    borderRadius: radii.md,
    backgroundColor: mint[200],
  },
  mapBlockA: {
    left: 299,
    top: 179,
    width: 70,
    height: 90,
    borderRadius: radii.md,
    backgroundColor: neutral.line,
  },
  mapBlockB: {
    left: 20,
    top: 179,
    width: 56,
    height: 60,
    borderRadius: radii.md,
    backgroundColor: neutral.line,
  },
  mapBlockC: {
    left: 90,
    top: 99,
    width: 230,
    height: 207,
    borderRadius: radii.huge,
    backgroundColor: neutral.surface2,
  },
  mapPin: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pharmacyPin: {
    left: 150,
    top: 150,
    backgroundColor: neutral.surface,
    borderWidth: 1,
    borderColor: neutral.line,
  },
  homePin: {
    left: 96,
    top: 268,
    backgroundColor: brand.forest,
  },
  mapControls: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    // The controls sit below the status bar, the way the frame draws them.
    top: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  mapButton: {
    width: 40,
    height: 40,
    borderRadius: radii.circle,
    backgroundColor: neutral.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    height: 36,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    backgroundColor: neutral.surface,
  },
  mapHelp: {
    marginLeft: 'auto',
    paddingHorizontal: spacing.md,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: radii.circle,
    backgroundColor: status.red,
  },

  /* Stages -------------------------------------------------------------- */
  stageStepper: {
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: neutral.line,
    backgroundColor: neutral.surface,
  },
  stageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
  },
  stage: {
    width: 64,
    alignItems: 'center',
    gap: spacing.xs,
  },
  stageCompact: {
    flex: 1,
    width: undefined,
  },
  stageCircle: {
    width: 32,
    height: 32,
    borderRadius: radii.circle,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: neutral.surface3,
  },
  stageCircleReached: {
    backgroundColor: gold[300],
  },
  stageCirclePassed: {
    backgroundColor: brand.forest,
  },
  stageBar: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.md,
  },
  stageBarLine: {
    width: '100%',
    height: 2,
    backgroundColor: neutral.line2,
  },
  stageBarLineDone: {
    backgroundColor: brand.forest,
  },

  /* Order card --------------------------------------------------------- */
  orderCard: {
    borderRadius: radii.huge,
    borderWidth: 1,
    borderColor: neutral.line,
    backgroundColor: neutral.surface,
    overflow: 'hidden',
  },
  liveStrip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    backgroundColor: brand.forest,
  },
  liveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  liveTitle: {
    flex: 1,
  },
  liveLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  progress: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  progressSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: neutral.surface,
  },
  progressSegmentDone: {
    backgroundColor: gold[300],
  },
  orderBody: {
    padding: spacing.md,
    gap: spacing.md,
  },
  orderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  orderStack: {
    flex: 1,
    gap: 2,
  },
  orderThumbs: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  orderNames: {
    flex: 1,
  },
  rxTag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.xs,
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 1,
    borderRadius: radii.xs,
    backgroundColor: mint[100],
  },
  dashed: {
    flexDirection: 'row',
    gap: 4,
    height: 1,
    overflow: 'hidden',
  },
  orderLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  orderLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  orderButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  orderButton: {
    flex: 1,
  },

  /* Notifications ------------------------------------------------------ */
  alertsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.xl,
    backgroundColor: brand.forest,
  },
  alertsTile: {
    width: 40,
    height: 40,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  alertsText: {
    flex: 1,
    gap: 2,
  },
  notification: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: neutral.line,
    backgroundColor: neutral.surface,
  },
  notificationTile: {
    width: 40,
    height: 40,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: brand.forest,
  },
  unreadDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: radii.circle,
    backgroundColor: status.red,
    borderWidth: 2,
    borderColor: neutral.surface,
  },
  notificationBody: {
    flex: 1,
    gap: spacing.xs,
  },
  notificationHead: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  notificationTitle: {
    flex: 1,
  },
  notificationLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },

  /* Cancel order -------------------------------------------------------- */
  scrim: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: semantic.scrim,
  },
  alert: {
    width: 270,
    borderRadius: radii.lg + 2,
    backgroundColor: neutral.surface,
    overflow: 'hidden',
  },
  alertContent: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  alertDivider: {
    height: 1,
    backgroundColor: neutral.line2,
  },
  alertActions: {
    flexDirection: 'row',
    height: 44,
  },
  alertAction: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertRule: {
    width: 1,
    backgroundColor: neutral.line2,
  },
});
