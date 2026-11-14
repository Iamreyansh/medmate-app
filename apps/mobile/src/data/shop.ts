/**
 * Content for the Shop home screen.
 *
 * Mirrors the Figma frame "iOS / 02 Shop / Home" and the live MVP: same copy,
 * same order, same numbers. Swap this module for an API client when the
 * backend lands - the screen itself never touches a literal.
 */

import { findProduct, initialsOf, type CatalogueProduct } from './catalogue';

export { initialsOf };

/** Look a product up in the catalogue. */
function byId(id: string): Product {
  const product = findProduct(id);
  if (!product) {
    throw new Error(`Unknown product id: ${id}`);
  }
  return product;
}

export type Category = {
  id: string;
  label: string;
  /** One or two letters shown on the art tint while the photo is pending. */
  initials: string;
};

/**
 * Products come from the shared catalogue so the home screen and the search
 * screen always show the same medicine.
 */
export type Product = CatalogueProduct;

export type Store = {
  id: string;
  name: string;
  /** One or two letters for the avatar. */
  initials: string;
  locality: string;
  eta: string;
  /** Short reason, e.g. "Fastest". */
  perk?: string;
  /** Longer perk line, e.g. "No delivery fee · no min". */
  perkLabel?: string;
};

export type HealthStore = {
  id: string;
  name: string;
  sub: string;
  /** Key into `storeAccents`. */
  accent: 'ortho' | 'baby' | 'women' | 'diabetes' | 'heart' | 'elderly';
  products: Product[];
};

export type Coupon = {
  id: string;
  /** Percentage shown as the big number, e.g. "25%". */
  big: string;
  code: string;
  desc: string;
  /** `forest` coupons invert, `gold` coupons use the cream card. */
  tone: 'forest' | 'gold';
};

export const delivery = {
  window: 'Delivery in 32–47 min',
  address: 'Home · Flat 302, Sri Sai Residency…',
  healthDay: 'Today · World Pneumonia Day',
  walletBalance: '₹15',
  searchPlaceholder: 'Search “Vicks VapoRub”',
};

export const serviceTabs = [
  'All',
  'Fever & pain',
  'Devices',
  'Baby',
  'Women',
  'Ayurveda',
  'Elderly',
] as const;

/**
 * The category each service tab stands for.
 *
 * `All` keeps every product; the other tabs narrow the rails below the hero
 * to one category of the catalogue.
 */
export const serviceTabCategories: Record<string, string | null> = {
  All: null,
  'Fever & pain': 'Fever & Pain',
  Devices: 'Devices',
  Baby: 'Baby & child care',
  Women: 'Women’s health',
  Ayurveda: 'Ayurveda',
  Elderly: 'Elderly care',
};

export const trustStrip = ['100% genuine', 'Licensed stores', 'Rx verified'] as const;

/**
 * The three-object composition that sits on the right of a hero banner.
 *
 * `x` and `y` are offsets inside the 361 x 172 banner.
 */
export type HeroArtItem =
  | { kind: 'photo'; x: number; y: number; size: number; initials: string }
  | {
      kind: 'glyph';
      x: number;
      y: number;
      size: number;
      icon: 'pill' | 'search' | 'phone';
      circle?: boolean;
    };

export type HeroBanner = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  code?: string;
  action: string;
  gradient: 'gold' | 'mint' | 'blush';
  art: HeroArtItem[];
};

export const heroBanners: HeroBanner[] = [
  {
    id: 'first-order',
    eyebrow: 'First order',
    title: 'Flat 25% off health products',
    body: 'Not on prescription medicines',
    code: 'MEDMATE25',
    action: 'Order now',
    gradient: 'gold',
    art: [
      { kind: 'photo', x: 194.31, y: 22, size: 70.34, initials: 'DA' },
      { kind: 'photo', x: 235, y: 38, size: 92, initials: 'CO' },
      { kind: 'photo', x: 295, y: 97.94, size: 63.74, initials: 'MC' },
    ],
  },
  {
    id: 'request-medicine',
    eyebrow: 'Can’t find a medicine?',
    title: 'Tell us, we’ll try to source it',
    body: 'We call back with price and time',
    action: 'Request it',
    gradient: 'mint',
    art: [
      { kind: 'glyph', x: 204.4, y: 26, size: 48.36, icon: 'pill' },
      { kind: 'glyph', x: 233, y: 42, size: 88, icon: 'search', circle: true },
      { kind: 'glyph', x: 305, y: 107.4, size: 48.36, icon: 'phone' },
    ],
  },
  {
    id: 'health-stores',
    eyebrow: 'Health stores',
    title: 'Care for everyone at home',
    body: 'Ortho · baby · women · elderly',
    action: 'Explore',
    gradient: 'blush',
    art: [
      { kind: 'photo', x: 194.31, y: 22, size: 70.34, initials: 'FU' },
      { kind: 'photo', x: 235, y: 38, size: 92, initials: 'HT' },
      { kind: 'photo', x: 295, y: 97.94, size: 63.74, initials: 'OH' },
    ],
  },
];

export const categoryGroups: { title: string; categories: Category[] }[] = [
  {
    title: 'Medicines and first aid',
    categories: [
      { id: 'fever-pain', label: 'Fever & Pain', initials: 'FP' },
      { id: 'cough-cold', label: 'Cough & Cold', initials: 'CC' },
      { id: 'stomach', label: 'Stomach', initials: 'ST' },
      { id: 'diabetes', label: 'Diabetes', initials: 'DB' },
      { id: 'heart-bp', label: 'Heart & BP', initials: 'HB' },
      { id: 'respiratory', label: 'Respiratory', initials: 'RS' },
      { id: 'eye-care', label: 'Eye Care', initials: 'EC' },
      { id: 'first-aid', label: 'First Aid', initials: 'FA' },
    ],
  },
  {
    title: 'Health and wellness',
    categories: [
      { id: 'vitamins', label: 'Vitamins', initials: 'VI' },
      { id: 'immunity', label: 'Immunity', initials: 'IM' },
      { id: 'devices', label: 'Devices', initials: 'DE' },
      { id: 'sports-nutrition', label: 'Sports Nutrition', initials: 'SN' },
      { id: 'ayurveda', label: 'Ayurveda', initials: 'AY' },
      { id: 'homeopathy', label: 'Homeopathy', initials: 'HO' },
      { id: 'elderly-care', label: 'Elderly Care', initials: 'EC' },
      { id: 'health-wellness', label: 'Health & Wellness', initials: 'HW' },
    ],
  },
  {
    title: 'Personal and family care',
    categories: [
      { id: 'skin-care', label: 'Skin Care', initials: 'SK' },
      { id: 'hair-care', label: 'Hair Care', initials: 'HC' },
      { id: 'mouth-teeth', label: 'Mouth & Teeth', initials: 'MT' },
      { id: 'personal', label: 'Personal', initials: 'PE' },
      { id: 'baby-care', label: 'Baby Care', initials: 'BC' },
      { id: 'womens-health', label: 'Women’s Health', initials: 'WH' },
      { id: 'sexual-wellness', label: 'Sexual Wellness', initials: 'SW' },
      { id: 'pet-care', label: 'Pet Care', initials: 'PC' },
    ],
  },
];

export const orderAgain: Product[] = [
  byId('moov-gel'),
  byId('dettol-liquid'),
  byId('cetaphil-cream'),
];

export const reorderBanner = {
  title: 'Reorder your last order',
  sub: 'Adds 8 items to your basket',
};

export const coupons: Coupon[] = [
  {
    id: 'medmate25',
    big: '25%',
    code: 'MEDMATE25',
    desc: '25% off health products on your first order',
    tone: 'forest',
  },
  {
    id: 'flat50',
    big: '₹50',
    code: 'FLAT50',
    desc: 'Flat ₹50 off above ₹399',
    tone: 'gold',
  },
  {
    id: 'freedel',
    big: '₹0',
    code: 'FREEDEL',
    desc: 'No delivery fee on this order',
    tone: 'gold',
  },
];

export const couponFootnote =
  'One coupon per order. Prescription medicines are never discounted.';

export const healthStores: HealthStore[] = [
  {
    id: 'ortho',
    name: 'Ortho & pain care',
    sub: 'Belts, supports, hot & cold packs, pain relief gels',
    accent: 'ortho',
    products: [
      byId('tynor-lumbo'),
      byId('aksobha-pack'),
      byId('volini-spray'),
      byId('moov-gel-care'),
      byId('leeford-lumbo'),
      byId('tynor-grip'),
    ],
  },
  {
    id: 'baby',
    name: 'Baby & child care',
    sub: 'Gentle wash, lotion, diapers, mosquito care',
    accent: 'baby',
    products: [
      byId('himalaya-pants'),
      byId('cetaphil-baby'),
      byId('dabur-baby-cream'),
      byId('himalaya-soap'),
      byId('mamaearth-body-wash'),
      byId('chicco-roll-on'),
    ],
  },
  {
    id: 'women',
    name: 'Women’s health',
    sub: 'Period care, menstrual cups, menopause support',
    accent: 'women',
    products: [
      byId('fem-pads'),
      byId('amrutanjan-cup'),
      byId('amrutanjan-pads'),
      byId('gytree-menopause'),
      byId('chicco-breast-pad'),
      byId('himalaya-pads-women'),
    ],
  },
];

export const dealOfTheDay = {
  eyebrow: 'Deal of the day',
  product: byId('omron-hem8712') as Product,
};

export const dealRail: Product[] = [
  byId('dettol-liquid-deal'),
  byId('moov-gel-deal'),
  byId('cetaphil-cream-deal'),
  byId('zandu-balm'),
];

export const seasonal = {
  eyebrow: 'Seasonal picks',
  title: 'This season in Bengaluru',
  body: 'Oct–Nov: cold evenings, mosquitoes after the rains, Deepavali',
  filters: ['Cold & cough', 'Mosquito care', 'Deepavali first aid'],
  products: [
    byId('zandu-balm-s'),
    byId('mamaearth-breathe'),
    byId('bakson-b33'),
    byId('amrutanjan-cold-rub'),
  ] satisfies Product[],
};

export const pharmacies: Store[] = [
  {
    id: 'hf',
    name: 'HealthFirst Chemist',
    initials: 'HF',
    locality: 'BTM Layout · 0.8 km',
    eta: '32–47 min',
    perk: 'Fastest',
    perkLabel: 'No delivery fee · no min',
  },
  {
    id: 'ss',
    name: 'Sri Sai Medicals',
    initials: 'SS',
    locality: 'Jayanagar 4th Block · 1.2 km',
    eta: '36–51 min',
    perk: 'Open 24×7',
    perkLabel: 'Open 24×7',
  },
  {
    id: 'lp',
    name: 'Lakshmi Pharma',
    initials: 'LP',
    locality: 'JP Nagar 2nd Phase · 2.1 km',
    eta: '38–53 min',
    perk: 'No delivery fee',
    perkLabel: 'No delivery fee above ₹299',
  },
  {
    id: 'jm',
    name: 'Janata Medical Store',
    initials: 'JM',
    locality: 'Koramangala 6th Block · 2.6 km',
    eta: '42–57 min',
    perk: 'Local favourite',
    perkLabel: 'Generics available',
  },
];

export const labTests = {
  eyebrow: 'Lab tests at home',
  title: 'Blood tests with home sample pickup',
  body: 'We are partnering with NABL-accredited labs. Bookings open here when it is ready.',
  tag: 'Coming soon',
};

export const careCorners = [
  {
    id: 'diabetes',
    name: 'Diabetes care',
    sub: 'Glucometers, test strips, sugar-free nutrition',
    accent: 'diabetes' as const,
    photos: ['Onetouch Verio Test Strip (Only Strips)', 'Beato CURV Smartphone Glucometer'],
  },
  {
    id: 'heart',
    name: 'Heart & BP',
    sub: 'BP monitors, omega-3, home checks',
    accent: 'heart' as const,
    photos: ['Omron HEM8712 BP Monitor', 'BPL B18 120/80 Blood Pressure Monitor'],
  },
  {
    id: 'elderly',
    name: 'Elderly care',
    sub: 'Adult diapers, underpads, mobility aids',
    accent: 'elderly' as const,
    photos: ['Himalaya Adult Diaper super absorbent super soft', 'Friends Overnight Adult Diaper Pants L-XL'],
  },
];

export const bestOffers: Product[] = [
  byId('beato-glucometer'),
  byId('digene-shots'),
  byId('morepen-calcium'),
];

export const everydayEssentials: Product[] = [
  byId('dettol-everyday'),
  byId('hansaplast'),
  byId('zandu-balm-everyday'),
  byId('digene-shots-2'),
];

export const prescriptionNote =
  'Have a prescription? Upload it and a registered pharmacist checks it before anything is dispensed.';

export const forPharmacies = {
  eyebrow: 'For pharmacies',
  title: 'Own a pharmacy? Start selling online.',
  body: 'Reach customers in your locality. Zero setup cost.',
  action: 'Partner with us',
};

export const footerLinks = [
  'Partner with us',
  'Help and support',
  'Offers and coupons',
  'Refer and earn',
  'My orders',
];

export const footer = {
  headline: 'Care,\ndelivered\nin minutes.',
  madeWith: 'Made with',
  place: 'in Bengaluru, India',
  brand: 'MedMate',
  legal: '© 2026 Medmate India Technology Private Limited · Terms · Privacy',
};

