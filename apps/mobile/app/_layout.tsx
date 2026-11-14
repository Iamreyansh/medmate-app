import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
  Outfit_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/outfit';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { neutral, platformKey } from '@medmate/theme';

/**
 * Root layout.
 *
 * Loads the Outfit family the whole design system is drawn in, then hands over
 * to the router. The Shop screen is the first route.
 */
export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
    Outfit_800ExtraBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: neutral.page },
          animation: 'fade',
        }}
      />
    </SafeAreaProvider>
  );
}

/** The platform the app is running on, for chrome decisions. */
export const platform = platformKey;
