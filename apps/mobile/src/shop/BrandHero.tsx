import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import {
  brand,
  designFontScale,
  elevation,
  fontFamily,
  gold,
  iosType,
  mint,
  neutral,
  radii,
  semantic,
  spacing,
} from '@medmate/theme';

import { Icon, type IconName } from '../icons/Icon';
import { Text } from '../ui/Text';
import { ArtTile, Button, Gradient, ServiceChip } from '../ui/primitives';
import { useContentInset, useContentWidth } from '../ui/layout';
import { delivery, heroBanners, serviceTabs, trustStrip } from '../data/shop';

const AnimatedPath = Animated.createAnimatedComponent(Path);

/* -------------------------------------------------------------------------- */
/*  Floating glyphs                                                           */
/* -------------------------------------------------------------------------- */

type FloatingGlyph = {
  icon: IconName;
  /** Left offset as a fraction of the hero width. */
  x: number;
  /** Top offset in pt, measured from the top of the brand zone. */
  y: number;
  size: number;
  color: string;
  opacity: number;
  /**
   * Drift distance in pt.
   *
   * The design draws the glyphs still. They drift a little so the hero is not
   * dead, but not enough to wander onto the copy.
   */
  drift: number;
  /** Seconds for one drift cycle. */
  duration: number;
  delay: number;
};

/**
 * The medical glyphs that drift behind the hero.
 *
 * The Figma frame places them by hand; these are the same positions expressed
 * as fractions so the composition holds on any device width.
 */
const FLOATING_GLYPHS: FloatingGlyph[] = [
  { icon: 'heart', x: 0.02, y: 120, size: 39, color: neutral.surface, opacity: 0.25, drift: 5, duration: 5.4, delay: 0 },
  { icon: 'pill', x: 0.76, y: 90, size: 36, color: gold[300], opacity: 0.35, drift: 7, duration: 6.2, delay: 0.6 },
  { icon: 'steth', x: 0.83, y: 300, size: 42, color: neutral.surface, opacity: 0.25, drift: 6, duration: 7.1, delay: 1.2 },
  { icon: 'flask', x: 0.02, y: 326, size: 32, color: neutral.surface, opacity: 0.25, drift: 4, duration: 6.7, delay: 0.3 },
  { icon: 'shield', x: 0.41, y: 66, size: 35, color: gold[300], opacity: 0.35, drift: 5, duration: 5.9, delay: 1.5 },
  { icon: 'plus', x: 0.64, y: 210, size: 26, color: neutral.surface, opacity: 0.25, drift: 8, duration: 4.8, delay: 2.1 },
  { icon: 'heart', x: 0.15, y: 515, size: 30, color: neutral.surface, opacity: 0.25, drift: 6, duration: 6.4, delay: 2.7 },
  { icon: 'pill', x: 0.8, y: 560, size: 40, color: gold[300], opacity: 0.35, drift: 7, duration: 5.6, delay: 3.3 },
];

function FloatingGlyphView({ glyph, width }: { glyph: FloatingGlyph; width: number }) {
  const drift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(glyph.delay * 1000),
        Animated.timing(drift, {
          toValue: 1,
          duration: glyph.duration * 1000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(drift, {
          toValue: 0,
          duration: glyph.duration * 1000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [drift, glyph.delay, glyph.duration]);

  const translateY = drift.interpolate({ inputRange: [0, 1], outputRange: [0, -glyph.drift] });
  const translateX = drift.interpolate({
    inputRange: [0, 1],
    outputRange: [0, glyph.drift / 2],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.floating,
        {
          left: glyph.x * width,
          top: glyph.y,
          opacity: glyph.opacity,
          transform: [{ translateY }, { translateX }],
        },
      ]}
    >
      <Icon name={glyph.icon} size={glyph.size} color={glyph.color} strokeWidth={1.6} />
    </Animated.View>
  );
}

/* -------------------------------------------------------------------------- */
/*  Heartbeat                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * The ECG line in the hero.
 *
 * The Figma note says it "draws itself every 3.2 s", so the stroke is
 * revealed with an animated dash offset and then held for the rest of the
 * cycle.
 */
function HeartbeatLine({ width }: { width: number }) {
  const height = 29;
  const path =
    'M0 15 H22 L28 15 L32 6 L38 25 L44 2 L50 22 L54 15 H74 L79 15 L82 9 L86 21 L90 15 H120';

  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(progress, {
          toValue: 1,
          duration: 3200,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
        Animated.delay(2400),
        Animated.timing(progress, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.quad),
          useNativeDriver: false,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [progress]);

  const strokeDashoffset = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [120, 0],
  });

  return (
    <Svg width={width} height={height} viewBox="0 0 120 30">
      <AnimatedPath
        d={path}
        stroke="rgba(255,255,255,0.45)"
        strokeWidth={1.88}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        strokeDasharray="120"
        strokeDashoffset={strokeDashoffset}
      />
    </Svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  Wordmark                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * The app wordmark.
 *
 * "Med" is white and "Mate" is gold, in one run of type at the same size and
 * weight. A nested text does not inherit the weight from its parent on every
 * platform, so both halves are set explicitly.
 */
function Wordmark() {
  const metrics = iosType.wordmark;
  const type = {
    fontFamily: fontFamily[metrics.fontWeight],
    fontWeight: metrics.fontWeight,
    fontSize: metrics.fontSize * designFontScale,
    lineHeight: metrics.lineHeight * designFontScale,
    letterSpacing: metrics.letterSpacing * designFontScale,
  };

  return (
    <Text style={[styles.wordmark, type]} allowFontScaling={false}>
      Med
      <Text style={[type, { color: gold[300] }]}>Mate</Text>
    </Text>
  );
}

/* -------------------------------------------------------------------------- */
/*  Hero                                                                      */
/* -------------------------------------------------------------------------- */

export type BrandHeroProps = {
  onSearch?: () => void;
  onUploadRx?: () => void;
  onBannerPress?: (id: string) => void;
  /** Fired when the profile avatar is tapped. */
  onProfilePress?: () => void;
  /** Fired when the wallet is tapped. */
  onWalletPress?: () => void;
  /** Fired when a service tab is picked, so the content below can filter. */
  onServiceTabChange?: (tab: string) => void;
};

/**
 * The brand zone at the top of the Shop screen.
 *
 * Forest gradient, drifting medical glyphs, the delivery promise, the health
 * day, the search bar, the service tabs and the hero carousel - all of it in
 * one frame, exactly as the Figma composes it.
 *
 * The system status bar is not drawn here: on device the OS renders it, so the
 * zone uses the real safe-area inset instead of the Figma's 54pt mock.
 */
export function BrandHero({
  onSearch,
  onUploadRx,
  onBannerPress,
  onProfilePress,
  onWalletPress,
  onServiceTabChange,
}: BrandHeroProps) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  // The hero keeps the same content column as the page below it, so on a
  // wider screen the copy and the carousel stay in step with the sections.
  const contentWidth = useContentWidth();
  const inset = useContentInset();

  const [activeTab, setActiveTab] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);

  const slideWidth = contentWidth;
  const slideStride = slideWidth + spacing.md;
  const carousel = useRef<React.ComponentRef<typeof ScrollView>>(null);
  const tabs = useMemo(() => serviceTabs, []);

  return (
    <Gradient token="brand" radius={0} style={styles.hero}>
      <View style={[styles.heroInner, { paddingTop: insets.top + spacing.xs, paddingHorizontal: inset }]}>
        {/* Drifting glyphs sit behind the content, so they are absolutely placed. */}
        <View pointerEvents="none" style={styles.glyphLayer}>
          {FLOATING_GLYPHS.map((glyph, index) => (
            <FloatingGlyphView key={`${glyph.icon}-${index}`} glyph={glyph} width={width} />
          ))}
        </View>

        {/* Top row: wordmark, wallet, bell, avatar */}
        <View style={styles.topRow}>
          <Wordmark />
          <Pressable
            style={styles.walletChip}
            accessibilityRole="button"
            accessibilityLabel="MedMate Money"
            onPress={onWalletPress}
          >
            <Icon name="wallet" size={16} color={gold[300]} />
            <Text variant="footnoteEmphasized" color={neutral.surface}>
              {delivery.walletBalance}
            </Text>
          </Pressable>
          <Pressable style={styles.iconChip} accessibilityRole="button" accessibilityLabel="Notifications">
            <Icon name="bell" size={18} color={neutral.surface} />
          </Pressable>
          <Pressable
            style={styles.avatar}
            accessibilityRole="button"
            accessibilityLabel="Profile"
            onPress={onProfilePress}
          >
            <Text variant="tag" color={brand.forest} style={styles.avatarLetter}>
              P
            </Text>
          </Pressable>
        </View>

        {/* Delivery promise */}
        <View style={styles.delivery}>
          <View style={styles.deliveryRow}>
            <View style={styles.deliveryBadge}>
              <Icon name="scooter" size={16} color={brand.forest} />
            </View>
            <Text variant="title2" color={neutral.surface}>
              {delivery.window}
            </Text>
          </View>
          <Pressable style={styles.addressRow} accessibilityRole="button">
            <Icon name="pin" size={14} color={neutral.surface} />
            <Text variant="footnote" color={neutral.surface} numberOfLines={1} style={styles.addressText}>
              {delivery.address}
            </Text>
            <Icon name="chev-d" size={14} color={neutral.surface} />
          </Pressable>
        </View>

        {/* Health day + heartbeat */}
        <View style={styles.healthRow}>
          <View style={styles.healthPill}>
            <Icon name="heart" size={12} color={neutral.surface} />
            <Text variant="captionStrong" color={neutral.surface}>
              {delivery.healthDay}
            </Text>
          </View>
          <View style={styles.heartbeat}>
            <HeartbeatLine width={120} />
          </View>
        </View>

        {/* Search bar */}
        <Pressable
          accessibilityRole="search"
          onPress={onSearch}
          style={({ pressed }) => [styles.searchBar, { opacity: pressed ? 0.92 : 1 }]}
        >
          <Icon name="search" size={18} color={semantic.textMuted} style={styles.searchIcon} />
          <Text
            variant="body"
            color={semantic.textMuted}
            style={styles.searchPlaceholder}
            numberOfLines={1}
          >
            {delivery.searchPlaceholder}
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={onUploadRx}
            style={styles.uploadRx}
            hitSlop={8}
          >
            <Icon name="rx-up" size={14} color={brand.green700} />
            <Text variant="captionStrong" color={brand.green700}>
              Upload Rx
            </Text>
          </Pressable>
        </Pressable>

        {/* Service tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.tabsRow, { paddingHorizontal: inset }]}
          style={[styles.tabsScroll, { marginHorizontal: -inset }]}
        >
          {tabs.map((tab, index) => (
            <ServiceChip
              key={tab}
              label={tab}
              selected={index === activeTab}
              onPress={() => {
                setActiveTab(index);
                onServiceTabChange?.(tab);
              }}
            />
          ))}
        </ScrollView>

        {/* Hero carousel */}
        <View style={styles.carousel}>
          <ScrollView
            ref={carousel}
            horizontal
            snapToInterval={slideStride}
            decelerationRate="fast"
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={32}
            onScroll={(event) => {
              // The dot follows the swipe, not just the end of the fling, so a
              // slow drag still tracks the slide under the finger.
              const index = Math.round(event.nativeEvent.contentOffset.x / slideStride);
              setActiveSlide(Math.max(0, Math.min(index, heroBanners.length - 1)));
            }}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / slideStride);
              setActiveSlide(Math.max(0, Math.min(index, heroBanners.length - 1)));
            }}
          >
            {heroBanners.map((banner) => (
              <View key={banner.id} style={{ width: slideWidth, marginRight: spacing.md }}>
                <HeroBanner
                  banner={banner}
                  width={slideWidth}
                  onPress={() => onBannerPress?.(banner.id)}
                />
              </View>
            ))}
          </ScrollView>
          <View style={styles.dots}>
            {heroBanners.map((banner, index) => (
              <Pressable
                key={banner.id}
                accessibilityRole="button"
                accessibilityLabel={`Slide ${index + 1} of ${heroBanners.length}`}
                hitSlop={10}
                onPress={() => {
                  setActiveSlide(index);
                  carousel.current?.scrollTo({ x: index * slideStride, animated: true });
                }}
              >
                <View
                  style={[styles.dot, index === activeSlide ? styles.dotActive : styles.dotIdle]}
                />
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </Gradient>
  );
}

/* -------------------------------------------------------------------------- */
/*  Banner                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * One hero banner.
 *
 * The banner pairs a tinted card with a three-object composition on the right
 * (product photos, or the pill / search / phone tiles for "Request a medicine").
 * Product photos are placeholders for now; the art tint carries the initials.
 */
function HeroBanner({
  banner,
  width,
  onPress,
}: {
  banner: (typeof heroBanners)[number];
  /** The width of the banner the art is drawn into. */
  width: number;
  onPress: () => void;
}) {
  // The banner art is drawn for a 361pt banner. Scale it with the banner so
  // nothing is clipped on a narrower phone.
  const scale = width / 361;

  return (
    <Gradient token={banner.gradient} radius={radii.huge} style={styles.banner}>
      <View pointerEvents="none" style={styles.bannerArt}>
        <View
          style={[
            styles.bannerDisc,
            { width: 190 * scale, height: 190 * scale, top: -9 * scale, right: -40 * scale },
          ]}
        />
        <View
          style={[
            styles.bannerDiscInner,
            { width: 132 * scale, height: 132 * scale, top: 20 * scale, right: -12 * scale },
          ]}
        />
        {banner.art.map((item, index) => (
          <View
            key={`${item.kind}-${index}`}
            style={[
              styles.bannerTile,
              {
                // The composition is drawn for a 361pt banner; on a narrower
                // phone it scales down instead of hanging off the edge.
                left: item.x * scale,
                top: item.y * scale,
                width: item.size * scale,
                height: item.size * scale,
                borderRadius: item.kind === 'glyph' && item.circle ? item.size / 2 : radii.xl,
                backgroundColor: item.kind === 'glyph' && item.circle ? brand.forest : neutral.surface,
                alignItems: 'center',
                justifyContent: 'center',
              },
            ]}
          >
            {item.kind === 'photo' ? (
              <ArtTile
                width={Math.max(0, item.size * scale - spacing.md)}
                height={Math.max(0, item.size * scale - spacing.md)}
                radius={radii.md}
                initials={item.initials}
              />
            ) : (
              <Icon
                name={item.icon}
                size={item.circle ? 40 : 22}
                color={item.circle ? neutral.surface : brand.forest}
              />
            )}
          </View>
        ))}
      </View>

      <View style={styles.bannerText}>
        <Text variant="sectionEyebrow" color={brand.forest} style={styles.bannerEyebrow} numberOfLines={1}>
          {banner.eyebrow}
        </Text>
        <Text variant="title3" color={brand.forest} style={styles.bannerTitle}>
          {banner.title}
        </Text>
        <Text variant="caption" color={brand.forest} style={styles.bannerSub}>
          {banner.body}
        </Text>
        <View style={styles.bannerActions}>
          <Button label={banner.action} tone="forest" chevron />
          {banner.code ? (
            <View style={styles.codeChip}>
              <Text variant="footnoteEmphasized" color={brand.forest}>
                {banner.code}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </Gradient>
  );
}

/* -------------------------------------------------------------------------- */
/*  Trust strip                                                               */
/* -------------------------------------------------------------------------- */

/** The reassurance row that closes the hero: genuine, licensed, Rx verified. */
export function TrustStrip() {
  return (
    <View style={styles.trustStrip}>
      {trustStrip.map((item) => (
        <View key={item} style={styles.trustItem}>
          <Icon name="shield" size={14} color={brand.green700} />
          <Text variant="captionStrong" color={semantic.textSecondary}>
            {item}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
  },
  heroInner: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    gap: 14,
  },
  glyphLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  floating: {
    position: 'absolute',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  wordmark: {
    flexDirection: 'row',
  },
  walletChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    height: 36,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(255,255,255,0.10)',
    marginLeft: 'auto',
  },
  iconChip: {
    width: 36,
    height: 36,
    borderRadius: radii.circle,
    backgroundColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: radii.circle,
    backgroundColor: gold[300],
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    lineHeight: 13,
  },
  delivery: {
    gap: spacing.xs,
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  deliveryBadge: {
    width: 28,
    height: 28,
    borderRadius: radii.circle,
    backgroundColor: gold[300],
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  addressText: {
    flexShrink: 1,
  },
  healthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  healthPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    height: 28,
    paddingHorizontal: spacing.md - 2,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  heartbeat: {
    marginLeft: 'auto',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    height: 44,
    paddingHorizontal: spacing.md,
    borderRadius: radii.lg,
    backgroundColor: neutral.surface,
  },
  searchIcon: {
    // The glyph keeps its shape even when the bar runs out of room.
    flexShrink: 0,
  },
  searchPlaceholder: {
    // The placeholder takes the space that is left over and gives it back
    // when the text is long, so the action beside it never moves.
    flex: 1,
    minWidth: 0,
  },
  uploadRx: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    height: 30,
    paddingHorizontal: spacing.md - 2,
    borderRadius: radii.pill,
    backgroundColor: mint[100],
    // The action is never squeezed and always sits against the right edge.
    flexShrink: 0,
    marginLeft: 'auto',
  },
  tabsScroll: {
    marginHorizontal: -spacing.lg,
  },
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  carousel: {
    gap: 10,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs + 2,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    width: 18,
    backgroundColor: gold[300],
  },
  dotIdle: {
    backgroundColor: 'rgba(255,255,255,0.30)',
  },
  banner: {
    minHeight: 172,
    justifyContent: 'flex-end',
    shadowColor: elevation.medium.shadowColor,
    shadowOffset: elevation.medium.shadowOffset,
    shadowRadius: elevation.medium.shadowRadius,
    shadowOpacity: elevation.medium.shadowOpacity,
    elevation: elevation.medium.elevation,
  },
  bannerArt: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bannerDisc: {
    position: 'absolute',
    borderRadius: 95,
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  bannerDiscInner: {
    position: 'absolute',
    borderRadius: 66,
    backgroundColor: 'rgba(255,255,255,0.60)',
  },
  bannerTile: {
    position: 'absolute',
    backgroundColor: neutral.surface,
    borderRadius: radii.xl,
    padding: spacing.xs,
    shadowColor: elevation.medium.shadowColor,
    shadowOffset: elevation.medium.shadowOffset,
    shadowRadius: elevation.medium.shadowRadius,
    shadowOpacity: elevation.medium.shadowOpacity,
    elevation: elevation.medium.elevation,
  },
  bannerText: {
    width: 201,
    maxWidth: '72%',
    gap: spacing.xs,
    paddingLeft: spacing.lg,
    paddingBottom: spacing.lg,
  },
  bannerEyebrow: {
    opacity: 0.7,
    lineHeight: 13,
  },
  bannerTitle: {
    lineHeight: 25,
  },
  bannerSub: {
    lineHeight: 16,
  },
  bannerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  codeChip: {
    height: 36,
    paddingHorizontal: spacing.md - 2,
    borderRadius: radii.sm,
    backgroundColor: 'rgba(255,255,255,0.40)',
    borderWidth: 1,
    borderColor: 'rgba(27,61,41,0.60)',
    justifyContent: 'center',
  },
  trustStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    height: 40,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: neutral.line,
    backgroundColor: neutral.surface,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
});
