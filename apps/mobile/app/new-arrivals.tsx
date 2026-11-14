import React from 'react';
import { useRouter } from 'expo-router';

import { NewArrivalsScreen } from '../src/shop/newarrivals/NewArrivalsScreen';

/**
 * The new arrivals route.
 *
 * The newest products on the catalogue with a filter per category.
 */
export default function NewArrivalsRoute() {
  const router = useRouter();

  return (
    <NewArrivalsScreen
      onBack={() => router.back()}
      onHelp={() => router.push({ pathname: '/search', params: { q: 'paracetamol' } })}
      onProductPress={(id) => router.push({ pathname: '/product/[id]', params: { id } })}
    />
  );
}
