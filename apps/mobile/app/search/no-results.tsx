import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { SearchEmptyScreen } from '../../src/shop/search/SearchEmptyScreen';

/**
 * The empty-state route.
 *
 * The same search surface with nothing to show: the header stays, and the
 * results are replaced by the "no results" card.
 */
export default function SearchNoResultsRoute() {
  const router = useRouter();
  const { q } = useLocalSearchParams<{ q?: string }>();

  return (
    <SearchEmptyScreen
      query={q ?? 'Thyronorm 50'}
      onBack={() => router.back()}
      onSuggestionPress={(suggestion: string) => router.replace({ pathname: '/search', params: { q: suggestion } })}
    />
  );
}
