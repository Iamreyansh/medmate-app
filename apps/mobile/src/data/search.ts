/**
 * Content for the Search results screen.
 *
 * The rows are the real catalogue entries the live MVP returns for a
 * "paracetamol" query, so the native screen shows the same products, prices
 * and pack descriptions as the shipped product.
 *
 * The counts (`total`, `noPrescription`, `prescription`, `discount`) are
 * server-owned in production - the API reports how many results match each
 * filter. The local seed mirrors the numbers the MVP reports for this query.
 */

export type SearchResult = {
  id: string;
  name: string;
  /** Pack size and composition, e.g. "Paracetamol 500mg Tablets". */
  sub: string;
  /** Selling price in rupees. */
  price: number;
  /** Maximum retail price. Never shown for prescription items. */
  mrp?: number;
  /** Discount percentage. Never shown for prescription items. */
  off?: number;
  /** Prescription item: price only, no strike-through, no discount. */
  rx: boolean;
};

export type SearchFilterId = 'all' | 'noPrescription' | 'prescription' | 'discount';

/** The query the design uses, and the default for the route. */
export const searchQuery = 'paracetamol';

/** How many results are rendered before the pagination button appears. */
export const pageSize = 20;

/** Counts and copy the API owns. */
export const searchSummary = {
  /** Total matches for the query. */
  total: 51,
  /** Matches that can be bought without a prescription. */
  noPrescription: 6,
  /** Matches that need a prescription. */
  prescription: 45,
  /** Matches carrying a discount. */
  discount: 5,
  /** The category the query sits in. */
  category: 'Fever & Pain',
  /** Guidance under the category chip. */
  hint: 'Showing results for paracetamol. Check the spelling if this is not what you meant.',
  /** The mint guidance card. */
  note: '22 brands contain Paracetamol. Strength and pack size differ, so compare on each product page and ask your pharmacist before switching.',
  /** The prescription notice under the result count. */
  rxNotice:
    '45 of these need a valid prescription. Upload it at checkout or talk to a registered doctor after you order.',
  /** The closing line under the results. */
  footer:
    'Can’t find it, or not in stock nearby? Request MedMate to get it, or upload a prescription.',
} as const;

/**
 * The result set.
 *
 * Six over-the-counter matches first, then the prescription matches, the way
 * the MVP orders them.
 */
export const searchResults: SearchResult[] = [
  {
    id: 'DR070502',
    name: 'Crocin Baby Paracetamol Paediatric Drops',
    sub: 'Bottle of 15 ml Drop · Paracetamol Oral Drops',
    price: 32,
    mrp: 38,
    off: 16,
    rx: false,
  },
  {
    id: 'DRS023755',
    name: 'Aristomol 650 Tablet',
    sub: 'Paracetamol (650mg) · Pain relief',
    price: 17,
    mrp: 20,
    off: 15,
    rx: false,
  },
  {
    id: 'DRS023756',
    name: 'Aristomol 650mg Tablet',
    sub: 'Paracetamol (650mg) · Pain relief',
    price: 27,
    mrp: 32,
    off: 16,
    rx: false,
  },
  {
    id: 'p1',
    name: 'Dolo 650',
    sub: 'Paracetamol · 15 tablets',
    price: 31,
    mrp: 34,
    off: 9,
    rx: false,
  },
  {
    id: 'ab72',
    name: 'Doliprane 500',
    sub: 'Paracetamol 500mg Tablets',
    price: 79,
    mrp: 93,
    off: 15,
    rx: false,
  },
  {
    id: 'ab73',
    name: 'Doliprane 650',
    sub: 'Paracetamol 650mg',
    price: 86,
    mrp: 101,
    off: 15,
    rx: false,
  },
  {
    id: 'DRS201520',
    name: 'Nedolide P 100mg/325mg Tablet',
    sub: 'Nimesulide (100mg) + Paracetamol (325mg) · Pain relief',
    price: 6,
    rx: true,
  },
  {
    id: 'DRS045014',
    name: 'Brustan 400 mg/325 mg Tablet',
    sub: 'Ibuprofen (400mg) + Paracetamol (325mg) · Pain relief',
    price: 12,
    rx: true,
  },
  {
    id: 'DRS120861',
    name: 'Flexon Tablet',
    sub: 'Ibuprofen (400mg) + Paracetamol (325mg) · Pain relief',
    price: 30,
    rx: true,
  },
  {
    id: 'DRS131694',
    name: 'Glenpara Cold & Flu Tablet',
    sub: 'Caffeine (30mg) + Diphenhydramine (25mg) + Paracetamol (325mg) + Phenylephrine (5mg) · Treatment of Common cold',
    price: 37,
    rx: true,
  },
  {
    id: 'DRS182275',
    name: 'Mefipic Oral Suspension Mango',
    sub: 'Mefenamic Acid (100mg) + Paracetamol (250mg) · Pain relief',
    price: 43,
    rx: true,
  },
  {
    id: 'DRS162525',
    name: 'Leemol DC Syrup',
    sub: 'Dicyclomine (20mg) + Paracetamol (325mg) · Treatment of Abdominal pain',
    price: 43,
    rx: true,
  },
  {
    id: 'DRS013063',
    name: 'Alkem Cold Suspension',
    sub: 'Cetirizine (2.5mg/5ml) + Paracetamol (125mg/5ml) + Phenylephrine (2.5mg/5ml) · Treatment of Common cold',
    price: 45,
    rx: true,
  },
  {
    id: 'DRS023315',
    name: 'Arflur-MR Tablet',
    sub: 'Aceclofenac (100mg) + Paracetamol (325mg) + Chlorzoxazone (500mg) · Treatment of Muscular pain',
    price: 47,
    rx: true,
  },
  {
    id: 'DRS209209',
    name: 'Nobel Cold New Tablet',
    sub: 'Caffeine (30mg) + Diphenhydramine (25mg) + Paracetamol (500mg) + Phenylephrine (5mg) · Treatment of Common cold',
    price: 47,
    rx: true,
  },
  {
    id: 'DRS207724',
    name: 'Nimucet MF Syrup',
    sub: 'Mefenamic Acid (50mg) + Paracetamol (125mg) · Pain relief',
    price: 49,
    rx: true,
  },
  {
    id: 'DRS209210',
    name: 'Nobel Cold Oral Suspension Orange',
    sub: 'Chlorpheniramine Maleate (0.5mg/5ml) + Paracetamol (125mg/5ml) + Phenylephrine (5mg/5ml) + Sodium Citrate (60mg/5ml) + Menthol (1mg/5ml) · Treatment of Dry cough',
    price: 49,
    rx: true,
  },
  {
    id: 'DRS162530',
    name: 'Leemol Spas Suspension',
    sub: 'Mefenamic Acid (50mg/5ml) + Paracetamol (125mg/5ml) · Pain relief',
    price: 51,
    rx: true,
  },
  {
    id: 'DRS385984',
    name: 'Diecold Plus Tablet',
    sub: 'Aceclofenac (100mg) + Paracetamol (325mg) + Cetirizine (10mg) + Phenylephrine (5mg) + Caffeine (25mg) · Treatment of Common cold',
    price: 51,
    rx: true,
  },
  {
    id: 'DRS076501',
    name: 'Cyclopam Tablet',
    sub: 'Dicyclomine (20mg) + Paracetamol (500mg) · Treatment of Abdominal pain',
    price: 53,
    rx: true,
  },
  {
    id: 'DRS174872',
    name: 'Lupisulide P Tablet',
    sub: 'Nimesulide (100mg) + Paracetamol (325mg) · Pain relief',
    price: 58,
    rx: true,
  },
  {
    id: 'DRS070104',
    name: 'Coldmine Drops',
    sub: 'Chlorpheniramine Maleate (1mg) + Paracetamol (125mg) + Phenylephrine (5mg) · Treatment of Common cold',
    price: 60,
    rx: true,
  },
  {
    id: 'DRS087673',
    name: 'Dicloran A Tablet',
    sub: 'Diclofenac (50mg) + Paracetamol (325mg) · Pain relief',
    price: 71,
    rx: true,
  },
  {
    id: 'DRS058819',
    name: 'Cetrizine Cold DS Syrup',
    sub: 'Cetirizine (2.5mg/5ml) + Paracetamol (250mg/5ml) + Phenylephrine (2.5mg/5ml) · Treatment of Common cold',
    price: 72,
    rx: true,
  },
  {
    id: 'DRS001717',
    name: 'Acceclowoc-P Tablet',
    sub: 'Aceclofenac (100mg) + Paracetamol (325mg) · Pain relief',
    price: 76,
    rx: true,
  },
  {
    id: 'DRS012226',
    name: 'Alex P Paed Drop',
    sub: 'Chlorpheniramine Maleate (2mg/ml) + Paracetamol (125mg/ml) + Phenylephrine (2.5mg/ml) · Treatment of Common cold',
    price: 76,
    rx: true,
  },
  {
    id: 'DRS045714',
    name: 'Buta Proxyvon Capsule',
    sub: 'Diclofenac (50mg) + Paracetamol (325mg) · Pain relief',
    price: 77,
    rx: true,
  },
  {
    id: 'ab64',
    name: 'Diclofam - MR',
    sub: 'Diclofenac Potassium 50mg, Paracetamol 325mg & Chlorzoxazone 250mg',
    price: 78,
    rx: true,
  },
  {
    id: 'DRS062858',
    name: 'Cip-Zox Tablet',
    sub: 'Chlorzoxazone (500mg) + Diclofenac (50mg) + Paracetamol (325mg) · Treatment of Pain due to muscle spasm',
    price: 78,
    rx: true,
  },
  {
    id: 'ab57',
    name: 'Phensedyl Cough Tablets',
    sub: 'Paracetamol 500mg, Phenylephrine Hydrochloride 5mg, Caffeine 30mg & Diphenhydramine Hydrochloride 25mg',
    price: 84,
    rx: true,
  },
  {
    id: 'DRS060191',
    name: 'Chymonet AP Tablet',
    sub: 'Aceclofenac (100mg) + Paracetamol (325mg) + Trypsin Chymotrypsin (50000AU) · Pain relief',
    price: 87,
    rx: true,
  },
  {
    id: 'DRS109956',
    name: 'Etoford P 60 mg/325 mg Tablet',
    sub: 'Etoricoxib (60mg) + Paracetamol (325mg) · Pain relief',
    price: 88,
    rx: true,
  },
  {
    id: 'DRS110757',
    name: 'Etorvel-P 60mg/325mg Tablet',
    sub: 'Etoricoxib (60mg) + Paracetamol (325mg) · Pain relief',
    price: 88,
    rx: true,
  },
  {
    id: 'DRS002244',
    name: 'aceclo-MR Tablet',
    sub: 'Aceclofenac (100mg) + Paracetamol (325mg) + Chlorzoxazone (500mg) · Treatment of Muscular pain',
    price: 91,
    rx: true,
  },
  {
    id: 'DRS173601',
    name: 'Luhar-SP Tablet',
    sub: 'Aceclofenac (100mg) + Paracetamol (325mg) + Serratiopeptidase (15mg) · Pain relief',
    price: 96,
    rx: true,
  },
  {
    id: 'ab59',
    name: 'M-Cold Plus New',
    sub: 'Paracetamol 500mg, Phenylephrine Hydrochloride 5mg, Caffeine 30mg & Diphenhydramine Hydrochloride 25mg',
    price: 98,
    rx: true,
  },
  {
    id: 'DRS002133',
    name: 'Aceclo Plus Tablet',
    sub: 'Aceclofenac (100mg) + Paracetamol (325mg) · Pain relief',
    price: 99,
    rx: true,
  },
  {
    id: 'DRS338418',
    name: 'Zedex-P Syrup',
    sub: 'Chlorpheniramine Maleate (0.5mg/5ml) + Paracetamol (125mg/5ml) + Phenylephrine (5mg/5ml) + Sodium Citrate (60mg/5ml) + Menthol (1mg/5ml) · Treatment of Dry cough',
    price: 105,
    rx: true,
  },
  {
    id: 'ab76',
    name: 'Maxofen New',
    sub: 'Aceclofenac 100mg & Paracetamol 325mg',
    price: 107,
    rx: true,
  },
  {
    id: 'DRS060091',
    name: 'Chymocad Tablet',
    sub: 'Aceclofenac (100mg) + Paracetamol (325mg) + Trypsin Chymotrypsin (50000AU) · Pain relief',
    price: 108,
    rx: true,
  },
];

/** The filter chips, with the counts the API reports. */
export const searchFilters: { id: SearchFilterId; label: string; count: number }[] = [
  { id: 'all', label: 'All', count: searchSummary.total },
  { id: 'noPrescription', label: 'No prescription', count: searchSummary.noPrescription },
  { id: 'prescription', label: 'Prescription', count: searchSummary.prescription },
  { id: 'discount', label: '15% off and more', count: searchSummary.discount },
];

/**
 * Apply a filter to the result set.
 *
 * The counts stay server-owned, so the list is filtered locally but the chip
 * labels keep reporting what the server knows about the whole result set.
 */
export function filterResults(results: SearchResult[], filter: SearchFilterId): SearchResult[] {
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
export type SearchSort = 'relevance' | 'priceLow' | 'priceHigh' | 'discount';

export const searchSorts: { id: SearchSort; label: string }[] = [
  { id: 'relevance', label: 'Relevance' },
  { id: 'priceLow', label: 'Price: low to high' },
  { id: 'priceHigh', label: 'Price: high to low' },
  { id: 'discount', label: 'Biggest discount' },
];

export function sortResults(results: SearchResult[], sort: SearchSort): SearchResult[] {
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

/** The free-delivery goal shown in the cart bar. */
export const cartGoal = {
  /** How much more is needed to reach free delivery. */
  remaining: 29,
  /** The progress already made towards free delivery, in points. */
  progress: 120,
  /** The width of the track, in points. */
  track: 169,
  /** Items in the cart. */
  count: 4,
  sub: 'Compare pharmacies at checkout',
} as const;

/** Initials helper used by the art tiles while product photos are pending. */
export function initialsOf(name: string): string {
  const words = name.split(/\s+/).filter(Boolean);
  if (words.length === 0) return '';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}
