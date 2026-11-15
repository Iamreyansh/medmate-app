import React, { useState } from 'react';
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
import { Button, Gradient } from '../ui/primitives';
import { useContentInset } from '../ui/layout';
import {
  CardTitle,
  LinkRow,
  ScreenCard,
  ZoneBar,
  ZoneHeading,
} from '../ui/blocks';
import {
  CareField,
  CareOption,
  DarkStepper,
  RadioOption,
} from './parts';
import {
  doctorPhone,
  prescriptionChoices,
  prescriptions,
  requestAddress,
  requestNote,
  requestTimingChoices,
} from './data';

export type RequestMedicineScreenProps = {
  onBack?: () => void;
  onHelp?: () => void;
  onSend?: () => void;
  onUpload?: () => void;
};

/**
 * Ask the MedMate team to source a medicine.
 *
 * The Figma `05 Prescriptions & care / Request a medicine` frame: what the
 * medicine is, whether it needs a prescription, when it is wanted and where
 * it goes.
 */
export function RequestMedicineScreen({
  onBack,
  onHelp,
  onSend,
  onUpload,
}: RequestMedicineScreenProps) {
  const insets = useSafeAreaInsets();
  const inset = useContentInset();

  const [name, setName] = useState('Thyronorm 50');
  const [details, setDetails] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [prescription, setPrescription] = useState('unsure');
  const [timing, setTiming] = useState('soon');
  const [note, setNote] = useState('');

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
                backLabel="Search"
                title="Request a medicine"
                onBack={onBack}
                onHelp={onHelp}
              />
            </View>
            <View style={[styles.zoneHeading, { paddingHorizontal: inset }]}>
              <ZoneHeading
                title="Can’t find it nearby?"
                body="Tell us what you need. The MedMate team tries to source it for you and confirms the price and delivery time before anything is ordered."
              />
            </View>
          </View>
        </Gradient>

        <View style={[styles.content, { paddingHorizontal: inset }]}>
          <View style={styles.example}>
            <View style={styles.exampleIcon}>
              <Icon name="pin" size={18} color={neutral.surface} />
            </View>
            <Text variant="footnote" color={semantic.text} style={styles.exampleText}>
              For example: Travelling and can’t find your usual medicine in a new city? Schedule
              a request and our team will check and call you back to confirm if it can be
              arranged.
            </Text>
          </View>

          <ScreenCard>
            <CardTitle>Medicine</CardTitle>
            <CareField
              label="Medicine or brand name"
              value={name}
              onChangeText={setName}
            />
            <CareField
              label="Strength, pack or brand details (optional)"
              value={details}
              onChangeText={setDetails}
              placeholder="For example 50 mcg, strip of 10, or any brand of the same salt"
            />
            <View style={styles.quantityRow}>
              <Text variant="footnoteEmphasized" color={semantic.textSecondary}>
                Quantity
              </Text>
              <DarkStepper quantity={quantity} onChange={setQuantity} />
            </View>
          </ScreenCard>

          <ScreenCard>
            <CardTitle>Prescription</CardTitle>
            {prescriptionChoices.map((choice) => (
              <RadioOption
                key={choice.id}
                label={choice.label}
                selected={prescription === choice.id}
                onPress={() => setPrescription(choice.id)}
              />
            ))}
            <Text variant="caption" color={semantic.textMuted}>
              Attach one you already sent (optional):
            </Text>
            <View style={styles.attach}>
              <Icon name="rx-doc" size={16} color={semantic.text} />
              <View style={styles.attachText}>
                <Text variant="footnoteEmphasized" color={semantic.text}>
                  {`#${prescriptions[0].id}`}
                </Text>
                <Text variant="caption" color={semantic.textMuted}>
                  Today · Under review
                </Text>
              </View>
              <View style={styles.attachRadio} />
            </View>
            <Button
              label="Upload a prescription"
              tone="outline"
              size="large"
              icon="rx-up"
              chevron
              onPress={onUpload}
            />
            <Text variant="caption" color={semantic.textMuted}>
              You can also send it later. The team asks for a valid prescription before delivery.
            </Text>
          </ScreenCard>

          <ScreenCard>
            <CardTitle>When do you need it?</CardTitle>
            {requestTimingChoices.map((choice) => (
              <CareOption
                key={choice.id}
                icon={choice.icon}
                title={choice.title}
                body={choice.body}
                selected={timing === choice.id}
                onPress={() => setTiming(choice.id)}
              />
            ))}
          </ScreenCard>

          <ScreenCard>
            <View style={styles.deliverHead}>
              <CardTitle>Deliver to</CardTitle>
              <LinkRow icon="chev-r" label="Change" />
            </View>
            <View style={styles.deliverRow}>
              <Icon name="pin" size={16} color={semantic.text} />
              <Text variant="footnote" color={semantic.text} style={styles.lineText}>
                {`${requestAddress.label} · ${requestAddress.line}`}
              </Text>
            </View>
            <View style={styles.deliverRow}>
              <Icon name="phone" size={16} color={semantic.text} />
              <Text variant="footnote" color={semantic.textSecondary} style={styles.lineText}>
                {`The team calls you on ${doctorPhone}.`}
              </Text>
              <Text variant="footnoteEmphasized" color={brand.green}>
                Change
              </Text>
            </View>
          </ScreenCard>

          <ScreenCard>
            <CardTitle>Anything else? (optional)</CardTitle>
            <CareField
              value={note}
              onChangeText={setNote}
              placeholder="For example: a substitute with the same salt is fine, or the doctor’s name on the prescription"
              tall
            />
          </ScreenCard>

          <View style={styles.plainNote}>
            <Icon name="info" size={16} color={brand.green700} />
            <Text variant="footnote" color={brand.green700} style={styles.exampleText}>
              {requestNote}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.actionBar, { paddingBottom: insets.bottom + spacing.sm }]}>
        <View style={[styles.actionInner, { paddingHorizontal: inset }]}>
          <Button
            label="Send request"
            tone="filled"
            size="large"
            icon="rx-up"
            chevron
            onPress={onSend}
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
  example: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.card,
    backgroundColor: gold[50],
  },
  exampleIcon: {
    width: 36,
    height: 36,
    borderRadius: radii.circle,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: brand.forest,
  },
  exampleText: { flex: 1 },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  attach: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: neutral.line,
  },
  attachText: { flex: 1, gap: 2 },
  attachRadio: {
    width: 22,
    height: 22,
    borderRadius: radii.circle,
    borderWidth: 1.5,
    borderColor: neutral.line2,
  },
  deliverHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  deliverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  lineText: { flex: 1 },
  plainNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radii.md,
    backgroundColor: mint[50],
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
  actionInner: { paddingTop: spacing.md },
});
