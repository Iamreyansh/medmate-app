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
import { CardTitle, ScreenCard, ZoneBar } from '../ui/blocks';
import { CareField } from '../care/parts';
import { FilterChip } from '../health/parts';
import { account, allergyOptions, bloodGroups } from './data';

export type ProfileScreenProps = {
  onBack?: () => void;
  onHelp?: () => void;
  onSave?: () => void;
};

/**
 * Edit the profile.
 *
 * The Figma `07 Account / Profile` frame: who the shopper is, the health
 * details that keep them safe and an emergency contact.
 */
export function ProfileScreen({ onBack, onHelp, onSave }: ProfileScreenProps) {
  const insets = useSafeAreaInsets();
  const inset = useContentInset();

  const [name, setName] = useState(account.name);
  const [email, setEmail] = useState('');
  const [birthday, setBirthday] = useState('12 Mar 1992');
  const [gender, setGender] = useState('Female');
  const [blood, setBlood] = useState<string[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [otherAllergy, setOtherAllergy] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactMobile, setContactMobile] = useState('');

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
        keyboardShouldPersistTaps="handled"
      >
        <Gradient token="brand" radius={radii.huge} style={styles.zone}>
          <View style={[styles.zoneInner, { paddingTop: insets.top }]}>
            <View style={{ paddingHorizontal: inset }}>
              <ZoneBar
                backLabel="Account"
                title="Edit profile"
                onBack={onBack}
                onHelp={onHelp}
              />
            </View>
            <View style={[styles.zoneContent, { paddingHorizontal: inset }]}>
              <View style={styles.identity}>
                <View style={styles.avatar}>
                  <Text variant="titleLarge" color={brand.forest}>
                    {account.initials}
                  </Text>
                </View>
                <View style={styles.identityText}>
                  <Text variant="titleLarge" color={neutral.surface}>
                    {account.name}
                  </Text>
                  <Text variant="footnote" color={mint[200]}>
                    {account.phone}
                  </Text>
                  <View style={styles.verifiedRow}>
                    <Icon name="badge-check" size={12} color={gold[300]} />
                    <Text variant="caption" color={gold[300]}>
                      verified
                    </Text>
                  </View>
                </View>
                <Text variant="caption" color={mint[200]}>
                  {account.age}
                </Text>
              </View>
            </View>
          </View>
        </Gradient>

        <View style={[styles.content, { paddingHorizontal: inset }]}>
          {/* About you. */}
          <View style={styles.overlap}>
            <ScreenCard>
              <CardTitle>About you</CardTitle>
              <CareField
                label="Full name"
                value={name}
                onChangeText={setName}
                helper="As on your prescriptions, so the pharmacist can match them"
              />
              <CareField
                label="Email (optional)"
                value={email}
                onChangeText={setEmail}
                placeholder="name@example.com"
                helper="For invoices and receipts. We don’t send offers by email unless you turn offers on."
              />
              <CareField
                label="Date of birth"
                value={birthday}
                onChangeText={setBirthday}
                helper="Helps the pharmacist check doses that depend on age"
              />
              <Text variant="footnoteEmphasized" color={semantic.textSecondary}>
                Gender
              </Text>
              <View style={styles.chips}>
                {['Female', 'Male', 'Other'].map((option) => (
                  <FilterChip
                    key={option}
                    label={option}
                    selected={gender === option}
                    onPress={() => setGender(option)}
                  />
                ))}
              </View>
              <Text variant="footnote" color={brand.green700}>
                Mobile number: {account.phone}. This is how you sign in, so it can’t be changed
                here.
              </Text>
            </ScreenCard>
          </View>

          {/* Health details. */}
          <ScreenCard>
            <CardTitle>Health details</CardTitle>
            <Text variant="caption" color={semantic.textMuted}>
              Optional. Helps pharmacists and doctors keep you safe. Shared only for an order or
              consult you start.
            </Text>

            <Text variant="footnoteEmphasized" color={semantic.textSecondary}>
              Blood group
            </Text>
            <View style={styles.chips}>
              {bloodGroups.map((option) => (
                <FilterChip
                  key={option}
                  label={option}
                  selected={blood.includes(option)}
                  onPress={() => toggle(option, blood, setBlood)}
                />
              ))}
            </View>
            <Text variant="caption" color={semantic.textMuted}>
              Tap again to clear
            </Text>

            <Text variant="footnoteEmphasized" color={semantic.textSecondary}>
              Allergies to medicines
            </Text>
            <View style={styles.chips}>
              {allergyOptions.map((option) => (
                <FilterChip
                  key={option}
                  label={option}
                  selected={allergies.includes(option)}
                  onPress={() => toggle(option, allergies, setAllergies)}
                />
              ))}
            </View>
            <CareField
              value={otherAllergy}
              onChangeText={setOtherAllergy}
              placeholder="Any other allergy, for example ibuprofen"
            />
          </ScreenCard>

          {/* Emergency contact. */}
          <ScreenCard>
            <CardTitle>Emergency contact</CardTitle>
            <Text variant="caption" color={semantic.textMuted}>
              Optional. Someone close to you, kept with your health details.
            </Text>
            <CareField
              label="Name"
              value={contactName}
              onChangeText={setContactName}
              placeholder="For example Rahul (brother)"
            />
            <CareField
              label="Mobile number"
              value={contactMobile}
              onChangeText={setContactMobile}
              placeholder="98450 12345"
              keyboardType="phone-pad"
            />
          </ScreenCard>

          <View style={styles.shieldLine}>
            <Icon name="shield" size={16} color={brand.green700} />
            <Text variant="footnote" color={semantic.textSecondary} style={styles.lineText}>
              Saved to your account and synced to every device you sign in on. See the Privacy
              Policy.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.actionBar, { paddingBottom: insets.bottom + spacing.sm }]}>
        <View style={[styles.actionInner, { paddingHorizontal: inset }]}>
          <Button
            label="No changes yet"
            tone="muted"
            size="large"
            icon="check"
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
  zoneContent: { paddingTop: spacing.md },
  identity: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: radii.circle,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: gold[300],
  },
  identityText: { flex: 1, gap: 2 },
  verifiedRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  content: { gap: spacing.lg, paddingTop: spacing.lg },
  overlap: { marginTop: -spacing.xl },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  shieldLine: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  lineText: { flex: 1 },
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
