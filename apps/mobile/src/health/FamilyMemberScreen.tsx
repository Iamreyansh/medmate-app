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
  InfoNote,
  ScreenCard,
  TagPill,
  ZoneBar,
} from '../ui/blocks';
import { CareField } from '../care/parts';
import { FilterChip, SquareChip } from './parts';
import {
  allergies,
  conditions,
  consentLine,
  familyPrivacyNote,
  relations,
} from './data';

export type FamilyMemberScreenProps = {
  onBack?: () => void;
  onHelp?: () => void;
  onSave?: () => void;
};

/**
 * Add a family member.
 *
 * The Figma `06 Health & family / Family member` frame: the relation, the
 * name, their age and the health details that keep them safe.
 */
export function FamilyMemberScreen({
  onBack,
  onHelp,
  onSave,
}: FamilyMemberScreenProps) {
  const insets = useSafeAreaInsets();
  const inset = useContentInset();

  const [relation, setRelation] = useState('Mother');
  const [name, setName] = useState('');
  const [age, setAge] = useState('62');
  const [ageMode, setAgeMode] = useState<'age' | 'birthday'>('age');
  const [picked, setPicked] = useState<string[]>(['Diabetes', 'High BP']);
  const [reactions, setReactions] = useState<string[]>([]);
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(true);

  const toggle = (
    value: string,
    list: string[],
    setList: (next: string[]) => void,
  ) =>
    setList(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);

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
                backLabel="Family"
                title="Add family member"
                onBack={onBack}
                onHelp={onHelp}
              />
            </View>
            <View style={[styles.zoneHeading, { paddingHorizontal: inset }]}>
              <View style={styles.newMember}>
                <View style={styles.newMemberAvatar}>
                  <Icon name="user" size={28} color={brand.forest} />
                </View>
                <View style={styles.newMemberText}>
                  <Text variant="titleLarge" color={neutral.surface}>
                    New family member
                  </Text>
                  <Text variant="footnote" color={mint[200]}>
                    Mother · 62 yrs
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Gradient>

        <View style={[styles.content, { paddingHorizontal: inset }]}>
          {/* Who they are. */}
          <View style={styles.overlap}>
            <ScreenCard>
              <Text variant="headline" color={semantic.text}>
                Who are you adding?
              </Text>
              <Text variant="caption" color={semantic.textMuted}>
                Only two things are needed: the relation and a name.
              </Text>
              <View style={styles.squares}>
                {relations.map((option) => (
                  <SquareChip
                    key={option}
                    label={option}
                    selected={option === relation}
                    onPress={() => setRelation(option)}
                    style={styles.squareFlex}
                  />
                ))}
              </View>
              <CareField
                label="Full name"
                value={name}
                onChangeText={setName}
                placeholder="Your mother’s full name"
                helper="As written on their prescriptions"
              />
            </ScreenCard>
          </View>

          {/* How old they are. */}
          <ScreenCard>
            <CardTitle>How old are they?</CardTitle>
            <View style={styles.segmentTrack}>
              {(['age', 'birthday'] as const).map((option) => (
                <Pressable
                  key={option}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: ageMode === option }}
                  onPress={() => setAgeMode(option)}
                  style={[
                    styles.segment,
                    ageMode === option ? styles.segmentOn : null,
                  ]}
                >
                  <Text
                    variant="footnoteEmphasized"
                    color={semantic.text}
                    numberOfLines={1}
                  >
                    {option === 'age' ? 'Age' : 'Birthday'}
                  </Text>
                </Pressable>
              ))}
            </View>
            <CareField
              label="Age in years"
              value={age}
              onChangeText={setAge}
              helper="Not sure of the birthday? An age is enough."
            />
          </ScreenCard>

          {/* Their health details. */}
          <ScreenCard>
            <View style={styles.detailHead}>
              <Text variant="headline" color={semantic.text}>
                Health details
              </Text>
              <TagPill label="Optional" tone="mint" />
            </View>
            <Text variant="caption" color={semantic.textMuted}>
              Helps the pharmacist and doctor keep your mother safe. Tap what applies.
            </Text>

            <Text variant="footnoteEmphasized" color={semantic.textSecondary}>
              Ongoing conditions
            </Text>
            <View style={styles.chips}>
              {conditions.map((option) => (
                <FilterChip
                  key={option}
                  label={option}
                  selected={picked.includes(option)}
                  onPress={() => toggle(option, picked, setPicked)}
                />
              ))}
            </View>

            <Text variant="footnoteEmphasized" color={semantic.textSecondary}>
              Allergies to medicines
            </Text>
            <View style={styles.chips}>
              {allergies.map((option) => (
                <FilterChip
                  key={option}
                  label={option}
                  selected={reactions.includes(option)}
                  onPress={() => toggle(option, reactions, setReactions)}
                />
              ))}
            </View>

            <CareField
              label="Their mobile number (optional)"
              value={phone}
              onChangeText={setPhone}
              placeholder="+91 98450 12345"
              helper="Useful if a pharmacist or doctor needs to reach them"
            />
          </ScreenCard>

          <Pressable
            accessibilityRole="checkbox"
            accessibilityState={{ checked: consent }}
            onPress={() => setConsent((current) => !current)}
            style={({ pressed }) => [styles.consent, pressed ? { opacity: 0.9 } : null]}
          >
            <View style={[styles.consentBox, consent ? styles.consentBoxOn : null]}>
              {consent ? <Icon name="check" size={12} color={neutral.surface} /> : null}
            </View>
            <Text variant="footnote" color={semantic.text} style={styles.consentText}>
              {consentLine}
            </Text>
          </Pressable>

          <InfoNote icon="shield">{familyPrivacyNote}</InfoNote>
        </View>
      </ScrollView>

      <View style={[styles.actionBar, { paddingBottom: insets.bottom + spacing.sm }]}>
        <View style={[styles.actionInner, { paddingHorizontal: inset }]}>
          <Button
            label="Add to family"
            tone="filled"
            size="large"
            icon="user"
            chevron
            onPress={onSave}
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
  newMember: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  newMemberAvatar: {
    width: 64,
    height: 64,
    borderRadius: radii.circle,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: gold[300],
  },
  newMemberText: { flex: 1, gap: 2 },
  content: { gap: spacing.lg, paddingTop: spacing.lg },
  overlap: { marginTop: -spacing.xl },
  squares: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  squareFlex: { flexGrow: 1, flexBasis: 100 },
  segmentTrack: {
    flexDirection: 'row',
    gap: spacing.xs,
    height: 32,
    padding: spacing.xxs,
    borderRadius: radii.md,
    backgroundColor: neutral.surface3,
  },
  segment: {
    flex: 1,
    height: 28,
    borderRadius: radii.xs + 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentOn: {
    backgroundColor: neutral.surface,
  },
  detailHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  consent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.card,
  },
  consentBox: {
    width: 22,
    height: 22,
    borderRadius: radii.circle,
    borderWidth: 1.5,
    borderColor: neutral.line2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  consentBoxOn: {
    backgroundColor: brand.green,
    borderColor: brand.green,
  },
  consentText: { flex: 1 },
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
