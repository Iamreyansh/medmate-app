import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  brand,
  gold,
  mint,
  radii,
  semantic,
  spacing,
} from '@medmate/theme';

import { Icon } from '../icons/Icon';
import { Text } from '../ui/Text';
import { Button, Gradient } from '../ui/primitives';
import { useContentInset } from '../ui/layout';
import { ScreenCard, TagPill, ZoneBar, ZoneHeading } from '../ui/blocks';
import { familyMembers } from './data';

export type FamilyScreenProps = {
  onBack?: () => void;
  onHelp?: () => void;
  onAddMember?: () => void;
  onSchedule?: (id: string) => void;
};

/**
 * The family members.
 *
 * The Figma `06 Health & family / Family` frame: the shopper themself at the
 * top, then the rest of the family.
 */
export function FamilyScreen({
  onBack,
  onHelp,
  onAddMember,
  onSchedule,
}: FamilyScreenProps) {
  const insets = useSafeAreaInsets();
  const inset = useContentInset();
  const [you, ...rest] = familyMembers;

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
                title="Family members"
                onBack={onBack}
                onHelp={onHelp}
              />
            </View>
            <View style={[styles.zoneHeading, { paddingHorizontal: inset }]}>
              <ZoneHeading
                title="Care for the whole family"
                body="Add parents, a spouse or children, then set up their medicine reminders in one place."
              />
            </View>
          </View>
        </Gradient>

        <View style={[styles.content, { paddingHorizontal: inset }]}>
          {/* The shopper overlaps the zone. */}
          <View style={styles.overlap}>
            <ScreenCard>
              <View style={styles.memberRow}>
                <View style={[styles.avatar, styles.avatarGold]}>
                  <Text variant="footnoteEmphasized" color={brand.forest}>
                    {you.initials}
                  </Text>
                </View>
                <View style={styles.memberText}>
                  <View style={styles.memberTitle}>
                    <Text variant="buttonSmall" color={semantic.text} numberOfLines={1}>
                      {you.name}
                    </Text>
                    <TagPill label="You" tone="mint" />
                  </View>
                  <Text variant="caption" color={semantic.textMuted} numberOfLines={2}>
                    {you.summary}
                  </Text>
                </View>
                <Button
                  label="Schedule"
                  tone="mint"
                  size="small"
                  icon="clock"
                  chevron
                  onPress={() => onSchedule?.(you.id)}
                  style={styles.schedule}
                />
              </View>
            </ScreenCard>
          </View>

          {/* The rest of the family. */}
          {rest.map((member) => (
            <ScreenCard key={member.id}>
              <View style={styles.memberRow}>
                <View style={[styles.avatar, styles.avatarForest]}>
                  <Text variant="footnoteEmphasized" color={gold[300]}>
                    {member.initials}
                  </Text>
                </View>
                <View style={styles.memberText}>
                  <View style={styles.memberTitle}>
                    <Text variant="buttonSmall" color={semantic.text}>
                      {member.name}
                    </Text>
                    <Icon name="edit" size={14} color={semantic.textMuted} />
                  </View>
                  <Text variant="caption" color={semantic.textMuted}>
                    {`${member.relation} · ${member.age}`}
                  </Text>
                  <Text variant="caption" color={semantic.textMuted}>
                    {member.summary}
                  </Text>
                  <View style={styles.tags}>
                    {member.conditions.map((condition) => (
                      <TagPill key={condition} label={condition} tone="mint" />
                    ))}
                  </View>
                </View>
                <Button
                  label="Schedule"
                  tone="mint"
                  size="small"
                  icon="clock"
                  chevron
                  onPress={() => onSchedule?.(member.id)}
                  style={styles.schedule}
                />
              </View>
            </ScreenCard>
          ))}

          <Button
            label="Add a family member"
            tone="outline"
            size="large"
            icon="plus"
            chevron
            onPress={onAddMember}
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
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: radii.circle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarGold: {
    backgroundColor: gold[300],
  },
  avatarForest: {
    backgroundColor: brand.forest,
  },
  memberText: { flex: 1, gap: 2 },
  memberTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  schedule: { backgroundColor: mint[100] },
});
