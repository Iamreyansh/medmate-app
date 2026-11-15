import React, { useState } from 'react';
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
import { PermissionPrompt, permissionCopy } from '../overlays/parts';
import {
  CheckLine,
  InfoNote,
  ZoneBar,
  ZoneHeading,
} from '../ui/blocks';
import { CareSteps, ValidPrescriptionCard } from './parts';
import {
  clearPhotoLines,
  prescriptionFileTypes,
  prescriptionSteps,
  uploadNote,
  validPrescriptionLines,
} from './data';

export type UploadPrescriptionScreenProps = {
  onBack?: () => void;
  onHelp?: () => void;
  onTakePhoto?: () => void;
  onUploadFile?: () => void;
  onSend?: () => void;
  onConsultation?: () => void;
};

/**
 * Upload a prescription.
 *
 * The Figma `05 Prescriptions & care / Upload prescription` frame: a zone
 * that says what happens, the three steps of sending one, the drop zone, and
 * what a valid prescription has to show.
 */
export function UploadPrescriptionScreen({
  onBack,
  onHelp,
  onTakePhoto,
  onUploadFile,
  onSend,
  onConsultation,
}: UploadPrescriptionScreenProps) {
  const insets = useSafeAreaInsets();
  const inset = useContentInset();
  const [asking, setAsking] = useState(false);

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
                backLabel="Home"
                title="Upload prescription"
                onBack={onBack}
                onHelp={onHelp}
              />
            </View>
            <View style={[styles.zoneHeading, { paddingHorizontal: inset }]}>
              <ZoneHeading
                title="Send us your prescription"
                body="A registered pharmacist checks it, usually within 30 minutes, 8 AM to 11 PM."
              />
            </View>
          </View>
        </Gradient>

        <View style={[styles.content, { paddingHorizontal: inset }]}>
          {/* The three steps overlap the zone. */}
          <View style={styles.overlap}>
            <ScreenCardCompact>
              <CareSteps steps={prescriptionSteps} current={0} />
            </ScreenCardCompact>
          </View>

          {/* The drop zone. */}
          <View style={styles.dropZone}>
            <IconTileLarge />
            <Text variant="titleLarge" color={semantic.text}>
              Add your prescription
            </Text>
            <Text variant="footnote" color={semantic.textSecondary}>
              A clear photo, or a PDF up to 4 MB. Photos are resized on your phone before sending.
            </Text>
            <Text variant="caption" color={semantic.textMuted}>
              {prescriptionFileTypes}
            </Text>
            <View style={styles.dropButtons}>
              <Button
                label="Take photo"
                tone="filled"
                size="large"
                icon="camera"
                chevron
                onPress={() => setAsking(true)}
                style={styles.dropButton}
              />
              <Button
                label="Upload file"
                tone="outline"
                size="large"
                icon="rx-up"
                chevron
                onPress={onUploadFile}
                style={styles.dropButton}
              />
            </View>
          </View>

          <View>
            <ValidPrescriptionCard
            lines={validPrescriptionLines('Doctor’s signature or clinic stamp')}
          />
            <Text variant="caption" color={semantic.textMuted} style={styles.uploadNote}>
              {uploadNote}
            </Text>
          </View>

          <ScreenCardCompact>
            <Text variant="headline" color={semantic.text}>
              For a clear photo
            </Text>
            {clearPhotoLines.map((line) => (
              <CheckLine key={line.text} icon={line.icon}>
                {line.text}
              </CheckLine>
            ))}
          </ScreenCardCompact>

          <InfoNote icon="shield">
            Stored encrypted and shared only with the pharmacist who checks it and the pharmacy
            that fulfils your order. You can remove it from My Prescriptions.
          </InfoNote>

          <Pressable
            accessibilityRole="link"
            onPress={onConsultation}
            style={({ pressed }) => [styles.consultLink, pressed ? { opacity: 0.8 } : null]}
          >
            <Text variant="footnoteEmphasized" color={brand.green}>
              Need a consultation? Talk to a registered doctor
            </Text>
            <Icon name="chev-r" size={14} color={brand.green} />
          </Pressable>
        </View>
      </ScrollView>

      <PermissionPrompt
        visible={asking}
        title={permissionCopy.camera.title}
        body={permissionCopy.camera.body}
        onAllow={() => {
          setAsking(false);
          onTakePhoto?.();
        }}
        onDeny={() => setAsking(false)}
      />

      {/* The action bar. */}
      <View style={[styles.actionBar, { paddingBottom: insets.bottom + spacing.sm }]}>
        <View style={[styles.actionInner, { paddingHorizontal: inset }]}>
          <Button
            label="Send prescription"
            tone="muted"
            size="large"
            icon="rx-up"
            chevron
            onPress={onSend}
          />
          <Text variant="caption" color={semantic.textMuted}>
            No prescription? Add the medicine to your cart and place the order. A registered
            doctor can call you to assess.
          </Text>
        </View>
      </View>
    </View>
  );
}

/** The drop zone's icon. */
function IconTileLarge() {
  return (
    <View style={styles.dropIcon}>
      <Icon name="rx-up" size={32} color={neutral.surface} />
    </View>
  );
}

/** A white card. The overlap card and the plain cards use the same shape. */
function ScreenCardCompact({ children }: { children: React.ReactNode }) {
  return <View style={styles.card}>{children}</View>;
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
  card: {
    padding: spacing.lg,
    gap: spacing.md,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: neutral.line,
    backgroundColor: neutral.surface,
  },
  dropZone: {
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: radii.huge,
    borderWidth: 1,
    borderColor: mint[200],
    backgroundColor: mint[50],
  },
  dropIcon: {
    width: 64,
    height: 64,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: brand.forest,
    marginBottom: spacing.xs,
  },
  dropButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
    width: '100%',
    marginTop: spacing.sm,
  },
  dropButton: {
    flex: 1,
    // Two buttons sit side by side here, so they carry less padding than the
    // full width buttons to keep their labels on one line.
    paddingHorizontal: spacing.md,
  },
  uploadNote: {
    marginTop: spacing.sm,
  },
  consultLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  actionBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: neutral.surface,
    borderTopWidth: 1,
    borderTopColor: neutral.line,
  },
  actionInner: {
    gap: spacing.sm,
    paddingTop: spacing.md,
  },
});
