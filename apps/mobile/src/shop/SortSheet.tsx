import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { brand, semantic, spacing } from '@medmate/theme';

import { Icon } from '../icons/Icon';
import { Text } from '../ui/Text';
import { Sheet } from '../overlays/parts';

export type SortOption = { id: string; label: string };

export type SortSheetProps = {
  visible: boolean;
  /** The options to offer. */
  options: SortOption[];
  /** The active option. */
  active: string;
  /** Heading of the sheet. */
  title?: string;
  onSelect: (id: string) => void;
  onClose: () => void;
};

/**
 * The sort sheet.
 *
 * The Figma `08 Overlays / Sort sheet` frame: the sheet over the results with
 * a grabber, the heading, a close button and the ways of sorting them.
 */
export function SortSheet({
  visible,
  options,
  active,
  title = 'Sort results',
  onSelect,
  onClose,
}: SortSheetProps) {
  return (
    <Sheet visible={visible} title={title} onClose={onClose}>
      <View style={styles.rows} accessibilityRole="radiogroup">
        {options.map((option) => {
          const selected = option.id === active;
          return (
            <Pressable
              key={option.id}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              onPress={() => onSelect(option.id)}
              style={({ pressed }) => [styles.option, pressed ? { opacity: 0.9 } : null]}
            >
              <Text
                variant="subheadline"
                color={selected ? brand.green : semantic.text}
                style={styles.label}
              >
                {option.label}
              </Text>
              {selected ? <Icon name="check" size={18} color={brand.green} /> : null}
            </Pressable>
          );
        })}
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  rows: {
    paddingHorizontal: spacing.lg,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 48,
  },
  label: {
    flex: 1,
  },
});
