import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { brand, gold, mint, neutral, radii, semantic, spacing } from '@medmate/theme';

import { Icon } from '../../icons/Icon';
import { Text } from '../../ui/Text';
import { useContentInset } from '../../ui/layout';
import { CategoryChip, StatusTag } from '../../ui/chips';
import { useCart } from '../../state/cart';
import { useNotice } from '../../state/notice';
import {
  filterResults,
  pageSize,
  searchCatalogue,
  searchFiltersFor,
  searchSorts,
  searchSummaryFor,
  sortResults,
  type SearchFilterId,
  type SearchSort,
} from '../../data/search';
import { SortSheet } from '../SortSheet';
import { CartBar } from './CartBar';
import { ResultDivider, ResultLine, ResultsCard, ShowMoreRow } from './ResultLine';
import { SearchEmptyScreen } from './SearchEmptyScreen';
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
  /** Opens the cart. */
  onCartPress?: () => void;
};

/**
 * The search results screen.
 *
 * The query drives everything: the products come from the shared catalogue,
 * the counts and the copy are derived from the results that are on screen,
 * and a query that matches nothing falls through to the empty state.
 */
export function SearchScreen({
  initialQuery = 'paracetamol',
  onQueryChange,
  onBack,
  onUploadRx,
  onCategoryPress,
  onRequestMedicine,
  onProductPress,
  onCartPress,
}: SearchScreenProps) {
  const insets = useSafeAreaInsets();
  // On a screen wider than the design the content column is centred.
  const inset = useContentInset();
  const cart = useCart();
  const notice = useNotice();

  const [query, setQuery] = useState(initialQuery);
  const [filter, setFilter] = useState<SearchFilterId>('all');
  const [sort, setSort] = useState<SearchSort>('relevance');
  const [visible, setVisible] = useState(pageSize);
  const [sortOpen, setSortOpen] = useState(false);
  const [categoryOnly, setCategoryOnly] = useState(false);

  /** Everything in the catalogue that matches the query. */
  const matched = useMemo(() => searchCatalogue(query), [query]);
  /** The counts and the copy that describe the matches. */
  const summary = useMemo(() => searchSummaryFor(query, matched), [query, matched]);
  /** The chips, with the counts of the current result set. */
  const filters = useMemo(() => searchFiltersFor(summary), [summary]);

  const filtered = useMemo(() => {
    const byFilter = filterResults(matched, filter);
    const byCategory = categoryOnly
      ? byFilter.filter((result) => result.category === summary.category)
      : byFilter;
    return sortResults(byCategory, sort);
  }, [matched, filter, categoryOnly, summary.category, sort]);

  const rows = filtered.slice(0, visible);
  const remaining = filtered.length - rows.length;

  const updateQuery = (value: string) => {
    setQuery(value);
    setVisible(pageSize);
    setFilter('all');
    setCategoryOnly(false);
    onQueryChange?.(value);
  };

  const changeFilter = (id: SearchFilterId) => {
    setFilter(id);
    setVisible(pageSize);
  };

  /* A query that matches nothing falls through to the empty state. */
  if (matched.length === 0) {
    return (
      <SearchEmptyScreen
        query={query}
        onQueryChange={updateQuery}
        onClear={() => updateQuery('')}
        onBack={onBack ?? (() => notice.notify('Back to the shop'))}
        onUploadRx={onUploadRx ?? (() => notice.notify('Upload a prescription to unlock Rx medicines'))}
        onRequestMedicine={
          onRequestMedicine ??
          (() => notice.notify('We will call back with the price and delivery time'))
        }
        onSuggestionPress={(suggestion) => updateQuery(suggestion)}
      />
    );
  }

  return (
    <View style={styles.root}>
      <SearchHeader
        query={query}
        onChangeQuery={updateQuery}
        onClear={() => updateQuery('')}
        onBack={onBack ?? (() => notice.notify('Back to the shop'))}
        onUploadRx={onUploadRx ?? (() => notice.notify('Upload a prescription to unlock Rx medicines'))}
        filters={filters}
        activeFilter={filter}
        onFilterChange={changeFilter}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 110, paddingHorizontal: inset }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.chipRow}>
          <CategoryChip
            label={categoryOnly ? `${summary.category} only` : summary.category}
            onPress={() => {
              setCategoryOnly((value) => !value);
              setVisible(pageSize);
              onCategoryPress?.(summary.category);
            }}
          />
        </View>

        <Text variant="resultMeta" color={semantic.textMuted}>
          {summary.hint}
        </Text>

        <View style={styles.note}>
          <Icon name="flask" size={16} color={brand.green700} />
          <Text variant="resultMeta" color={brand.green700} style={styles.noteText}>
            {summary.note}
          </Text>
        </View>

        <View style={styles.metaRow}>
          <Text variant="resultMeta" color={semantic.text}>
            {`${summary.total} ${summary.total === 1 ? 'result' : 'results'} · pharmacy picked at checkout`}
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

        {summary.prescription > 0 ? (
          <View style={styles.rxRow}>
            <StatusTag label="Rx" tone="prescription" />
            <Text variant="resultSub" color={neutral.ink2} style={styles.rxText}>
              {summary.rxNotice}
            </Text>
          </View>
        ) : null}

        <ResultsCard>
          {rows.map((result, index) => (
            <React.Fragment key={result.id}>
              {index > 0 ? <ResultDivider /> : null}
              <ResultLine
                result={result}
                onAdd={() => {
                  cart.add({
                    id: result.id,
                    name: result.name,
                    sub: result.sub,
                    price: result.price,
                    mrp: result.mrp,
                    off: result.off,
                    rx: result.rx,
                  });
                  notice.notify(`${result.name} added to the cart`);
                }}
                onPress={() => onProductPress?.(result.id)}
              />
            </React.Fragment>
          ))}
          {remaining > 0 ? (
            <ShowMoreRow
              label={`Show ${Math.min(pageSize, remaining)} more of ${summary.total}`}
              onPress={() => setVisible((count) => count + pageSize)}
            />
          ) : null}
        </ResultsCard>

        <Pressable
          accessibilityRole="button"
          onPress={() =>
            onRequestMedicine?.() ?? notice.notify('We will call back with the price and delivery time')
          }
          style={({ pressed }) => [styles.footerLink, { opacity: pressed ? 0.8 : 1 }]}
        >
          <Text variant="resultMeta" color={semantic.textMuted} style={styles.footer}>
            {summary.footer}
          </Text>
        </Pressable>
      </ScrollView>

      <View style={[styles.cartBar, { paddingBottom: insets.bottom }]}>
        <CartBar count={cart.count} onCartPress={onCartPress} />
      </View>

      <SortSheet
        visible={sortOpen}
        options={searchSorts}
        active={sort}
        onSelect={(id) => {
          setSort(id as SearchSort);
          setSortOpen(false);
          setVisible(pageSize);
        }}
        onClose={() => setSortOpen(false)}
      />
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
  footerLink: {
    paddingTop: spacing.sm,
  },
  footer: {
    textAlign: 'center',
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
