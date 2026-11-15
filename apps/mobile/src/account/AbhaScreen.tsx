import React from 'react';
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
import { CardTitle, ScreenCard, ZoneBar, ZoneHeading } from '../ui/blocks';
import { NumberedStep } from './parts';
import { abhaNever, abhaReasons, abhaSteps } from './data';

export type AbhaScreenProps = {
  onBack?: () => void;
  onHelp?: () => void;
  onNotifyMe?: () => void;
};

/**
 * The ABHA health ID.
 *
 * The Figma `07 Account / ABHA` frame explains what it is and what is
 * planned, and says plainly that it is not live yet.
 */
export function AbhaScreen({ onBack, onHelp, onNotifyMe }: AbhaScreenProps) {
  const insets = useSafeAreaInsets();
  const inset = useContentInset();

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: insets.bottom + 140 }}
        showsVerticalScrollIndicator={false}
      >
        <Gradient token="brand" radius={radii.huge} style={styles.zone}>
          <View style={[styles.zoneInner, { paddingTop: insets.top }]}>
            <View style={{ paddingHorizontal: inset }}>
              <ZoneBar
                backLabel="Account"
                title="ABHA health ID"
                trailing="Coming soon"
                onBack={onBack}
                onHelp={onHelp}
              />
            </View>
            <View style={[styles.zoneHeading, { paddingHorizontal: inset }]}>
              <ZoneHeading
                title="Link your ABHA health ID"
                body="Keep your prescriptions and pharmacy bills with the rest of your health records. Not available yet."
              />
            </View>
          </View>
        </Gradient>

        <View style={[styles.content, { paddingHorizontal: inset }]}>
          <View style={styles.overlap}>
            <ScreenCard>
              <View style={styles.status}>
                <View style={styles.statusIcon}>
                  <Text variant="titleLarge" color={gold[300]}>
                    ABHA
                  </Text>
                </View>
                <View style={styles.statusText}>
                  <Text variant="eyebrow" color={brand.green700}>
                    Ayushman Bharat Health Account
                  </Text>
                  <Text variant="button" color={semantic.text}>
                    Not available yet
                  </Text>
                </View>
              </View>
              <Text variant="footnote" color={semantic.textSecondary}>
                MedMate is registering with the Ayushman Bharat Digital Mission (ABDM) so your
                records can be linked with your consent. We will add linking here once that
                approval is through. We can’t give a date yet.
              </Text>
              <View style={styles.note}>
                <Icon name="info" size={16} color={semantic.textMuted} />
                <Text variant="footnote" color={semantic.textMuted} style={styles.noteText}>
                  Want to know when it’s live? Tap the button below.
                </Text>
              </View>
            </ScreenCard>
          </View>

          <ScreenCard>
            <CardTitle>Why link it</CardTitle>
            {abhaReasons.map((reason) => (
              <View key={reason.title} style={styles.reason}>
                <Text variant="buttonSmall" color={semantic.text}>
                  {reason.title}
                </Text>
                <Text variant="caption" color={semantic.textMuted}>
                  {reason.body}
                </Text>
              </View>
            ))}
          </ScreenCard>

          <ScreenCard>
            <CardTitle>When it’s live</CardTitle>
            <Text variant="caption" color={semantic.textMuted}>
              How we plan it to work. Details may change with ABDM’s rules.
            </Text>
            {abhaSteps.map((step, index) => (
              <NumberedStep key={step} number={String(index + 1)} body={step} />
            ))}
            <View style={styles.never}>
              <Text variant="eyebrow" color={brand.green700}>
                What we will never do
              </Text>
              {abhaNever.map((line) => (
                <View key={line} style={styles.reason}>
                  <Text variant="footnote" color={semantic.textSecondary}>
                    {line}
                  </Text>
                </View>
              ))}
            </View>
          </ScreenCard>

          <Text variant="footnote" color={semantic.textSecondary}>
            Don’t have an ABHA yet? You can create one free on the government’s ABHA website.
          </Text>
          <Pressable
            accessibilityRole="link"
            style={({ pressed }) => [styles.link, pressed ? { opacity: 0.8 } : null]}
          >
            <Text variant="footnoteEmphasized" color={brand.green}>
              abha.abdm.gov.in
            </Text>
            <Icon name="chev-r" size={14} color={brand.green} />
          </Pressable>
        </View>
      </ScrollView>

      <View style={[styles.actionBar, { paddingBottom: insets.bottom + spacing.sm }]}>
        <View style={[styles.actionInner, { paddingHorizontal: inset }]}>
          <Button
            label="Tell me when it’s live"
            tone="filled"
            size="large"
            icon="bell"
            chevron
            onPress={onNotifyMe}
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
  zoneHeading: { marginTop: spacing.md },
  content: { gap: spacing.lg, paddingTop: spacing.lg },
  overlap: { marginTop: -spacing.xl },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  statusIcon: {
    width: 48,
    height: 48,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: brand.forest,
  },
  statusText: { flex: 1, gap: 2 },
  note: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radii.md,
    backgroundColor: neutral.surface2,
  },
  noteText: { flex: 1 },
  reason: { gap: 2 },
  never: {
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radii.md,
    backgroundColor: mint[50],
  },
  link: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
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
