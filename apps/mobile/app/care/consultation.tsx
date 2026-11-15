import React from 'react';
import { useRouter } from 'expo-router';

import { ConsultationInfoScreen } from '../../src/care/ConsultationInfoScreen';
import { useNotice } from '../../src/state/notice';

/**
 * What a doctor call is.
 */
export default function ConsultationRoute() {
  const router = useRouter();
  const notice = useNotice();

  return (
    <ConsultationInfoScreen
      onBack={() => router.back()}
      onHelp={() => notice.notify('Help and support is one tap away')}
      onRequestCall={() => router.push({ pathname: '/care/call' })}
    />
  );
}
