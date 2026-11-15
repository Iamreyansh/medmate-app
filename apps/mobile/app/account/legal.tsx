import React from 'react';
import { useRouter } from 'expo-router';

import { LegalScreen } from '../../src/account/LegalScreen';
import { useNotice } from '../../src/state/notice';

/**
 * Terms and Conditions.
 */
export default function LegalRoute() {
  const router = useRouter();
  const notice = useNotice();

  return (
    <LegalScreen
      onBack={() => router.back()}
      onHelp={() => notice.notify('Help and support is one tap away')}
      onLink={(id) => {
        if (id === 'help') {
          router.push({ pathname: '/account/help' });
          return;
        }
        notice.notify('That part of the account is not built yet');
      }}
    />
  );
}
