import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import {
  brand,
  gold,
  mint,
  neutral,
  platformKey,
  radii,
  semantic,
  spacing,
} from '@medmate/theme';

import { Icon, type IconName } from '../icons/Icon';
import { Text } from './Text';

/**
 * The building blocks the prescriptions, health and account screens share.
 *
 * They are taken from the Figma frames for those sections, so the same card,
 * the same tinted icon tile and the same dark banner appear everywhere rather
 * than being redrawn per screen.
 */

const isAndroid = platformKey === 'android';

/* -------------------------------------------------------------------------- */
/*  Surfaces                                                                   */
/* -------------------------------------------------------------------------- */

/** A white card. */
export function ScreenCard({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: object;
}) {
  return <View style={[styles.card, style]}>{children}</View>;
}

/** A card title. */
export function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <Text variant="headline" color={semantic.text}>
      {children}
    </Text>
  );
}

/** A small label above a value, e.g. "Source" over "Your upload". */
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <Text variant="eyebrow" color={semantic.textMuted}>
      {children}
    </Text>
  );
}

/* -------------------------------------------------------------------------- */
/*  Tiles                                                                      */
/* -------------------------------------------------------------------------- */

/** An icon on a tinted rounded tile. */
export function IconTile({
  name,
  size = 18,
  box = 36,
  tint = mint[100],
  color = brand.green700,
  radius = radii.mdPlus,
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
  icon,
}: {
  label: string;
  tone?: 'mint' | 'gold' | 'muted' | 'danger';
  icon?: IconName;
}) {
  const tones = {
    mint: { backgroundColor: mint[100], color: brand.green700 },
    gold: { backgroundColor: gold[100], color: gold.ink },
    muted: { backgroundColor: neutral.surface3, color: neutral.muted },
    danger: { backgroundColor: '#FCECE9', color: '#C2392D' },
  } as const;
  const chosen = tones[tone];

  return (
    <View style={[styles.tagPill, { backgroundColor: chosen.backgroundColor }]}>
      {icon ? <Icon name={icon} size={12} color={chosen.color} /> : null}
      <Text variant="captionStrong" color={chosen.color}>
        {label}
      </Text>
    </View>
  );
}

/** A tick or an empty circle. */
export function RadioCircle({ selected }: { selected?: boolean }) {
  return (
    <View style={[styles.radio, selected ? styles.radioOn : null]}>
      {selected ? <Icon name="check" size={12} color={neutral.surface} /> : null}
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*  Lines                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * A line that starts with a glyph and a sentence.
 *
 * The prescription, health and account screens all list what is on a
 * document, what to check, or what is stored, in this shape.
 */
export function CheckLine({
  icon,
  children,
  tone = 'default',
}: {
  icon: IconName;
  children: React.ReactNode;
  tone?: 'default' | 'muted';
}) {
  return (
    <View style={styles.checkLine}>
      <Icon
        name={icon}
        size={16}
        color={tone === 'muted' ? semantic.textMuted : brand.green700}
      />
      <Text
        variant="footnote"
        color={tone === 'muted' ? semantic.textMuted : semantic.textSecondary}
        style={styles.checkText}
      >
        {children}
      </Text>
    </View>
  );
}

/** A note with a glyph beside it. */
export function InfoNote({
  icon,
  children,
  tone = 'default',
}: {
  icon: IconName;
  children: React.ReactNode;
  tone?: 'default' | 'muted';
}) {
  return (
    <View style={styles.infoNote}>
      <Icon
        name={icon}
        size={16}
        color={tone === 'muted' ? semantic.textMuted : brand.green700}
      />
      <Text
        variant="footnote"
        color={tone === 'muted' ? semantic.textMuted : semantic.textSecondary}
        style={styles.checkText}
      >
        {children}
      </Text>
    </View>
  );
}

/** A titled row with a tinted icon tile, a title and a line of copy. */
export function StepRow({
  icon,
  title,
  body,
  tint = mint[100],
}: {
  icon: IconName;
  title: string;
  body?: string;
  tint?: string;
}) {
  return (
    <View style={styles.stepRow}>
      <IconTile name={icon} size={20} box={40} radius={radii.lg} tint={tint} />
      <View style={styles.stepText}>
        <Text variant="buttonSmall" color={semantic.text}>
          {title}
        </Text>
        {body ? (
          <Text variant="caption" color={semantic.textMuted}>
            {body}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

/** A dark banner that leads somewhere. */
export function BannerRow({
  icon,
  title,
  body,
  onPress,
}: {
  icon: IconName;
  title: string;
  body?: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.banner, pressed ? { opacity: 0.92 } : null]}
    >
      <IconTile
        name={icon}
        size={20}
        box={40}
        radius={radii.lg}
        tint={neutral.surface}
        color={brand.forest}
      />
      <View style={styles.stepText}>
        <Text variant="buttonSmall" color={neutral.surface}>
          {title}
        </Text>
        {body ? (
          <Text variant="caption" color={mint[200]}>
            {body}
          </Text>
        ) : null}
      </View>
      <Icon name="chev-r" size={18} color={neutral.surface} />
    </Pressable>
  );
}

/** A small tinted tile holding a label and a value. */
export function FactTile({
  label,
  value,
  tint = mint[50],
}: {
  label: string;
  value: string;
  tint?: string;
}) {
  return (
    <View style={[styles.factTile, { backgroundColor: tint }]}>
      <Text variant="caption" color={semantic.textMuted}>
        {label}
      </Text>
      <Text variant="footnoteEmphasized" color={semantic.text}>
        {value}
      </Text>
    </View>
  );
}

/** A row that opens something, with a glyph and a chevron. */
export function LinkRow({
  icon,
  label,
  onPress,
  tone = 'default',
}: {
  icon: IconName;
  label: string;
  onPress?: () => void;
  tone?: 'default' | 'danger';
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.linkRow, pressed ? { opacity: 0.85 } : null]}
    >
      <Icon
        name={icon}
        size={16}
        color={tone === 'danger' ? '#C2392D' : semantic.text}
      />
      <Text
        variant="footnoteEmphasized"
        color={tone === 'danger' ? '#C2392D' : semantic.text}
        style={styles.checkText}
      >
        {label}
      </Text>
      <Icon name="chev-r" size={16} color={semantic.textMuted} />
    </Pressable>
  );
}

/* -------------------------------------------------------------------------- */
/*  Brand zone                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * The bar at the top of a screen.
 *
 * The back label names where the shopper came from, and the trailing side
 * carries the help button and the bell.
 */
export function ZoneBar({
  backLabel,
  title,
  onBack,
  onHelp,
  trailing,
  tone = 'dark',
}: {
  backLabel: string;
  /** The title in the middle of the bar. */
  title?: string;
  onBack?: () => void;
  onHelp?: () => void;
  /** What the trailing side says instead of the help button. */
  trailing?: string;
  /** The bar sits on white rather than on the brand zone. */
  tone?: 'dark' | 'light';
}) {
  const ink = tone === 'light' ? semantic.text : neutral.surface;
  const accent = tone === 'light' ? brand.green : gold[300];
  const bellTile = tone === 'light' ? mint[100] : 'rgba(255,255,255,0.14)';

  return (
    <View style={styles.zoneBar}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Back to ${backLabel}`}
        onPress={onBack}
        hitSlop={10}
        style={styles.zoneBack}
      >
        <Icon
          name={isAndroid ? 'arrow-left' : 'chev-l'}
          size={isAndroid ? 24 : 20}
          color={ink}
          strokeWidth={isAndroid ? 2 : 2.2}
        />
        <Text variant="body" color={ink}>
          {backLabel}
        </Text>
      </Pressable>

      {title ? (
        <Text variant="storeNavTitle" color={ink} numberOfLines={1} style={styles.zoneTitle}>
          {title}
        </Text>
      ) : null}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Help and support"
        onPress={onHelp}
        style={styles.zoneHelp}
      >
        {trailing ? (
          <Text variant="body" color={accent}>
            {trailing}
          </Text>
        ) : null}
        <View style={[styles.zoneBell, { backgroundColor: bellTile }]}>
          <Icon name="bell" size={18} color={ink} />
        </View>
      </Pressable>
    </View>
  );
}

/** The large title and the line under it, inside the brand zone. */
export function ZoneHeading({
  title,
  body,
  eyebrow,
}: {
  title: string;
  body?: string;
  /** A small line above the title. */
  eyebrow?: string;
}) {
  return (
    <View style={styles.zoneHeading}>
      {eyebrow ? (
        <Text variant="eyebrow" color={gold[300]}>
          {eyebrow}
        </Text>
      ) : null}
      <Text variant="headlineMedium" color={neutral.surface}>
        {title}
      </Text>
      {body ? (
        <Text variant="footnote" color={mint[200]}>
          {body}
        </Text>
      ) : null}
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*  Styles                                                                     */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  card: {
    padding: spacing.lg,
    gap: spacing.md,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: neutral.line,
    backgroundColor: neutral.surface,
  },
  iconTile: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 1,
    borderRadius: radii.xs,
    alignSelf: 'flex-start',
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
    backgroundColor: brand.green700,
    borderColor: brand.green700,
  },
  checkLine: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  infoNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  checkText: {
    flex: 1,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  stepText: {
    flex: 1,
    gap: 2,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.xl,
    backgroundColor: brand.forest,
  },
  factTile: {
    flex: 1,
    gap: 2,
    padding: spacing.md,
    borderRadius: radii.md,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  zoneBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
    gap: spacing.sm,
  },
  zoneBack: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  zoneTitle: {
    flex: 1,
    textAlign: 'center',
  },
  zoneHelp: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  zoneBell: {
    width: 32,
    height: 32,
    borderRadius: radii.circle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoneHeading: {
    gap: spacing.xs,
  },
});
