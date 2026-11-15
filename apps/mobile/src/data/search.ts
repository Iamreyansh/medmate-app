/**
 * Search over the mock catalogue.
 *
 * The screen does not hold its own product list: it queries the shared
 * catalogue, so typing a different medicine shows different products, and the
 * filter counts always describe the results that are actually on screen.
 */
import { brandCount, catalogue, type CatalogueProduct } from './catalogue';

export type SearchResult = CatalogueProduct;

export type SearchFilterId = 'all' | 'noPrescription' | 'prescription' | 'discount';

export type SearchSort = 'relevance' | 'priceLow' | 'priceHigh' | 'discount';

/** The query the design demonstrates with. */
export const searchQuery = 'paracetamol';

/** How many results are rendered before the pagination button appears. */
export const pageSize = 20;

/* -------------------------------------------------------------------------- */
/*  Matching                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Score a product against a query.
 *
 * A name that starts with the query beats a brand that does, which beats a
 * match in the pack description. `0` means no match at all.
 */
export function matchScore(product: CatalogueProduct, query: string): number {
  const needle = query.trim().toLowerCase();
  if (!needle) return 0;

  const name = product.name.toLowerCase();
  const brand = product.brand.toLowerCase();
  const sub = product.sub.toLowerCase();
  const category = product.category.toLowerCase();

  if (name.startsWith(needle)) return 5;
  if (brand.startsWith(needle)) return 4;
  if (name.includes(needle)) return 3;
  if (category.includes(needle)) return 2;
  if (sub.includes(needle)) return 2;
  if (brand.includes(needle)) return 1;
  return 0;
}

/**
 * Run a query over the catalogue.
 *
 * An empty query matches nothing - the screen shows the empty state, which is
 * where the popular searches live.
 */
export function searchCatalogue(query: string): CatalogueProduct[] {
  return catalogue
    .map((product) => ({ product, score: matchScore(product, query) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.product.name.localeCompare(b.product.name))
    .map((entry) => entry.product);
}

/* -------------------------------------------------------------------------- */
/*  Filtering and sorting                                                     */
/* -------------------------------------------------------------------------- */

/** Apply a filter to a result set. */
export function filterResults(
  results: CatalogueProduct[],
  filter: SearchFilterId,
): CatalogueProduct[] {
  switch (filter) {
    case 'noPrescription':
      return results.filter((result) => !result.rx);
    case 'prescription':
      return results.filter((result) => result.rx);
    case 'discount':
      return results.filter((result) => !result.rx && (result.off ?? 0) >= 15);
    default:
      return results;
  }
}

/** Sort options offered by the sort chip. */
export const searchSorts: { id: SearchSort; label: string }[] = [
  { id: 'relevance', label: 'Relevance' },
  { id: 'priceLow', label: 'Price: low to high' },
  { id: 'priceHigh', label: 'Price: high to low' },
  { id: 'discount', label: 'Biggest discount (no-prescription items)' },
];

/** Sort a result set. */
export function sortResults(
  results: CatalogueProduct[],
  sort: SearchSort,
): CatalogueProduct[] {
  const copy = [...results];
  switch (sort) {
    case 'priceLow':
      return copy.sort((a, b) => a.price - b.price);
    case 'priceHigh':
      return copy.sort((a, b) => b.price - a.price);
    case 'discount':
      return copy.sort((a, b) => (b.off ?? 0) - (a.off ?? 0));
    default:
      return copy;
  }
}

/* -------------------------------------------------------------------------- */
/*  Summary                                                                   */
/* -------------------------------------------------------------------------- */

export type SearchSummary = {
  /** Matches for the query. */
  total: number;
  /** Matches that can be bought without a prescription. */
  noPrescription: number;
  /** Matches that need a prescription. */
  prescription: number;
  /** Matches carrying a discount of 15% or more. */
  discount: number;
  /** Distinct manufacturers in the result set. */
  brands: number;
  /** The category the query sits in. */
  category: string;
  /** Guidance under the category chip. */
  hint: string;
  /** The mint guidance card. */
  note: string;
  /** The prescription notice under the result count. */
  rxNotice: string;
  /** The closing line under the results. */
  footer: string;
};

const capitalise = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

/**
 * Build the summary that describes a result set.
 *
 * Every number comes from the results on screen, so the counts stay honest
 * whatever the query is.
 */
export function searchSummaryFor(query: string, results: CatalogueProduct[]): SearchSummary {
  const total = results.length;
  const noPrescription = results.filter((result) => !result.rx).length;
  const prescription = results.filter((result) => result.rx).length;
  const discount = results.filter((result) => !result.rx && (result.off ?? 0) >= 15).length;
  const brands = brandCount(results);
  const salt = capitalise(query.trim() || 'medicine');

  const oneBrand = brands === 1;
  const oneRx = prescription === 1;

  return {
    total,
    noPrescription,
    prescription,
    discount,
    brands,
    category: results[0]?.category ?? 'Fever & Pain',
    hint: `Showing results for ${query.trim() || 'your search'}. Check the spelling if this is not what you meant.`,
    note: `${brands} ${oneBrand ? 'brand contains' : 'brands contain'} ${salt}. Strength and pack size differ, so compare on each product page and ask your pharmacist before switching.`,
    rxNotice: `${prescription} of these ${oneRx ? 'needs' : 'need'} a valid prescription. Upload it at checkout or talk to a registered doctor after you order.`,
    footer:
      'Can’t find it, or not in stock nearby? Request MedMate to get it, or upload a prescription.',
  };
}

/** The filter chips, with the counts of the current result set. */
export function searchFiltersFor(summary: SearchSummary): {
  id: SearchFilterId;
  label: string;
  count: number;
}[] {
  return [
    { id: 'all', label: 'All', count: summary.total },
    { id: 'noPrescription', label: 'No prescription', count: summary.noPrescription },
    { id: 'prescription', label: 'Prescription', count: summary.prescription },
    { id: 'discount', label: '15% off and more', count: summary.discount },
  ];
}

/** The free-delivery goal shown in the cart bar. */
export const cartGoal = {
  /** How much more is needed to reach free delivery. */
  remaining: 29,
  /** The progress already made towards free delivery, in points. */
  progress: 120,
  /** The width of the track, in points. */
  track: 169,
  /** The default number of items in the cart. */
  count: 4,
  sub: 'Compare pharmacies at checkout',
} as const;
