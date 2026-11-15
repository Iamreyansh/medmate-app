import React from 'react';
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
import { Gradient } from '../ui/primitives';
import { useContentInset } from '../ui/layout';
import { BottomChrome } from '../shop/BottomChrome';
import { ZoneBar } from '../ui/blocks';
import { AccountGroup } from './parts';
import { account, accountGroups, accountStats } from './data';

export type AccountScreenProps = {
  onBack?: () => void;
  onHelp?: () => void;
  onLink?: (id: string) => void;
  onEdit?: () => void;
  onTabPress?: (id: string) => void;
  onChatPress?: () => void;
};

/**
 * My account.
 *
 * The Figma `07 Account / Account` frame: who is signed in, what is
 * happening with their order, their wallet, and everything else the account
 * holds.
 */
export function AccountScreen({
  onBack,
  onHelp,
  onLink,
  onEdit,
  onTabPress,
  onChatPress,
}: AccountScreenProps) {
  const insets = useSafeAreaInsets();
  const inset = useContentInset();

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: insets.bottom + 110 }}
        showsVerticalScrollIndicator={false}
      >
        <Gradient token="brand" radius={radii.huge} style={styles.zone}>
          <View style={[styles.zoneInner, { paddingTop: insets.top }]}>
            <View style={{ paddingHorizontal: inset }}>
              <ZoneBar backLabel="Back" onBack={onBack} onHelp={onHelp} />
              <View style={styles.titleRow}>
                <Text variant="pharmacyTitle" color={neutral.surface}>
                  My account
                </Text>
              </View>
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
                </View>
                <Pressable
                  accessibilityRole="button"
                  onPress={onEdit}
                  style={({ pressed }) => [styles.edit, pressed ? { opacity: 0.85 } : null]}
                >
                  <Text variant="footnoteEmphasized" color={neutral.surface}>
                    Edit
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Gradient>

        <View style={[styles.content, { paddingHorizontal: inset }]}>
          {/* The counts overlap the zone. */}
          <View style={styles.overlap}>
            <View style={styles.stats}>
              {accountStats.map((stat, index) => (
                <React.Fragment key={stat.label}>
                  {index > 0 ? <View style={styles.statRule} /> : null}
                  <View style={styles.stat}>
                    <Text variant="amount" color={brand.forest}>
                      {stat.value}
                    </Text>
                    <Text variant="caption" color={semantic.textMuted}>
                      {stat.label}
                    </Text>
                  </View>
                </React.Fragment>
              ))}
            </View>
          </View>

          {/* How much of the profile is filled in. */}
          <View style={styles.profileCard}>
            <View style={styles.profileRow}>
              <View style={styles.profileIcon}>
                <Icon name="user" size={20} color={brand.green700} />
              </View>
              <View style={styles.profileText}>
                <Text variant="buttonSmall" color={semantic.text}>
                  {`Profile ${account.profilePercent}% complete`}
                </Text>
                <Text variant="caption" color={semantic.textMuted}>
                  {account.profileMissing}
                </Text>
              </View>
              <Pressable accessibilityRole="button" onPress={onEdit} hitSlop={6}>
                <Text variant="footnoteEmphasized" color={brand.green}>
                  Complete
                </Text>
              </Pressable>
            </View>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${account.profilePercent}%` },
                ]}
              />
            </View>
          </View>

          {/* The order that needs attention. */}
          <View style={styles.liveOrder}>
            <View style={styles.liveIcon}>
              {/* The glyph sits on the gold tile, so it is the dark green. */}
              <Icon name="rx-doc" size={20} color={brand.forest} />
            </View>
            <View style={styles.liveText}>
              <Text variant="buttonSmall" color={neutral.surface}>
                Order waiting for a prescription
              </Text>
              <Text variant="caption" color={mint[200]}>
                #MM-20341
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={() => onLink?.('orders')}
              hitSlop={6}
              style={styles.liveLink}
            >
              <Text variant="footnoteEmphasized" color={gold[300]}>
                Track
              </Text>
              <Icon name="chev-r" size={14} color={gold[300]} />
            </Pressable>
          </View>

          {/* The wallet. */}
          <View style={styles.money}>
            <View style={styles.moneyIcon}>
              <Icon name="wallet" size={20} color={neutral.surface} />
            </View>
            <View style={styles.moneyText}>
              <Text variant="eyebrow" color={brand.forest}>
                MedMate Money
              </Text>
              <Text variant="headlineMedium" color={brand.forest}>
                {account.money}
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={() => onLink?.('orders')}
              hitSlop={6}
              style={styles.moneyLink}
            >
              <Text variant="footnoteEmphasized" color={brand.forest}>
                Use at checkout
              </Text>
              <Icon name="chev-r" size={14} color={brand.forest} />
            </Pressable>
          </View>

          {/* Everything else. */}
          {accountGroups.map((group) => (
            <AccountGroup
              key={group.label}
              label={group.label}
              links={group.links}
              onPress={onLink}
            />
          ))}

          <Text variant="caption" color={semantic.textFaint}>
            MedMate version 0.1.0 · Made in Bengaluru
          </Text>
        </View>
      </ScrollView>

      <BottomChrome active="" onTabPress={onTabPress} onChatPress={onChatPress} />
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
  titleRow: { height: 52, justifyContent: 'center' },
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
  edit: {
    height: 34,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { gap: spacing.lg, paddingTop: spacing.lg },
  overlap: { marginTop: -spacing.xl },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 73,
    paddingHorizontal: spacing.md,
    borderRadius: radii.xxl,
    borderWidth: 1,
    borderColor: neutral.line,
    backgroundColor: neutral.surface,
  },
  stat: { flex: 1, gap: 2 },
  statRule: {
    width: 1,
    height: 32,
    marginHorizontal: spacing.md,
    backgroundColor: neutral.line,
  },
  profileCard: {
    padding: spacing.md,
    gap: spacing.md,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: neutral.line,
    backgroundColor: neutral.surface,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: mint[100],
  },
  profileText: { flex: 1, gap: 2 },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: mint[100],
    overflow: 'hidden',
  },
  progressFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: brand.green,
  },
  liveOrder: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.xl,
    backgroundColor: brand.forest,
  },
  liveIcon: {
    width: 40,
    height: 40,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: gold[300],
  },
  liveText: { flex: 1, gap: 2 },
  liveLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  money: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.xl,
    backgroundColor: gold[300],
  },
  moneyIcon: {
    width: 40,
    height: 40,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: brand.forest,
  },
  moneyText: { flex: 1, gap: 2 },
  moneyLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
});
