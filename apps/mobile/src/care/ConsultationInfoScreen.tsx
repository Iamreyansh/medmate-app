import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
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
import { Gradient } from '../ui/primitives';
import { useContentInset } from '../ui/layout';
import {
  CardTitle,
  CheckLine,
  ScreenCard,
  StepRow,
  TagPill,
  ZoneBar,
  ZoneHeading,
} from '../ui/blocks';
import { callHowItWorks, consultationOrder, keepReady } from './data';

export type ConsultationInfoScreenProps = {
  onBack?: () => void;
  onHelp?: () => void;
  onRequestCall?: () => void;
};

/**
 * What a doctor call is.
 *
 * The Figma `05 Prescriptions & care / Consultation info` frame explains how
 * the call works, what to have ready, and what the doctor decides.
 */
export function ConsultationInfoScreen({
  onBack,
  onHelp,
  onRequestCall,
}: ConsultationInfoScreenProps) {
  const insets = useSafeAreaInsets();
  const inset = useContentInset();

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xl }}
        showsVerticalScrollIndicator={false}
      >
        <Gradient token="brand" radius={radii.huge} style={styles.zone}>
          <View style={[styles.zoneInner, { paddingTop: insets.top }]}>
            <View style={{ paddingHorizontal: inset }}>
              <ZoneBar
                backLabel="Home"
                title="Doctor call"
                onBack={onBack}
                onHelp={onHelp}
              />
            </View>
            <View style={[styles.zoneHeading, { paddingHorizontal: inset }]}>
              <ZoneHeading
                eyebrow="Need a consultation?"
                title="Talk to a registered doctor"
                body="For prescription medicines when you don’t have a prescription to hand."
              />
            </View>
          </View>
        </Gradient>

        <View style={[styles.content, { paddingHorizontal: inset }]}>
          <View style={styles.overlap}>
            <ScreenCard>
              <Text variant="eyebrow" color={brand.green700}>
                Waiting for a prescription
              </Text>

              <View style={styles.waiting}>
                <View style={styles.waitingIcon}>
                  <Icon name="phone" size={20} color={neutral.surface} />
                </View>
                <View style={styles.waitingText}>
                  <Text variant="buttonSmall" color={semantic.text}>
                    {consultationOrder.order}
                  </Text>
                  <Text variant="caption" color={semantic.textSecondary}>
                    {`${consultationOrder.pharmacy} · ${consultationOrder.reason}`}
                  </Text>
                </View>
                <Icon name="chev-r" size={16} color={semantic.textMuted} />
              </View>

              <TagPill
                label="Doctors are calling now · 8 AM to 11 PM"
                tone="mint"
                icon="clock"
              />
            </ScreenCard>
          </View>

          <ScreenCard>
            <CardTitle>How the call works</CardTitle>
            {callHowItWorks.map((step) => (
              <StepRow
                key={step.title}
                icon={step.icon}
                title={step.title}
                body={step.body}
                tint={step.icon === 'bag' ? brand.forest : mint[100]}
              />
            ))}
          </ScreenCard>

          <ScreenCard>
            <CardTitle>Keep these ready</CardTitle>
            {keepReady.map((line) => (
              <CheckLine key={line.text} icon={line.icon}>
                {line.text}
              </CheckLine>
            ))}
          </ScreenCard>

          <ScreenCard>
            <View style={styles.titleRow}>
              <Icon name="info" size={16} color={semantic.text} />
              <CardTitle>Good to know</CardTitle>
            </View>
            <Text variant="footnote" color={semantic.textSecondary}>
              The doctor’s decision is their own. They may prescribe, suggest a different
              medicine, or advise you to see a doctor in person. If no prescription is issued,
              you can cancel the order before packing at no charge.
            </Text>
            <Text variant="footnote" color="#C2392D">
              This is not for emergencies. For chest pain, breathing trouble, severe bleeding or
              loss of consciousness, call 112 now.
            </Text>
          </ScreenCard>

          <View style={styles.shieldLine}>
            <Icon name="shield" size={16} color={brand.green700} />
            <Text variant="footnote" color={semantic.textSecondary} style={styles.lineText}>
              Your call and medicine details are shared only with the doctor and the pharmacy
              fulfilling your order.
            </Text>
          </View>
        </View>
      </ScrollView>
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
  waiting: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.card,
    backgroundColor: gold[50],
  },
  waitingIcon: {
    width: 40,
    height: 40,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: brand.forest,
  },
  waitingText: { flex: 1, gap: 2 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  shieldLine: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  lineText: { flex: 1 },
});
