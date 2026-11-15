import React from 'react';
import { useRouter } from 'expo-router';

import { MyPrescriptionsScreen } from '../../src/care/MyPrescriptionsScreen';
import { useNotice } from '../../src/state/notice';

/**
 * My prescriptions.
 *
 * The account screen links here, and the checkout links here when a shopper
 * uploads a prescription instead of asking for a doctor call.
 */
export default function MyPrescriptionsRoute() {
  const router = useRouter();
  const notice = useNotice();

  return (
    <MyPrescriptionsScreen
      onBack={() => router.back()}
      onHelp={() => notice.notify('Help and support is one tap away')}
      onUpload={() => router.push({ pathname: '/care/upload' })}
      onOpenFile={() => router.push({ pathname: '/care/file' })}
      onViewStatus={() => router.push({ pathname: '/orders/track' })}
      onRemove={() => notice.notify('The prescription was removed')}
    />
  );
}
