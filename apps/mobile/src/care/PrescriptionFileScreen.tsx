import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { neutral, radii, semantic, spacing } from '@medmate/theme';

import { Text } from '../ui/Text';
import { useContentInset } from '../ui/layout';
import { ZoneBar } from '../ui/blocks';
import { prescriptions, prescriptionFileNote } from './data';

export type PrescriptionFileScreenProps = {
  onBack?: () => void;
  onHelp?: () => void;
};

/**
 * The prescription file the shopper sent.
 *
 * The Figma `05 Prescriptions & care / Prescription file` frame shows the
 * photo of the prescription as it was uploaded, so the shopper can check it
 * against what they sent.
 */
export function PrescriptionFileScreen({ onBack, onHelp }: PrescriptionFileScreenProps) {
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
        {/* This screen sits on white, so the bar is the light one. */}
        <View style={[styles.zone, { paddingTop: insets.top }]}>
          <View style={{ paddingHorizontal: inset }}>
            <ZoneBar
              backLabel="Back"
              title="Your prescription file"
              tone="light"
              onBack={onBack}
              onHelp={onHelp}
            />
          </View>
        </View>

        <View style={[styles.content, { paddingHorizontal: inset }]}>
          <Text variant="caption" color={semantic.textMuted}>
            {`#${prescription.id}`}
          </Text>

          <View style={styles.sheet}>
            <View style={styles.paper}>
              <View style={styles.paperHead}>
                <Text variant="rxMark" color={semantic.text}>
                  Rx
                </Text>
                <View style={styles.clinic}>
                  <View style={[styles.clinicLine, styles.clinicLineWide]} />
                  <View style={[styles.clinicLine, styles.clinicLineShort]} />
                </View>
              </View>

              <View style={styles.paperRule} />

              <View style={styles.handwriting}>
                {[200, 240, 170, 220, 120, 260, 190].map((width, index) => (
                  <View
                    key={index}
                    style={[
                      styles.inkLine,
                      { width },
                      index % 2 === 0 ? styles.inkLineDark : styles.inkLineLight,
                    ]}
                  />
                ))}
              </View>

              <View style={styles.paperGap} />

              <View style={styles.signature}>
                <View style={styles.signatureRule} />
                <Text variant="captionStrong" color={semantic.textFaint}>
                  Signature
                </Text>
              </View>
            </View>
          </View>

          <Text variant="caption" color={semantic.textMuted}>
            {prescriptionFileNote}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: neutral.surface,
  },
  scroll: {
    flex: 1,
  },
  zone: {
    backgroundColor: neutral.surface,
  },
  content: {
    gap: spacing.md,
    paddingTop: spacing.md,
  },
  sheet: {
    padding: spacing.sm,
    borderRadius: radii.card,
    backgroundColor: semantic.page,
  },
  paper: {
    padding: spacing.lg,
    gap: spacing.sm,
    borderRadius: radii.card,
    backgroundColor: neutral.surface,
  },
  paperHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  clinic: {
    gap: spacing.xs,
  },
  clinicLine: {
    height: 10,
    borderRadius: 5,
    backgroundColor: neutral.line2,
  },
  clinicLineWide: {
    width: 160,
  },
  clinicLineShort: {
    width: 110,
    height: 8,
    borderRadius: 4,
    backgroundColor: neutral.surface3,
  },
  paperRule: {
    height: 1,
    backgroundColor: neutral.line2,
  },
  handwriting: {
    gap: spacing.sm,
    paddingTop: spacing.xs,
  },
  inkLine: {
    height: 9,
    borderRadius: 5,
  },
  inkLineDark: {
    backgroundColor: neutral.line2,
  },
  inkLineLight: {
    backgroundColor: neutral.surface3,
  },
  paperGap: {
    height: 30,
  },
  signature: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  signatureRule: {
    width: 90,
    height: 2,
    backgroundColor: semantic.textSecondary,
  },
});
