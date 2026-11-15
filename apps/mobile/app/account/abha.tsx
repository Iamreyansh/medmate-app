import React from 'react';
import { useRouter } from 'expo-router';

import { AbhaScreen } from '../../src/account/AbhaScreen';
import { useNotice } from '../../src/state/notice';

/**
 * The ABHA health ID.
 */
export default function AbhaRoute() {
  const router = useRouter();
  const notice = useNotice();

  return (
    <AbhaScreen
      onBack={() => router.back()}
      onHelp={() => notice.notify('Help and support is one tap away')}
      onNotifyMe={() => notice.notify('We will tell you when it is live')}
    />
  );
}
