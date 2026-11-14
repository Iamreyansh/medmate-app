import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { pharmacyFromSlug } from '../../src/data/pharmacy';
import { PharmacyStorefrontScreen } from '../../src/shop/pharmacies/PharmacyStorefrontScreen';
import { useNotice } from '../../src/state/notice';

/**
 * The pharmacy storefront route.
 *
 * `id` names the store. The screen lists the products on its shelves, the
 * coupons it accepts and its delivery window.
 */
export default function PharmacyRoute() {
  const router = useRouter();
  const notice = useNotice();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const pharmacy = pharmacyFromSlug(id ?? 'healthfirst-chemist');

  return (
    <PharmacyStorefrontScreen
      pharmacy={pharmacy}
      onBack={() => router.back()}
      onHelp={() => router.push({ pathname: '/search', params: { q: 'paracetamol' } })}
      onProductPress={(productId) =>
        router.push({ pathname: '/product/[id]', params: { id: productId } })
      }
      onCouponApply={(code) => notice.notify(`${code} applied`)}
    />
  );
}
