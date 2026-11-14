import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { brand, mint, neutral, platformKey, radii, semantic, spacing } from '@medmate/theme';

import { Icon } from '../../icons/Icon';
import { Text } from '../../ui/Text';
import { Gradient } from '../../ui/primitives';
import { SearchHeader } from './SearchHeader';

const isAndroid = platformKey === 'android';

/** The queries the design offers when a search finds nothing. */
const suggestions = ['Fever', 'Dolo 650', 'Cold and cough', 'Acidity'];

export type SearchEmptyScreenProps = {
  /** The query that found nothing. */
  query?: string;
  onQueryChange?: (value: string) => void;
  onClear?: () => void;
  onBack?: () => void;
  onUploadRx?: () => void;
  onRequestMedicine?: () => void;
  onSuggestionPress?: (suggestion: string) => void;
};

/**
 * The empty state.
 *
 * When a search returns nothing the screen keeps the header and swaps the
 * results for a card that explains what to try next and offers two ways out:
 * ask MedMate to source the medicine, or upload a prescription.
 */
export function SearchEmptyScreen({
  query = 'Thyronorm 50',
  onQueryChange,
  onClear,
  onBack,
  onUploadRx,
  onRequestMedicine,
  onSuggestionPress,
}: SearchEmptyScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <SearchHeader
        query={query}
        onChangeQuery={onQueryChange ?? (() => undefined)}
        onClear={onClear ?? (() => undefined)}
        onBack={onBack ?? (() => undefined)}
        onUploadRx={onUploadRx}
        filters={[]}
        activeFilter="all"
        onFilterChange={() => undefined}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Gradient token="art" radius={radii.circle} style={styles.art}>
            <Icon name="search" size={36} color={brand.green700} />
          </Gradient>

          <Text variant="sectionTitle" color={semantic.text} style={styles.center}>
            {query.trim() ? `No results for “${query.trim()}”` : 'What are you looking for?'}
          </Text>
          <Text variant="resultMeta" color={semantic.textMuted} style={styles.center}>
            {query.trim()
              ? 'Check the spelling, or try the salt name on the pack. Still can’t find it? Ask MedMate to source it: the team checks with pharmacies and distributors and confirms the price and delivery time first.'
              : 'Search a medicine by its name or by the salt on the pack. Popular searches are below, or ask MedMate to source it for you.'}
          </Text>

          <View style={styles.suggestionRow}>
            {suggestions.map((suggestion) => (
              <Pressable
                key={suggestion}
                accessibilityRole="button"
                onPress={() => onSuggestionPress?.(suggestion)}
                style={({ pressed }) => [styles.suggestion, { opacity: pressed ? 0.85 : 1 }]}
              >
                <Text variant="filterLabel" color={neutral.ink2}>
                  {suggestion}
                </Text>
              </Pressable>
            ))}
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={onRequestMedicine}
            style={({ pressed }) => [styles.primaryButton, { opacity: pressed ? 0.85 : 1 }]}
          >
            <Text variant="button" color={neutral.surface}>
              Request MedMate to get it
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={onUploadRx}
            style={({ pressed }) => [styles.secondaryButton, { opacity: pressed ? 0.85 : 1 }]}
          >
            <Text variant="button" color={semantic.action}>
              Upload prescription
            </Text>
          </Pressable>
        </View>

        <Text variant="bodyStrong" color={semantic.text}>
          Popular searches
        </Text>
        <View style={styles.suggestionRow}>
          {suggestions.map((suggestion) => (
            <Pressable
              key={`popular-${suggestion}`}
              accessibilityRole="button"
              onPress={() => onSuggestionPress?.(suggestion)}
              style={({ pressed }) => [styles.suggestion, { opacity: pressed ? 0.85 : 1 }]}
            >
              <Text variant="filterLabel" color={neutral.ink2}>
                {suggestion}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    gap: 14,
  },
  card: {
    alignItems: 'center',
    gap: 14,
    padding: spacing.xl,
    borderRadius: isAndroid ? 16 : radii.xl,
    borderWidth: 1,
    borderColor: '#D9F0E1',
    backgroundColor: neutral.surface,
  },
  art: {
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    textAlign: 'center',
  },
  suggestionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  suggestion: {
    height: 34,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: neutral.line2,
    backgroundColor: neutral.surface,
  },
  primaryButton: {
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: radii.lg,
    backgroundColor: brand.green,
  },
  secondaryButton: {
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: radii.lg,
    borderWidth: 1.5,
    borderColor: brand.green,
    backgroundColor: neutral.surface,
  },
});

/** The mint used by the empty-state art circle. */
export const emptyArtTint = mint[200];
