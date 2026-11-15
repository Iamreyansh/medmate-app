import React from 'react';
import { Redirect, useSegments } from 'expo-router';

import { useSession } from '../src/state/session';

/**
 * The gate.
 *
 * Until the shopper has been through the onboarding flow there is no account,
 * and the cart, the orders, the prescriptions and the wallet have nobody to
 * belong to. So the app opens on the splash until the flow is done.
 */
export function OnboardingGate({ children }: { children: React.ReactNode }) {
  const session = useSession();
  const segments = useSegments();
  const inOnboarding = segments[0] === 'onboarding';

  if (!session.onboarded && !inOnboarding) {
    return <Redirect href="/onboarding/splash" />;
  }

  return <>{children}</>;
}
