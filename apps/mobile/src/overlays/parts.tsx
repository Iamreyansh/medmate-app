import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import {
  brand,
  neutral,
  radii,
  semantic,
  spacing,
} from '@medmate/theme';

import { Icon } from '../icons/Icon';
import { Text } from '../ui/Text';

/**
 * The pieces the overlays share.
 *
 * They are taken from the Figma `08 Overlays` section: the sort sheet, the
 * coupon sheet, the chat panel and the permission prompts.
 */

/** A sheet that slides up over the screen. */
export function Sheet({
  visible,
  title,
  onClose,
  children,
}: {
  visible: boolean;
  title: string;
  onClose?: () => void;
  children: React.ReactNode;
}) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.scrim}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close"
          onPress={onClose}
          accessible={false}
          importantForAccessibility="no"
          style={styles.scrimFill}
        />
        <View
          style={[styles.sheet, { paddingBottom: insets.bottom + spacing.xl }]}
          accessibilityViewIsModal
        >
          <View style={styles.grabber} />

          <View style={styles.sheetHead}>
            <Text variant="headline" color={semantic.text}>
              {title}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close"
              onPress={onClose}
              hitSlop={10}
              style={styles.close}
            >
              <Icon name="x" size={18} color={semantic.text} />
            </Pressable>
          </View>

          {children}
        </View>
      </View>
    </Modal>
  );
}

/**
 * The permission prompt.
 *
 * The Figma frames draw the iOS system alert over the screen that needs the
 * permission. The app asks for the same thing in its own words, so the
 * shopper sees why before the phone asks, and the answer is kept in the
 * session.
 */
export function PermissionPrompt({
  visible,
  title,
  body,
  onAllow,
  onDeny,
  middle,
}: {
  visible: boolean;
  /** The permission, e.g. `“MedMate” Would Like to Access the Camera`. */
  title: string;
  body: string;
  onAllow?: () => void;
  onDeny?: () => void;
  /** A third choice, the way iOS offers "Allow While Using App". */
  middle?: { label: string; onPress?: () => void };
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDeny}
    >
      <View style={styles.scrim}>
        <View style={styles.alert} accessibilityViewIsModal accessibilityRole="alert">
          <View style={styles.alertContent}>
            <Text variant="headline" color={semantic.text}>
              {title}
            </Text>
            <Text variant="footnote" color={semantic.text}>
              {body}
            </Text>
          </View>

          <View style={styles.alertDivider} />

          <View style={styles.alertActions}>
            <Pressable
              accessibilityRole="button"
              onPress={onDeny}
              style={({ pressed }) => [styles.alertAction, pressed ? { opacity: 0.85 } : null]}
            >
              <Text variant="body" color={brand.green}>
                Don’t Allow
              </Text>
            </Pressable>
            {middle ? (
              <>
                <View style={styles.alertRule} />
                <Pressable
                  accessibilityRole="button"
                  onPress={middle.onPress}
                  style={({ pressed }) => [styles.alertAction, pressed ? { opacity: 0.85 } : null]}
                >
                  <Text variant="body" color={brand.green}>
                    {middle.label}
                  </Text>
                </Pressable>
              </>
            ) : null}
            <View style={styles.alertRule} />
            <Pressable
              accessibilityRole="button"
              onPress={onAllow}
              style={({ pressed }) => [styles.alertAction, pressed ? { opacity: 0.85 } : null]}
            >
              <Text variant="button" color={brand.green}>
                {middle ? 'Allow Once' : 'Allow'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

/**
 * The permissions the app asks for.
 *
 * The Figma `08 Overlays` frames draw the system alert over the screen that
 * needs it. The app asks in its own words first, so the shopper knows why
 * before the phone does.
 */
export const permissionCopy: Record<
  'camera' | 'location' | 'notifications' | 'contacts',
  { title: string; body: string }
> = {
  camera: {
    title: '“MedMate” Would Like to Access the Camera',
    body: 'To photograph a prescription or video call a doctor. Nothing is recorded.',
  },
  location: {
    title: 'Allow “MedMate” to use your location?',
    body: 'To find pharmacies near you and fill in your address. Only while you use the app.',
  },
  notifications: {
    title: '“MedMate” Would Like to Send You Notifications',
    body: 'Notifications may include alerts, sounds and icon badges. These can be configured in Settings.',
  },
  contacts: {
    title: '“MedMate” Would Like to Access Your Contacts',
    body: 'You pick who to invite. Your address book is never uploaded.',
  },
};

const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: semantic.scrim,
  },
  scrimFill: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  sheet: {
    backgroundColor: neutral.surface,
    borderTopLeftRadius: radii.huge,
    borderTopRightRadius: radii.huge,
  },
  grabber: {
    alignSelf: 'center',
    width: 36,
    height: 5,
    borderRadius: 3,
    backgroundColor: neutral.line2,
    marginTop: spacing.sm,
  },
  sheetHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  close: {
    width: 32,
    height: 32,
    borderRadius: radii.circle,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: neutral.surface2,
  },

  /* The permission alert ------------------------------------------------- */
  alert: {
    width: 270,
    alignSelf: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
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
