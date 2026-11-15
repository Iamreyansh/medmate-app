import React from 'react';
import { useRouter } from 'expo-router';

import { UploadPrescriptionScreen } from '../../src/care/UploadPrescriptionScreen';
import { useNotice } from '../../src/state/notice';

/**
 * Upload a prescription.
 */
export default function UploadPrescriptionRoute() {
  const router = useRouter();
  const notice = useNotice();

  return (
    <UploadPrescriptionScreen
      onBack={() => router.back()}
      onHelp={() => notice.notify('Help and support is one tap away')}
      onTakePhoto={() => notice.notify('The camera opens on your phone')}
      onUploadFile={() => notice.notify('Choose a photo or a PDF')}
      onSend={() => router.replace({ pathname: '/care' })}
      onConsultation={() => router.push({ pathname: '/care/consultation' })}
    />
  );
}
