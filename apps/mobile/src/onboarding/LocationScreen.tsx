import React, { useMemo, useState } from 'react';
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
import { Text } from '../ui/Text';
import { Button, Gradient } from '../ui/primitives';
import { useContentInset } from '../ui/layout';
import { PermissionPrompt, permissionCopy } from '../overlays/parts';
import { useSession } from '../state/session';
import { DetectRow, DeliveringHereTag, Wordmark } from './parts';
import {
  addAddress,
  detectLocation,
  locationBody,
  locationHeading,
  locationNote,
  savedAddressesLabel,
} from './data';

export type LocationScreenProps = {
  onBack?: () => void;
  onHelp?: () => void;
  /** Fired when the shopper asks to use their location. */
  onDetect?: () => void;
  /** Fired when the shopper adds another address. */
  onAddAddress?: () => void;
  /** Fired when the shopper confirms where the order goes. */
  onDeliver?: (addressId: string) => void;
};

/**
 * Where the order goes.
 *
 * The Figma `01 Onboarding / Location` frame: the saved addresses with the
 * one the order goes to marked, and the action that confirms it.
 */
export function LocationScreen({
  onBack,
  onHelp,
  onDetect,
  onAddAddress,
  onDeliver,
}: LocationScreenProps) {
  const insets = useSafeAreaInsets();
  const inset = useContentInset();
  const session = useSession();
  const [asking, setAsking] = useState(false);

  const chosen = useMemo(
    () => session.addresses.find((address) => address.id === session.addressId),
    [session.addresses, session.addressId],
  );

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: insets.bottom + 110 }}
        showsVerticalScrollIndicator={false}
      >
        {/* The brand zone */}
        <Gradient token="brand" radius={radii.huge} style={styles.zone}>
          <View style={[styles.zoneInner, { paddingTop: insets.top }]}>
            <View style={[styles.navBar, { paddingHorizontal: inset }]}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Back"
                onPress={onBack}
                hitSlop={10}
                style={styles.navBack}
              >
                <Icon name="chev-l" size={20} color={neutral.surface} strokeWidth={2.2} />
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Help and support"
                onPress={onHelp}
                style={styles.navHelp}
              >
                <Text variant="body" color={gold[300]}>
                  Help
                </Text>
                <Icon name="bell" size={18} color={neutral.surface} />
              </Pressable>
            </View>

            <View style={[styles.zoneBody, { paddingHorizontal: inset }]}>
              <Wordmark size="small" />
              <Text variant="headlineMedium" color={neutral.surface}>
                {locationHeading}
              </Text>
              <Text variant="footnote" color={mint[200]}>
                {locationBody}
              </Text>
            </View>
          </View>
        </Gradient>

        <View style={[styles.content, { paddingHorizontal: inset }]}>
          <DetectRow
            title={detectLocation.title}
            body={detectLocation.body}
            action={detectLocation.action}
            onPress={() => setAsking(true)}
          />

          <Text variant="eyebrow" color={brand.green700}>
            {savedAddressesLabel(session.addresses.length)}
          </Text>

          {session.addresses.map((address) => {
            const selected = address.id === session.addressId;
            return (
              <Pressable
                key={address.id}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                onPress={() => session.setAddressId(address.id)}
                style={({ pressed }) => [
                  styles.address,
                  selected ? styles.addressOn : null,
                  pressed ? { opacity: 0.92 } : null,
                ]}
              >
                <View style={styles.addressIcon}>
                  <Icon
                    name={address.label === 'Work' ? 'briefcase' : 'home'}
                    size={20}
                    color={brand.green700}
                  />
                </View>
                <View style={styles.addressText}>
                  <View style={styles.addressHead}>
                    <Text variant="subheadline" color={semantic.text}>
                      {address.label}
                    </Text>
                    {address.deliveringHere ? <DeliveringHereTag /> : null}
                  </View>
                  <Text variant="caption" color={semantic.textSecondary}>
                    {address.line}
                  </Text>
                  <Text variant="caption" color={semantic.textMuted}>
                    {`${address.receiver} · ${address.phone}`}
                  </Text>
                </View>
                <View style={styles.addressRadio}>
                  {selected ? (
                    <Icon name="check" size={12} color={neutral.surface} />
                  ) : null}
                </View>
              </Pressable>
            );
          })}

          <Pressable
            accessibilityRole="button"
            onPress={onAddAddress}
            style={({ pressed }) => [styles.addAddress, pressed ? { opacity: 0.9 } : null]}
          >
            <Icon name="plus" size={16} color={brand.green} />
            <Text variant="buttonSmall" color={brand.green}>
              {addAddress}
            </Text>
          </Pressable>

          <View style={styles.note}>
            <Icon name="info" size={16} color={semantic.textMuted} />
            <Text variant="footnote" color={semantic.textSecondary} style={styles.noteText}>
              {locationNote}
            </Text>
          </View>
        </View>
      </ScrollView>

      <PermissionPrompt
        visible={asking}
        title={permissionCopy.location.title}
        body={permissionCopy.location.body}
        onAllow={() => {
          setAsking(false);
          onDetect?.();
        }}
        onDeny={() => setAsking(false)}
      />

      <View style={[styles.actionBar, { paddingBottom: insets.bottom + spacing.sm }]}>
        <View style={[styles.actionInner, { paddingHorizontal: inset }]}>
          <Button
            label={`Deliver to ${chosen?.label ?? 'Home'}`}
            tone="filled"
            size="large"
            icon="home"
            chevron
            onPress={() => onDeliver?.(session.addressId)}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: semantic.page },
  scroll: { flex: 1 },
  zone: {
    borderBottomLeftRadius: radii.huge,
    borderBottomRightRadius: radii.huge,
    overflow: 'hidden',
  },
  zoneInner: { paddingBottom: spacing.lg },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
  },
  navBack: { width: 32, height: 32, justifyContent: 'center' },
  navHelp: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  zoneBody: { gap: spacing.sm, paddingTop: spacing.md },
  content: { gap: spacing.md, paddingTop: spacing.lg },
  address: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: neutral.line,
    backgroundColor: neutral.surface,
  },
  addressOn: {
    borderColor: brand.green700,
    borderWidth: 1.5,
  },
  addressIcon: {
    width: 40,
    height: 40,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: mint[100],
  },
  addressText: { flex: 1, gap: 2 },
  addressHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  addressRadio: {
    width: 22,
    height: 22,
    borderRadius: radii.circle,
    borderWidth: 1.5,
    borderColor: neutral.line2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addAddress: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: 48,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: neutral.line,
  },
  note: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  noteText: { flex: 1 },
  actionBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: neutral.surface,
    borderTopWidth: 1,
    borderTopColor: neutral.line,
  },
  actionInner: { paddingTop: spacing.md },
});
