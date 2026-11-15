import React from 'react';
import { useRouter } from 'expo-router';

import { PrivacyScreen } from '../../src/account/PrivacyScreen';
import { useNotice } from '../../src/state/notice';

/**
 * Privacy and permissions.
 */
export default function PrivacyRoute() {
  const router = useRouter();
  const notice = useNotice();

  return (
    <PrivacyScreen
      onBack={() => router.back()}
      onHelp={() => notice.notify('Help and support is one tap away')}
      onLink={(id) => {
        if (id === 'privacy-policy' || id === 'terms') {
          router.push({ pathname: '/account/legal' });
          return;
        }
        notice.notify('That part of the account is not built yet');
      }}
    />
  );
}
