import React, { useRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
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
import { Wordmark } from './parts';
import {
  demoCode,
  otpDemoNote,
  otpExpiry,
  otpHeading,
  otpSafety,
  otpSubheading,
} from './data';

export type OtpScreenProps = {
  phone: string;
  onBack?: () => void;
  onHelp?: () => void;
  /** Fired when the shopper asks for a different number. */
  onChangeNumber?: () => void;
  /** Fired when the code is entered. */
  onVerify?: (code: string) => void;
};

/**
 * Enter the code.
 *
 * The Figma `01 Onboarding / OTP` frame: the four boxes on the brand zone and
 * the notes under them. The demo build takes the code 1234.
 */
export function OtpScreen({
  phone,
  onBack,
  onHelp,
  onChangeNumber,
  onVerify,
}: OtpScreenProps) {
  const insets = useSafeAreaInsets();
  const inset = useContentInset();
  // The demo build has no SMS, so the code starts filled in.
  const [code, setCode] = useState(demoCode);
  const input = useRef<React.ComponentRef<typeof TextInput>>(null);

  // The demo build has one code, and it is the one on the screen.
  const matches = code === demoCode;

  return (
    <View style={styles.root}>
      <Gradient token="brand" radius={0} style={styles.zone}>
        <View style={[styles.zoneInner, { paddingTop: insets.top }]}>
          <View style={[styles.navBar, { paddingHorizontal: inset }]}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Back to login"
              onPress={onBack}
              hitSlop={10}
              style={styles.navBack}
            >
              <Icon name="chev-l" size={20} color={neutral.surface} strokeWidth={2.2} />
              <Text variant="body" color={neutral.surface}>
                Login
              </Text>
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
              {otpHeading}
            </Text>
            <Text variant="footnote" color={mint[200]}>
              {otpSubheading(phone)}
            </Text>

            <Pressable
              accessibilityRole="button"
              onPress={onChangeNumber}
              style={styles.changeNumber}
            >
              <Text variant="footnoteEmphasized" color={gold[300]}>
                Wrong number? Change it
              </Text>
            </Pressable>

            {/* The four boxes. */}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={code.length ? `Code ${code}` : 'Enter the 4-digit code'}
              onPress={() => input.current?.focus()}
              style={styles.boxes}
            >
              {[0, 1, 2, 3].map((index) => {
                const digit = code[index] ?? '';
                const active = index === code.length;
                return (
                  <View
                    key={index}
                    style={[
                      styles.box,
                      active ? styles.boxActive : null,
                      digit ? styles.boxFilled : null,
                    ]}
                  >
                    <Text variant="pharmacyTitle" color={gold[300]}>
                      {digit}
                    </Text>
                  </View>
                );
              })}
            </Pressable>

            <TextInput
              ref={input}
              value={code}
              onChangeText={(value) => setCode(value.replace(/\D/g, '').slice(0, 4))}
              keyboardType="number-pad"
              maxLength={4}
              style={styles.hiddenInput}
              accessibilityLabel="Verification code"
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
            />
          </View>
        </View>
      </Gradient>

      <View style={[styles.body, { paddingHorizontal: inset }]}>
        <Text variant="caption" color={semantic.textMuted}>
          {otpExpiry}
        </Text>
        <Text variant="caption" color={gold.ink}>
          {otpDemoNote}
        </Text>

        <Button
          label="Verify and continue"
          tone={matches ? 'filled' : 'muted'}
          size="large"
          icon="chev-r"
          disabled={!matches}
          onPress={() => onVerify?.(code)}
        />

        <Text variant="footnote" color={brand.green700}>
          {otpSafety}
        </Text>

        {/* The paste suggestion the phone offers for the code. */}
        <View style={styles.paste}>
          <View style={styles.pasteHead}>
            <Text variant="captionStrong" color={semantic.textSecondary}>
              From Messages
            </Text>
          </View>
          <Text variant="buttonSmall" color={semantic.text}>
            {demoCode}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: neutral.surface },
  zone: { flex: 1, overflow: 'hidden' },
  zoneInner: { flex: 1 },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
  },
  navBack: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  navHelp: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  zoneBody: { flex: 1, gap: spacing.sm, paddingTop: spacing.xl },
  changeNumber: { alignSelf: 'flex-start' },
  boxes: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
  box: {
    flex: 1,
    aspectRatio: 0.8,
    maxHeight: 72,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxActive: {
    borderColor: gold[300],
    borderWidth: 2,
  },
  boxFilled: {
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    height: 1,
    width: 1,
  },
  body: {
    gap: spacing.md,
    paddingTop: spacing.lg,
  },
  paste: {
    gap: spacing.xs,
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: neutral.line,
    backgroundColor: neutral.surface,
  },
  pasteHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
});
