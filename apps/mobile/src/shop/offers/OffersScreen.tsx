import React, { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  brand,
  designFontScale,
  elevation,
  gold,
  mint,
  neutral,
  platformKey,
  radii,
  semantic,
  spacing,
} from '@medmate/theme';

import { Icon } from '../../icons/Icon';
import { Text } from '../../ui/Text';
import { Button, Gradient } from '../../ui/primitives';
import { useNotice } from '../../state/notice';
import {
  couponRules,
  emptyCartNote,
  offerCoupons,
  rewards,
} from '../../data/pharmacy';
import { BottomChrome } from '../BottomChrome';
import { NavBar } from '../BrandZone';

const isAndroid = platformKey === 'android';

export type OffersScreenProps = {
  onBack?: () => void;
  onApplyCoupon?: (code: string) => void;
};

/**
 * Offers and coupons.
 *
 * The rewards balance, the field for a code the user has, the coupons that
 * are waiting for them and how the rules work.
 */
export function OffersScreen({ onBack, onApplyCoupon }: OffersScreenProps) {
  const insets = useSafeAreaInsets();
  const notice = useNotice();
  const [code, setCode] = useState('');

  const apply = (value: string) => {
    const match = offerCoupons.find((coupon) => coupon.code === value.trim().toUpperCase());
    if (match) {
      onApplyCoupon?.(match.code) ?? notice.notify(`${match.code} applied`);
      setCode('');
      return;
    }
    notice.notify('That code is not valid on this order');
  };

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 110 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Brand zone */}
        <View style={[styles.zone, { paddingTop: insets.top }]}>
          <NavBar
            title="Offers and coupons"
            onBack={onBack}
            onAction={onBack}
            actionLabel="Help"
          />

          <View style={styles.zoneContent}>
            <Text variant="storeTitle" color={neutral.surface}>
              Save on health products
            </Text>
            <Text variant="resultMeta" color={mint[200]}>
              {`${offerCoupons.length} coupons · one coupon per order · never on prescription medicines`}
            </Text>
          </View>
        </View>

        {/* The rewards card overlaps the brand zone. */}
        <View style={styles.overlap}>
          <Gradient token="gold" radius={radii.xxl} style={styles.rewards}>
            <Text variant="sectionEyebrow" color={brand.forest} style={styles.rewardsEyebrow}>
              {rewards.title}
            </Text>
            <Text variant="displayPrice" color={brand.forest}>
              {rewards.balance}
            </Text>
            <Text variant="strong" color={brand.forest}>
              {rewards.line}
            </Text>
            <Text variant="resultSub" color={brand.green700}>
              {rewards.body}
            </Text>
            <View style={styles.rewardsAction}>
              <Text variant="strong" color={brand.forest}>
                {rewards.action}
              </Text>
              <Icon name="chev-r" size={14} color={brand.forest} />
            </View>
          </Gradient>
        </View>

        <View style={styles.body}>
          {/* A code the user already has */}
          <View style={styles.card}>
            <Text variant="headline" color={semantic.text}>
              Have a coupon code?
            </Text>
            <View style={styles.codeRow}>
              <TextInput
                allowFontScaling={false}
                value={code}
                onChangeText={setCode}
                placeholder="Enter code"
                placeholderTextColor={semantic.textMuted}
                autoCapitalize="characters"
                style={styles.codeField}
                accessibilityLabel="Coupon code"
              />
              <Button
                label="Apply"
                tone="filled"
                size="large"
                onPress={() => apply(code)}
                style={styles.applyButton}
              />
            </View>
            <Text variant="resultSub" color={semantic.textSecondary}>
              {emptyCartNote}
            </Text>
          </View>

          <Text variant="sectionEyebrow" color={brand.green700}>
            Coupons for you
          </Text>

          {offerCoupons.map((coupon) => (
            <View key={coupon.id} style={styles.couponCard}>
              <View
                style={[
                  styles.stub,
                  coupon.stub === 'forest' ? styles.stubForest : styles.stubGold,
                ]}
              >
                <Text variant="amount" color={coupon.stub === 'forest' ? gold[300] : brand.forest}>
                  {coupon.big}
                </Text>
                <Text
                  variant="tag"
                  color={coupon.stub === 'forest' ? mint[300] : gold.ink}
                >
                  {coupon.unit}
                </Text>
              </View>

              <View style={styles.couponBody}>
                <View style={styles.couponTags}>
                  <View style={styles.codeChip}>
                    <Text variant="tag" color={gold.ink}>
                      {coupon.code}
                    </Text>
                  </View>
                  {coupon.best ? (
                    <View style={styles.bestTag}>
                      <Text variant="tag" color={neutral.surface}>
                        Best for your cart
                      </Text>
                    </View>
                  ) : null}
                </View>
                <Text variant="strong" color={semantic.text} style={styles.couponTitle}>
                  {coupon.title}
                </Text>
                <View style={styles.requirementRow}>
                  <Icon name="info" size={14} color={semantic.textMuted} />
                  <Text variant="resultSub" color={semantic.textSecondary} style={styles.requirementText}>
                    {coupon.requirement}
                  </Text>
                </View>
                <View style={styles.couponFoot}>
                  <Text variant="resultSub" color={semantic.textMuted}>
                    {coupon.code}
                  </Text>
                  <Button
                    label="Apply"
                    tone="forest"
                    size="small"
                    onPress={() => apply(coupon.code)}
                  />
                </View>
              </View>
            </View>
          ))}

          {/* How coupons work */}
          <View style={styles.card}>
            <Text variant="headline" color={semantic.text}>
              How coupons work
            </Text>
            {couponRules.map((rule) => (
              <View key={rule} style={styles.ruleRow}>
                <View style={styles.ruleDot} />
                <Text variant="resultMeta" color={semantic.textSecondary} style={styles.ruleText}>
                  {rule}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* iOS closes the screen with the tab bar; Android leaves the system
          gesture handle alone. */}
      {isAndroid ? null : (
        <View style={[styles.chrome, { paddingBottom: insets.bottom }]}>
          <BottomChrome
            active="home"
            onTabPress={(id) =>
              id === 'home' ? undefined : notice.notify('The pharmacy screen is next in the section')
            }
            onChatPress={() => notice.notify('Chat opens in the next release')}
            onAdPress={() => notice.notify('New arrivals are on the offers screen')}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: neutral.page,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: spacing.xxl,
  },
  zone: {
    backgroundColor: brand.forest,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    paddingLeft: spacing.sm,
    paddingRight: spacing.lg,
    marginTop: spacing.sm,
  },
  back: {
    width: 24,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitle: {
    flex: 1,
    textAlign: 'center',
  },
  help: {
    width: 32,
    height: 32,
  },
  zoneContent: {
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    // The rewards card overlaps the zone, so the zone keeps room for it.
    paddingBottom: spacing.lg + 48,
  },
  overlap: {
    marginTop: -48,
    paddingHorizontal: spacing.lg,
  },
  rewards: {
    gap: spacing.xs,
    padding: spacing.lg,
    borderRadius: radii.xxl,
    shadowColor: elevation.medium.shadowColor,
    shadowOffset: elevation.medium.shadowOffset,
    shadowRadius: elevation.medium.shadowRadius,
    shadowOpacity: elevation.medium.shadowOpacity,
    elevation: elevation.medium.elevation,
  },
  rewardsEyebrow: {
    lineHeight: 13,
  },
  rewardsAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    marginTop: spacing.xxs,
  },
  body: {
    gap: 14,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  card: {
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: mint[200],
    backgroundColor: neutral.surface,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  codeField: {
    flex: 1,
    height: 48,
    paddingHorizontal: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: neutral.line2,
    backgroundColor: neutral.surface2,
    fontFamily: 'Outfit_400Regular',
    fontSize: 15,
    color: semantic.text,
  },
  applyButton: {
    minWidth: 86,
  },
  couponCard: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: mint[200],
    backgroundColor: neutral.surface,
  },
  stub: {
    width: 96,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: radii.lg,
    borderBottomLeftRadius: radii.lg,
  },
  stubForest: {
    backgroundColor: brand.forest,
  },
  stubGold: {
    backgroundColor: gold[50],
  },
  couponBody: {
    flex: 1,
    gap: spacing.xs,
    paddingVertical: spacing.xs,
  },
  couponTags: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  codeChip: {
    borderWidth: 1,
    borderColor: gold.ink,
    borderRadius: radii.xs,
    paddingHorizontal: spacing.xs + 4,
    paddingVertical: spacing.xxs,
  },
  bestTag: {
    paddingHorizontal: spacing.xs + 5,
    paddingVertical: spacing.xxs,
    borderRadius: radii.xs,
    backgroundColor: brand.forest,
  },
  couponTitle: {
    fontSize: 15 * designFontScale,
    lineHeight: 20 * designFontScale,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
  },
  requirementText: {
    flex: 1,
  },
  couponFoot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ruleRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  ruleDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 6,
    backgroundColor: neutral.faint,
  },
  ruleText: {
    flex: 1,
  },
  chrome: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});
