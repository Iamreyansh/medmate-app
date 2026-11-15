import React from 'react';
import { useRouter } from 'expo-router';

import { ComparePharmaciesScreen } from '../../src/checkout/ComparePharmaciesScreen';
import { useNotice } from '../../src/state/notice';

/**
 * The compare-pharmacies route.
 *
 * Picking a pharmacy here changes the one the cart fills the order from.
 */
export default function ComparePharmaciesRoute() {
  const router = useRouter();
  const notice = useNotice();

  return (
    <ComparePharmaciesScreen
      onBack={() => router.back()}
      onHelp={() => notice.notify('Help and support is one tap away')}
    />
  );
}
