import React from 'react';
import { useRouter } from 'expo-router';

import { MyRequestsScreen } from '../../src/care/MyRequestsScreen';
import { useNotice } from '../../src/state/notice';

/**
 * The medicines the MedMate team is sourcing.
 */
export default function MyRequestsRoute() {
  const router = useRouter();
  const notice = useNotice();

  return (
    <MyRequestsScreen
      onBack={() => router.back()}
      onHelp={() => notice.notify('Help and support is one tap away')}
      onRequestAnother={() => router.push({ pathname: '/care/request' })}
      onCancel={(id) => notice.notify(`Request #${id} cancelled`)}
    />
  );
}
