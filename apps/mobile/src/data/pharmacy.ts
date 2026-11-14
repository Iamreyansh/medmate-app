/**
 * Pharmacies and offers.
 *
 * The stores that deliver to the app, the two highlighted ones at the top of
 * the list, and the coupons the offers screen hands out.
 */
import { catalogue } from './catalogue';

export type Pharmacy = {
  /** The url slug. */
  id: string;
  /** The initials on the avatar. */
  initials: string;
  name: string;
  /** The area the store sits in. */
  area: string;
  /** How far away it is, e.g. "0.8 km". */
  distance: string;
  /** The delivery window, e.g. "32–47 min". */
  eta: string;
  /** What the store carries. */
  categories: string;
  /** The store licence. */
  licence: string;
  /** The pharmacist on duty. */
  pharmacist: string;
  /** What the store is good for. */
  perks: string[];
  /** Whether the store is open right now. */
  open: boolean;
  /** When it closes. */
  openLabel: string;
  /** Whether the store pays the delivery fee. */
  noDeliveryFee: boolean;
  /** The store is in the first kilometre. */
  nearby: boolean;
  /** The store is highlighted at the top of the list. */
  promoted?: boolean;
  /** The headline of the highlight card. */
  highlight?: { eyebrow: string; title: string; note: string };
};

export const pharmacies: Pharmacy[] = [
  {
    id: 'healthfirst-chemist',
    initials: 'HF',
    name: 'HealthFirst Chemist',
    area: 'BTM Layout',
    distance: '0.8 km',
    eta: '32–47 min',
    categories: 'Medicines · Baby care · Devices',
    licence: 'Lic. 118744',
    pharmacist: 'Pharmacist Meena Rao',
    perks: ['No delivery fee', 'Rx accepted'],
    open: true,
    openLabel: 'Open till 11 pm',
    noDeliveryFee: true,
    nearby: true,
    promoted: true,
    highlight: {
      eyebrow: 'Nearest to you',
      title: 'No delivery fee',
      note: 'HealthFirst Chemist · no minimum order',
    },
  },
  {
    id: 'sri-sai-medicals',
    initials: 'SS',
    name: 'Sri Sai Medicals',
    area: 'Jayanagar 4th Block',
    distance: '1.2 km',
    eta: '36–51 min',
    categories: 'Medicines · Surgicals · Ayurveda',
    licence: 'Lic. 102377',
    pharmacist: 'Pharmacist Sai Prasad',
    perks: ['₹20 delivery · no fee above ₹199'],
    open: true,
    openLabel: 'Open 24×7',
    noDeliveryFee: false,
    nearby: false,
    highlight: {
      eyebrow: 'Open all night',
      title: '24×7 pharmacy',
      note: 'Sri Sai Medicals · Jayanagar 4th Block',
    },
  },
  {
    id: 'lakshmi-pharma',
    initials: 'LP',
    name: 'Lakshmi Pharma',
    area: 'JP Nagar 2nd Phase',
    distance: '2.1 km',
    eta: '38–53 min',
    categories: 'Medicines · Devices · First aid',
    licence: 'Lic. 118201',
    pharmacist: 'Pharmacist Anitha Rao',
    perks: ['₹25 delivery · no fee above ₹299'],
    open: true,
    openLabel: 'Open till 10 pm',
    noDeliveryFee: false,
    nearby: false,
  },
  {
    id: 'janata-medical-store',
    initials: 'JM',
    name: 'Janata Medical Store',
    area: 'Koramangala 6th Block',
    distance: '2.6 km',
    eta: '42–57 min',
    categories: 'Medicines · Generic medicines',
    licence: 'Lic. 118990',
    pharmacist: 'Pharmacist Ravi Kumar',
    perks: ['Generics available'],
    open: false,
    openLabel: 'Opens at 9 am',
    noDeliveryFee: true,
    nearby: false,
  },
];

/** The store a slug stands for. */
export function pharmacyFromSlug(slug: string): Pharmacy {
  return pharmacies.find((pharmacy) => pharmacy.id === slug) ?? pharmacies[0];
}

/** The stores highlighted at the top of the list. */
export function highlightedPharmacies(): Pharmacy[] {
  return pharmacies.filter((pharmacy) => pharmacy.highlight);
}

/** The pharmacy filter chips. */
export type PharmacyFilterId = 'all' | 'openNow' | 'under20' | 'within1km' | 'noDeliveryFee';

export function pharmacyFilters(): { id: PharmacyFilterId; label: string }[] {
  return [
    { id: 'all', label: 'All' },
    { id: 'openNow', label: `Open now ${pharmacies.filter((p) => p.open).length}` },
    { id: 'under20', label: 'Under 20 min' },
    { id: 'within1km', label: 'Within 1 km' },
    { id: 'noDeliveryFee', label: 'No delivery fee' },
  ];
}

/** Apply a pharmacy filter. */
export function filterPharmacies(
  list: Pharmacy[],
  filter: PharmacyFilterId,
): Pharmacy[] {
  switch (filter) {
    case 'openNow':
      return list.filter((pharmacy) => pharmacy.open);
    case 'under20':
      return list.filter((pharmacy) => pharmacy.eta.startsWith('32–') || pharmacy.eta.startsWith('36–'));
    case 'within1km':
      return list.filter((pharmacy) => pharmacy.nearby);
    case 'noDeliveryFee':
      return list.filter((pharmacy) => pharmacy.noDeliveryFee);
    default:
      return list;
  }
}

/** The copy under the title. */
export function pharmacySubtitle(): string {
  return `${pharmacies.length} licensed stores delivering now · fastest in 32–47 min`;
}

/** The note under the list. */
export const deliveryNote = [
  'Times shown are Standard delivery. Express, on a dedicated rider, is offered at checkout.',
  'Each store sets its own delivery fee. Stores over 3 km away add ₹20 and about 25 min. A ₹5 handling fee applies to every order.',
  'Every partner is a licensed pharmacy with a registered pharmacist.',
];

/** The smaller line under the delivery note. */
export const deliverySampleNote =
  'Store details are sample listings until each pharmacy joins MedMate.';

/* -------------------------------------------------------------------------- */
/*  Offers                                                                    */
/* -------------------------------------------------------------------------- */

export type OfferCoupon = {
  id: string;
  /** The big number on the stub, e.g. "25%". */
  big: string;
  /** The small label under it, e.g. "OFF". */
  unit: string;
  /** The offer itself. */
  title: string;
  /** What it needs. */
  requirement: string;
  /** The code. */
  code: string;
  /** Whether it is the best fit for the cart. */
  best?: boolean;
  /** The stub colour. */
  stub: 'forest' | 'gold';
};

export const offerCoupons: OfferCoupon[] = [
  {
    id: 'medmate25',
    big: '25%',
    unit: 'OFF',
    title: '25% off health products on your first order',
    requirement: 'Applies to health products once you add them',
    code: 'MEDMATE25',
    best: true,
    stub: 'forest',
  },
  {
    id: 'flat50',
    big: '₹50',
    unit: 'OFF',
    title: 'Flat ₹50 off above ₹399',
    requirement: 'Needs ₹399 of health products',
    code: 'FLAT50',
    stub: 'gold',
  },
  {
    id: 'freedel',
    big: '₹0',
    unit: 'DELIVERY',
    title: 'No delivery fee on this order',
    requirement: 'Removes the delivery fee',
    code: 'FREEDEL',
    stub: 'gold',
  },
];

/** The rewards card at the top of the offers screen. */
export const rewards = {
  title: 'MedMate Money',
  balance: '₹0',
  line: 'Rewards balance · earn ₹15 on every order you place',
  body: 'Use it at checkout for part or all of an order. It goes back to your wallet if you cancel.',
  action: 'Use it at checkout',
};

/** The lines under "How coupons work". */
export const couponRules = [
  'One coupon per order. Coupons cannot be combined.',
  'MedMate Money can be used together with a coupon.',
  'Coupons never apply to prescription medicines.',
];

/** The line under the code field. */
export const emptyCartNote =
  'Your cart is empty. A coupon you apply now is used when you check out.';

/** The products the store shelves. */
export function storefrontProducts(): typeof catalogue {
  return catalogue.filter((product) => !product.rx).slice(0, 9);
}
