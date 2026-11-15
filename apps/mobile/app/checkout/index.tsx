import React from 'react';
import { useRouter } from 'expo-router';

import { CheckoutScreen } from '../../src/checkout/CheckoutScreen';
import { useNotice } from '../../src/state/notice';

/**
 * The checkout route.
 *
 * The cart is the first step of the checkout. The other steps live on their
 * own routes: the pharmacy comparison and the order confirmation.
 */
export default function CheckoutRoute() {
  const router = useRouter();
  const notice = useNotice();

  return (
    <CheckoutScreen
      onBack={() => router.back()}
      onHelp={() => notice.notify('Help and support is one tap away')}
      onComparePharmacies={() => router.push({ pathname: '/checkout/pharmacies' })}
      onChangeAddress={() => router.push({ pathname: '/address' })}
      onAddItems={() => router.push({ pathname: '/new-arrivals' })}
      onAddPrescription={() => notice.notify('Upload a prescription to unlock Rx medicines')}
      onInstructions={() => router.push({ pathname: '/address' })}
      onPlaceOrder={() => router.push({ pathname: '/checkout/success' })}
    />
  );
}
