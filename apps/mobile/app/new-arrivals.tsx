import React from 'react';
import { useRouter } from 'expo-router';

import { NewArrivalsScreen } from '../src/shop/newarrivals/NewArrivalsScreen';
import { useNotice } from '../src/state/notice';

/**
 * The new arrivals route.
 *
 * The newest products on the catalogue with a filter per category.
 */
export default function NewArrivalsRoute() {
  const router = useRouter();
  const notice = useNotice();

  return (
    <NewArrivalsScreen
      onBack={() => router.back()}
      onHelp={() => router.push({ pathname: '/search', params: { q: 'paracetamol' } })}
      onProductPress={(id) => notice.notify(`${id} - the product page is next in the section`)}
    />
  );
}
