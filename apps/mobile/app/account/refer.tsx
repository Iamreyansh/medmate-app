import React from 'react';
import { useRouter } from 'expo-router';

import { ReferScreen } from '../../src/account/ReferScreen';
import { useNotice } from '../../src/state/notice';

/**
 * Refer and earn.
 */
export default function ReferRoute() {
  const router = useRouter();
  const notice = useNotice();

  return (
    <ReferScreen
      onBack={() => router.back()}
      onHelp={() => notice.notify('Help and support is one tap away')}
      onCopy={(value) => notice.notify(`${value} copied`)}
      onInvite={() => notice.notify('Your invite is ready to share')}
    />
  );
}
