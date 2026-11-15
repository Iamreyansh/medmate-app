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
  InfoNote,
  ScreenCard,
  TagPill,
  ZoneBar,
  ZoneHeading,
} from '../ui/blocks';
import { RequestProgress } from './parts';
import { medicineRequests, requestSteps } from './data';

export type MyRequestsScreenProps = {
  onBack?: () => void;
  onHelp?: () => void;
  onRequestAnother?: () => void;
  onCancel?: (id: string) => void;
};

/**
 * The medicines the MedMate team is sourcing.
 *
 * The Figma `05 Prescriptions & care / My requests` frame: the request that
 * is open, how far it has got, and what was asked for.
 */
export function MyRequestsScreen({
  onBack,
  onHelp,
  onRequestAnother,
  onCancel,
}: MyRequestsScreenProps) {
  const insets = useSafeAreaInsets();
  const inset = useContentInset();
  const request = medicineRequests[0];

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
                title="My medicine requests"
                onBack={onBack}
                onHelp={onHelp}
              />
            </View>
            <View style={[styles.zoneHeading, { paddingHorizontal: inset }]}>
              <ZoneHeading
                title="Medicines we source for you"
                body="1 open · 1 in all"
              />
            </View>
          </View>
        </Gradient>

        <View style={[styles.content, { paddingHorizontal: inset }]}>
          <View style={styles.sent}>
            <View style={styles.sentIcon}>
              <Icon name="check" size={16} color={neutral.surface} />
            </View>
            <View style={styles.sentText}>
              <Text variant="buttonSmall" color={semantic.text}>
                {`Request #${request.id} sent`}
              </Text>
              <Text variant="caption" color={semantic.textMuted}>
                The MedMate team checks with pharmacies and distributors, usually within 4 hours
                (8 AM to 11 PM). You’ll see the answer here and in notifications.
              </Text>
            </View>
          </View>

          <Button
            label="Request another medicine"
            tone="outline"
            size="large"
            icon="plus"
            chevron
            onPress={onRequestAnother}
          />

          <ScreenCard>
            <View style={styles.requestHead}>
              <View style={styles.requestIcon}>
                <Icon name="pill" size={24} color={brand.green700} />
              </View>
              <View style={styles.requestText}>
                <Text variant="buttonSmall" color={semantic.text}>
                  {`${request.name} × ${request.quantity}`}
                </Text>
                <Text variant="caption" color={semantic.textMuted}>
                  {`#${request.id} · ${request.sent}`}
                </Text>
              </View>
              <TagPill label="Request sent" tone="gold" />
            </View>

            <RequestProgress step={request.step} total={requestSteps} />

            <Text variant="caption" color={semantic.textSecondary}>
              Waiting for the MedMate team to start checking.
            </Text>

            <View style={styles.facts}>
              <View style={styles.fact}>
                <Text variant="caption" color={semantic.textMuted}>
                  Wanted
                </Text>
                <Text variant="footnoteEmphasized" color={semantic.text}>
                  {request.wanted}
                </Text>
              </View>
              <View style={styles.fact}>
                <Text variant="caption" color={semantic.textMuted}>
                  Prescription
                </Text>
                <Text variant="footnoteEmphasized" color={semantic.text}>
                  {request.prescription}
                </Text>
              </View>
            </View>

            <Pressable
              accessibilityRole="button"
              onPress={() => onCancel?.(request.id)}
              hitSlop={6}
              style={({ pressed }) => [styles.cancel, pressed ? { opacity: 0.8 } : null]}
            >
              <Text variant="footnoteEmphasized" color="#C2392D">
                Cancel request
              </Text>
            </Pressable>
          </ScreenCard>

          <InfoNote icon="info">
            MedMate does not promise every medicine can be found. Prescription medicines are
            delivered only against a valid prescription.
          </InfoNote>
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
  sent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: neutral.line,
    backgroundColor: neutral.surface,
  },
  sentIcon: {
    width: 32,
    height: 32,
    borderRadius: radii.circle,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: brand.green,
  },
  sentText: { flex: 1, gap: 2 },
  requestHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  requestIcon: {
    width: 48,
    height: 48,
    borderRadius: radii.card,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: mint[100],
  },
  requestText: { flex: 1, gap: 2 },
  facts: { flexDirection: 'row', gap: spacing.sm },
  fact: {
    flex: 1,
    gap: 2,
    padding: spacing.md,
    borderRadius: radii.md,
    backgroundColor: mint[50],
  },
  cancel: { alignSelf: 'flex-start' },
});
