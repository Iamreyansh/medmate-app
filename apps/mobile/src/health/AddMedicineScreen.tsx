import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  brand,
  radii,
  semantic,
  spacing,
} from '@medmate/theme';

import { Icon } from '../icons/Icon';
import { Text } from '../ui/Text';
import { Button, Gradient } from '../ui/primitives';
import { useContentInset } from '../ui/layout';
import { CardTitle, ScreenCard, ZoneBar, ZoneHeading } from '../ui/blocks';
import { CareField } from '../care/parts';
import { FilterChip } from './parts';
import { doseOptions, foodOptions, people, timeOptions } from './data';

export type AddMedicineScreenProps = {
  onBack?: () => void;
  onHelp?: () => void;
  onSave?: () => void;
};

/**
 * Add a medicine to the reminder schedule.
 *
 * The Figma `06 Health & family / Add medicine` frame: whose it is for, the
 * medicine, how much to take and when.
 */
export function AddMedicineScreen({ onBack, onHelp, onSave }: AddMedicineScreenProps) {
  const insets = useSafeAreaInsets();
  const inset = useContentInset();

  const [person, setPerson] = useState('priya');
  const [name, setName] = useState('Dr Morepen Calcium + Advanced Tablet');
  const [dose, setDose] = useState('1 tablet');
  const [times, setTimes] = useState<string[]>(['Morning 8:00 am']);
  const [food, setFood] = useState('After food');

  const toggleTime = (time: string) =>
    setTimes((current) =>
      current.includes(time) ? current.filter((item) => item !== time) : [...current, time],
    );

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
                backLabel="Schedule"
                title="Add medicine"
                onBack={onBack}
                onHelp={onHelp}
              />
            </View>
            <View style={[styles.zoneHeading, { paddingHorizontal: inset }]}>
              <ZoneHeading
                title="What do you take?"
                body="Set the times. Reminders show in the app at dose time while it is open, and we track how much is left."
              />
            </View>
          </View>
        </Gradient>

        <View style={[styles.content, { paddingHorizontal: inset }]}>
          {/* Who it is for, and the medicine. */}
          <View style={styles.overlap}>
            <ScreenCard>
              <Text variant="footnoteEmphasized" color={semantic.textSecondary}>
                For
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

              <CareField
                label="Medicine name"
                value={name}
                onChangeText={setName}
              />

              <View style={styles.found}>
                <Icon name="check" size={14} color={brand.green700} />
                <Text variant="caption" color={brand.green700}>
                  Found in the MedMate catalogue, so you can refill in one tap.
                </Text>
              </View>
            </ScreenCard>
          </View>

          {/* How much and when. */}
          <ScreenCard>
            <CardTitle>How much, and when</CardTitle>

            <Text variant="footnoteEmphasized" color={semantic.textSecondary}>
              Dose
            </Text>
            <View style={styles.chips}>
              {doseOptions.map((option) => (
                <FilterChip
                  key={option}
                  label={option}
                  selected={option === dose}
                  onPress={() => setDose(option)}
                />
              ))}
            </View>

            <Text variant="footnoteEmphasized" color={semantic.textSecondary}>
              {`Times each day · ${times.length} of up to 6`}
            </Text>
            <View style={styles.chips}>
              {timeOptions.map((option) => (
                <FilterChip
                  key={option}
                  label={option}
                  selected={times.includes(option)}
                  onPress={() => toggleTime(option)}
                />
              ))}
            </View>

            <Text variant="footnoteEmphasized" color={semantic.textSecondary}>
              With food
            </Text>
            <View style={styles.chips}>
              {foodOptions.map((option) => (
                <FilterChip
                  key={option}
                  label={option}
                  selected={option === food}
                  onPress={() => setFood(option)}
                />
              ))}
            </View>
          </ScreenCard>

          <Button
            label="Add medicine"
            tone="filled"
            size="large"
            icon="pill"
            chevron
            onPress={onSave}
          />
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
  overlap: { marginTop: -spacing.xl },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  found: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});
