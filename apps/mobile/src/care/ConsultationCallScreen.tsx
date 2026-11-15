import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  brand,
  gold,
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
  CardTitle,
  CheckLine,
  ScreenCard,
  TagPill,
  ZoneBar,
  ZoneHeading,
} from '../ui/blocks';
import { CareField, PromiseTile, ReachTile } from './parts';
import {
  callPromises,
  doctorPhone,
  ePrescription,
  keepReady,
  reachChoices,
} from './data';

export type ConsultationCallScreenProps = {
  onBack?: () => void;
  onHelp?: () => void;
  onRequest?: () => void;
  onUploadInstead?: () => void;
};

/**
 * Request the doctor call.
 *
 * The Figma `05 Prescriptions & care / Consultation call` frame: what the
 * doctor promises, which medicine has to be verified, and how the doctor
 * should reach the shopper.
 */
export function ConsultationCallScreen({
  onBack,
  onHelp,
  onRequest,
  onUploadInstead,
}: ConsultationCallScreenProps) {
  const insets = useSafeAreaInsets();
  const inset = useContentInset();
  const [reach, setReach] = useState('phone');
  const [note, setNote] = useState('');
  const medicine = ePrescription.medicines[0];

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: insets.bottom + 150 }}
        showsVerticalScrollIndicator={false}
      >
        <Gradient token="brand" radius={radii.huge} style={styles.zone}>
          <View style={[styles.zoneInner, { paddingTop: insets.top }]}>
            <View style={{ paddingHorizontal: inset }}>
              <ZoneBar
                backLabel="Track"
                title="Verify your prescription"
                onBack={onBack}
                onHelp={onHelp}
              />
            </View>
            <View style={[styles.zoneHeading, { paddingHorizontal: inset }]}>
              <ZoneHeading
                title="A doctor will call you"
                body="Order #MM-20341 is placed. The pharmacy packs your prescription medicines once a prescription is verified."
              />
            </View>
          </View>
        </Gradient>

        <View style={[styles.content, { paddingHorizontal: inset }]}>
          <View style={styles.overlap}>
            <ScreenCard>
              <View style={styles.doctorRow}>
                <View style={styles.doctorIcon}>
                  <Icon name="steth" size={26} color={brand.forest} />
                </View>
                <View style={styles.doctorText}>
                  <Text variant="headline" color={semantic.text}>
                    Registered MedMate doctor
                  </Text>
                  <Text variant="caption" color={semantic.textMuted}>
                    Assesses you on the call and decides independently. A prescription is issued
                    only if it is medically appropriate. English · Hindi · Kannada.
                  </Text>
                </View>
              </View>

              <View style={styles.promises}>
                {callPromises.map((promise) => (
                  <PromiseTile
                    key={promise.label}
                    icon={promise.icon}
                    value={promise.value}
                    label={promise.label}
                  />
                ))}
              </View>
            </ScreenCard>
          </View>

          <ScreenCard>
            <CardTitle>Medicines to verify</CardTitle>
            <View style={styles.medicineRow}>
              <ArtTile
                width={44}
                height={44}
                radius={radii.lg}
                initials={medicine.initials}
              />
              <View style={styles.medicineText}>
                <Text variant="buttonSmall" color={semantic.text}>
                  {medicine.name}
                </Text>
                <Text variant="caption" color={semantic.textMuted}>
                  Prescription-only · needs a valid Rx
                </Text>
              </View>
              <TagPill label="Rx" tone="danger" />
            </View>
          </ScreenCard>

          <ScreenCard>
            <CardTitle>How should the doctor reach you?</CardTitle>
            <View style={styles.reachRow}>
              {reachChoices.map((choice) => (
                <ReachTile
                  key={choice.id}
                  icon={choice.icon}
                  title={choice.title}
                  body={choice.body}
                  selected={reach === choice.id}
                  onPress={() => setReach(choice.id)}
                />
              ))}
            </View>
            <Text variant="caption" color={semantic.textMuted}>
              {`We’ll call ${doctorPhone}. Wrong number? Change it in Account`}
            </Text>
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
              <CardTitle>Before you request</CardTitle>
            </View>
            <Text variant="footnote" color={semantic.textSecondary}>
              The doctor may prescribe, suggest something else, or advise an in-person visit. If
              no prescription is issued, you can cancel order #MM-20341 before packing at no
              charge.
            </Text>
            <Text variant="footnote" color={semantic.textSecondary}>
              Doctors are calling now, 8 AM to 11 PM. Not for emergencies: call 112.
            </Text>
          </ScreenCard>

          <ScreenCard>
            <CareField
              label="Anything to tell the doctor? (optional)"
              value={note}
              onChangeText={setNote}
              placeholder="For example: a substitute with the same salt is fine"
              tall
            />
          </ScreenCard>
        </View>
      </ScrollView>

      <View style={[styles.actionBar, { paddingBottom: insets.bottom + spacing.sm }]}>
        <View style={[styles.actionInner, { paddingHorizontal: inset }]}>
          <Button
            label="Request a doctor call"
            tone="filled"
            size="large"
            icon="phone"
            chevron
            onPress={onRequest}
          />
          <Pressable
            accessibilityRole="link"
            onPress={onUploadInstead}
            hitSlop={6}
            style={({ pressed }) => [styles.uploadLink, pressed ? { opacity: 0.8 } : null]}
          >
            <Text variant="footnoteEmphasized" color={brand.green}>
              Have a prescription already? Upload it instead
            </Text>
          </Pressable>
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
  doctorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  doctorIcon: {
    width: 56,
    height: 56,
    borderRadius: radii.circle,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: gold[300],
  },
  doctorText: { flex: 1, gap: 2 },
  promises: { flexDirection: 'row', gap: spacing.sm },
  medicineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  medicineText: { flex: 1, gap: 2 },
  reachRow: { flexDirection: 'row', gap: spacing.sm },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  uploadLink: { alignSelf: 'center' },
  actionBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: neutral.surface,
    borderTopWidth: 1,
    borderTopColor: neutral.line,
  },
  actionInner: { gap: spacing.sm, paddingTop: spacing.md },
});
