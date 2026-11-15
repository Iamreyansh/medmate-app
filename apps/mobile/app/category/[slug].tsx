import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { categoryFromSlug, slugFor } from '../../src/data/category';
import { CategoryScreen } from '../../src/shop/category/CategoryScreen';

/**
 * The category route.
 *
 * `slug` names the category; the screen keeps the products of that category
 * and the filters over them.
 */
export default function CategoryRoute() {
  const router = useRouter();
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
      onProductPress={(id) => router.push({ pathname: '/product/[id]', params: { id } })}
      onCartPress={() => router.push({ pathname: '/checkout' })}
    />
  );
}
