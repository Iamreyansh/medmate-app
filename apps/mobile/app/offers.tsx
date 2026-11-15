import React from 'react';
import { useRouter } from 'expo-router';

import { OffersScreen } from '../src/shop/offers/OffersScreen';
import { useNotice } from '../src/state/notice';

/**
 * The offers route.
 *
 * The rewards balance, the coupons waiting for the user and how the rules
 * work.
 */
export default function OffersRoute() {
  const router = useRouter();
  const notice = useNotice();

  return (
    <OffersScreen
      onBack={() => router.back()}
      onApplyCoupon={(code) => notice.notify(`${code} applied`)}
      onRefer={() => router.push({ pathname: '/account/refer' })}
      onHistory={() => router.push({ pathname: '/orders' })}
    />
  );
}
