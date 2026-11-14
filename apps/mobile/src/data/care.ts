/**
 * The health stores.
 *
 * A health store is a curated shelf of the catalogue - ortho care, baby care,
 * women's health and the rest - with its own accent colour. The home screen
 * links into these stores, and each store has its own screen.
 */
import { catalogue, type CatalogueProduct } from './catalogue';

export type CareAccent = 'ortho' | 'baby' | 'women' | 'diabetes' | 'heart' | 'elderly';

export type CareStore = {
  /** The url slug. */
  id: string;
  /** The store name. */
  name: string;
  /** What the store carries. */
  sub: string;
  /** The accent pair from the theme. */
  accent: CareAccent;
  /** The catalogue ids on the shelf. */
  products: string[];
};

export const careStores: CareStore[] = [
  {
    id: 'ortho-pain-care',
    name: 'Ortho & pain care',
    sub: 'Belts, supports, hot & cold packs, pain relief gels',
    accent: 'ortho',
    products: [
      'tynor-lumbo',
      'aksobha-pack',
      'volini-spray',
      'moov-gel',
      'leeford-lumbo',
      'tynor-grip',
    ],
  },
  {
    id: 'baby-child-care',
    name: 'Baby & child care',
    sub: 'Gentle wash, lotion, diapers, mosquito care',
    accent: 'baby',
    products: [
      'himalaya-pants',
      'cetaphil-baby',
      'dabur-baby-cream',
      'himalaya-soap',
      'mamaearth-body-wash',
      'chicco-roll-on',
    ],
  },
  {
    id: 'womens-health',
    name: 'Women’s health',
    sub: 'Period care, menstrual cups, menopause support',
    accent: 'women',
    products: [
      'fem-pads',
      'amrutanjan-cup',
      'amrutanjan-pads',
      'gytree-menopause',
      'chicco-breast-pad',
      'himalaya-pads-women',
    ],
  },
  {
    id: 'diabetes-care',
    name: 'Diabetes care',
    sub: 'Glucometers, test strips, sugar-free nutrition',
    accent: 'diabetes',
    products: ['beato-glucometer', 'DR204607', 'DR084084', 'DR106559'],
  },
  {
    id: 'heart-bp',
    name: 'Heart & BP',
    sub: 'BP monitors, omega-3, home checks',
    accent: 'heart',
    products: ['omron-hem8712', 'DR059078', 'DR037520', 'DR106277', 'DR037590'],
  },
  {
    id: 'elderly-care',
    name: 'Elderly care',
    sub: 'Adult diapers, underpads, mobility aids',
    accent: 'elderly',
    products: [
      'DR142298',
      'DR125835',
      'DR125803',
      'DR116512',
      'DR007834',
      'DR125839',
    ],
  },
];

/** The store a slug stands for. */
export function careStoreFromSlug(slug: string): CareStore {
  return careStores.find((store) => store.id === slug) ?? careStores[0];
}

/** The products on a store's shelf, in the order the store lists them. */
export function storeProducts(store: CareStore): CatalogueProduct[] {
  return store.products
    .map((id) => catalogue.find((product) => product.id === id))
    .filter((product): product is CatalogueProduct => Boolean(product));
}

/** The stores other than the one on screen. */
export function otherStores(store: CareStore): CareStore[] {
  return careStores.filter((candidate) => candidate.id !== store.id);
}

/** The line under the store title. */
export function storeSubtitle(store: CareStore): string {
  return `${store.sub} · ${storeProducts(store).length} products`;
}

/** The line under the grid. */
export const storeFooterNote =
  'Products for everyday care. For a medicine your doctor prescribed, search by name or upload the prescription.';
