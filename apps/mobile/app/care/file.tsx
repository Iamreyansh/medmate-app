import React from 'react';
import { useRouter } from 'expo-router';

import { PrescriptionFileScreen } from '../../src/care/PrescriptionFileScreen';
import { useNotice } from '../../src/state/notice';

/**
 * The prescription file the shopper sent.
 */
export default function PrescriptionFileRoute() {
  const router = useRouter();
  const notice = useNotice();

  return (
    <PrescriptionFileScreen
      onBack={() => router.back()}
      onHelp={() => notice.notify('Help and support is one tap away')}
    />
  );
}
