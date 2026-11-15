import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { brand, mint, neutral, radii, semantic, spacing } from '@medmate/theme';

import { Icon } from '../icons/Icon';
import { Text } from '../ui/Text';

/** The questions the helper can answer straight away. */
export const chatChips = [
  'Track my order',
  'Upload prescription',
  'Medicine not available',
  'Offers',
  'Talk to support',
];

/** What the helper says when it opens. */
export const chatGreeting =
  'Hi, I’m MedMate’s chat helper. Ask about orders, prescriptions, delivery or offers, or type a medicine name. I’m automated and not a doctor.';

/** What it says about the delivery charges. */
export const chatDelivery =
  'Each pharmacy sets its own delivery fee, and some waive it above an order value. A ₹5 handling fee applies to every order. Express adds ₹25, and a second pickup adds ₹15.';

export type ChatPanelProps = {
  visible: boolean;
  onClose?: () => void;
  /** Fired when the shopper picks one of the quick questions. */
  onAsk?: (question: string) => void;
};

/**
 * The chat panel.
 *
 * The Figma `08 Overlays / Chat panel` frame: the panel over the home screen
 * with the helper's messages, the quick questions and the composer.
 */
export function ChatPanel({ visible, onClose, onAsk }: ChatPanelProps) {
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState('');

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.scrim}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close the chat"
          onPress={onClose}
          style={styles.scrimFill}
        />

        <View style={[styles.panel, { paddingBottom: insets.bottom }]}>
          <View style={styles.grabber} />

          <View style={styles.head}>
            <View style={styles.headText}>
              <Text variant="headline" color={semantic.text}>
                MedMate chat
              </Text>
              <Text variant="caption" color={semantic.textMuted}>
                Automated help · not a doctor
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close the chat"
              onPress={onClose}
              hitSlop={10}
              style={styles.close}
            >
              <Icon name="x" size={18} color={semantic.text} />
            </Pressable>
          </View>

          <ScrollView
            style={styles.messages}
            contentContainerStyle={styles.messagesBody}
            showsVerticalScrollIndicator={false}
          >
            <View style={[styles.bubble, styles.botBubble]}>
              <Text variant="footnote" color={semantic.text}>
                {chatGreeting}
              </Text>
            </View>

            <View style={[styles.bubble, styles.userBubble]}>
              <Text variant="footnote" color={neutral.surface}>
                Delivery charges
              </Text>
            </View>

            <View style={[styles.bubble, styles.botBubble]}>
              <Text variant="footnote" color={semantic.text}>
                {chatDelivery}
              </Text>
            </View>

            <View style={styles.chips}>
              {chatChips.map((chip) => (
                <Pressable
                  key={chip}
                  accessibilityRole="button"
                  onPress={() => onAsk?.(chip)}
                  style={({ pressed }) => [styles.chip, pressed ? { opacity: 0.9 } : null]}
                >
                  <Text variant="footnoteEmphasized" color={brand.green}>
                    {chip}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>

          <View style={styles.composer}>
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Type your question or a medicine name"
              placeholderTextColor={semantic.textFaint}
              style={styles.input}
              accessibilityLabel="Your question"
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Send"
              onPress={() => {
                if (message.trim()) onAsk?.(message.trim());
                setMessage('');
              }}
              style={({ pressed }) => [styles.send, pressed ? { opacity: 0.85 } : null]}
            >
              <Icon name="chev-r" size={16} color={neutral.surface} />
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: semantic.scrim,
  },
  scrimFill: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  panel: {
    maxHeight: '86%',
    backgroundColor: neutral.surface,
    borderTopLeftRadius: radii.huge,
    borderTopRightRadius: radii.huge,
  },
  grabber: {
    alignSelf: 'center',
    width: 36,
    height: 5,
    borderRadius: 3,
    backgroundColor: neutral.line2,
    marginTop: spacing.sm,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headText: {
    flex: 1,
    gap: 2,
  },
  close: {
    width: 32,
    height: 32,
    borderRadius: radii.circle,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: neutral.surface2,
  },
  messages: {
    flexGrow: 0,
  },
  messagesBody: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  bubble: {
    maxWidth: '92%',
    padding: spacing.md,
    borderRadius: radii.lg,
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: neutral.surface2,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: brand.green,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingTop: spacing.xs,
  },
  chip: {
    height: 34,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: mint[200],
    backgroundColor: mint[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    borderTopWidth: 1,
    borderTopColor: neutral.line,
  },
  input: {
    flex: 1,
    height: 44,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: neutral.line2,
    fontSize: 15,
    color: neutral.ink,
  },
  send: {
    width: 44,
    height: 44,
    borderRadius: radii.circle,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: brand.green,
  },
});
