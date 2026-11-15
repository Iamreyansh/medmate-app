import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
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
import { PromiseStrip, Wordmark } from './parts';
import { codeNotice, loginBody, loginHeading, packPhotos } from './data';

export type LoginScreenProps = {
  onBack?: () => void;
  onHelp?: () => void;
  /** Fired when the shopper asks for a code. */
  onGetCode?: (phone: string) => void;
};

/**
 * Log in or sign up.
 *
 * The Figma `01 Onboarding / Login` frame: the brand zone with the wordmark
 * and the three promises, and the sheet that slides over it with the mobile
 * number field.
 */
export function LoginScreen({ onBack, onHelp, onGetCode }: LoginScreenProps) {
  const insets = useSafeAreaInsets();
  const inset = useContentInset();
  const [number, setNumber] = useState('98450 12345');

  const phone = `+91 ${number}`;
  const valid = number.replace(/\D/g, '').length >= 10;

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xl }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* The brand zone */}
        <Gradient token="brand" radius={0} style={styles.zone}>
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
              <Wordmark size="large" />

              {/* The pack of products the zone shows. */}
              <View style={styles.packs}>
                {packPhotos.map((photo) => (
                  <View
                    key={photo.id}
                    style={[
                      styles.pack,
                      {
                        width: photo.size,
                        height: photo.size,
                        left: photo.x,
                        top: photo.y,
                      },
                    ]}
                  >
                    <View style={styles.packInner}>
                      <Text variant="titleLarge" color={brand.green700}>
                        {photo.name.slice(0, 2).toUpperCase()}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>

              <PromiseStrip />
            </View>
          </View>
        </Gradient>

        {/* The login sheet */}
        <View style={[styles.sheet, { paddingHorizontal: inset }]}>
          <Text variant="headlineMedium" color={semantic.text}>
            {loginHeading}
          </Text>
          <Text variant="subheadline" color={semantic.textMuted}>
            {loginBody}
          </Text>

          <View style={styles.field}>
            <Text variant="footnoteEmphasized" color={semantic.textSecondary}>
              Mobile number
            </Text>
            <View style={styles.fieldBox}>
              <Text variant="subheadline" color={semantic.text}>
                +91
              </Text>
              <View style={styles.fieldRule} />
              <TextInput
                value={number}
                onChangeText={setNumber}
                keyboardType="phone-pad"
                placeholder="98450 12345"
                placeholderTextColor={semantic.textFaint}
                style={styles.fieldInput}
                accessibilityLabel="Mobile number"
              />
              {valid ? (
                <Icon name="check" size={20} color={brand.green} />
              ) : null}
            </View>
          </View>

          <Text variant="caption" color={brand.green700}>
            {codeNotice(phone)}
          </Text>

          <Button
            label="Get code"
            tone="filled"
            size="large"
            icon="chev-r"
            onPress={() => onGetCode?.(phone)}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: neutral.surface },
  scroll: { flex: 1 },
  zone: { overflow: 'hidden' },
  zoneInner: {
    // The sheet that slides over the zone covers the bottom 20pt of it, so
    // the zone keeps enough padding for the last line to stay clear.
    paddingBottom: 28,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
  },
  navBack: { width: 32, height: 32, justifyContent: 'center' },
  navHelp: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  zoneBody: { gap: spacing.lg, paddingTop: spacing.sm },
  packs: {
    position: 'relative',
    width: 300,
    height: 150,
    marginLeft: 31,
  },
  pack: {
    position: 'absolute',
    borderRadius: 22,
    backgroundColor: mint[50],
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  packInner: {
    width: '78%',
    height: '78%',
    borderRadius: 18,
    backgroundColor: mint[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheet: {
    marginTop: -spacing.xl,
    paddingTop: spacing.xl,
    gap: spacing.md,
    borderTopLeftRadius: radii.huge,
    borderTopRightRadius: radii.huge,
    backgroundColor: neutral.surface,
  },
  field: { gap: spacing.xs },
  fieldBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    height: 48,
    paddingHorizontal: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: neutral.line2,
    backgroundColor: neutral.surface,
  },
  fieldRule: { width: 1, height: 22, backgroundColor: neutral.line2 },
  fieldInput: {
    flex: 1,
    fontSize: 17,
    lineHeight: 22,
    color: neutral.ink,
    paddingVertical: 0,
  },
});
