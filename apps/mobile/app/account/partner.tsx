import React from 'react';
import { useRouter } from 'expo-router';

import { PartnerScreen } from '../../src/account/PartnerScreen';
import { useNotice } from '../../src/state/notice';

/**
 * Partner with us.
 */
export default function PartnerRoute() {
  const router = useRouter();
  const notice = useNotice();

  return (
    <PartnerScreen
      onBack={() => router.back()}
      onHelp={() => notice.notify('Help and support is one tap away')}
    />
  );
}
