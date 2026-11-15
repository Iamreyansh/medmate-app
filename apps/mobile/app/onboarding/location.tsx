import React from 'react';
import { useRouter } from 'expo-router';

import { LocationScreen } from '../../src/onboarding/LocationScreen';
import { useNotice } from '../../src/state/notice';
import { useSession } from '../../src/state/session';

/**
 * Where the order goes.
 *
 * The last screen of the onboarding flow. After this the shop opens.
 */
export default function LocationRoute() {
  const router = useRouter();
  const notice = useNotice();
  const session = useSession();

  return (
    <LocationScreen
      onBack={() => router.back()}
      onHelp={() => notice.notify('Help and support is one tap away')}
      onDetect={() => notice.notify('Pinning your location')}
      onAddAddress={() => router.push({ pathname: '/address' })}
      onDeliver={() => {
        session.finishOnboarding();
        router.replace({ pathname: '/' });
      }}
    />
  );
}
