import React from 'react';
import { useRouter } from 'expo-router';

import { ConsentScreen } from '../../src/onboarding/ConsentScreen';
import { useNotice } from '../../src/state/notice';
import { useSession } from '../../src/state/session';

/**
 * The terms and the consents.
 */
export default function ConsentRoute() {
  const router = useRouter();
  const notice = useNotice();
  const session = useSession();

  return (
    <ConsentScreen
      phone={session.phone}
      onBack={() => router.back()}
      onHelp={() => notice.notify('Help and support is one tap away')}
      onExplain={(title) => notice.notify(`${title}: what this means`)}
      onAgree={(consents) => {
        session.setConsents(consents);
        router.replace({ pathname: '/onboarding/location' });
      }}
      onDecline={() => {
        session.signOut();
        router.replace({ pathname: '/onboarding/login' });
      }}
    />
  );
}
