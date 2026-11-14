import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { SearchScreen } from '../../src/shop/search/SearchScreen';
import { useNotice } from '../../src/state/notice';

/**
 * The search results route.
 *
 * `?q=` carries the query. The screen keeps its own copy so the field can be
 * edited without a navigation round trip.
 */
export default function SearchRoute() {
  const router = useRouter();
  const notice = useNotice();
  const { q } = useLocalSearchParams<{ q?: string }>();

  return (
    <SearchScreen
      initialQuery={q ?? 'paracetamol'}
      onBack={() => router.back()}
      onUploadRx={() => notice.notify('Upload a prescription to unlock Rx medicines')}
      onProductPress={(id) => router.push({ pathname: '/product/[id]', params: { id } })}
    />
  );
}
