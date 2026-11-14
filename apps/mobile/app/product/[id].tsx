import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { pharmacies } from '../../src/data/pharmacy';
import { ProductScreen } from '../../src/shop/product/ProductScreen';
import { useNotice } from '../../src/state/notice';

/**
 * The product route.
 *
 * `id` is the catalogue id of the product. Prescription medicines and
 * over-the-counter ones share the layout; the prescription medicine drops the
 * discount and gains the prescription notice.
 */
export default function ProductRoute() {
  const router = useRouter();
  const notice = useNotice();
  const { id } = useLocalSearchParams<{ id?: string }>();

  return (
    <ProductScreen
      productId={id ?? ''}
      onBack={() => router.back()}
      onSearch={() => router.push({ pathname: '/search', params: { q: 'paracetamol' } })}
      onShare={() => notice.notify('Sharing opens in the next release')}
      onFavourite={() => notice.notify('Saved for later')}
      onUploadPrescription={() => notice.notify('Upload a prescription to unlock Rx medicines')}
      onCouponApply={(code) => notice.notify(`${code} applied`)}
      onSimilarPress={(other) => router.push({ pathname: '/product/[id]', params: { id: other } })}
      onPharmacyPress={(name) => {
        const pharmacy = pharmacies.find(
          (candidate) => candidate.name.toLowerCase() === name.toLowerCase(),
        );
        if (pharmacy) {
          router.push({ pathname: '/pharmacies/[id]', params: { id: pharmacy.id } });
          return;
        }
        notice.notify(`${name} - the pharmacy page is next in the section`);
      }}
    />
  );
}
