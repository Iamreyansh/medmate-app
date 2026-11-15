import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { brand, elevation, gold, neutral, platformKey, radii, semantic, spacing } from '@medmate/theme';

import { Icon, type IconName } from '../icons/Icon';
import { Text } from '../ui/Text';
import { ChatPanel } from '../overlays/ChatPanel';

type Tab = {
  id: string;
  label: string;
  icon: IconName;
};

const TABS: Tab[] = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'pharmacy', label: 'Pharmacy', icon: 'store' },
];

/**
 * The floating bottom bar.
 *
 * iOS gets a pill that holds the tabs plus a separate chat tile and a home
 * indicator; Android gets the same pill, a 60dp chat tile and a gesture
 * handle. The two platforms share the tab items, only the chrome differs.
 */
export function BottomChrome({
  active = 'home',
  onTabPress,
  onChatPress,
  onChatAsk,
  onAdPress,
}: {
  active?: string;
  onTabPress?: (id: string) => void;
  /** Opens the chat sheet. */
  onChatPress?: () => void;
  /** Fired when the shopper asks the chat helper something. */
  onChatAsk?: (question: string) => void;
  /** Opens the promoted slot. */
  onAdPress?: () => void;
}) {
  const isAndroid = platformKey === 'android';

  const [chatOpen, setChatOpen] = useState(false);

  return (
    <View style={styles.chrome}>
      <View style={styles.footer}>
        <View style={styles.bar}>
          {TABS.map((tab) => {
            const selected = tab.id === active;
            return (
              <Pressable
                key={tab.id}
                accessibilityRole="tab"
                accessibilityState={{ selected }}
                onPress={() => onTabPress?.(tab.id)}
                style={({ pressed }) => [
                  styles.tab,
                  selected ? styles.tabActive : styles.tabIdle,
                  { opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <Icon name={tab.icon} size={20} color={selected ? semantic.action : neutral.ink2} />
                <Text
                  variant="navLabel"
                  color={selected ? brand.green700 : neutral.ink2}
                  style={styles.tabLabel}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}

          {/* Ad slot that takes the third tab position. */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Sponsored: new arrivals"
            onPress={onAdPress}
            style={styles.adSlot}
          >
            <View style={styles.adArt} />
            <View style={styles.adTag}>
              <Text variant="tag" color={gold[300]}>
                New
              </Text>
            </View>
          </Pressable>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Chat with the MedMate helper"
          onPress={() => {
            setChatOpen(true);
            onChatPress?.();
          }}
          style={styles.chatTile}
        >
          <Icon name="chat" size={20} color={neutral.surface} />
          <Text variant="navLabel" color={neutral.surface} style={styles.chatLabel}>
            Chat
          </Text>
        </Pressable>
      </View>

      {isAndroid ? (
        <View style={styles.gestureHandle}>
          <View style={styles.handleBar} />
        </View>
      ) : null}

      <ChatPanel
        visible={chatOpen}
        onClose={() => setChatOpen(false)}
        onAsk={(question) => onChatAsk?.(question)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  chrome: {
    backgroundColor: 'transparent',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
  },
  bar: {
    flex: 1,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    padding: spacing.xs,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: neutral.line,
    backgroundColor: neutral.surface,
    shadowColor: elevation.high.shadowColor,
    shadowOffset: elevation.high.shadowOffset,
    shadowRadius: elevation.high.shadowRadius,
    shadowOpacity: elevation.high.shadowOpacity,
    elevation: elevation.high.elevation,
  },
  tab: {
    flex: 1,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xxs,
    borderRadius: 18,
  },
  tabActive: {
    backgroundColor: '#E9F6EE',
  },
  tabIdle: {
    backgroundColor: 'transparent',
  },
  tabLabel: {
    lineHeight: 12,
  },
  adSlot: {
    width: 50,
    height: 48,
    borderRadius: radii.md,
    backgroundColor: gold[50],
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  adArt: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: gold[100],
    opacity: 0.7,
  },
  adTag: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    paddingHorizontal: spacing.xs,
    paddingVertical: 1,
    backgroundColor: brand.forest,
  },
  chatTile: {
    width: 60,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xxs,
    borderRadius: 20,
    backgroundColor: brand.forest,
    shadowColor: elevation.high.shadowColor,
    shadowOffset: elevation.high.shadowOffset,
    shadowRadius: elevation.high.shadowRadius,
    shadowOpacity: elevation.high.shadowOpacity,
    elevation: elevation.high.elevation,
  },
  chatLabel: {
    lineHeight: 12,
  },
  gestureHandle: {
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  handleBar: {
    width: 108,
    height: 4,
    borderRadius: 2,
    backgroundColor: neutral.ink,
    opacity: 0.6,
  },
});
