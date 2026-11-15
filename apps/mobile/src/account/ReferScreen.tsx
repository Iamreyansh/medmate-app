import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  brand,
  gold,
  neutral,
  radii,
  semantic,
  spacing,
} from '@medmate/theme';

import { Text } from '../ui/Text';
import { Button, Gradient } from '../ui/primitives';
import { useContentInset } from '../ui/layout';
import { CardTitle, ScreenCard, ZoneBar, ZoneHeading } from '../ui/blocks';
import { account } from './data';

export type ReferScreenProps = {
  onBack?: () => void;
  onHelp?: () => void;
  onCopy?: (value: string) => void;
  onInvite?: () => void;
};

/**
 * Refer and earn.
 *
 * The Figma `07 Account / Refer & earn` frame: the code, what the shopper and
 * their friend get, and how it works.
 */
export function ReferScreen({ onBack, onHelp, onCopy, onInvite }: ReferScreenProps) {
  const insets = useSafeAreaInsets();
  const inset = useContentInset();

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: insets.bottom + 140 }}
        showsVerticalScrollIndicator={false}
      >
        <Gradient token="brand" radius={radii.huge} style={styles.zone}>
          <View style={[styles.zoneInner, { paddingTop: insets.top }]}>
            <View style={{ paddingHorizontal: inset }}>
              <ZoneBar
                backLabel="Account"
                title="Refer and earn"
                onBack={onBack}
                onHelp={onHelp}
              />
            </View>
            <View style={[styles.zoneHeading, { paddingHorizontal: inset }]}>
              <ZoneHeading
                eyebrow="Invite friends"
                title="You both get ₹100"
                body="They save on health products in their first order, you earn MedMate Money."
              />
            </View>
          </View>
        </Gradient>

        <View style={[styles.content, { paddingHorizontal: inset }]}>
          {/* The code. */}
          <View style={styles.overlap}>
            <ScreenCard>
              <Text variant="eyebrow" color={semantic.textMuted}>
                Your referral code
              </Text>
              <View style={styles.codeRow}>
                <Text variant="referralCode" color={brand.forest}>
                  {account.referralCode}
                </Text>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => onCopy?.(account.referralCode)}
                  hitSlop={6}
                >
                  <Text variant="buttonSmall" color={brand.green700}>
                    Copy
                  </Text>
                </Pressable>
              </View>
              <View style={styles.earnings}>
                <View style={styles.earning}>
                  <Text variant="amount" color={brand.forest}>
                    ₹100
                  </Text>
                  <Text variant="caption" color={semantic.textMuted}>
                    Your friend saves on health products
                  </Text>
                </View>
                <View style={styles.earning}>
                  <Text variant="amount" color={brand.forest}>
                    ₹100
                  </Text>
                  <Text variant="caption" color={semantic.textMuted}>
                    You get in MedMate Money
                  </Text>
                </View>
              </View>
            </ScreenCard>
          </View>

          {/* How it works. */}
          <ScreenCard>
            <CardTitle>How it works</CardTitle>
            <View style={styles.step}>
              <Text variant="eyebrow" color={semantic.textMuted}>
                STEP 1
              </Text>
              <Text variant="buttonSmall" color={semantic.text}>
                Share your code
              </Text>
              <Text variant="caption" color={semantic.textMuted}>
                Send your invite to friends and family who have not ordered on MedMate before.
              </Text>
            </View>
            <View style={styles.step}>
              <Text variant="eyebrow" color={semantic.textMuted}>
                STEP 2
              </Text>
              <Text variant="buttonSmall" color={semantic.text}>
                They save ₹100
              </Text>
              <Text variant="caption" color={semantic.textMuted}>
                On health products in their first order above ₹199. Prescription medicines are
                never discounted.
              </Text>
            </View>
            <View style={styles.step}>
              <Text variant="eyebrow" color={semantic.textMuted}>
                STEP 3
              </Text>
              <Text variant="buttonSmall" color={semantic.text}>
                You get ₹100
              </Text>
              <Text variant="caption" color={semantic.textMuted}>
                Added to your MedMate Money once their first order is delivered.
              </Text>
            </View>
          </ScreenCard>

          {/* The message to share. */}
          <ScreenCard>
            <Text variant="eyebrow" color={brand.green700}>
              Your invite message
            </Text>
            <Text variant="footnote" color={semantic.textSecondary}>
              MedMate delivers medicines from licensed pharmacies nearby. Use my code{' '}
              {account.referralCode} and save ₹100 on health products in your first order above
              ₹199.
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => onCopy?.(account.referralCode)}
              hitSlop={6}
              style={({ pressed }) => [pressed ? { opacity: 0.8 } : null]}
            >
              <Text variant="footnoteEmphasized" color={brand.green}>
                Copy message
              </Text>
            </Pressable>
          </ScreenCard>

          {/* The wallet. */}
          <View style={styles.money}>
            <Text variant="buttonSmall" color={brand.forest}>
              MedMate Money balance ₹15
            </Text>
            <Text variant="caption" color={brand.forest}>
              Referral rewards are added here. Use them at checkout.
            </Text>
          </View>

          <Text variant="footnote" color={semantic.textSecondary}>
            Friends who join with your code are not listed in the app yet. When a friend’s first
            order is delivered, our team adds your ₹100 to MedMate Money.
          </Text>

          <Pressable
            accessibilityRole="button"
            hitSlop={6}
            style={({ pressed }) => [styles.terms, pressed ? { opacity: 0.8 } : null]}
          >
            <Text variant="buttonSmall" color={semantic.text}>
              Terms of the referral offer
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      <View style={[styles.actionBar, { paddingBottom: insets.bottom + spacing.sm }]}>
        <View style={[styles.actionInner, { paddingHorizontal: inset }]}>
          <Button
            label="Invite friends"
            tone="filled"
            size="large"
            icon="gift"
            chevron
            onPress={onInvite}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: semantic.page },
  scroll: { flex: 1 },
  zone: {
    borderBottomLeftRadius: radii.huge,
    borderBottomRightRadius: radii.huge,
    overflow: 'hidden',
  },
  zoneInner: { paddingBottom: spacing.lg },
  zoneHeading: { marginTop: spacing.md },
  content: { gap: spacing.lg, paddingTop: spacing.lg },
  overlap: { marginTop: -spacing.xl },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  earnings: { flexDirection: 'row', gap: spacing.md },
  earning: { flex: 1, gap: 2 },
  step: { gap: 2 },
  money: {
    gap: 2,
    padding: spacing.md,
    borderRadius: radii.lg,
    backgroundColor: gold[50],
  },
  terms: { alignSelf: 'flex-start' },
  actionBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: neutral.surface,
    borderTopWidth: 1,
    borderTopColor: neutral.line,
  },
  actionInner: { paddingTop: spacing.md },
});
