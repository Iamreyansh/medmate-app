import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import {
  brand,
  designFontScale,
  gold,
  mint,
  neutral,
  radii,
  semantic,
  spacing,
} from '@medmate/theme';

import { Icon, type IconName } from '../icons/Icon';
import { Text } from '../ui/Text';
import { ArtTile } from '../ui/primitives';

/**
 * The pieces the checkout screens share.
 *
 * They are drawn from the Figma `03 Checkout` frames - the Cart, Compare
 * pharmacies and Payment success screens on iOS and Android - and they use the
 * same tokens as the rest of the app so the checkout sits in the same design
 * language as the shop.
 */

/* -------------------------------------------------------------------------- */
/*  Steps                                                                      */
/* -------------------------------------------------------------------------- */

/** One step of the checkout tracker. */
export type CheckoutStep = {
  id: string;
  label: string;
  /** The width the label takes at the design size, from the Figma frame. */
  labelWidth: number;
  /** The step is behind the shopper. */
  done?: boolean;
  /** The step the shopper is on. */
  current?: boolean;
};

/**
 * The tracker under the brand zone.
 *
 * It shows how far along the checkout is: the steps behind the shopper carry
 * a tick, the one they are on carries its number.
 *
 * On a narrow screen with a large font there is not room for four labels.
 * Rather than cut them off, the steps that are already done drop their
 * label and keep their tick, which is all the information they add.
 */
export function CheckoutSteps({ steps }: { steps: CheckoutStep[] }) {
  const [available, setAvailable] = useState(0);

  // The width the tracker needs at the size the text is actually drawn at.
  const needed = useMemo(
    () =>
      steps.reduce(
        (total, step) => total + 22 + spacing.xs + 2 + step.labelWidth * designFontScale,
        0,
      ) +
      (steps.length - 1) * spacing.xs,
    [steps],
  );

  const compact = available > 0 && needed > available;

  return (
    <View
      style={styles.steps}
      onLayout={(event) => setAvailable(event.nativeEvent.layout.width)}
    >
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          {index > 0 ? <View style={styles.stepRule} /> : null}
          <View style={styles.step}>
            <View
              style={[
                styles.stepDot,
                step.done ? styles.stepDotDone : null,
                step.current ? styles.stepDotCurrent : null,
              ]}
            >
              {step.done ? (
                <Icon name="check" size={12} color={neutral.surface} />
              ) : (
                <Text variant="captionStrong" color={neutral.surface}>
                  {String(index + 1)}
                </Text>
              )}
            </View>
            {compact && step.done ? null : (
              <Text
                variant="footnoteEmphasized"
                color={neutral.surface}
                numberOfLines={1}
                style={styles.stepLabel}
              >
                {step.label}
              </Text>
            )}
          </View>
        </React.Fragment>
      ))}
    </View>
  );
}

/**
 * The numbered circle in front of a section title.
 *
 * The checkout is a numbered list of decisions, so each card that asks for
 * one carries its number.
 */
export function StepBadge({ number }: { number: number }) {
  return (
    <View style={styles.badge}>
      <Text variant="captionStrong" color={brand.green700}>
        {String(number)}
      </Text>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*  Surfaces                                                                   */
/* -------------------------------------------------------------------------- */

/** A white card. Every checkout section sits in one. */
export function SectionCard({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: object;
}) {
  return <View style={[styles.card, style]}>{children}</View>;
}

/** A rounded icon on a tinted tile. */
export function IconTile({
  name,
  size = 18,
  box = 36,
  tint = mint[100],
  color = brand.green700,
  radius = radii.lg,
}: {
  name: IconName;
  /** The size of the glyph. */
  size?: number;
  /** The size of the tile. */
  box?: number;
  tint?: string;
  color?: string;
  radius?: number;
}) {
  return (
    <View
      style={[
        styles.iconTile,
        { width: box, height: box, borderRadius: radius, backgroundColor: tint },
      ]}
    >
      <Icon name={name} size={size} color={color} />
    </View>
  );
}

/** A small label pill. */
export function TagPill({
  label,
  tone = 'mint',
}: {
  label: string;
  tone?: 'mint' | 'gold' | 'muted';
}) {
  const toneStyle =
    tone === 'gold'
      ? { backgroundColor: gold[100], color: gold.ink }
      : tone === 'muted'
        ? { backgroundColor: neutral.surface3, color: neutral.muted }
        : { backgroundColor: mint[100], color: brand.green700 };

  return (
    <View style={[styles.tagPill, { backgroundColor: toneStyle.backgroundColor }]}>
      <Text variant="tag" color={toneStyle.color}>
        {label}
      </Text>
    </View>
  );
}

/** A tick or an empty circle. */
export function RadioCircle({ selected }: { selected: boolean }) {
  return (
    <View style={[styles.radio, selected ? styles.radioOn : null]}>
      {selected ? <Icon name="check" size={12} color={neutral.surface} /> : null}
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*  Choices                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * A tile the shopper picks one of.
 *
 * Used for the payment method and for what to do when an item is missing.
 */
export function ChoiceTile({
  label,
  icon,
  selected = false,
  badge,
  onPress,
  style,
}: {
  label: string;
  icon: IconName;
  selected?: boolean;
  /** A small badge in the corner, e.g. "Soon". */
  badge?: string;
  onPress?: () => void;
  style?: object;
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected: !!selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.choice,
        selected ? styles.choiceOn : null,
        pressed ? { opacity: 0.9 } : null,
        style,
      ]}
    >
      {badge ? (
        <View style={styles.choiceBadge}>
          <Text variant="captionStrong" color={semantic.textMuted}>
            {badge}
          </Text>
        </View>
      ) : null}
      <Icon name={icon} size={18} color={selected ? brand.green700 : neutral.muted} />
      <Text
        variant="footnoteEmphasized"
        color={selected ? semantic.text : semantic.textSecondary}
        numberOfLines={2}
      >
        {label}
      </Text>
    </Pressable>
  );
}

/** The stepper that sets how many packs of a medicine are in the basket. */
export function QuantityStepper({
  quantity,
  onChange,
}: {
  quantity: number;
  onChange: (quantity: number) => void;
}) {
  return (
    <View style={styles.stepper}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="One fewer"
        onPress={() => onChange(quantity - 1)}
        hitSlop={6}
        style={styles.stepperButton}
      >
        <Icon name="minus" size={14} color={brand.green700} />
      </Pressable>
      <Text variant="footnoteEmphasized" color={semantic.text}>
        {String(quantity)}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="One more"
        onPress={() => onChange(quantity + 1)}
        hitSlop={6}
        style={styles.stepperButton}
      >
        <Icon name="plus" size={14} color={brand.green700} />
      </Pressable>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*  Forms                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * A labelled text field.
 *
 * The label sits above the box and a helper line sits below it, so a field
 * with a hint is the same height as one without.
 */
export function Field({
  label,
  value,
  onChangeText,
  placeholder,
  helper,
  multiline = false,
  keyboardType,
  autoCapitalize = 'sentences',
  style,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  /** The line under the box. */
  helper?: string;
  multiline?: boolean;
  keyboardType?: 'default' | 'number-pad' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words';
  style?: object;
}) {
  return (
    <View style={[styles.field, style]}>
      <Text variant="footnoteEmphasized" color={semantic.text}>
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={semantic.textFaint}
        multiline={multiline}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        style={[styles.fieldInput, multiline ? styles.fieldInputTall : null]}
      />
      {helper ? (
        <Text variant="caption" color={semantic.textMuted}>
          {helper}
        </Text>
      ) : null}
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*  Notes                                                                      */
/* -------------------------------------------------------------------------- */
/**
 * A row that opens something.
 *
 * The bill and the policy cards fold away behind these.
 */
export function FoldRow({
  label,
  onPress,
  icon = 'info',
}: {
  label: string;
  onPress?: () => void;
  icon?: IconName;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.foldRow, pressed ? { opacity: 0.85 } : null]}
    >
      <Icon name={icon} size={16} color={semantic.textMuted} />
      <Text variant="footnoteEmphasized" color={semantic.text} style={styles.foldLabel}>
        {label}
      </Text>
      <Icon name="chev-d" size={16} color={semantic.textMuted} />
    </Pressable>
  );
}

/** A note in a tinted box. */
export function NoteRow({
  icon,
  children,
  tone = 'mint',
}: {
  icon: IconName;
  children: React.ReactNode;
  tone?: 'mint' | 'muted';
}) {
  return (
    <View
      style={[
        styles.note,
        tone === 'muted' ? styles.noteMuted : styles.noteMint,
      ]}
    >
      <Icon
        name={icon}
        size={16}
        color={tone === 'muted' ? semantic.textMuted : brand.green700}
      />
      <Text
        variant="caption"
        color={tone === 'muted' ? semantic.textMuted : semantic.textSecondary}
        style={styles.noteText}
      >
        {children}
      </Text>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*  Bill                                                                       */
/* -------------------------------------------------------------------------- */

/** One line of the bill. */
export function BillLine({
  icon,
  label,
  value,
  strong = false,
}: {
  icon?: IconName;
  label: string;
  value: string;
  /** The value is the muted one, e.g. "No delivery fee". */
  strong?: boolean;
}) {
  return (
    <View style={styles.billLine}>
      {icon ? <Icon name={icon} size={16} color={semantic.textMuted} /> : null}
      <Text variant="subheadline" color={semantic.text} style={styles.billLabel}>
        {label}
      </Text>
      <Text variant="subheadlineEmphasized" color={semantic.text}>
        {value}
      </Text>
    </View>
  );
}

/** A dashed rule that separates the bill from what is owed. */
export function DashedRule() {
  return (
    <View style={styles.dashed}>
      {Array.from({ length: 44 }).map((_, index) => (
        <View key={index} style={styles.dash} />
      ))}
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*  Pharmacy                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * One pharmacy the order can be filled by.
 *
 * The card carries the pharmacy's badge, the window it promises, what it
 * charges for delivery and what the basket comes to there.
 */
export function PharmacyOptionCard({
  option,
  selected,
  total,
  meta,
  onPress,
}: {
  option: {
    id: string;
    name: string;
    initials: string;
    tag?: { label: string; tone: 'best' | 'warn' | 'savings' };
    stockNote?: string;
    farNote?: string;
  };
  selected?: boolean;
  /** What the basket comes to at this pharmacy. */
  total: string;
  /** The window, distance and delivery charge. */
  meta: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected: !!selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.pharmacy,
        selected ? styles.pharmacyOn : null,
        pressed ? { opacity: 0.92 } : null,
      ]}
    >
      <View style={styles.pharmacyHead}>
        <ArtTile
          width={40}
          height={40}
          radius={radii.lg}
          initials={option.initials}
          style={styles.pharmacyAvatar}
        />
        <View style={styles.pharmacyText}>
          {option.tag ? (
            <View style={styles.pharmacyTag}>
              <TagPill
                label={option.tag.label}
                tone={
                  option.tag.tone === 'best'
                    ? 'mint'
                    : option.tag.tone === 'warn'
                      ? 'muted'
                      : 'gold'
                }
              />
            </View>
          ) : null}
          <Text variant="subheadlineEmphasized" color={semantic.text} numberOfLines={1}>
            {option.name}
          </Text>
          <View style={styles.pharmacyMeta}>
            <Icon name="scooter" size={12} color={brand.green700} />
            <Text variant="caption" color={semantic.textMuted} numberOfLines={1}>
              {meta}
            </Text>
          </View>
        </View>
        <View style={styles.pharmacyTotal}>
          <Text variant="price" color={semantic.text}>
            {total}
          </Text>
          <Text variant="captionStrong" color={semantic.textMuted}>
            to pay
          </Text>
        </View>
        <RadioCircle selected={!!selected} />
      </View>
      {option.stockNote ? (
        <View style={styles.stockNote}>
          <Icon name="check" size={14} color={brand.green700} />
          <Text variant="caption" color={semantic.textSecondary}>
            {option.stockNote}
          </Text>
        </View>
      ) : null}
      {option.farNote ? (
        <View style={styles.stockNote}>
          <Icon name="info" size={14} color={semantic.textMuted} />
          <Text variant="caption" color={semantic.textMuted}>
            {option.farNote}
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
}

/* -------------------------------------------------------------------------- */
/*  Rails                                                                      */
/* -------------------------------------------------------------------------- */

/** A product the shopper might add before checking out. */
export function AddOnCard({
  name,
  price,
  initials,
  onAdd,
}: {
  name: string;
  price: string;
  initials: string;
  onAdd?: () => void;
}) {
  return (
    <View style={styles.addOn}>
      <ArtTile width={48} height={48} radius={radii.md} initials={initials} />
      <View style={styles.addOnText}>
        <Text variant="caption" color={semantic.text} numberOfLines={2}>
          {name}
        </Text>
        <Text variant="footnoteEmphasized" color={semantic.text}>
          {price}
        </Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Add ${name}`}
        onPress={onAdd}
        style={({ pressed }) => [styles.addOnButton, pressed ? { opacity: 0.85 } : null]}
      >
        <Text variant="footnoteEmphasized" color={brand.green700}>
          ADD
        </Text>
      </Pressable>
    </View>
  );
}

/** A coupon the shopper can apply. */
export function CouponChip({
  code,
  body,
  best,
  onPress,
}: {
  code: string;
  body: string;
  best?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.coupon, pressed ? { opacity: 0.92 } : null]}
    >
      <View style={styles.couponHead}>
        <IconTile name="percent" size={14} box={28} radius={radii.sm} />
        <Text variant="buttonSmall" color={semantic.text}>
          {code}
        </Text>
        {best ? <TagPill label="Best" tone="gold" /> : null}
      </View>
      <Text variant="caption" color={semantic.textMuted} numberOfLines={2}>
        {body}
      </Text>
    </Pressable>
  );
}

/** A horizontal rail of cards that runs off the edge of the screen. */
export function CardRail({ children }: { children: React.ReactNode }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.rail}
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  /* Steps -------------------------------------------------------------- */
  steps: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  badge: {
    width: 24,
    height: 24,
    borderRadius: radii.circle,
    backgroundColor: mint[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    // The rules give way first and the label is the last thing to, so the
    // tracker never runs off the side of a narrow screen.
    flexShrink: 1,
  },
  stepDot: {
    // The tick keeps its size; only the label gives way.
    flexShrink: 0,
    width: 22,
    height: 22,
    borderRadius: radii.circle,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  stepDotDone: {
    backgroundColor: brand.green700,
  },
  stepDotCurrent: {
    backgroundColor: brand.green700,
  },
  stepRule: {
    // The rules share whatever room is left and give it all back when there
    // is none, so the tracker fits the narrowest screen.
    flex: 1,
    minWidth: 0,
    maxWidth: 18,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  stepLabel: {
    // The label is the last thing to give way, and it gives way by
    // shortening rather than by pushing the tracker off the screen.
    flexShrink: 1,
  },

  /* Surfaces ----------------------------------------------------------- */
  card: {
    backgroundColor: neutral.surface,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: neutral.line,
    padding: spacing.lg,
    gap: spacing.md,
  },
  iconTile: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagPill: {
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 1,
    borderRadius: radii.xs,
    alignSelf: 'flex-start',
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: radii.circle,
    borderWidth: 1.5,
    borderColor: neutral.line2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOn: {
    backgroundColor: brand.green700,
    borderColor: brand.green700,
  },

  /* Choices ------------------------------------------------------------ */
  choice: {
    flex: 1,
    minHeight: 60,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: neutral.line,
    backgroundColor: neutral.surface,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.xxs,
    paddingVertical: spacing.sm,
  },
  choiceOn: {
    borderColor: brand.green700,
    backgroundColor: mint[50],
  },
  choiceBadge: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: 81,
    height: 32,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: mint[200],
    backgroundColor: neutral.surface,
  },
  stepperButton: {
    padding: spacing.xs,
  },

  /* Forms -------------------------------------------------------------- */
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
    fontSize: 15,
    color: neutral.ink,
  },
  fieldInputTall: {
    minHeight: 88,
    textAlignVertical: 'top',
  },

  /* Notes -------------------------------------------------------------- */
  foldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 40,
  },
  foldLabel: {
    flex: 1,
  },
  note: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radii.md,
  },
  noteMint: {
    backgroundColor: mint[50],
  },
  noteMuted: {
    backgroundColor: neutral.surface2,
  },
  noteText: {
    flex: 1,
  },

  /* Bill --------------------------------------------------------------- */
  billLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 20,
  },
  billLabel: {
    flex: 1,
  },
  dashed: {
    flexDirection: 'row',
    gap: 4,
    height: 1,
    overflow: 'hidden',
  },
  dash: {
    width: 4,
    height: 1,
    backgroundColor: neutral.line2,
  },

  /* Pharmacy ----------------------------------------------------------- */
  pharmacy: {
    borderRadius: radii.xxl,
    borderWidth: 1,
    borderColor: neutral.line,
    backgroundColor: neutral.surface,
    padding: spacing.md,
    gap: spacing.sm,
  },
  pharmacyOn: {
    borderColor: brand.green700,
    borderWidth: 1.5,
  },
  pharmacyHead: {
    flexDirection: 'row',
    alignItems: 'center',
    // The delivery line under the name has to fit without being cut off,
    // so the parts of the head sit closer together than the design's grid.
    gap: spacing.sm,
  },
  pharmacyAvatar: {
    borderRadius: radii.lg,
  },
  pharmacyText: {
    flex: 1,
    gap: 2,
  },
  pharmacyTag: {
    flexDirection: 'row',
  },
  pharmacyMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  pharmacyTotal: {
    alignItems: 'flex-end',
  },
  stockNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs + 1,
    borderRadius: radii.md,
    backgroundColor: mint[50],
  },

  /* Rails -------------------------------------------------------------- */
  rail: {
    gap: spacing.md,
    paddingRight: spacing.lg,
  },
  addOn: {
    width: 232,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: neutral.line,
    backgroundColor: neutral.surface,
  },
  addOnText: {
    flex: 1,
    gap: 2,
  },
  addOnButton: {
    height: 32,
    paddingHorizontal: spacing.md,
    borderRadius: radii.sm,
    borderWidth: 1.5,
    borderColor: brand.green700,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coupon: {
    width: 236,
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: neutral.line,
    backgroundColor: neutral.surface,
  },
  couponHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
});
