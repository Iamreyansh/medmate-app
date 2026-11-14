import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { brand, neutral, radii, spacing } from '@medmate/theme';

import { Text } from '../ui/Text';

/**
 * A short notice.
 *
 * Several flows of the app are not built yet - uploading a prescription,
 * opening a product page, asking MedMate to source a medicine. Rather than
 * leaving those taps dead, they raise a notice so the prototype always
 * answers the user.
 */

export type NoticeContextValue = {
  /** Show a notice for a few seconds. */
  notify: (message: string) => void;
};

const NoticeContext = createContext<NoticeContextValue | null>(null);

export function NoticeProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const notify = useCallback((text: string) => {
    setMessage(text);
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(() => setMessage(null), 2600);
  }, []);

  useEffect(
    () => () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    },
    [],
  );

  const value = useMemo<NoticeContextValue>(() => ({ notify }), [notify]);

  return (
    <NoticeContext.Provider value={value}>
      {children}
      <NoticeToast message={message} />
    </NoticeContext.Provider>
  );
}

/** Raise a short notice. */
export function useNotice(): NoticeContextValue {
  const context = useContext(NoticeContext);
  if (!context) {
    throw new Error('useNotice must be used inside a NoticeProvider');
  }
  return context;
}

/** The notice itself. */
function NoticeToast({ message }: { message: string | null }) {
  const insets = useSafeAreaInsets();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: message ? 1 : 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: message ? 0 : 12,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();
  }, [message, opacity, translateY]);

  if (!message) {
    return null;
  }

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.toast,
        {
          bottom: insets.bottom + 96,
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <View style={styles.bubble}>
        <Text variant="caption" color={neutral.surface}>
          {message}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    alignItems: 'center',
  },
  bubble: {
    maxWidth: '100%',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md - 2,
    borderRadius: radii.md,
    backgroundColor: brand.forest,
  },
});
