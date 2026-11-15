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
import { Gradient } from '../ui/primitives';
import { useContentInset } from '../ui/layout';
import { CardTitle, ScreenCard, ZoneBar, ZoneHeading } from '../ui/blocks';
import { AccountGroup } from './parts';
import { legalSections, otherPolicies } from './data';

export type LegalScreenProps = {
  onBack?: () => void;
  onHelp?: () => void;
  onLink?: (id: string) => void;
};

/**
 * Terms and Conditions.
 *
 * The Figma `07 Account / Legal` frame: the sections, a note that it is
 * still a draft, and the other policies.
 */
export function LegalScreen({ onBack, onHelp, onLink }: LegalScreenProps) {
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
                title="Terms and Conditions"
                onBack={onBack}
                onHelp={onHelp}
              />
            </View>
            <View style={[styles.zoneHeading, { paddingHorizontal: inset }]}>
              <ZoneHeading
                title="The rules for using MedMate, and what you allow us to use"
                body="Last updated 1 October 2026 · 11 sections"
              />
              <Text variant="caption" color={mint[200]}>
                Medmate India Technology Private Limited
              </Text>
            </View>
          </View>
        </Gradient>

        <View style={[styles.content, { paddingHorizontal: inset }]}>
          <View style={styles.draftNote}>
            <Icon name="alert" size={16} color={gold.ink} />
            <Text variant="footnote" color={gold.ink} style={styles.draftText}>
              Draft for the demo build. Items in [brackets] are still to be filled and the text
              reviewed by a lawyer before the app goes to the stores.
            </Text>
          </View>

          <Text variant="buttonSmall" color={semantic.text}>
            On this page
          </Text>

          {legalSections.map((section) => (
            <ScreenCard key={section.number}>
              <Text variant="eyebrow" color={brand.green}>
                {section.number}
              </Text>
              <CardTitle>{section.title}</CardTitle>
              <Text variant="footnote" color={semantic.textSecondary}>
                {section.body}
              </Text>
            </ScreenCard>
          ))}

          {/* A way to a person. */}
          <View style={styles.questions}>
            <Text variant="buttonSmall" color={neutral.surface}>
              Questions about this policy?
            </Text>
            <Text variant="caption" color={mint[200]}>
              See Help and support for the ways to reach us.
            </Text>
            <Pressable
              accessibilityRole="link"
              onPress={() => onLink?.('help')}
              style={({ pressed }) => [styles.questionsLink, pressed ? { opacity: 0.8 } : null]}
            >
              <Text variant="footnoteEmphasized" color={gold[300]}>
                Help and support
              </Text>
              <Icon name="chev-r" size={14} color={gold[300]} />
            </Pressable>
          </View>

          <View style={styles.group}>
            <Text variant="footnote" color={semantic.textMuted}>
              Other policies
            </Text>
            <AccountGroup links={otherPolicies} onPress={onLink} />
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
  zoneHeading: { gap: spacing.xs, marginTop: spacing.md },
  content: { gap: spacing.lg, paddingTop: spacing.lg },
  draftNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radii.md,
    backgroundColor: gold[50],
  },
  draftText: { flex: 1 },
  questions: {
    gap: spacing.xs,
    padding: spacing.lg,
    borderRadius: radii.card,
    backgroundColor: brand.forest,
  },
  questionsLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  group: { gap: spacing.sm },
});
