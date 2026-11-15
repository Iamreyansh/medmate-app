import React from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

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
import { CardTitle, IconTile, ScreenCard, TagPill } from '../ui/blocks';

/**
 * The pieces the prescriptions and care screens share with each other.
 */

/* -------------------------------------------------------------------------- */
/*  Tracker                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * The three steps of sending a prescription.
 *
 * The step the shopper is on is filled, the ones after it are grey.
 */
export function CareSteps({
  steps,
  current,
}: {
  steps: { id: string; label: string; icon: IconName }[];
  /** The index of the step they are on. */
  current: number;
}) {
  return (
    <View style={styles.steps}>
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          {index > 0 ? (
            <View style={styles.stepLine}>
              <View
                style={[
                  styles.stepBar,
                  index <= current ? styles.stepBarDone : null,
                ]}
              />
            </View>
          ) : null}
          <View style={styles.step}>
            <View
              style={[
                styles.stepCircle,
                index < current ? styles.stepCircleDone : null,
                index === current ? styles.stepCircleCurrent : null,
              ]}
            >
              {index < current ? (
                <Icon name="check" size={12} color={neutral.surface} />
              ) : (
                <Text
                  variant="captionStrong"
                  color={index === current ? brand.green700 : semantic.textMuted}
                >
                  {String(index + 1)}
                </Text>
              )}
            </View>
            <Text
              variant="captionStrong"
              color={index === current ? semantic.text : semantic.textMuted}
              numberOfLines={2}
            >
              {step.label}
            </Text>
          </View>
        </React.Fragment>
      ))}
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*  Form                                                                       */
/* -------------------------------------------------------------------------- */

/** A labelled text field. */
export function CareField({
  label,
  value,
  onChangeText,
  placeholder,
  helper,
  tall = false,
  style,
}: {
  label?: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  /** The line under the box. */
  helper?: string;
  /** The field is tall enough for several lines. */
  tall?: boolean;
  style?: object;
}) {
  return (
    <View style={[styles.field, style]}>
      {label ? (
        <Text variant="footnoteEmphasized" color={semantic.textSecondary}>
          {label}
        </Text>
      ) : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={semantic.textFaint}
        multiline={tall}
        style={[styles.fieldInput, tall ? styles.fieldInputTall : null]}
      />
      {helper ? (
        <Text variant="caption" color={semantic.textMuted}>
          {helper}
        </Text>
      ) : null}
    </View>
  );
}

/** A row with a radio button and a label. */
export function RadioOption({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected: !!selected }}
      onPress={onPress}
      style={({ pressed }) => [styles.radioOption, pressed ? { opacity: 0.9 } : null]}
    >
      <View style={[styles.radio, selected ? styles.radioOn : null]}>
        {selected ? <Icon name="check" size={12} color={neutral.surface} /> : null}
      </View>
      <Text variant="subheadline" color={semantic.text}>
        {label}
      </Text>
    </Pressable>
  );
}

/** A tile the shopper picks one of. */
export function ReachTile({
  icon,
  title,
  body,
  selected,
  onPress,
}: {
  icon: IconName;
  title: string;
  body: string;
  selected?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected: !!selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.reach,
        selected ? styles.reachOn : null,
        pressed ? { opacity: 0.92 } : null,
      ]}
    >
      <Icon
        name={icon}
        size={20}
        color={selected ? neutral.surface : semantic.text}
      />
      <Text
        variant="buttonSmall"
        color={selected ? neutral.surface : semantic.text}
      >
        {title}
      </Text>
      <Text
        variant="caption"
        color={selected ? mint[200] : semantic.textMuted}
      >
        {body}
      </Text>
    </Pressable>
  );
}

/** One of the small promises on the call screen. */
export function PromiseTile({
  icon,
  value,
  label,
}: {
  icon: IconName;
  value: string;
  label: string;
}) {
  return (
    <View style={styles.promise}>
      <Icon name={icon} size={18} color={brand.green700} />
      <Text variant="footnoteEmphasized" color={semantic.text}>
        {value}
      </Text>
      <Text variant="captionStrong" color={semantic.textMuted}>
        {label}
      </Text>
    </View>
  );
}

/** A choice with an icon, a title and a line of copy. */
export function CareOption({
  icon,
  title,
  body,
  selected,
  onPress,
}: {
  icon: IconName;
  title: string;
  body?: string;
  selected?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected: !!selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.option,
        selected ? styles.optionOn : null,
        pressed ? { opacity: 0.92 } : null,
      ]}
    >
      <IconTile name={icon} size={18} box={36} radius={radii.mdPlus} />
      <View style={styles.optionText}>
        <Text variant="buttonSmall" color={semantic.text}>
          {title}
        </Text>
        {body ? (
          <Text variant="caption" color={semantic.textMuted}>
            {body}
          </Text>
        ) : null}
      </View>
      <View style={[styles.radio, selected ? styles.radioOn : null]}>
        {selected ? <Icon name="check" size={12} color={neutral.surface} /> : null}
      </View>
    </Pressable>
  );
}

/** The stepper that sets how many packs are wanted. */
export function DarkStepper({
  quantity,
  onChange,
}: {
  quantity: number;
  onChange: (quantity: number) => void;
}) {
  return (
    <View style={styles.darkStepper}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="One fewer"
        onPress={() => onChange(quantity - 1)}
        hitSlop={6}
        style={styles.darkStepperButton}
      >
        <Icon name="minus" size={14} color={neutral.surface} />
      </Pressable>
      <Text variant="footnoteEmphasized" color={neutral.surface}>
        {String(quantity)}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="One more"
        onPress={() => onChange(quantity + 1)}
        hitSlop={6}
        style={styles.darkStepperButton}
      >
        <Icon name="plus" size={14} color={neutral.surface} />
      </Pressable>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*  Cards                                                                      */
/* -------------------------------------------------------------------------- */

/** The card that says what a valid prescription shows. */
export function ValidPrescriptionCard({
  title = 'A valid prescription shows',
  lines,
}: {
  title?: string;
  lines: { icon: IconName; text: string }[];
}) {
  return (
    <ScreenCard>
      <CardTitle>{title}</CardTitle>
      {lines.map((line) => (
        <View key={line.text} style={styles.line}>
          <Icon name={line.icon} size={16} color={brand.green700} />
          <Text variant="footnote" color={semantic.textSecondary} style={styles.lineText}>
            {line.text}
          </Text>
        </View>
      ))}
    </ScreenCard>
  );
}

/** The prescription waiting for the pharmacist to check it. */
export function UnderReviewCard({
  prescriptionId,
  sent,
  note,
}: {
  prescriptionId: string;
  sent: string;
  note: string;
}) {
  return (
    <ScreenCard>
      <View style={styles.underReviewHead}>
        <IconTile
          name="rx-doc"
          size={22}
          box={44}
          radius={radii.mdPlus}
          tint={brand.forest}
          color={neutral.surface}
        />
        <View style={styles.underReviewText}>
          <Text variant="eyebrow" color={brand.green700}>
            Uploaded by you
          </Text>
          <Text variant="button" color={semantic.text}>
            {`#${prescriptionId}`}
          </Text>
        </View>
        <TagPill label="Under review" tone="gold" icon="clock" />
      </View>

      <View style={styles.goldNote}>
        <Icon name="clock" size={16} color={gold.ink} />
        <Text variant="footnote" color={gold.ink} style={styles.lineText}>
          {note}
        </Text>
      </View>

      <View style={styles.facts}>
        <View style={styles.fact}>
          <Text variant="caption" color={semantic.textMuted}>
            Source
          </Text>
          <Text variant="footnoteEmphasized" color={semantic.text}>
            Your upload
          </Text>
        </View>
        <View style={styles.fact}>
          <Text variant="caption" color={semantic.textMuted}>
            Sent
          </Text>
          <Text variant="footnoteEmphasized" color={semantic.text}>
            {sent}
          </Text>
        </View>
      </View>
    </ScreenCard>
  );
}

/** The segments that show how far a request has got. */
export function RequestProgress({ step, total }: { step: number; total: number }) {
  return (
    <View style={styles.progress}>
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          style={[styles.progressSegment, index < step ? styles.progressSegmentDone : null]}
        />
      ))}
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*  Styles                                                                     */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  /* Tracker ------------------------------------------------------------ */
  steps: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  step: {
    width: 64,
    alignItems: 'center',
    gap: spacing.xs,
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: radii.circle,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: neutral.surface,
  },
  stepCircleDone: {
    backgroundColor: brand.green700,
  },
  stepCircleCurrent: {
    borderWidth: 1.5,
    borderColor: brand.green700,
  },
  stepLine: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.md,
  },
  stepBar: {
    width: '100%',
    height: 2,
    borderRadius: 1,
    backgroundColor: neutral.line2,
  },
  stepBarDone: {
    backgroundColor: brand.green700,
  },

  /* Form --------------------------------------------------------------- */
  field: {
    gap: spacing.xs,
  },
  fieldInput: {
    minHeight: 48,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: neutral.line2,
    backgroundColor: neutral.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 17,
    lineHeight: 22,
    color: neutral.ink,
  },
  fieldInputTall: {
    minHeight: 88,
    textAlignVertical: 'top',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 34,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: radii.circle,
    borderWidth: 1.5,
    borderColor: neutral.line2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOn: {
    backgroundColor: brand.green,
    borderColor: brand.green,
  },
  reach: {
    flex: 1,
    gap: spacing.xs,
    padding: spacing.md,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: neutral.line,
    backgroundColor: neutral.surface,
  },
  reachOn: {
    borderColor: brand.forest,
    backgroundColor: brand.forest,
  },
  promise: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
    padding: spacing.md,
    borderRadius: radii.md,
    backgroundColor: mint[50],
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: neutral.line,
    backgroundColor: neutral.surface,
  },
  optionOn: {
    borderColor: brand.green,
    backgroundColor: mint[50],
  },
  optionText: {
    flex: 1,
    gap: 2,
  },
  darkStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: 81,
    height: 32,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.md,
    backgroundColor: brand.forest,
  },
  darkStepperButton: {
    padding: spacing.xs,
  },

  /* Cards --------------------------------------------------------------- */
  line: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  lineText: {
    flex: 1,
  },
  underReviewHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  underReviewText: {
    flex: 1,
    gap: 2,
  },
  goldNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radii.md,
    backgroundColor: gold[50],
  },
  facts: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  fact: {
    flex: 1,
    gap: 2,
    padding: spacing.md,
    borderRadius: radii.md,
    backgroundColor: mint[50],
  },
  progress: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  progressSegment: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: neutral.line,
  },
  progressSegmentDone: {
    backgroundColor: brand.green,
  },
});
