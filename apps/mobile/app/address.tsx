import React from 'react';
import { useRouter } from 'expo-router';

import { AddressScreen } from '../src/checkout/AddressScreen';
import { useNotice } from '../src/state/notice';

/**
 * The address route.
 *
 * The checkout opens it from "Deliver to", and the address saved here is the
 * one the order goes to.
 */
export default function AddressRoute() {
  const router = useRouter();
  const notice = useNotice();

  return (
    <AddressScreen
      onBack={() => router.back()}
      onHelp={() => notice.notify('Help and support is one tap away')}
      onSave={() => router.back()}
      onUseMyNumber={() => notice.notify('Your number is already saved')}
    />
  );
}
