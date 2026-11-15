import React from 'react';
import { useRouter } from 'expo-router';

import { RequestMedicineScreen } from '../../src/care/RequestMedicineScreen';
import { useNotice } from '../../src/state/notice';

/**
 * Ask the MedMate team to source a medicine.
 */
export default function RequestMedicineRoute() {
  const router = useRouter();
  const notice = useNotice();

  return (
    <RequestMedicineScreen
      onBack={() => router.back()}
      onHelp={() => notice.notify('Help and support is one tap away')}
      onSend={() => {
        notice.notify('Request sent. The team calls you back');
        router.replace({ pathname: '/care/requests' });
      }}
      onUpload={() => router.push({ pathname: '/care/upload' })}
    />
  );
}
