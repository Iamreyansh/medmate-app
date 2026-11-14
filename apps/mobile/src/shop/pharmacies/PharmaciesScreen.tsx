import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  brand,
  designFontScale,
  elevation,
  gold,
  mint,
  neutral,
  platformKey,
  radii,
  semantic,
  spacing,
} from '@medmate/theme';

import { Icon } from '../../icons/Icon';
import { useContentInset, useContentWidth } from '../../ui/layout';
import { Text } from '../../ui/Text';
import { ArtTile, EmptyState, FilterChip, Gradient } from '../../ui/primitives';
import { useNotice } from '../../state/notice';
import { categoryList } from '../../data/category';
import { initialsOf } from '../../data/catalogue';
import {
  deliveryNote,
  deliverySampleNote,
  filterPharmacies,
  highlightedPharmacies,
  pharmacyFilters,
  pharmacySubtitle,
  pharmacies,
  type Pharmacy,
  type PharmacyFilterId,
} from '../../data/pharmacy';
import { BottomChrome } from '../BottomChrome';

const isAndroid = platformKey === 'android';

export type PharmaciesScreenProps = {
  onBack?: () => void;
  onStorePress?: (pharmacy: Pharmacy) => void;
  onCategoryPress?: (category: string) => void;
};

/**
 * Pharmacies near you.
 *
 * The two highlighted stores, the categories to shop by, the filters and the
 * list of stores with their delivery windows.
 */
export function PharmaciesScreen({
  onBack,
  onStorePress,
  onCategoryPress,
}: PharmaciesScreenProps) {
  const insets = useSafeAreaInsets();
  // On a screen wider than the design the content column is centred.
  const inset = useContentInset();
  const notice = useNotice();
  const [filter, setFilter] = useState<PharmacyFilterId>('all');
  const [query, setQuery] = useState('');

  const list = useMemo(() => filterPharmacies(pharmacies, filter), [filter]);
  const searched = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return list;
    return list.filter((pharmacy) =>
      `${pharmacy.name} ${pharmacy.area} ${pharmacy.categories}`.toLowerCase().includes(needle),
    );
  }, [list, query]);

  const highlights = useMemo(() => highlightedPharmacies(), []);
  // The design draws the highlight card at 330; a narrower phone gets a card
  // that fits instead of one that is clipped.
  const contentWidth = useContentWidth();
  const highlightWidth = Math.min(330, contentWidth);
  const categories = useMemo(() => categoryList().slice(0, 6), []);

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 110 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Brand zone */}
        <Gradient token="brand" radius={0} style={styles.zone}>
          <View style={[styles.zoneInner, { paddingTop: insets.top + spacing.sm }]}>
            <View style={styles.addressRow}>
              <View style={styles.addressText}>
                <Text variant="strong" color={neutral.surface}>
                  Home
                </Text>
                <Text variant="resultSub" color={mint[200]} numberOfLines={1}>
                  Flat 302, Sri Sai Residency, 7th Cross, Jayanagar 4th Block
                </Text>
              </View>
              <View style={styles.avatar}>
                <Text variant="tag" color={brand.forest}>
                  P
                </Text>
              </View>
            </View>

            <Text variant="pharmacyTitle" color={neutral.surface}>
              Pharmacies near you
            </Text>
            <Text variant="resultMeta" color={mint[200]}>
              {pharmacySubtitle()}
            </Text>

            <View style={styles.searchBar}>
              <Icon name="search" size={18} color={semantic.textMuted} />
              <TextInput
                allowFontScaling={false}
            numberOfLines={1}
                value={query}
                onChangeText={setQuery}
                placeholder="Search pharmacy, area or speciality"
                placeholderTextColor={semantic.textMuted}
                style={styles.searchInput}
                accessibilityLabel="Search pharmacies"
              />
            </View>
          </View>
        </Gradient>

        <View style={[styles.body, { paddingHorizontal: inset }]}>
          {/* Highlighted stores */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.highlightRow}
          >
            {highlights.map((pharmacy) => (
              <Pressable
                key={pharmacy.id}
                accessibilityRole="button"
                onPress={() => onStorePress?.(pharmacy)}
                style={({ pressed }) => [
                  styles.highlight,
                  { width: highlightWidth },
                  pharmacy.highlight?.eyebrow === 'Open all night'
                    ? styles.highlightGold
                    : styles.highlightForest,
                  { opacity: pressed ? 0.9 : 1 },
                ]}
              >
                <View style={styles.highlightText}>
                  <Text variant="sectionEyebrow" color={gold[300]} style={styles.highlightEyebrow}>
                    {pharmacy.highlight?.eyebrow}
                  </Text>
                  <Text variant="sectionTitle" color={neutral.surface}>
                    {pharmacy.highlight?.title}
                  </Text>
                  <Text variant="resultSub" color={mint[200]} numberOfLines={2}>
                    {pharmacy.highlight?.note}
                  </Text>
                  <View style={styles.visitRow}>
                    <Text variant="strong" color={gold[300]}>
                      Visit store
                    </Text>
                    <Icon name="chev-r" size={14} color={gold[300]} />
                  </View>
                </View>
                <ArtTile
                  width={94}
                  height={94}
                  radius={radii.xxl}
                  initials={initialsOf(pharmacy.name)}
                />
              </Pressable>
            ))}
          </ScrollView>

          {/* Categories */}
          <Text variant="headline" color={semantic.text}>
            What do you need today?
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryRow}
          >
            {categories.map((category) => (
              <Pressable
                key={category}
                accessibilityRole="button"
                onPress={() => onCategoryPress?.(category)}
                style={styles.category}
              >
                <View style={styles.categoryPhoto}>
                  <Text variant="tileLabel" color={brand.green700}>
                    {initialsOf(category)}
                  </Text>
                </View>
                <Text variant="tileLabel" color={semantic.text} style={styles.categoryLabel}>
                  {category}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Filters */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
          >
            {pharmacyFilters().map((entry) => (
              <FilterChip
                key={entry.id}
                label={entry.label}
                selected={filter === entry.id}
                onPress={() => setFilter(entry.id)}
              />
            ))}
          </ScrollView>

          <Text variant="sectionEyebrow" color={brand.green700}>
            {`${searched.length} pharmacies delivering to you`}
          </Text>

          {searched.length === 0 ? (
            <EmptyState
              title="No pharmacy matches that search"
              body="Try a different area, speciality or store name."
            />
          ) : null}
          {searched.map((pharmacy) => (
            <PharmacyCard
              key={pharmacy.id}
              pharmacy={pharmacy}
              onPress={() => onStorePress?.(pharmacy)}
            />
          ))}

          {/* How delivery works */}
          <View style={styles.howCard}>
            <View style={styles.howHeader}>
              <Icon name="info" size={16} color={semantic.text} />
              <Text variant="strong" color={semantic.text}>
                How delivery works
              </Text>
            </View>
            {deliveryNote.map((line) => (
              <Text key={line} variant="resultSub" color={semantic.textSecondary}>
                {line}
              </Text>
            ))}
            <Text variant="resultSub" color={semantic.textMuted}>
              {deliverySampleNote}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.chrome, { paddingBottom: insets.bottom }]}>
        <BottomChrome
          active="home"
          onTabPress={(id) =>
            id === 'home' ? undefined : notice.notify('The pharmacy screen is next in the section')
          }
          onChatPress={() => notice.notify('Chat opens in the next release')}
          onAdPress={() => notice.notify('New arrivals are on the offers screen')}
        />
      </View>
    </View>
  );
}

/** A store card with its cover, delivery window and perks. */
function PharmacyCard({
  pharmacy,
  onPress,
}: {
  pharmacy: Pharmacy;
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, { opacity: pressed ? 0.94 : 1 }]}
    >
      <View style={styles.cover}>
        <Gradient token="art" radius={0} style={styles.coverGradient}>
          {pharmacy.promoted ? (
            <View style={styles.promotedTag}>
              <Text variant="tag" color={semantic.text}>
                Promoted
              </Text>
            </View>
          ) : null}
          <View style={styles.coverRow}>
            <Text variant="strong" color={semantic.text}>
              {pharmacy.eta}
            </Text>
            <Text variant="tag" color={semantic.textMuted}>
              {pharmacy.distance}
            </Text>
          </View>
        </Gradient>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.nameRow}>
          <Text variant="headline" color={semantic.text} style={styles.nameText}>
            {pharmacy.name}
          </Text>
          <Text variant="tag" color={pharmacy.open ? brand.green700 : semantic.textMuted}>
            {pharmacy.open ? '● Open' : '● Closed'}
          </Text>
        </View>
        <Text variant="resultSub" color={semantic.textMuted}>
          {pharmacy.categories}
        </Text>
        <Text variant="resultSub" color={brand.green700}>
          {`${pharmacy.area} · ${pharmacy.openLabel}`}
        </Text>
        <Text variant="resultSub" color={semantic.textMuted}>
          {`${pharmacy.licence} · ${pharmacy.pharmacist}`}
        </Text>
        <View style={styles.dashed} />
        <View style={styles.perkRow}>
          {pharmacy.perks.map((perk) => (
            <Text key={perk} variant="resultSub" color={semantic.textMuted}>
              {perk}
            </Text>
          ))}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: neutral.page,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: spacing.xxl,
  },
  zone: {
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
  },
  zoneInner: {
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  addressText: {
    flex: 1,
    gap: spacing.xxs,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: radii.circle,
    backgroundColor: gold[300],
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: isAndroid ? spacing.md : spacing.sm,
    minHeight: isAndroid ? 56 : 44,
    paddingHorizontal: isAndroid ? spacing.lg : spacing.md,
    // Android draws the search field as a Material pill.
    borderRadius: isAndroid ? 28 : radii.lg,
    backgroundColor: neutral.surface,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Outfit_400Regular',
    fontSize: 17 * designFontScale,
    lineHeight: 22 * designFontScale,
    color: semantic.text,
    padding: 0,
    margin: 0,
  },
  body: {
    gap: 14,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  highlightRow: {
    gap: spacing.md,
    paddingRight: spacing.lg,
  },
  highlight: {
    height: 132,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: isAndroid ? 20 : radii.xxl,
  },
  highlightForest: {
    backgroundColor: brand.forest,
  },
  highlightGold: {
    backgroundColor: gold[50],
  },
  highlightText: {
    flex: 1,
    gap: spacing.xxs,
  },
  highlightEyebrow: {
    lineHeight: 13,
  },
  visitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    marginTop: spacing.xxs,
  },
  categoryRow: {
    gap: spacing.md,
    paddingRight: spacing.lg,
  },
  category: {
    width: 68,
    alignItems: 'center',
    gap: spacing.xs + 2,
  },
  categoryPhoto: {
    width: 56,
    height: 56,
    borderRadius: radii.circle,
    borderWidth: 1,
    borderColor: mint[200],
    backgroundColor: mint[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryLabel: {
    textAlign: 'center',
  },
  filterRow: {
    gap: spacing.sm,
  },
  card: {
    borderRadius: radii.xxl,
    borderWidth: 1,
    borderColor: mint[200],
    backgroundColor: neutral.surface,
    overflow: 'hidden',
  },
  cover: {
    height: 144,
  },
  coverGradient: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: spacing.md,
  },
  promotedTag: {
    paddingHorizontal: spacing.xs + 5,
    paddingVertical: spacing.xxs,
    borderRadius: radii.xs,
    backgroundColor: neutral.surface,
  },
  coverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  cardBody: {
    gap: spacing.xs,
    padding: spacing.md,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  nameText: {
    flexShrink: 1,
  },
  dashed: {
    height: 1,
    marginVertical: spacing.xs,
    borderTopWidth: 1,
    borderStyle: 'dashed',
    borderColor: neutral.line2,
  },
  perkRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md - 2,
  },
  howCard: {
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: mint[200],
    backgroundColor: mint[50],
  },
  howHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  chrome: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});

/** The elevation the highlight cards cast. */
export const highlightElevation = elevation.medium;
