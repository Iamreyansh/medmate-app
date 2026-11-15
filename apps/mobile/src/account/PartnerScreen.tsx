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

import { Text } from '../ui/Text';
import { Gradient } from '../ui/primitives';
import { useContentInset } from '../ui/layout';
import { CardTitle, ScreenCard, ZoneBar, ZoneHeading } from '../ui/blocks';
import { NumberedStep } from './parts';

export type PartnerScreenProps = {
  onBack?: () => void;
  onHelp?: () => void;
};

/** The four facts in the brand zone. */
const facts = [
  { title: 'Licensed', body: 'Pharmacies only' },
  { title: 'Bengaluru', body: 'Now onboarding' },
  { title: '4 steps', body: 'To go live' },
];

/**
 * Partner with us.
 *
 * The Figma `07 Account / Partner` frame: what partnering means, why a
 * pharmacy would, and how to go live.
 */
export function PartnerScreen({ onBack, onHelp }: PartnerScreenProps) {
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
                backLabel="Account"
                title="Partner with us"
                onBack={onBack}
                onHelp={onHelp}
              />
            </View>
            <View style={[styles.zoneHeading, { paddingHorizontal: inset }]}>
              <ZoneHeading
                eyebrow="MedMate for pharmacies"
                title="Bring your pharmacy online."
                body="For licensed neighbourhood pharmacies in Bengaluru. We bring nearby customers and arrange delivery. You keep doing what you do best."
              />
              <View style={styles.facts}>
                {facts.map((fact) => (
                  <View key={fact.title} style={styles.fact}>
                    <Text variant="buttonSmall" color={brand.forest}>
                      {fact.title}
                    </Text>
                    <Text variant="caption" color={semantic.textMuted}>
                      {fact.body}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </Gradient>

        <View style={[styles.content, { paddingHorizontal: inset }]}>
          <Text variant="headline" color={semantic.text}>
            Why partner with us
          </Text>

          <View style={styles.whyCard}>
            <Text variant="buttonSmall" color={neutral.surface}>
              Customers nearby
            </Text>
            <Text variant="caption" color={mint[200]}>
              People searching for medicines in your area see your shop and your stock.
            </Text>
          </View>

          <ScreenCard>
            <CardTitle>How to go live</CardTitle>
            {[
              'Tell us your pharmacy licence, GST number and pharmacist details.',
              'We connect your catalogue so your stock shows for the medicines you have.',
              'Your shop goes live in Jayanagar and the nearby areas we cover.',
              'Riders collect from your counter and the delivery fee is set by you.',
            ].map((step, index) => (
              <NumberedStep key={step} number={String(index + 1)} body={step} />
            ))}
          </ScreenCard>

          <ScreenCard>
            <CardTitle>What you keep</CardTitle>
            <Text variant="footnote" color={semantic.textSecondary}>
              Your prices, your stock and your relationship with your customers. MedMate brings
              the orders, the delivery coordination and the app the customer orders from.
            </Text>
          </ScreenCard>

          <Text variant="caption" color={semantic.textMuted}>
            The Grievance Officer details and the partner agreement will be published here
            before launch.
          </Text>
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
  zoneHeading: { gap: spacing.xs, marginTop: spacing.md },
  facts: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.sm },
  fact: {
    flex: 1,
    gap: 2,
    padding: spacing.md,
    borderRadius: radii.md,
    backgroundColor: gold[50],
  },
  content: { gap: spacing.lg, paddingTop: spacing.lg },
  whyCard: {
    gap: spacing.xs,
    padding: spacing.lg,
    borderRadius: radii.card,
    backgroundColor: brand.forest,
  },
});
