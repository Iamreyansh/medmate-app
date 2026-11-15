import React, { useState } from 'react';
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
import { ConsentTick, Wordmark } from './parts';
import {
  adultTick,
  alwaysOn,
  consentBody,
  consentGroupLabel,
  consentHeading,
  consentNote,
  consentVersion,
  offersTick,
  termConsents,
  whatThisMeans,
} from './data';

export type ConsentScreenProps = {
  phone: string;
  onBack?: () => void;
  onHelp?: () => void;
  /** Fired when the shopper accepts. */
  onAgree?: (consents: { adult: boolean; offers: boolean }) => void;
  /** Fired when the shopper declines. */
  onDecline?: () => void;
  /** Fired when "What this means" is tapped. */
  onExplain?: (title: string) => void;
};

/**
 * The terms and the consents.
 *
 * The Figma `01 Onboarding / Consent` frame: the brand zone that says what
 * is being agreed to, and the sheet with the consents and the two ticks.
 */
export function ConsentScreen({
  phone,
  onBack,
  onHelp,
  onAgree,
  onDecline,
  onExplain,
}: ConsentScreenProps) {
  const insets = useSafeAreaInsets();
  const inset = useContentInset();
  const [adult, setAdult] = useState(false);
  const [offers, setOffers] = useState(false);

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xl }}
        showsVerticalScrollIndicator={false}
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
              <Wordmark size="small" />
              <Text variant="headlineMedium" color={neutral.surface}>
                {consentHeading}
              </Text>
              <Text variant="footnote" color={mint[200]}>
                {consentBody}
              </Text>
              <Text variant="caption" color={mint[300]}>
                {`Signed in as ${phone}`}
              </Text>
            </View>
          </View>
        </Gradient>

        {/* The consent sheet */}
        <View style={[styles.sheet, { paddingHorizontal: inset }]}>
          <Text variant="eyebrow" color={brand.green700}>
            {consentGroupLabel}
          </Text>

          {termConsents.map((consent) => (
            <View key={consent.title} style={styles.consent}>
              <Text variant="subheadline" color={semantic.text}>
                {consent.title}
              </Text>
              <Text variant="footnote" color={semantic.textMuted}>
                {consent.body}
              </Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => onExplain?.(consent.title)}
                hitSlop={6}
                style={styles.explain}
              >
                <Text variant="footnoteEmphasized" color={brand.green}>
                  {whatThisMeans}
                </Text>
                <Icon name="chev-r" size={14} color={brand.green} />
              </Pressable>
            </View>
          ))}

          {alwaysOn.map((item) => (
            <View key={item.title} style={styles.alwaysOn}>
              <Text variant="footnote" color={semantic.textSecondary}>
                {`${item.title}. ${item.body}`}
              </Text>
            </View>
          ))}

          <View style={styles.ticks}>
            <ConsentTick
              label={adultTick}
              note="Required"
              checked={adult}
              onPress={() => setAdult((current) => !current)}
            />
            <ConsentTick
              label={offersTick}
              note="Optional · off unless you tick it. Order updates come either way."
              checked={offers}
              onPress={() => setOffers((current) => !current)}
            />
          </View>

          <Text variant="caption" color={semantic.textMuted}>
            {consentNote}
          </Text>

          <Button
            label="Agree and continue"
            tone={adult ? 'filled' : 'muted'}
            size="large"
            icon="chev-r"
            disabled={!adult}
            onPress={() => onAgree?.({ adult, offers })}
          />

          <Pressable
            accessibilityRole="button"
            onPress={onDecline}
            hitSlop={6}
            style={({ pressed }) => [pressed ? { opacity: 0.8 } : null]}
          >
            <Text variant="footnoteEmphasized" color={semantic.textMuted}>
              I don’t agree, log me out
            </Text>
          </Pressable>

          <Text variant="caption" color={semantic.textFaint}>
            {consentVersion}
          </Text>
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
  zoneBody: { gap: spacing.sm, paddingTop: spacing.md },
  sheet: {
    marginTop: -spacing.xl,
    paddingTop: spacing.xl,
    gap: spacing.md,
    borderTopLeftRadius: radii.huge,
    borderTopRightRadius: radii.huge,
    backgroundColor: neutral.surface,
  },
  consent: { gap: 2 },
  explain: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  alwaysOn: { gap: 2 },
  ticks: { gap: spacing.md, paddingVertical: spacing.sm },
});
