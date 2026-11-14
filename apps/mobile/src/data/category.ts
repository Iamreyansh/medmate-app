/**
 * Category browsing.
 *
 * The screen lists one category of the shared catalogue, with the filters the
 * design draws: prescription status, price band and brand. Every count is
 * derived from the products in the category, so the numbers always describe
 * what is on screen.
 */
import { catalogue, type CatalogueProduct } from './catalogue';

export type PrescriptionFilterId = 'all' | 'noPrescription' | 'prescription';

export type PriceBandId = 'any' | 'under100' | 'between100and300' | 'over300';

export type CategorySort = 'relevance' | 'priceLow' | 'priceHigh' | 'discount' | 'name';

/** The price bands the filter card offers. */
export const priceBands: { id: PriceBandId; label: string }[] = [
  { id: 'any', label: 'Any price' },
  { id: 'under100', label: 'Under ₹100' },
  { id: 'between100and300', label: '₹100–₹300' },
  { id: 'over300', label: 'Over ₹300' },
];

/** The sort options the sort chip offers. */
export const categorySorts: { id: CategorySort; label: string }[] = [
  { id: 'relevance', label: 'Relevance' },
  { id: 'priceLow', label: 'Price: low to high' },
  { id: 'priceHigh', label: 'Price: high to low' },
  { id: 'discount', label: 'Biggest discount' },
  { id: 'name', label: 'Name: A to Z' },
];

/** The price band a price falls into. */
export function priceBandOf(price: number): PriceBandId {
  if (price < 100) return 'under100';
  if (price <= 300) return 'between100and300';
  return 'over300';
}

/** Every product in a category. */
export function productsInCategory(category: string): CatalogueProduct[] {
  return catalogue.filter((product) => product.category === category);
}

/** The categories of the catalogue, in the order the rail shows them. */
/**
 * The order the categories appear in.
 *
 * The list is kept in code so the rail and the routes agree, but any category
 * the catalogue grows that is missing from here still shows up, at the end.
 */
const CATEGORY_ORDER = [
  'Fever & Pain',
  'Cough & Cold',
  'Stomach',
  'Devices',
  'Diabetes care',
  'Heart & BP',
  'Ortho & pain care',
  'First Aid',
  'Ayurveda',
  'Skin Care',
  'Baby & child care',
  'Women’s health',
  'Vitamins & immunity',
  'Sports Nutrition',
  'Hair Care',
  'Personal',
  'Eye Care',
  'Elderly care',
  'Everyday essentials',
];

export function categoryList(): string[] {
  const present = new Set(catalogue.map((product) => product.category));
  const ordered = CATEGORY_ORDER.filter((category) => present.has(category));
  const extra = [...present]
    .filter((category) => !CATEGORY_ORDER.includes(category))
    .sort((a, b) => a.localeCompare(b));
  return [...ordered, ...extra];
}

/** Apply the prescription filter. */
export function filterByPrescription(
  products: CatalogueProduct[],
  filter: PrescriptionFilterId,
): CatalogueProduct[] {
  switch (filter) {
    case 'noPrescription':
      return products.filter((product) => !product.rx);
    case 'prescription':
      return products.filter((product) => product.rx);
    default:
      return products;
  }
}

/** Apply the price band. */
export function filterByPrice(products: CatalogueProduct[], band: PriceBandId): CatalogueProduct[] {
  if (band === 'any') return products;
  return products.filter((product) => priceBandOf(product.price) === band);
}

/** Apply a brand filter. */
export function filterByBrand(
  products: CatalogueProduct[],
  brand: string | null,
): CatalogueProduct[] {
  if (!brand) return products;
  return products.filter((product) => product.brand === brand);
}

/** Sort the products of a category. */
export function sortCategoryProducts(
  products: CatalogueProduct[],
  sort: CategorySort,
): CatalogueProduct[] {
  const copy = [...products];
  switch (sort) {
    case 'priceLow':
      return copy.sort((a, b) => a.price - b.price);
    case 'priceHigh':
      return copy.sort((a, b) => b.price - a.price);
    case 'discount':
      return copy.sort((a, b) => (b.off ?? 0) - (a.off ?? 0));
    case 'name':
      return copy.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return copy;
  }
}

/** The brands of a category, with how many products each one has. */
export function brandChips(
  products: CatalogueProduct[],
  limit = 6,
): { brand: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const product of products) {
    counts.set(product.brand, (counts.get(product.brand) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([brand, count]) => ({ brand, count }))
    .sort((a, b) => b.count - a.count || a.brand.localeCompare(b.brand))
    .slice(0, limit);
}

/** The counts the header and the filter chips report. */
export function categoryCounts(products: CatalogueProduct[]) {
  const noPrescription = products.filter((product) => !product.rx).length;
  return {
    total: products.length,
    brands: new Set(products.map((product) => product.brand)).size,
    noPrescription,
    prescription: products.length - noPrescription,
  };
}

/** The line under the grid. */
export const categoryFooterNote =
  'Standard prices shown; each pharmacy’s own price is confirmed at checkout. MRP is inclusive of all taxes.';

/** The line under the header counts. */
export const checkoutNote = 'Choose the pharmacy at checkout';

/** The url slug of a category. */
export function slugFor(category: string): string {
  return category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/** The category a slug stands for. */
export function categoryFromSlug(slug: string): string {
  return categoryList().find((category) => slugFor(category) === slug) ?? 'Fever & Pain';
}
