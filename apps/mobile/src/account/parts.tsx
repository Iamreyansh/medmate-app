import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import {
  brand,
  mint,
  neutral,
  radii,
  semantic,
  spacing,
} from '@medmate/theme';

import { Icon, type IconName } from '../icons/Icon';
import { Text } from '../ui/Text';
import { TagPill } from '../ui/blocks';
import type { AccountLink } from './data';

/**
 * The pieces the account screens share with each other.
 */

/**
 * A row that opens something.
 *
 * The account screen is a long list of these, so the shape is shared rather
 * than redrawn per group.
 */
export function AccountRow({
  link,
  onPress,
  icon = true,
}: {
  link: AccountLink;
  onPress?: (id: string) => void;
  /** The tile in front of the name. */
  icon?: boolean;
}) {
  const ink = link.danger ? '#C2392D' : semantic.text;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress?.(link.id)}
      style={({ pressed }) => [styles.row, pressed ? { opacity: 0.9 } : null]}
    >
      {icon && link.icon ? (
        <View style={styles.rowIcon}>
          <Icon name={link.icon} size={18} color={brand.green700} />
        </View>
      ) : null}
      <View style={styles.rowText}>
        <Text variant="subheadline" color={ink} numberOfLines={1}>
          {link.title}
        </Text>
        {link.subtitle ? (
          <Text variant="caption" color={semantic.textMuted} numberOfLines={2}>
            {link.subtitle}
          </Text>
        ) : null}
      </View>
      <Icon name="chev-r" size={16} color={semantic.textMuted} />
    </Pressable>
  );
}

/** A group of rows under a label. */
export function AccountGroup({
  label,
  links,
  onPress,
}: {
  /** The label above the group. */
  label?: string;
  links: AccountLink[];
  onPress?: (id: string) => void;
}) {
  return (
    <View style={styles.group}>
      {label ? (
        <Text variant="footnote" color={semantic.textMuted}>
          {label}
        </Text>
      ) : null}
      <View style={styles.groupRows}>
        {links.map((link, index) => (
          <View key={link.id}>
            {index > 0 ? <View style={styles.separator} /> : null}
            <AccountRow link={link} onPress={onPress} />
          </View>
        ))}
      </View>
    </View>
  );
}

/** A row that shows a permission and what it is set to. */
export function PermissionRow({
  title,
  body,
  icon,
  state,
  onPress,
}: {
  title: string;
  body: string;
  icon: IconName;
  state: 'Allowed' | 'Ask me';
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed ? { opacity: 0.9 } : null]}
    >
      <View style={styles.rowIcon}>
        <Icon name={icon} size={18} color={brand.green700} />
      </View>
      <View style={styles.rowText}>
        <Text variant="subheadline" color={semantic.text} numberOfLines={1}>
          {title}
        </Text>
        <Text variant="caption" color={semantic.textMuted} numberOfLines={2}>
          {body}
        </Text>
      </View>
      <TagPill label={state} tone={state === 'Allowed' ? 'mint' : 'muted'} />
    </Pressable>
  );
}

/** A row that shows what the account holds. */
export function HeldRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.heldRow}>
      <Text variant="subheadline" color={semantic.text}>
        {label}
      </Text>
      <Text variant="footnoteEmphasized" color={semantic.textSecondary}>
        {value}
      </Text>
    </View>
  );
}

/** A consent on the privacy screen. */
export function ConsentRow({
  title,
  body,
  icon,
  onPress,
}: {
  title: string;
  body: string;
  icon: IconName;
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed ? { opacity: 0.9 } : null]}
    >
      <View style={styles.rowIcon}>
        <Icon name={icon} size={18} color={brand.green700} />
      </View>
      <View style={styles.rowText}>
        <Text variant="subheadline" color={semantic.text} numberOfLines={1}>
          {title}
        </Text>
        <Text variant="caption" color={semantic.textMuted} numberOfLines={2}>
          {body}
        </Text>
      </View>
      <Icon name="chev-r" size={16} color={semantic.textMuted} />
    </Pressable>
  );
}

/** A numbered step, used on the ABHA and refer-and-earn screens. */
export function NumberedStep({
  number,
  title,
  body,
}: {
  number: string;
  title?: string;
  body: string;
}) {
  return (
    <View style={styles.numberedRow}>
      <View style={styles.numberedBadge}>
        <Text variant="captionStrong" color={brand.green700}>
          {number}
        </Text>
      </View>
      <View style={styles.rowText}>
        {title ? (
          <Text variant="buttonSmall" color={semantic.text}>
            {title}
          </Text>
        ) : null}
        <Text variant="footnote" color={semantic.textSecondary}>
          {body}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: mint[100],
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  group: {
    gap: spacing.sm,
  },
  groupRows: {
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: neutral.line,
    backgroundColor: neutral.surface,
    overflow: 'hidden',
  },
  separator: {
    height: 1,
    marginLeft: 60,
    backgroundColor: neutral.line,
  },
  heldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  numberedRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  numberedBadge: {
    width: 24,
    height: 24,
    borderRadius: radii.circle,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: mint[100],
  },
});
