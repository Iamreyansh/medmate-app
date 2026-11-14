import React from 'react';
import { StyleSheet, Text as RNText, type TextProps as RNTextProps, type TextStyle } from 'react-native';

import {
  fontFamily,
  iosType,
  m3Type,
  neutral,
  platformKey,
  typeRoles,
  type IosTypeToken,
  type M3TypeToken,
  type TypeRole,
  type TypeStyle,
} from '@medmate/theme';

export type TextVariant = IosTypeToken | M3TypeToken | TypeRole;

export type TextProps = RNTextProps & {
  /**
   * Which step of the scale to use. Platform tokens (`largeTitle`, `title2`, …)
   * render the platform's own scale; roles (`sectionTitle`, `caption`, …)
   * resolve to the platform's equivalent.
   */
  variant?: TextVariant;
  /** Text colour. Defaults to the primary ink. */
  color?: string;
  /** Override the resolved size / weight / spacing. */
  style?: TextStyle | TextStyle[];
  children?: React.ReactNode;
};

/**
 * Resolve a variant name to concrete type metrics for the running platform.
 *
 * A platform token that only exists on one platform falls back to the closest
 * match on the other, so a shared screen can use `title2` without branching.
 */
export function resolveType(variant: TextVariant): TypeStyle {
  const isIos = platformKey === 'ios';

  if (variant in typeRoles) {
    const role = typeRoles[variant as TypeRole];
    return isIos
      ? (iosType[role.ios] as TypeStyle)
      : (m3Type[role.m3] as TypeStyle);
  }

  if (isIos && variant in iosType) {
    return iosType[variant as keyof typeof iosType] as TypeStyle;
  }
  if (!isIos && variant in m3Type) {
    return m3Type[variant as keyof typeof m3Type] as TypeStyle;
  }
  if (variant in iosType) {
    return iosType[variant as keyof typeof iosType] as TypeStyle;
  }
  if (variant in m3Type) {
    return m3Type[variant as keyof typeof m3Type] as TypeStyle;
  }

  return iosType.body as TypeStyle;
}

/**
 * Typed text.
 *
 * Every string in the app goes through this component so the Outfit scale is
 * applied consistently and no screen hand-rolls a font size.
 */
export function Text({ variant = 'body', color = neutral.ink, style, children, ...rest }: TextProps) {
  const metrics = resolveType(variant);

  return (
    <RNText
      {...rest}
      style={[
        styles.base,
        {
          fontSize: metrics.fontSize,
          lineHeight: metrics.lineHeight,
          fontFamily: fontFamily[metrics.fontWeight],
          fontWeight: metrics.fontWeight,
          letterSpacing: metrics.letterSpacing,
          textTransform: metrics.textTransform,
          color,
        },
        style,
      ]}
    >
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
  },
});
