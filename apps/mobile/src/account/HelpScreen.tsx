import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  brand,
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
import { helpQuestions, helpTopics } from './data';

export type HelpScreenProps = {
  onBack?: () => void;
  onHelp?: () => void;
  onSearch?: (value: string) => void;
};

/**
 * Help and support.
 *
 * The Figma `07 Account / Help` frame: a way to search, the order in
 * progress, the topics, the questions and how to reach a person.
 */
export function HelpScreen({ onBack, onHelp, onSearch }: HelpScreenProps) {
  const insets = useSafeAreaInsets();
  const inset = useContentInset();
  const [query] = useState('');
  const [open, setOpen] = useState<string | null>(helpQuestions[0].q);

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xl }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Gradient token="brand" radius={radii.huge} style={styles.zone}>
          <View style={[styles.zoneInner, { paddingTop: insets.top }]}>
            <View style={{ paddingHorizontal: inset }}>
              <ZoneBar
                backLabel="Account"
                title="Help and support"
                onBack={onBack}
                onHelp={onHelp}
              />
            </View>
            <View style={[styles.zoneHeading, { paddingHorizontal: inset }]}>
              <ZoneHeading title="How can we help you?" />
            </View>
          </View>
        </Gradient>

        <View style={[styles.content, { paddingHorizontal: inset }]}>
          {/* The search. */}
          <View style={styles.search}>
            <Icon name="search" size={18} color={semantic.textMuted} />
            <Text
              variant="subheadline"
              color={semantic.textMuted}
              style={styles.searchText}
              numberOfLines={1}
            >
              {query || 'Search, for example refund or prescription'}
            </Text>
          </View>

          {/* The order in progress. */}
          <Text variant="headline" color={semantic.text}>
            Help with an order
          </Text>
          <View style={styles.orderCard}>
            <View style={styles.orderHead}>
              <Text variant="footnoteEmphasized" color={brand.green}>
                All orders
              </Text>
              <Text variant="eyebrow" color={brand.green700}>
                In progress · 30 Oct
              </Text>
            </View>
            <Text variant="buttonSmall" color={semantic.text}>
              #MM-20341 · HealthFirst Chemist
            </Text>
            <Text variant="caption" color={semantic.textMuted}>
              3 items · ₹274
            </Text>
          </View>

          {/* The topics. */}
          <Text variant="headline" color={semantic.text}>
            Browse by topic
          </Text>
          <View style={styles.topics}>
            {helpTopics.map((topic, index) => (
              <View
                key={topic}
                style={[styles.topic, index === 0 ? styles.topicOn : null]}
              >
                <Text
                  variant="footnoteEmphasized"
                  color={index === 0 ? neutral.surface : semantic.text}
                >
                  {topic}
                </Text>
              </View>
            ))}
          </View>

          {/* The questions. */}
          <ScreenCard>
            <CardTitle>Frequently asked</CardTitle>
            {helpQuestions.map((question) => {
              const expanded = open === question.q;
              return (
                <View key={question.q}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ expanded }}
                    onPress={() => setOpen(expanded ? null : question.q)}
                    style={({ pressed }) => [
                      styles.question,
                      pressed ? { opacity: 0.9 } : null,
                    ]}
                  >
                    <Text variant="buttonSmall" color={semantic.text} style={styles.questionText}>
                      {question.q}
                    </Text>
                    <Icon
                      name={expanded ? 'chev-d' : 'chev-r'}
                      size={16}
                      color={semantic.textMuted}
                    />
                  </Pressable>
                  {expanded && question.a ? (
                    <Text variant="footnote" color={semantic.textSecondary} style={styles.answer}>
                      {question.a}
                    </Text>
                  ) : null}
                </View>
              );
            })}
          </ScreenCard>

          {/* Getting a person. */}
          <ScreenCard>
            <CardTitle>Still need help?</CardTitle>
            <Text variant="footnote" color={semantic.textSecondary}>
              Our support line is being set up. Until it is live, the pharmacy’s number on your
              order page is the fastest way to reach someone about a delivery.
            </Text>
            <View style={styles.emergency}>
              <Icon name="alert" size={16} color="#C2392D" />
              <Text variant="footnote" color="#C2392D" style={styles.emergencyText}>
                In a medical emergency, call 112 or go to the nearest hospital. MedMate is not an
                emergency service.
              </Text>
            </View>
          </ScreenCard>

          {/* The grievance officer. */}
          <ScreenCard>
            <CardTitle>Grievance Officer</CardTitle>
            <Text variant="footnote" color={semantic.textSecondary}>
              If we have not solved a complaint, or it is about your personal data, you can
              write to our Grievance Officer. Complaints are acknowledged within 24 hours, and
              we aim to resolve them within 15 days.
            </Text>
            <Text variant="caption" color={semantic.textMuted}>
              The Grievance Officer’s details will be published here and in the Privacy Policy
              before launch.
            </Text>
          </ScreenCard>

          <View style={styles.policyLinks}>
            <Pressable accessibilityRole="button" hitSlop={6}>
              <Text variant="buttonSmall" color={semantic.textSecondary}>
                Privacy Policy
              </Text>
            </Pressable>
            <Pressable accessibilityRole="button" hitSlop={6}>
              <Text variant="buttonSmall" color={semantic.textSecondary}>
                Terms
              </Text>
            </Pressable>
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
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    height: 48,
    paddingHorizontal: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: neutral.line,
    backgroundColor: neutral.surface,
  },
  searchText: { flex: 1 },
  orderCard: {
    padding: spacing.md,
    gap: 2,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: neutral.line,
    backgroundColor: neutral.surface,
  },
  orderHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topics: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  topic: {
    height: 44,
    paddingHorizontal: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: neutral.line,
    backgroundColor: neutral.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topicOn: {
    backgroundColor: brand.forest,
    borderColor: brand.forest,
  },
  question: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 40,
  },
  questionText: { flex: 1 },
  answer: {
    paddingBottom: spacing.sm,
  },
  emergency: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  emergencyText: { flex: 1 },
  policyLinks: { flexDirection: 'row', gap: spacing.lg },
});
