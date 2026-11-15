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
import { ArtTile, Button, Gradient } from '../ui/primitives';
import { useContentInset } from '../ui/layout';
import {
  Eyebrow,
  InfoNote,
  LinkRow,
  ScreenCard,
  TagPill,
  ZoneBar,
  ZoneHeading,
} from '../ui/blocks';
import { ePrescription } from './data';

export type EPrescriptionScreenProps = {
  onBack?: () => void;
  onHelp?: () => void;
  onOpenFile?: () => void;
  onAddToCart?: () => void;
};

/**
 * The e-prescription a doctor issued on a call.
 *
 * The Figma `05 Prescriptions & care / e-Prescription` frame: a zone that
 * says it is verified, the prescription card with the medicine it covers, and
 * a way to add it to the cart.
 */
export function EPrescriptionScreen({
  onBack,
  onHelp,
  onOpenFile,
  onAddToCart,
}: EPrescriptionScreenProps) {
  const insets = useSafeAreaInsets();
  const inset = useContentInset();
  const medicine = ePrescription.medicines[0];

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: insets.bottom + 130 }}
        showsVerticalScrollIndicator={false}
      >
        <Gradient token="brand" radius={radii.huge} style={styles.zone}>
          <View style={[styles.zoneInner, { paddingTop: insets.top }]}>
            <View style={{ paddingHorizontal: inset }}>
              <ZoneBar
                backLabel="Back"
                title="e-Prescription"
                onBack={onBack}
                onHelp={onHelp}
              />
            </View>
            <View style={[styles.zoneHeading, { paddingHorizontal: inset }]}>
              <ZoneHeading
                eyebrow="Issued after a doctor call"
                title="Your prescription is verified"
              />
            </View>
          </View>
        </Gradient>

        <View style={[styles.content, { paddingHorizontal: inset }]}>
          <View style={styles.overlap}>
            <ScreenCard>
              <View style={styles.prescriptionHead}>
                <View style={styles.rxTile}>
                  <Text variant="titleLarge" color={gold[300]}>
                    Rx
                  </Text>
                </View>
                <View style={styles.prescriptionText}>
                  <Text variant="eyebrow" color={brand.green700}>
                    MedMate doctor
                  </Text>
                  <Text variant="button" color={semantic.text}>
                    {`#${ePrescription.id}`}
                  </Text>
                </View>
                <TagPill label="Verified" tone="mint" icon="check" />
              </View>

              <View style={styles.dashed} />

              <View style={styles.facts}>
                <View style={styles.fact}>
                  <Text variant="caption" color={semantic.textMuted}>
                    Prescribed by
                  </Text>
                  <Text variant="footnoteEmphasized" color={semantic.text}>
                    Registered MedMate doctor
                  </Text>
                </View>
                <View style={styles.fact}>
                  <Text variant="caption" color={semantic.textMuted}>
                    Verified
                  </Text>
                  <Text variant="footnoteEmphasized" color={semantic.text}>
                    {ePrescription.sent}
                  </Text>
                </View>
              </View>

              <Eyebrow>1 medicine covered</Eyebrow>

              <View style={styles.medicineRow}>
                <View style={styles.medicineNumber}>
                  <Text variant="captionStrong" color={gold[300]}>
                    1
                  </Text>
                </View>
                <ArtTile
                  width={48}
                  height={48}
                  radius={radii.lg}
                  initials={medicine.initials}
                />
                <View style={styles.medicineText}>
                  <View style={styles.medicineTitle}>
                    <Text variant="buttonSmall" color={semantic.text} numberOfLines={1}>
                      {medicine.name}
                    </Text>
                    <TagPill label="Rx" tone="danger" />
                  </View>
                  <Text variant="caption" color={semantic.textMuted}>
                    As written by the doctor on the prescription
                  </Text>
                </View>
              </View>

              <LinkRow icon="image" label="Open the file you sent" onPress={onOpenFile} />
            </ScreenCard>
          </View>

          <View style={styles.plainNote}>
            <Icon name="info" size={16} color={semantic.textSecondary} />
            <Text variant="footnote" color={semantic.textSecondary} style={styles.noteText}>
              How long a prescription stays valid depends on its date and the doctor’s
              instructions. The pharmacist confirms it for each order and may ask for a fresh
              one.
            </Text>
          </View>

          <InfoNote icon="shield">
            The pharmacy can dispense these medicines against this prescription. Saved to My
            Prescriptions and shared only with the pharmacy that fulfils your order.
          </InfoNote>
        </View>
      </ScrollView>

      <View style={[styles.actionBar, { paddingBottom: insets.bottom + spacing.sm }]}>
        <View style={[styles.actionInner, { paddingHorizontal: inset }]}>
          <Button
            label="Add these medicines to cart"
            tone="filled"
            size="large"
            icon="bag"
            chevron
            onPress={onAddToCart}
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
  prescriptionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  rxTile: {
    width: 48,
    height: 48,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: brand.forest,
  },
  prescriptionText: { flex: 1, gap: 2 },
  dashed: {
    flexDirection: 'row',
    gap: 4,
    height: 1,
    overflow: 'hidden',
  },
  facts: { flexDirection: 'row', gap: spacing.sm },
  fact: {
    flex: 1,
    gap: 2,
    padding: spacing.md,
    borderRadius: radii.md,
    backgroundColor: mint[50],
  },
  medicineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  medicineNumber: {
    width: 24,
    height: 24,
    borderRadius: radii.circle,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: brand.forest,
  },
  medicineText: { flex: 1, gap: 2 },
  medicineTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  plainNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radii.md,
    backgroundColor: neutral.surface,
  },
  noteText: { flex: 1 },
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
