import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

import { iconGlyphs, type IconName } from './iconPaths';

export type IconProps = {
  /** Name of the glyph. */
  name: IconName;
  /** Rendered size in pt/dp. The glyph is always drawn on a 24 x 24 grid. */
  size?: number;
  /** Stroke colour. Defaults to `currentColor` behaviour — pass it explicitly. */
  color: string;
  /** Stroke width on the 24 x 24 grid. The MVP uses 1.8. */
  strokeWidth?: number;
};

/**
 * A single line icon.
 *
 * Glyph geometry comes from the MedMate web MVP so the native app and the live
 * product share one icon set. Icons are stroked, never filled, with round caps
 * and joins.
 */
export function Icon({ name, size = 24, color, strokeWidth = 1.8 }: IconProps) {
  const glyph = iconGlyphs[name];

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {glyph.paths.map((d, index) => (
        <Path
          key={`${name}-p${index}`}
          d={d}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
      {glyph.circles.map((c, index) => (
        <Circle
          key={`${name}-c${index}`}
          cx={c.cx}
          cy={c.cy}
          r={c.r}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </Svg>
  );
}

export type { IconName };
