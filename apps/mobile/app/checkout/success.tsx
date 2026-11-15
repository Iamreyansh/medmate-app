import React from 'react';
import { useRouter } from 'expo-router';

import { PaymentSuccessScreen } from '../../src/checkout/PaymentSuccessScreen';
import { useNotice } from '../../src/state/notice';

/**
 * The order-confirmation route.
 *
 * The last step of the checkout: the order is placed and the screen shows
 * what happens next.
 */
export default function PaymentSuccessRoute() {
  const router = useRouter();
  const notice = useNotice();

  return (
    <PaymentSuccessScreen
      onTrackOrder={() => router.push({ pathname: '/pharmacies' })}
      onDoctorCall={() => notice.notify('A doctor calls you after you order')}
      onHelp={() => notice.notify('Help and support is one tap away')}
      onTurnOnUpdates={() => notice.notify('Live updates are on')}
    />
  );
}
