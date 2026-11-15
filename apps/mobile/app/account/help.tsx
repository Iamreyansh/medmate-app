import React from 'react';
import { useRouter } from 'expo-router';

import { HelpScreen } from '../../src/account/HelpScreen';
import { useNotice } from '../../src/state/notice';

/**
 * Help and support.
 */
export default function HelpRoute() {
  const router = useRouter();
  const notice = useNotice();

  return (
    <HelpScreen
      onBack={() => router.back()}
      onHelp={() => notice.notify('Help and support is one tap away')}
      onSearch={(value) => notice.notify(`Searching for ${value}`)}
    />
  );
}
