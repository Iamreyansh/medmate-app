import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  brand,
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
import {
  BannerRow,
  CardTitle,
  Eyebrow,
  InfoNote,
  LinkRow,
  ScreenCard,
  StepRow,
  TagPill,
  ZoneBar,
  ZoneHeading,
} from '../ui/blocks';
import { UnderReviewCard, ValidPrescriptionCard } from './parts';
import {
  prescriptionHowItWorks,
  prescriptions,
  validPrescriptionLines,
} from './data';

export type MyPrescriptionsScreenProps = {
  onBack?: () => void;
  onHelp?: () => void;
  onUpload?: () => void;
  onOpenFile?: () => void;
  onViewStatus?: () => void;
  onRemove?: () => void;
};

/**
 * My prescriptions.
 *
 * The Figma `05 Prescriptions & care / My prescriptions` frame: the
 * prescription on file, a way to send another, and how the whole thing works.
 */
export function MyPrescriptionsScreen({
  onBack,
  onHelp,
  onUpload,
  onOpenFile,
  onViewStatus,
  onRemove,
}: MyPrescriptionsScreenProps) {
  const insets = useSafeAreaInsets();
  const inset = useContentInset();
  const prescription = prescriptions[0];

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
                title="My prescriptions"
                onBack={onBack}
                onHelp={onHelp}
              />
            </View>
            <View style={[styles.zoneHeading, { paddingHorizontal: inset }]}>
              <ZoneHeading
                title="Your prescriptions, in one place"
                body="1 prescription on file · latest under review"
              />
            </View>
          </View>
        </Gradient>

        <View style={[styles.content, { paddingHorizontal: inset }]}>
          {/* The prescription on file overlaps the zone. */}
          <View style={styles.overlap}>
            <UnderReviewCard
              prescriptionId={prescription.id}
              sent={prescription.sent}
              note="A registered pharmacist is checking it, usually within 30 minutes, 8 AM to 11 PM. We will notify you."
            />
          </View>

          <View style={styles.contentCard}>
            <Text variant="eyebrow" color={semantic.textMuted}>
              Medicines covered
            </Text>
            <Text variant="caption" color={semantic.textMuted}>
              The pharmacist lists the medicines once the prescription is checked.
            </Text>
            <LinkRow icon="image" label="Open the file you sent" onPress={onOpenFile} />
            <Eyebrow>Used for</Eyebrow>
            <View style={styles.usedFor}>
              <Icon name="bag" size={16} color={semantic.text} />
              <Text variant="footnote" color={semantic.text} style={styles.usedForText}>
                {prescription.usedFor}
              </Text>
              <TagPill label={prescription.usedForTag ?? ''} tone="gold" />
            </View>
            <Button
              label="View status"
              tone="outline"
              size="large"
              icon="info"
              chevron
              onPress={onViewStatus}
            />
            <Pressable
              accessibilityRole="button"
              onPress={onRemove}
              hitSlop={6}
              style={({ pressed }) => [styles.remove, pressed ? { opacity: 0.8 } : null]}
            >
              <Text variant="footnoteEmphasized" color="#C2392D">
                Remove this prescription
              </Text>
            </Pressable>
          </View>

          <BannerRow
            icon="rx-up"
            title="Upload a new prescription"
            body="Photo or PDF · earlier ones stay listed here"
            onPress={onUpload}
          />

          <ScreenCard>
            <CardTitle>How prescriptions work</CardTitle>
            {prescriptionHowItWorks.map((step) => (
              <StepRow
                key={step.title}
                icon={step.icon}
                title={step.title}
                body={step.body}
                tint={step.icon === 'rx-up' ? brand.forest : mint[100]}
              />
            ))}
          </ScreenCard>

          <ValidPrescriptionCard lines={validPrescriptionLines} />

          <InfoNote icon="shield">
            Each prescription is shared only with the reviewing pharmacist or doctor and the
            pharmacy that fulfils the order it is used for. Remove any you no longer need.
          </InfoNote>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: semantic.page,
  },
  scroll: {
    flex: 1,
  },
  zone: {
    borderBottomLeftRadius: radii.huge,
    borderBottomRightRadius: radii.huge,
    overflow: 'hidden',
  },
  zoneInner: {
    paddingBottom: spacing.lg,
  },
  zoneHeading: {
    marginTop: spacing.md,
  },
  content: {
    gap: spacing.lg,
    paddingTop: spacing.lg,
  },
  overlap: {
    marginTop: -spacing.xl,
  },
  contentCard: {
    padding: spacing.lg,
    gap: spacing.md,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: neutral.line,
    backgroundColor: neutral.surface,
  },
  usedFor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  usedForText: {
    flex: 1,
  },
  remove: {
    alignSelf: 'flex-start',
  },
});
