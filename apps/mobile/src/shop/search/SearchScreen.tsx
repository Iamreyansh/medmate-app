import React, { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
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

import { Icon } from '../../icons/Icon';
import { Text } from '../../ui/Text';
import { CategoryChip, StatusTag } from '../../ui/chips';
import {
  filterResults,
  pageSize,
  searchFilters,
  searchResults,
  searchSorts,
  searchSummary,
  sortResults,
  type SearchFilterId,
  type SearchSort,
} from '../../data/search';
import { CartBar } from './CartBar';
import { ResultDivider, ResultLine, ResultsCard, ShowMoreRow } from './ResultLine';
import { SearchHeader } from './SearchHeader';

export type SearchScreenProps = {
  /** The query the screen opens with. */
  initialQuery?: string;
  onQueryChange?: (value: string) => void;
  onBack?: () => void;
  onUploadRx?: () => void;
  onCategoryPress?: (category: string) => void;
  onRequestMedicine?: () => void;
  onProductPress?: (id: string) => void;
};

/**
 * The search results screen.
 *
 * The header stays pinned while the results scroll, the rows live in one
 * card exactly as the design draws them, and the cart bar closes the screen.
 */
export function SearchScreen({
  initialQuery = 'paracetamol',
  onQueryChange,
  onBack,
  onUploadRx,
  onCategoryPress,
  onRequestMedicine,
  onProductPress,
}: SearchScreenProps) {
  const insets = useSafeAreaInsets();

  const [query, setQuery] = useState(initialQuery);
  const [filter, setFilter] = useState<SearchFilterId>('all');
  const [sort, setSort] = useState<SearchSort>('relevance');
  const [visible, setVisible] = useState(pageSize);
  const [sortOpen, setSortOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const filtered = useMemo(() => {
    return sortResults(filterResults(searchResults, filter), sort);
  }, [filter, sort]);

  const rows = filtered.slice(0, visible);
  const remaining = filtered.length - rows.length;

  const updateQuery = (value: string) => {
    setQuery(value);
    setVisible(pageSize);
    onQueryChange?.(value);
  };

  const changeFilter = (id: SearchFilterId) => {
    setFilter(id);
    setVisible(pageSize);
  };

  return (
    <View style={styles.root}>
      <SearchHeader
        query={query}
        onChangeQuery={updateQuery}
        onClear={() => updateQuery('')}
        onBack={onBack ?? (() => undefined)}
        onUploadRx={onUploadRx}
        filters={searchFilters}
        activeFilter={filter}
        onFilterChange={changeFilter}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 110 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.chipRow}>
          <CategoryChip
            label={searchSummary.category}
            onPress={() => onCategoryPress?.(searchSummary.category)}
          />
        </View>

        <Text variant="resultMeta" color={semantic.textMuted}>
          {searchSummary.hint}
        </Text>

        <View style={styles.note}>
          <Icon name="flask" size={16} color={brand.green700} />
          <Text variant="resultMeta" color={brand.green700} style={styles.noteText}>
            {searchSummary.note}
          </Text>
        </View>

        <View style={styles.metaRow}>
          <Text variant="resultMeta" color={semantic.text}>
            {`${searchSummary.total} results · pharmacy picked at checkout`}
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => setSortOpen(true)}
            style={({ pressed }) => [styles.sortButton, { opacity: pressed ? 0.85 : 1 }]}
          >
            <Icon name="refill" size={14} color={neutral.ink2} />
            <Text variant="strong" color={neutral.ink2}>
              Sort
            </Text>
            <Icon name="chev-d" size={14} color={neutral.ink2} />
          </Pressable>
        </View>

        <View style={styles.rxRow}>
          <StatusTag label="Rx" tone="prescription" />
          <Text variant="resultSub" color={neutral.ink2} style={styles.rxText}>
            {searchSummary.rxNotice}
          </Text>
        </View>

        <ResultsCard>
          {rows.map((result, index) => (
            <React.Fragment key={result.id}>
              {index > 0 ? <ResultDivider /> : null}
              <ResultLine
                result={result}
                onAdd={() => setCartCount((count) => count + 1)}
                onPress={() => onProductPress?.(result.id)}
              />
            </React.Fragment>
          ))}
          {remaining > 0 ? (
            <ShowMoreRow
              label={`Show ${Math.min(pageSize, remaining)} more of ${searchSummary.total}`}
              onPress={() => setVisible((count) => count + pageSize)}
            />
          ) : null}
        </ResultsCard>

        <Text variant="resultMeta" color={semantic.textMuted} style={styles.footer}>
          {searchSummary.footer}
        </Text>
      </ScrollView>

      <View style={[styles.cartBar, { paddingBottom: insets.bottom }]}>
        <CartBar count={cartCount} />
      </View>

      <SortSheet
        visible={sortOpen}
        active={sort}
        onSelect={(id) => {
          setSort(id);
          setSortOpen(false);
          setVisible(pageSize);
        }}
        onClose={() => setSortOpen(false)}
      />
    </View>
  );
}

/**
 * The sort sheet.
 *
 * The design only draws the sort chip, so this sheet follows the same
 * surfaces as the rest of the app and is flagged as a not-yet-designed
 * surface.
 */
function SortSheet({
  visible,
  active,
  onSelect,
  onClose,
}: {
  visible: boolean;
  active: SearchSort;
  onSelect: (id: SearchSort) => void;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.scrim} onPress={onClose} />
      <View style={styles.sheet}>
        <Text variant="sectionTitle" color={semantic.text}>
          Sort by
        </Text>
        {searchSorts.map((option) => (
          <Pressable
            key={option.id}
            accessibilityRole="radio"
            accessibilityState={{ selected: option.id === active }}
            onPress={() => onSelect(option.id)}
            style={({ pressed }) => [styles.sortOption, { opacity: pressed ? 0.8 : 1 }]}
          >
            <Text variant="body" color={semantic.text}>
              {option.label}
            </Text>
            {option.id === active ? <Icon name="check" size={16} color={semantic.action} /> : null}
          </Pressable>
        ))}
        <Pressable accessibilityRole="button" onPress={onClose} style={styles.sortCancel}>
          <Text variant="button" color={semantic.action}>
            Cancel
          </Text>
        </Pressable>
      </View>
    </Modal>
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
    paddingTop: spacing.md,
    gap: 14,
  },
  chipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  note: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md - 2,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: mint[200],
    backgroundColor: mint[50],
  },
  noteText: {
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    height: 32,
    marginLeft: 'auto',
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: neutral.line2,
  },
  rxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  rxText: {
    flex: 1,
  },
  footer: {
    textAlign: 'center',
    paddingTop: spacing.sm,
  },
  cartBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  scrim: {
    flex: 1,
    backgroundColor: semantic.scrim,
  },
  sheet: {
    backgroundColor: neutral.surface,
    borderTopLeftRadius: radii.huge,
    borderTopRightRadius: radii.huge,
    padding: spacing.lg,
    gap: spacing.md,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  sortCancel: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
});

/** The gold accent the sort sheet reuses from the design system. */
export const sortSheetAccent = gold[300];
