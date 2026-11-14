import React from 'react';
import { useRouter } from 'expo-router';

import { PharmaciesScreen } from '../../src/shop/pharmacies/PharmaciesScreen';

/**
 * The pharmacies route.
 *
 * The stores that deliver to the app, the categories to shop by and the
 * filters.
 */
export default function PharmaciesRoute() {
  const router = useRouter();

  return (
    <PharmaciesScreen
      onBack={() => router.back()}
      onStorePress={(pharmacy) =>
        router.push({ pathname: '/pharmacies/[id]', params: { id: pharmacy.id } })
      }
      onCategoryPress={(category) =>
        router.push({ pathname: '/category/[slug]', params: { slug: category.toLowerCase().replace(/[^a-z0-9]+/g, '-') } })
      }
    />
  );
}
