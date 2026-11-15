import React from 'react';
import { useRouter } from 'expo-router';

import { SplashScreen } from '../../src/onboarding/SplashScreen';

/**
 * The splash.
 *
 * The first screen of the app. It hands over to the sign-in.
 */
export default function SplashRoute() {
  const router = useRouter();

  return (
    <SplashScreen
      onDone={() => router.replace({ pathname: '/onboarding/login' })}
    />
  );
}
