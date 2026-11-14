/**
 * New arrivals.
 *
 * The newest products on the catalogue, with the filters the design draws.
 * The filter chips are derived from the categories the new arrivals sit in, so
 * every chip leads somewhere.
 */
import { catalogue, type CatalogueProduct } from './catalogue';

/** The products that just landed, in the order the API returns them. */
export const newArrivalIds: string[] = [
  'DR120090',
  'DR133614',
  'DR058938',
  'DR331938',
  'DR008619',
  'DR120111',
  'DR219601',
  'DR067398',
  'DR026950',
  'DR210778',
  'DR026935',
  'DR163791',
  'DR133205',
  'DR125839',
  'DR116123',
  'DR146442',
  'DR195567',
  'DR026910',
  'DR027136',
  'DR240569',
];

/** Every new arrival, in order. */
export function newArrivals(): CatalogueProduct[] {
  return newArrivalIds
    .map((id) => catalogue.find((product) => product.id === id))
    .filter((product): product is CatalogueProduct => Boolean(product));
}

/**
 * The order the design puts the filters in.
 *
 * The categories that follow are the ones the new arrivals add on top.
 */
const CATEGORY_ORDER = [
  'Sports Nutrition',
  'Hair Care',
  'Personal',
  'First Aid',
  'Ayurveda',
  'Vitamins & immunity',
  'Cough & Cold',
  'Elderly care',
  'Eye Care',
  'Women’s health',
];

/** The categories the new arrivals cover, in the order the chips show them. */
export function newArrivalCategories(): string[] {
  const counts = new Map<string, number>();
  for (const product of newArrivals()) {
    counts.set(product.category, (counts.get(product.category) ?? 0) + 1);
  }
  const present = [...counts.keys()].sort(
    (a, b) =>
      CATEGORY_ORDER.indexOf(a) - CATEGORY_ORDER.indexOf(b) || a.localeCompare(b),
  );
  return present;
}

/** The new arrivals of one category. */
export function newArrivalsIn(category: string): CatalogueProduct[] {
  return newArrivals().filter((product) => product.category === category);
}

/** The line under the title. */
export function newArrivalSubtitle(): string {
  return `${newArrivals().length} products just added from brands you know · delivered by licensed pharmacies near you`;
}

/** The line under the grid. */
export const newArrivalFooterNote =
  'Prices are each pharmacy’s own, at or below MRP. A ₹5 handling fee applies to every order.';
