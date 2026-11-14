import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { careStoreFromSlug } from '../../src/data/care';
import { HealthStoreScreen } from '../../src/shop/care/HealthStoreScreen';
import { useNotice } from '../../src/state/notice';

/**
 * The health store route.
 *
 * `slug` names the store. The screen lists that store's shelf and lets the
 * user hop to the other stores.
 */
export default function CareStoreRoute() {
  const router = useRouter();
  const notice = useNotice();
  const { slug } = useLocalSearchParams<{ slug?: string }>();
  const store = careStoreFromSlug(slug ?? 'ortho-pain-care');

  return (
    <HealthStoreScreen
      store={store}
      onBack={() => router.back()}
      onHelp={() => router.push({ pathname: '/search', params: { q: 'paracetamol' } })}
      onStoreChange={(next) =>
        router.push({ pathname: '/care/[slug]', params: { slug: next.id } })
      }
      onProductPress={(id) => notice.notify(`${id} - the product page is next in the section`)}
    />
  );
}
