/**
 * Content for the Shop home screen.
 *
 * Mirrors the Figma frame "iOS / 02 Shop / Home" and the live MVP: same copy,
 * same order, same numbers. Swap this module for an API client when the
 * backend lands - the screen itself never touches a literal.
 */

export type Category = {
  id: string;
  label: string;
  /** One or two letters shown on the art tint while the photo is pending. */
  initials: string;
};

export type Product = {
  id: string;
  name: string;
  /** Pack size, e.g. "Tube of 10 gm Gel". */
  sub: string;
  /** Selling price in rupees. */
  price: number;
  /** Maximum retail price. Never shown for prescription items. */
  mrp?: number;
  /** Discount percentage. Never shown for prescription items. */
  off?: number;
  /** Delivery window. */
  eta?: string;
  /** Prescription item: price only, no strike-through, no discount. */
  rx?: boolean;
};

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
  {
    id: 'moov-gel',
    name: 'Moov Cool Therapy Gel',
    sub: 'Tube of 10 gm Gel',
    price: 38,
    mrp: 44,
    off: 14,
    eta: '32–47 min',
  },
  {
    id: 'dettol-liquid',
    name: 'Dettol Antiseptic Disinfectant Liquid',
    sub: 'Bottle of 60 ml Liquid',
    price: 32,
    mrp: 38,
    off: 16,
    eta: '32–47 min',
  },
  {
    id: 'cetaphil-cream',
    name: 'Cetaphil Optimal Hydration Daily Cream',
    sub: 'Jar of 50 gm Cream',
    price: 1124,
    mrp: 1322,
    off: 15,
    eta: '32–47 min',
  },
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
      { id: 'tynor-lumbo', name: 'Tynor A 05 Lumbo Sacral Belt Large', sub: 'Box of 1 Belt', price: 740, mrp: 870, off: 15, eta: '32–47 min' },
      { id: 'aksobha-pack', name: 'Aksobha Long Herbal Hot & Cold Therapy Pack', sub: 'Pack of 2', price: 560, mrp: 660, off: 15, eta: '32–47 min' },
      { id: 'volini-spray', name: 'Volini Spray Spray for Sprain, Muscle and Joint Pain', sub: 'Bottle of 55 ml', price: 189, mrp: 225, off: 16, eta: '32–47 min' },
      { id: 'moov-gel-care', name: 'Moov Cool Therapy Gel', sub: 'Tube of 10 gm Gel', price: 38, mrp: 44, off: 14, eta: '32–47 min' },
      { id: 'leeford-lumbo', name: 'Leeford Contoured Lumbo Sacral Belt Large', sub: 'Box of 1 Belt', price: 799, mrp: 940, off: 15, eta: '32–47 min' },
      { id: 'tynor-grip', name: 'Tynor Tynogrip Training Gloves with Support', sub: 'Pair', price: 249, mrp: 295, off: 16, eta: '32–47 min' },
    ],
  },
  {
    id: 'baby',
    name: 'Baby & child care',
    sub: 'Gentle wash, lotion, diapers, mosquito care',
    accent: 'baby',
    products: [
      { id: 'himalaya-pants', name: 'Himalaya Total Care Baby Pants', sub: 'Packet of 76 diapers', price: 944, mrp: 1110, off: 15, eta: '32–47 min' },
      { id: 'cetaphil-baby', name: 'Cetaphil Baby Gentle Wash with Organic Calendula', sub: 'Bottle of 200 ml', price: 449, mrp: 529, off: 15, eta: '32–47 min' },
      { id: 'dabur-baby-cream', name: 'Dabur Baby Cream', sub: 'Jar of 50 gm', price: 199, mrp: 235, off: 15, eta: '32–47 min' },
      { id: 'himalaya-soap', name: 'Himalaya Gentle Baby Soap (75gm Each)', sub: 'Pack of 2', price: 128, mrp: 150, off: 15, eta: '32–47 min' },
      { id: 'mamaearth-body-wash', name: 'Mamaearth Body Wash for Kids with Apple Extract', sub: 'Bottle of 200 ml', price: 259, mrp: 305, off: 15, eta: '32–47 min' },
      { id: 'chicco-roll-on', name: 'Chicco Anti-Mosquito Baby Fabric Roll-On', sub: 'Bottle of 50 ml', price: 299, mrp: 352, off: 15, eta: '32–47 min' },
    ],
  },
  {
    id: 'women',
    name: 'Women’s health',
    sub: 'Period care, menstrual cups, menopause support',
    accent: 'women',
    products: [
      { id: 'fem-pads', name: 'Fem Ultra Care Sanitary Pads XL+', sub: 'Pack of 30', price: 219, mrp: 260, off: 16, eta: '32–47 min' },
      { id: 'amrutanjan-cup', name: 'Amrutanjan Comfy Snug Fit Period Cup Large', sub: 'Pack of 2', price: 349, mrp: 410, off: 15, eta: '32–47 min' },
      { id: 'amrutanjan-pads', name: 'Amrutanjan Comfy Snug Fit Sanitary Pads Regular', sub: 'Pack of 20', price: 179, mrp: 210, off: 15, eta: '32–47 min' },
      { id: 'gytree-menopause', name: 'Gytree Total Menopause Support Cafe Mocha', sub: 'Box of 10 sachets', price: 449, mrp: 529, off: 15, eta: '32–47 min' },
      { id: 'chicco-breast-pad', name: 'Chicco Breast pad with Antibacterial Fabric', sub: 'Pack of 12', price: 249, mrp: 295, off: 16, eta: '32–47 min' },
      { id: 'himalaya-pads-women', name: 'Himalaya Ultra Thin Pad with Super Soft Cover', sub: 'Pack of 20', price: 149, mrp: 175, off: 15, eta: '32–47 min' },
    ],
  },
];

export const dealOfTheDay = {
  eyebrow: 'Deal of the day',
  product: {
    id: 'omron-hem8712',
    name: 'Omron HEM8712 BP Monitor',
    sub: 'Box of 1 Unit',
    price: 1821,
    mrp: 2142,
    off: 15,
    eta: '32–47 min',
  } as Product,
};

export const dealRail: Product[] = [
  { id: 'dettol-liquid-deal', name: 'Dettol Antiseptic Disinfectant Liquid', sub: 'Bottle of 60 ml Liquid', price: 32, mrp: 38, off: 16, eta: '32–47 min' },
  { id: 'moov-gel-deal', name: 'Moov Cool Therapy Gel', sub: 'Tube of 10 gm Gel', price: 38, mrp: 44, off: 14, eta: '32–47 min' },
  { id: 'cetaphil-cream-deal', name: 'Cetaphil Optimal Hydration Daily Cream', sub: 'Jar of 50 gm Cream', price: 1124, mrp: 1322, off: 15, eta: '32–47 min' },
  { id: 'zandu-balm', name: 'Zandu Balm', sub: 'Bottle of 25 ml Balm', price: 99, mrp: 116, off: 15, eta: '32–47 min' },
];

export const seasonal = {
  eyebrow: 'Seasonal picks',
  title: 'This season in Bengaluru',
  body: 'Oct–Nov: cold evenings, mosquitoes after the rains, Deepavali',
  filters: ['Cold & cough', 'Mosquito care', 'Deepavali first aid'],
  products: [
    { id: 'zandu-balm-s', name: 'Zandu Balm', sub: 'Bottle of 25 ml Balm', price: 99, mrp: 116, off: 15, eta: '32–47 min' },
    { id: 'mamaearth-breathe', name: 'Mamaearth Natural Breathe Easy Vapour Roll-On for Babies', sub: 'Bottle of 40 ml Oil', price: 214, mrp: 252, off: 15, eta: '32–47 min' },
    { id: 'bakson-b33', name: 'Bakson B33 Cough Drop', sub: 'Bottle of 30 ml Drop', price: 144, mrp: 169, off: 15, eta: '32–47 min' },
    { id: 'amrutanjan-cold-rub', name: 'Amrutanjan Cold Rub', sub: 'Jar of 30 gm Balm', price: 40, mrp: 47, off: 15, eta: '32–47 min' },
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
  { id: 'beato-glucometer', name: 'Beato CURV Smartphone Glucometer', sub: 'Box of 1 Unit', price: 1049, mrp: 1235, off: 15, eta: '32–47 min' },
  { id: 'digene-shots', name: 'Digene Insta On The Go Shots (10ml Each) No Added Sugar Orange', sub: 'Pack of 15 shots', price: 299, mrp: 352, off: 15, eta: '32–47 min' },
  { id: 'morepen-calcium', name: 'Dr Morepen Calcium + Advanced Tablet', sub: 'Strip of 15 tablets', price: 189, mrp: 225, off: 16, eta: '32–47 min' },
];

export const everydayEssentials: Product[] = [
  { id: 'dettol-everyday', name: 'Dettol Antiseptic Disinfectant Liquid', sub: 'Bottle of 60 ml Liquid', price: 32, mrp: 38, off: 16, eta: '32–47 min' },
  { id: 'hansaplast', name: 'Hansaplast Antiseptic Washproof Bandage For Wound Protection Bandage', sub: 'Box of 20 plasters', price: 149, mrp: 175, off: 15, eta: '32–47 min' },
  { id: 'zandu-balm-everyday', name: 'Zandu Balm', sub: 'Bottle of 25 ml Balm', price: 99, mrp: 116, off: 15, eta: '32–47 min' },
  { id: 'digene-shots-2', name: 'Digene Insta On The Go Shots (10ml Each) No Added Sugar Orange', sub: 'Pack of 15 shots', price: 299, mrp: 352, off: 15, eta: '32–47 min' },
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

/** Initials helper used by the art tiles while product photos are pending. */
export function initialsOf(name: string): string {
  const words = name.split(/\s+/).filter(Boolean);
  if (words.length === 0) return '';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}
