import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { neutral, radii, semantic, spacing } from '@medmate/theme';

import { Icon } from '../icons/Icon';
import { Text } from '../ui/Text';

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
 * The design only draws the sort chip, so this sheet follows the surfaces
 * used elsewhere in the app and is flagged as a not-yet-designed surface.
 */
export function SortSheet({
  visible,
  options,
  active,
  title = 'Sort by',
  onSelect,
  onClose,
}: SortSheetProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.scrim} onPress={onClose} />
      <View style={styles.sheet}>
        <Text variant="sectionTitle" color={semantic.text}>
          {title}
        </Text>
        {options.map((option) => (
          <Pressable
            key={option.id}
            accessibilityRole="radio"
            accessibilityState={{ selected: option.id === active }}
            onPress={() => onSelect(option.id)}
            style={({ pressed }) => [styles.option, { opacity: pressed ? 0.8 : 1 }]}
          >
            <Text variant="body" color={semantic.text}>
              {option.label}
            </Text>
            {option.id === active ? <Icon name="check" size={16} color={semantic.action} /> : null}
          </Pressable>
        ))}
        <Pressable accessibilityRole="button" onPress={onClose} style={styles.cancel}>
          <Text variant="button" color={semantic.action}>
            Cancel
          </Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  cancel: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
});
