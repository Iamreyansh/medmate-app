import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import {
  brand,
  gold,
  mint,
  neutral,
  radii,
  semantic,
  spacing,
} from '@medmate/theme';

import { Icon, type IconName } from '../icons/Icon';
import { Text } from '../ui/Text';
import { TagPill } from '../ui/blocks';
import type { Dose, Person, WeekDay } from './data';

/**
 * The pieces the health and family screens share with each other.
 */

/* -------------------------------------------------------------------------- */
/*  People                                                                     */
/* -------------------------------------------------------------------------- */

/** A chip that picks whose medicine a reminder is for. */
export function PersonChip({
  person,
  selected,
  onPress,
  tone = 'dark',
}: {
  person: Person;
  selected?: boolean;
  onPress?: () => void;
  /** On the brand zone the chip is a light bubble; on a card it is a pill. */
  tone?: 'dark' | 'light';
}) {
  const onDark = tone === 'dark';
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected: !!selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.person,
        onDark
          ? selected
            ? styles.personSelectedDark
            : styles.personDark
          : selected
            ? styles.personSelectedLight
            : styles.personLight,
        pressed ? { opacity: 0.9 } : null,
      ]}
    >
      <View
        style={[
          styles.personAvatar,
          onDark
            ? selected
              ? styles.personAvatarSelected
              : styles.personAvatarDark
            : selected
              ? styles.personAvatarSelected
              : styles.personAvatarLight,
        ]}
      >
        <Text
          variant="tag"
          color={onDark ? (selected ? gold[300] : neutral.surface) : brand.forest}
        >
          {person.initials}
        </Text>
      </View>
      <Text
        variant="footnoteEmphasized"
        color={onDark ? (selected ? brand.forest : neutral.surface) : semantic.textSecondary}
      >
        {person.label}
      </Text>
    </Pressable>
  );
}

/** The "Add" chip at the end of the people row. */
export function AddPersonChip({ onPress }: { onPress?: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.person, styles.personDark, pressed ? { opacity: 0.9 } : null]}
    >
      <Icon name="plus" size={14} color={neutral.surface} />
      <Text variant="footnoteEmphasized" color={neutral.surface}>
        Add
      </Text>
    </Pressable>
  );
}

/* -------------------------------------------------------------------------- */
/*  Progress                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * The ring that shows how much of today is done.
 */
export function ProgressRing({
  percent,
  size = 88,
  caption,
}: {
  percent: number;
  size?: number;
  /** The small line under the number. */
  caption?: string;
}) {
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={neutral.surface}
          strokeWidth={stroke}
          fill="none"
          opacity={0.25}
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={gold[300]}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={circumference * (1 - percent / 100)}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={styles.ringLabel}>
        <Text variant="button" color={gold[300]}>
          {`${percent}%`}
        </Text>
        {caption ? (
          <Text variant="captionStrong" color={mint[200]}>
            {caption}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

/**
 * The strip of days the schedule covers.
 */
export function WeekStrip({ days }: { days: WeekDay[] }) {
  return (
    <View style={styles.week}>
      {days.map((day) => {
        const background = day.done
          ? brand.forest
          : day.today
            ? gold[300]
            : day.upcoming
              ? '#FCECE9'
              : gold[50];
        return (
          <View key={day.label} style={styles.day}>
            <View style={[styles.dayCircle, { backgroundColor: background }]}>
              {day.done ? (
                <Icon name="check" size={14} color={neutral.surface} />
              ) : day.today ? (
                <Text variant="tag" color={brand.forest}>
                  {String(day.percent ?? 0)}
                </Text>
              ) : null}
            </View>
            <Text
              variant="captionStrong"
              color={day.today ? semantic.text : semantic.textMuted}
              numberOfLines={1}
            >
              {day.label}
            </Text>
            <Text
              variant="captionStrong"
              color={day.today ? semantic.text : semantic.textMuted}
            >
              {day.date}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*  Doses                                                                      */
/* -------------------------------------------------------------------------- */

/** One dose in the day's schedule. */
export function DoseRow({
  dose,
  onToggle,
  onSkip,
}: {
  dose: Dose;
  onToggle?: () => void;
  onSkip?: () => void;
}) {
  return (
    <View style={styles.dose}>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: !!dose.taken }}
        onPress={onToggle}
        hitSlop={6}
        style={[
          styles.doseCircle,
          dose.taken ? styles.doseCircleTaken : null,
        ]}
      >
        {dose.taken ? <Icon name="check" size={16} color={neutral.surface} /> : null}
      </Pressable>

      <View style={styles.doseText}>
        <Text
          variant="buttonSmall"
          color={dose.taken ? semantic.textMuted : semantic.text}
          numberOfLines={2}
        >
          {dose.name}
        </Text>
        <Text variant="caption" color={semantic.textMuted}>
          {dose.detail}
        </Text>
        {dose.dueNow ? (
          <Text variant="captionStrong" color={brand.green}>
            Due now
          </Text>
        ) : null}
      </View>

      {dose.taken ? (
        <Pressable accessibilityRole="button" onPress={onToggle} hitSlop={6}>
          <Text variant="footnoteEmphasized" color={brand.green}>
            Undo
          </Text>
        </Pressable>
      ) : (
        <Pressable
          accessibilityRole="button"
          onPress={onSkip}
          style={styles.skip}
        >
          <Text variant="footnoteEmphasized" color={semantic.textSecondary}>
            Skip
          </Text>
        </Pressable>
      )}

      <TagPill
        label={dose.time}
        tone={dose.taken ? 'muted' : 'mint'}
      />
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*  Choices                                                                    */
/* -------------------------------------------------------------------------- */

/** A pill that picks one of the options. */
export function FilterChip({
  label,
  selected,
  onPress,
  size = 'large',
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  /** The small pills in the frame are 34 tall, the larger ones 44. */
  size?: 'small' | 'large';
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected: !!selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.filter,
        size === 'large' ? styles.filterLarge : null,
        selected ? styles.filterOn : styles.filterOff,
        pressed ? { opacity: 0.9 } : null,
      ]}
    >
      {selected ? <Icon name="check" size={14} color={neutral.surface} /> : null}
      <Text
        variant={size === 'large' ? 'buttonSmall' : 'footnoteEmphasized'}
        color={selected ? neutral.surface : semantic.textSecondary}
      >
        {label}
      </Text>
    </Pressable>
  );
}

/** A square chip that picks a relation or a condition. */
export function SquareChip({
  label,
  selected,
  onPress,
  style,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  style?: object;
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected: !!selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.square,
        selected ? styles.squareOn : styles.squareOff,
        pressed ? { opacity: 0.9 } : null,
        style,
      ]}
    >
      {selected ? <Icon name="check" size={14} color={neutral.surface} /> : null}
      <Text
        variant="footnoteEmphasized"
        color={selected ? neutral.surface : semantic.textSecondary}
        numberOfLines={1}
      >
        {label}
      </Text>
    </Pressable>
  );
}

/** The icon tile a section heading carries. */
export function SectionIcon({ name }: { name: IconName }) {
  return (
    <View style={styles.sectionIcon}>
      <Icon name={name} size={18} color={brand.green700} />
    </View>
  );
}

const styles = StyleSheet.create({
  /* People ------------------------------------------------------------- */
  person: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    height: 36,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
  },
  personDark: {
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  personLight: {
    backgroundColor: neutral.surface,
    borderWidth: 1,
    borderColor: neutral.line,
  },
  personSelectedDark: {
    backgroundColor: gold[300],
  },
  personSelectedLight: {
    backgroundColor: brand.forest,
  },
  personAvatar: {
    width: 26,
    height: 26,
    borderRadius: radii.circle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  personAvatarDark: {
    backgroundColor: neutral.surface,
  },
  personAvatarLight: {
    backgroundColor: neutral.surface3,
  },
  personAvatarSelected: {
    backgroundColor: brand.forest,
  },

  /* Progress ------------------------------------------------------------ */
  ringLabel: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  week: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  day: {
    alignItems: 'center',
    gap: 2,
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: radii.circle,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Doses --------------------------------------------------------------- */
  dose: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  doseCircle: {
    width: 32,
    height: 32,
    borderRadius: radii.circle,
    borderWidth: 1.5,
    borderColor: neutral.line2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doseCircleTaken: {
    backgroundColor: brand.green,
    borderColor: brand.green,
  },
  doseText: {
    flex: 1,
    gap: 2,
  },
  skip: {
    height: 28,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Choices ------------------------------------------------------------- */
  filter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    height: 34,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
  },
  filterLarge: {
    height: 44,
    borderRadius: radii.md,
  },
  filterOn: {
    backgroundColor: brand.forest,
  },
  filterOff: {
    backgroundColor: neutral.surface,
    borderWidth: 1,
    borderColor: neutral.line,
  },
  square: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    height: 44,
    paddingHorizontal: spacing.md,
    borderRadius: radii.md,
  },
  squareOn: {
    backgroundColor: brand.forest,
  },
  squareOff: {
    backgroundColor: neutral.surface,
    borderWidth: 1,
    borderColor: neutral.line,
  },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: radii.mdPlus,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: brand.forest,
  },
});
