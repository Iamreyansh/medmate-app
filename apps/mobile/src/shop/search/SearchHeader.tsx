import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  brand,
  designFontScale,
  fontFamily,
  gold,
  neutral,
  platformKey,
  radii,
  semantic,
  spacing,
} from '@medmate/theme';

import { Icon } from '../../icons/Icon';
import { Text } from '../../ui/Text';
import { Gradient } from '../../ui/primitives';
import type { SearchFilterId } from '../../data/search';

const isAndroid = platformKey === 'android';

export type SearchHeaderProps = {
  /** The current query. */
  query: string;
  onChangeQuery: (value: string) => void;
  onClear: () => void;
  onBack: () => void;
  onUploadRx?: () => void;
  /** Filter chips with their labels and counts. */
  filters: { id: SearchFilterId; label: string; count: number }[];
  activeFilter: SearchFilterId;
  onFilterChange: (id: SearchFilterId) => void;
  style?: StyleProp<ViewStyle>;
};

/**
 * The search header.
 *
 * A forest gradient panel with the back control, the live search field, the
 * gold upload-a-prescription button and the filter chips - the block the Figma
 * draws as "Search header".
 *
 * iOS uses a 44pt rounded field and a pill-shaped filter chip; Android uses
 * the Material 56pt pill field and an 8pt chip.
 */
export function SearchHeader({
  query,
  onChangeQuery,
  onClear,
  onBack,
  onUploadRx,
  filters,
  activeFilter,
  onFilterChange,
  style,
}: SearchHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <Gradient token="brand" radius={0} style={[styles.header, style]}>
      <View style={[styles.inner, { paddingTop: insets.top + spacing.xs }]}>
        <View style={styles.searchRow}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back"
            onPress={onBack}
            hitSlop={12}
            style={styles.back}
          >
            <Icon
              name={isAndroid ? 'arrow-left' : 'chev-l'}
              size={isAndroid ? 24 : 20}
              color={neutral.surface}
              strokeWidth={isAndroid ? 2 : 2.2}
            />
          </Pressable>

          <View style={styles.field}>
            <Icon name="search" size={isAndroid ? 24 : 18} color={semantic.textMuted} />
            <TextInput
              allowFontScaling={false}
              value={query}
              onChangeText={onChangeQuery}
              placeholder="Search a medicine"
              placeholderTextColor={semantic.textMuted}
              selectionColor={brand.green}
              style={styles.input}
              autoCorrect={false}
              returnKeyType="search"
              accessibilityLabel="Search medicines"
            />
            {query.length > 0 ? (
              <Pressable accessibilityRole="button" accessibilityLabel="Clear search" onPress={onClear} hitSlop={10}>
                <Icon name="x" size={isAndroid ? 20 : 16} color={neutral.faint} />
              </Pressable>
            ) : null}
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Upload prescription"
            onPress={onUploadRx}
            style={({ pressed }) => [styles.uploadRx, { opacity: pressed ? 0.85 : 1 }]}
          >
            <Icon name="rx-up" size={20} color={brand.forest} />
          </Pressable>
        </View>

        {filters.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
          >
            {filters.map((filter) => (
              <FilterChip
                key={filter.id}
                label={`${filter.label} ${filter.count}`}
                selected={filter.id === activeFilter}
                onPress={() => onFilterChange(filter.id)}
              />
            ))}
          </ScrollView>
        ) : null}
      </View>
    </Gradient>
  );
}

/**
 * A filter chip.
 *
 * Selected chips are forest with a gold tick; unselected ones are white with
 * a hairline border.
 */
function FilterChip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        isAndroid ? styles.chipAndroid : styles.chipIOS,
        selected ? styles.chipSelected : styles.chipIdle,
        { opacity: pressed ? 0.85 : 1 },
      ]}
    >
      {selected ? <Icon name="check" size={isAndroid ? 18 : 14} color={gold[300]} /> : null}
      <Text variant="filterLabel" color={selected ? neutral.surface : neutral.ink2}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: {
    borderBottomLeftRadius: radii.huge,
    borderBottomRightRadius: radii.huge,
    overflow: 'hidden',
  },
  inner: {
    gap: spacing.sm,
    paddingBottom: spacing.sm,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingLeft: isAndroid ? spacing.xs : spacing.sm,
    paddingRight: spacing.lg,
  },
  back: {
    width: isAndroid ? 24 : 20,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  field: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: isAndroid ? spacing.md : spacing.sm,
    minHeight: isAndroid ? 56 : 44,
    paddingLeft: isAndroid ? spacing.lg : spacing.md,
    paddingRight: isAndroid ? spacing.sm : spacing.md,
    borderRadius: isAndroid ? 28 : radii.lg,
    backgroundColor: neutral.surface,
  },
  input: {
    flex: 1,
    fontFamily: fontFamily['400'],
    fontSize: (isAndroid ? 16 : 17) * designFontScale,
    lineHeight: (isAndroid ? 24 : 22) * designFontScale,
    color: semantic.text,
    padding: 0,
    margin: 0,
  },
  uploadRx: {
    width: 44,
    height: 44,
    borderRadius: radii.lg,
    backgroundColor: gold[300],
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
  },
  chipIOS: {
    height: 34,
    borderRadius: radii.pill,
  },
  chipAndroid: {
    height: 32,
    borderRadius: radii.sm,
  },
  chipSelected: {
    backgroundColor: brand.forest,
    borderColor: brand.forest,
  },
  chipIdle: {
    backgroundColor: neutral.surface,
    borderColor: neutral.line2,
  },
});
