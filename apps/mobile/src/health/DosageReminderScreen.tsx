import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
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
  ScreenCard,
  TagPill,
  ZoneBar,
} from '../ui/blocks';
import {
  AddPersonChip,
  DoseRow,
  PersonChip,
  ProgressRing,
  SectionIcon,
  WeekStrip,
} from './parts';
import {
  doseParts,
  lowStock,
  people,
  reminderDisclaimer,
  reminderNote,
  scheduledMedicines,
  todayProgress,
  week,
  weekNote,
} from './data';

export type DosageReminderScreenProps = {
  onBack?: () => void;
  onHelp?: () => void;
  onFamily?: () => void;
  onAddMedicine?: () => void;
  onRefill?: () => void;
};

/**
 * The medicine dosage reminder.
 *
 * The Figma `06 Health & family / Medicine dosage reminder` frame: whose
 * schedule this is, how far through the day they are, the week behind them,
 * and the doses in each part of the day.
 */
export function DosageReminderScreen({
  onBack,
  onHelp,
  onFamily,
  onAddMedicine,
  onRefill,
}: DosageReminderScreenProps) {
  const insets = useSafeAreaInsets();
  const inset = useContentInset();
  const [person, setPerson] = useState('priya');
  const [taken, setTaken] = useState<string[]>(['d1', 'd2', 'd3']);

  const toggle = (id: string) =>
    setTaken((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
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
                backLabel="Home"
                title="Medicine dosage reminder"
                trailing="Family"
                onBack={onBack}
                onHelp={onFamily ?? onHelp}
              />
            </View>

            <View style={[styles.zoneHeading, { paddingHorizontal: inset }]}>
              {/* The people run off the right of the frame, so they scroll. */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.people}
              >
                {people.map((entry) => (
                  <PersonChip
                    key={entry.id}
                    person={entry}
                    selected={entry.id === person}
                    onPress={() => setPerson(entry.id)}
                  />
                ))}
                <AddPersonChip />
              </ScrollView>

              <View style={styles.today}>
                <ProgressRing percent={todayProgress.percent} caption="today" />
                <View style={styles.todayText}>
                  <Text variant="eyebrow" color={gold[300]}>
                    Today
                  </Text>
                  <Text variant="headlineMedium" color={neutral.surface}>
                    {`${todayProgress.taken} of ${todayProgress.total} doses taken`}
                  </Text>
                  <Text variant="footnote" color={mint[200]}>
                    {todayProgress.next}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Gradient>

        <View style={[styles.content, { paddingHorizontal: inset }]}>
          {/* The week overlaps the zone. */}
          <View style={styles.overlap}>
            <ScreenCard>
              <View style={styles.weekHead}>
                <Text variant="headline" color={semantic.text}>
                  This week
                </Text>
                <TagPill label="4 of 6 days complete" tone="mint" />
              </View>
              <WeekStrip days={week} />
              <Text variant="caption" color={semantic.textMuted}>
                {weekNote}
              </Text>
            </ScreenCard>
          </View>

          {/* Running low. */}
          <View style={styles.lowStock}>
            <View style={styles.lowIcon}>
              <Icon name="refill" size={20} color={neutral.surface} />
            </View>
            <View style={styles.lowText}>
              <Text variant="buttonSmall" color={brand.forest}>
                {`${lowStock.name} · ${lowStock.left} left`}
              </Text>
              <Text variant="caption" color={brand.forest}>
                {lowStock.about}
              </Text>
            </View>
            <Button
              label="Refill"
              tone="forest"
              size="small"
              icon="refill"
              chevron
              onPress={onRefill}
              style={styles.refill}
            />
          </View>

          {/* The doses, part by part. */}
          {doseParts.map((part) => (
            <ScreenCard key={part.id}>
              <View style={styles.partHead}>
                <SectionIcon name={part.icon} />
                <Text variant="headline" color={semantic.text} style={styles.partTitle}>
                  {part.label}
                </Text>
                <TagPill
                  label={`${part.taken} of ${part.total} taken`}
                  tone={part.taken === part.total ? 'muted' : 'mint'}
                />
              </View>
              {part.doses.map((dose) => (
                <DoseRow
                  key={dose.id}
                  dose={{ ...dose, taken: taken.includes(dose.id) }}
                  onToggle={() => toggle(dose.id)}
                />
              ))}
            </ScreenCard>
          ))}

          {/* Every medicine on the schedule. */}
          <ScreenCard>
            <CardTitle>All medicines</CardTitle>
            {scheduledMedicines.map((medicine, index) => (
              <View key={medicine.id}>
                {index > 0 ? <View style={styles.divider} /> : null}
                <Pressable
                  accessibilityRole="button"
                  style={styles.medicineRow}
                >
                  <View style={styles.medicineIcon}>
                    <Icon name="pill" size={18} color={brand.green700} />
                  </View>
                  <View style={styles.medicineText}>
                    <Text variant="buttonSmall" color={semantic.text} numberOfLines={2}>
                      {medicine.name}
                    </Text>
                    <Text variant="caption" color={semantic.textMuted}>
                      {medicine.schedule}
                    </Text>
                    <Text
                      variant="captionStrong"
                      color={medicine.low ? '#C2392D' : brand.green700}
                    >
                      {medicine.left}
                    </Text>
                  </View>
                  <Icon name="chev-r" size={16} color={semantic.textMuted} />
                </Pressable>
              </View>
            ))}
          </ScreenCard>

          <Button
            label="Add medicine"
            tone="outline"
            size="large"
            icon="plus"
            chevron
            onPress={onAddMedicine}
          />

          <View style={styles.plainNote}>
            <Icon name="info" size={16} color={brand.green700} />
            <Text variant="footnote" color={brand.green700} style={styles.noteText}>
              {reminderNote}
            </Text>
          </View>

          <Text variant="caption" color={semantic.textMuted}>
            {reminderDisclaimer}
          </Text>
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
  zoneHeading: { gap: spacing.md, marginTop: spacing.md },
  people: { flexDirection: 'row', gap: spacing.sm, paddingRight: spacing.lg },
  today: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  todayText: { flex: 1, gap: spacing.xs },
  content: { gap: spacing.lg, paddingTop: spacing.lg },
  overlap: { marginTop: -spacing.xl },
  weekHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  lowStock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.xl,
    backgroundColor: gold[300],
  },
  lowIcon: {
    width: 40,
    height: 40,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: brand.forest,
  },
  lowText: { flex: 1, gap: 2 },
  refill: { backgroundColor: brand.forest },
  partHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  partTitle: { flex: 1 },
  divider: { height: 1, backgroundColor: neutral.line },
  medicineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  medicineIcon: {
    width: 36,
    height: 36,
    borderRadius: radii.mdPlus,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: mint[100],
  },
  medicineText: { flex: 1, gap: 2 },
  plainNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radii.md,
    backgroundColor: mint[50],
  },
  noteText: { flex: 1 },
});
