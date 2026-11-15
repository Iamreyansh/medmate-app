import React from 'react';
import { useRouter } from 'expo-router';

import { EPrescriptionScreen } from '../../src/care/EPrescriptionScreen';
import { useNotice } from '../../src/state/notice';

/**
 * The e-prescription a doctor issued on a call.
 */
export default function EPrescriptionRoute() {
  const router = useRouter();
  const notice = useNotice();

  return (
    <EPrescriptionScreen
      onBack={() => router.back()}
      onHelp={() => notice.notify('Help and support is one tap away')}
      onOpenFile={() => router.push({ pathname: '/care/file' })}
      onAddToCart={() => router.push({ pathname: '/' })}
    />
  );
}
