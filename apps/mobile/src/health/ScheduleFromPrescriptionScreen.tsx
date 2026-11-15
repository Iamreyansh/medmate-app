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
import { ArtTile, Button, Gradient } from '../ui/primitives';
import { useContentInset } from '../ui/layout';
import {
  InfoNote,
  ScreenCard,
  TagPill,
  ZoneBar,
  ZoneHeading,
} from '../ui/blocks';
import { CareField } from '../care/parts';
import { FilterChip, SquareChip } from './parts';
import { ePrescription } from '../care/data';
import { foodOptions, people, scheduleNote } from './data';

export type ScheduleFromPrescriptionScreenProps = {
  onBack?: () => void;
  onHelp?: () => void;
  onConfirm?: () => void;
};

/**
 * Turn an e-prescription into a reminder schedule.
 *
 * The Figma `06 Health & family / Schedule from prescription` frame: the
 * medicine the doctor wrote, the dose, the times and how many are left.
 */
export function ScheduleFromPrescriptionScreen({
  onBack,
  onHelp,
  onConfirm,
}: ScheduleFromPrescriptionScreenProps) {
  const insets = useSafeAreaInsets();
  const inset = useContentInset();
  const medicine = ePrescription.medicines[0];

  const [person, setPerson] = useState('priya');
  const [dose, setDose] = useState('1 tablet');
  const [days, setDays] = useState('Ongoing');
  const [food, setFood] = useState('After food');
  const [times, setTimes] = useState<string[]>(['8:00 am']);
  const [stock, setStock] = useState('10');

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: insets.bottom + 140 }}
        showsVerticalScrollIndicator={false}
      >
        <Gradient token="brand" radius={radii.huge} style={styles.zone}>
          <View style={[styles.zoneInner, { paddingTop: insets.top }]}>
            <View style={{ paddingHorizontal: inset }}>
              <ZoneBar
                backLabel="Schedule"
                title="Reminders from prescription"
                onBack={onBack}
                onHelp={onHelp}
              />
            </View>
            <View style={[styles.zoneHeading, { paddingHorizontal: inset }]}>
              <ZoneHeading
                title="Turn it into a schedule"
                body="From MedMate doctor, 30 Oct. Check each line, then confirm."
              />
            </View>
          </View>
        </Gradient>

        <View style={[styles.content, { paddingHorizontal: inset }]}>
          {/* Whose medicines they are. */}
          <View style={styles.overlap}>
            <ScreenCard>
              <Text variant="headline" color={semantic.text}>
                Whose medicines are these?
              </Text>
              <View style={styles.chips}>
                {people
                  .filter((entry) => entry.id !== 'everyone')
                  .map((entry) => (
                    <FilterChip
                      key={entry.id}
                      label={entry.label}
                      selected={entry.id === person}
                      onPress={() => setPerson(entry.id)}
                    />
                  ))}
              </View>
            </ScreenCard>
          </View>

          <ScreenCard>
            <View style={styles.medicineRow}>
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
                  As written on your e-prescription
                </Text>
              </View>
              <View style={styles.selected}>
                <Icon name="check" size={12} color={neutral.surface} />
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.pairRow}>
              <CareField
                label="Dose"
                value={dose}
                onChangeText={setDose}
                style={styles.pair}
              />
              <CareField
                label="For how many days"
                value={days}
                onChangeText={setDays}
                style={styles.pair}
              />
            </View>

            <Text variant="footnoteEmphasized" color={semantic.textSecondary}>
              Times each day
            </Text>
            <View style={styles.times}>
              {times.map((time) => (
                <Pressable
                  key={time}
                  accessibilityRole="button"
                  onPress={() => setTimes((current) => current.filter((item) => item !== time))}
                  style={styles.timeChip}
                >
                  <Text variant="footnoteEmphasized" color={neutral.surface}>
                    {time}
                  </Text>
                  <Icon name="x" size={14} color={neutral.surface} />
                </Pressable>
              ))}
              <Pressable
                accessibilityRole="button"
                onPress={() => setTimes((current) => [...current, '8:00 pm'])}
                style={styles.addTime}
              >
                <Icon name="plus" size={14} color={brand.green} />
                <Text variant="footnoteEmphasized" color={brand.green}>
                  Add time
                </Text>
              </Pressable>
            </View>

            <View style={styles.chips}>
              {foodOptions.map((option) => (
                <SquareChip
                  key={option}
                  label={option}
                  selected={option === food}
                  onPress={() => setFood(option)}
                />
              ))}
            </View>

            <CareField
              label="Tablets or doses you have for this course"
              value={stock}
              onChangeText={setStock}
            />
          </ScreenCard>

          <InfoNote icon="shield">{scheduleNote}</InfoNote>
        </View>
      </ScrollView>

      <View style={[styles.actionBar, { paddingBottom: insets.bottom + spacing.sm }]}>
        <View style={[styles.actionInner, { paddingHorizontal: inset }]}>
          <Button
            label="Confirm 1 medicine and start reminders"
            tone="filled"
            size="large"
            icon="check"
            chevron
            onPress={onConfirm}
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
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  medicineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  medicineText: { flex: 1, gap: 2 },
  medicineTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  selected: {
    width: 22,
    height: 22,
    borderRadius: radii.circle,
    backgroundColor: brand.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: { height: 1, backgroundColor: neutral.line },
  pairRow: { flexDirection: 'row', gap: spacing.md },
  pair: { flex: 1 },
  times: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.sm,
  },
  timeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    height: 32,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    backgroundColor: brand.forest,
  },
  addTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    height: 32,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: neutral.line,
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
