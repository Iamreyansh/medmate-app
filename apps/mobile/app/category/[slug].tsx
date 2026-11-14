import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { categoryFromSlug, slugFor } from '../../src/data/category';
import { CategoryScreen } from '../../src/shop/category/CategoryScreen';
import { useNotice } from '../../src/state/notice';

/**
 * The category route.
 *
 * `slug` names the category; the screen keeps the products of that category
 * and the filters over them.
 */
export default function CategoryRoute() {
  const router = useRouter();
  const notice = useNotice();
  const { slug } = useLocalSearchParams<{ slug?: string }>();
  const category = categoryFromSlug(slug ?? 'fever-pain');

  return (
    <CategoryScreen
      category={category}
      onBack={() => router.back()}
      onSearch={() => router.push({ pathname: '/search', params: { q: 'paracetamol' } })}
      onCategoryChange={(name) =>
        router.push({ pathname: '/category/[slug]', params: { slug: slugFor(name) } })
      }
      onProductPress={(id) => notice.notify(`${id} - the product page is next in the section`)}
    />
  );
}
