import React from 'react';
import { useRouter } from 'expo-router';

import { ConsultationCallScreen } from '../../src/care/ConsultationCallScreen';
import { useNotice } from '../../src/state/notice';

/**
 * Request the doctor call.
 */
export default function ConsultationCallRoute() {
  const router = useRouter();
  const notice = useNotice();

  return (
    <ConsultationCallScreen
      onBack={() => router.back()}
      onHelp={() => notice.notify('Help and support is one tap away')}
      onRequest={() => {
        notice.notify('A doctor will call you shortly');
        router.replace({ pathname: '/orders/track' });
      }}
      onUploadInstead={() => router.push({ pathname: '/care/upload' })}
    />
  );
}
