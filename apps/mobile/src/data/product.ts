/**
 * Product details.
 *
 * A catalogue product is a price and a pack. A product page needs more: who
 * markets it, what is in it, which pharmacies have it and what the labels
 * say. The showcase products carry the copy from the Figma file; every other
 * product derives its page from the catalogue.
 */
import { catalogue, type CatalogueProduct } from './catalogue';

export type ProductPharmacy = {
  /** The initials on the avatar. */
  initials: string;
  name: string;
  /** Distance and delivery window, e.g. "0.8 km · 32–47 min". */
  distance: string;
  /** What the store charges, e.g. "No delivery fee". */
  perk: string;
  /** The price at this store. */
  price: number;
};

export type ProductCoupon = {
  code: string;
  desc: string;
};

export type ProductDetail = {
  /** The catalogue id. */
  id: string;
  /** Who markets it. */
  manufacturer: string;
  /** What is in it. */
  contains: string;
  /** The pack it comes in. */
  pack: string;
  /** The form, e.g. "Gel". */
  form: string;
  /** The salt and strength. */
  salt: string;
  /** The badge under the name. */
  badge: string;
  /** How to use it. */
  use: string;
  /** The safety notes. */
  safety: string;
  /** The questions people ask. */
  faqs: { q: string; a: string }[];
  /** The other products to show. */
  similar: string[];
  /** The stores that have it. */
  pharmacies: ProductPharmacy[];
  /** The coupons that apply. */
  coupons: ProductCoupon[];
  /** The licence of the selling store. */
  licence: string;
  /** The pharmacist on duty. */
  pharmacist: string;
  /** Where the store is. */
  locality: string;
};

const PHARMACIES: ProductPharmacy[] = [
  {
    initials: 'HF',
    name: 'HealthFirst Chemist',
    distance: '0.8 km · 32–47 min',
    perk: 'No delivery fee',
    price: 0,
  },
  {
    initials: 'SS',
    name: 'Sri Sai Medicals',
    distance: '1.2 km · 36–51 min',
    perk: '₹20 delivery · no fee above ₹199',
    price: 0,
  },
  {
    initials: 'LP',
    name: 'Lakshmi Pharma',
    distance: '2.1 km · 38–53 min',
    perk: '₹25 delivery · no fee above ₹299',
    price: 0,
  },
];

const COUPONS: ProductCoupon[] = [
  { code: 'MEDMATE25', desc: '25% off health products on your first order' },
  { code: 'FLAT50', desc: 'Flat ₹50 off above ₹399' },
];

/** The details the Figma file writes out for the two showcase products. */
const SHOWCASE: Record<string, ProductDetail> = {
  'moov-gel': {
    id: 'moov-gel',
    manufacturer: 'Reckitt Benckiser (India) Pvt. Ltd.',
    contains: 'Tube of 10 gm Gel',
    pack: 'Tube of 10 gm Gel',
    form: 'Gel',
    salt: 'Menthol 5% w/w, Methyl Salicylate 10% w/w',
    badge: 'Gel & Sprays',
    use: 'Apply a thin layer to the affected area up to three times a day, or as directed by your doctor. Wash your hands before and after use, and avoid contact with the eyes.',
    safety: 'For external use only. Do not use on broken or inflamed skin. Stop if the skin reacts, and keep out of reach of children.',
    faqs: [
      {
        q: 'Can I use it with other pain relief gels?',
        a: 'Ask your pharmacist first. Two cooling gels can irritate the skin together.',
      },
      {
        q: 'How long does a tube last?',
        a: 'A 10 gm tube is enough for around a week of twice-daily use.',
      },
    ],
    similar: ['volini-spray', 'tynor-lumbo', 'aksobha-pack'],
    pharmacies: PHARMACIES,
    coupons: COUPONS,
    licence: 'Drug licence KA-BLR-20B/21B 118744',
    pharmacist: 'Pharmacist Meena Rao · Reg. KSPC 41208',
    locality: 'BTM Layout · Open till 11 pm',
  },
  DRS201520: {
    id: 'DRS201520',
    manufacturer: 'Leeford Healthcare Ltd.',
    contains: 'Nimesulide (100mg) + Paracetamol (325mg)',
    pack: 'strip of 10 tablets',
    form: 'Tablet',
    salt: 'Nimesulide (100mg) + Paracetamol (325mg)',
    badge: 'Pain relief',
    use: 'Take one tablet after food, twice a day, or as your doctor has prescribed. Do not take more than the prescribed dose.',
    safety: 'Prescription medicine. Do not self-medicate. Tell your doctor if you take blood thinners or have stomach ulcers.',
    faqs: [
      {
        q: 'Can I take a painkiller alongside it?',
        a: 'Nimesulide and paracetamol are both in this tablet. Ask your doctor before adding any other painkiller.',
      },
      {
        q: 'How do I get it dispensed?',
        a: 'Upload a valid prescription from a registered doctor at checkout. The pharmacist checks it before the order leaves the store.',
      },
    ],
    similar: ['DRS120861', 'DRS045014', 'DRS087673'],
    pharmacies: PHARMACIES,
    coupons: [],
    licence: 'Drug licence KA-BLR-20B/21B 118744',
    pharmacist: 'Pharmacist Meena Rao · Reg. KSPC 41208',
    locality: 'BTM Layout · Open till 11 pm',
  },
};

/**
 * The details of a product.
 *
 * The showcase products keep the copy from the design; everything else is
 * derived from the catalogue.
 */
export function productDetail(product: CatalogueProduct): ProductDetail {
  const showcase = SHOWCASE[product.id];
  if (showcase) {
    return {
      ...showcase,
      pharmacies: showcase.pharmacies.map((pharmacy) => ({ ...pharmacy, price: product.price })),
    };
  }

  return {
    id: product.id,
    manufacturer: product.brand,
    contains: product.sub || product.name,
    pack: product.sub || product.name,
    form: 'Tablet',
    salt: product.sub || product.name,
    badge: product.category,
    use: 'Take as directed by your doctor or pharmacist, and finish the full course.',
    safety: 'Keep out of reach of children. Store in a cool, dry place, away from direct sunlight.',
    faqs: [
      {
        q: 'How should I store it?',
        a: 'Store below 25°C in a dry place, in the original pack.',
      },
      {
        q: 'Is it safe for children?',
        a: 'Ask your doctor or pharmacist before giving it to a child.',
      },
    ],
    similar: catalogue
      .filter((candidate) => candidate.category === product.category && candidate.id !== product.id)
      .slice(0, 3)
      .map((candidate) => candidate.id),
    pharmacies: PHARMACIES.map((pharmacy) => ({ ...pharmacy, price: product.price })),
    coupons: product.rx ? [] : COUPONS,
    licence: 'Drug licence KA-BLR-20B/21B 118744',
    pharmacist: 'Pharmacist Meena Rao · Reg. KSPC 41208',
    locality: 'BTM Layout · Open till 11 pm',
  };
}

/** The copy under the price. */
export function mrpLine(product: CatalogueProduct): string {
  if (!product.mrp) return 'Inclusive of all taxes';
  return `MRP ₹${product.mrp.toLocaleString('en-IN')} inclusive of all taxes`;
}

/** The savings badge next to the price. */
export function savingsLabel(product: CatalogueProduct): string | null {
  if (product.rx || !product.mrp || !product.off) return null;
  return `You save ₹${product.mrp - product.price}`;
}

/** The badges under the product name. */
export function badgesFor(product: CatalogueProduct, detail: ProductDetail) {
  return [
    {
      key: 'prescription',
      label: product.rx ? 'Rx · prescription needed' : 'No prescription needed',
      background: product.rx ? '#FCECE9' : '#E9F6EE',
      color: product.rx ? '#C2392D' : '#256B46',
    },
    {
      key: 'pharmacy',
      label: 'From a licensed pharmacy',
      background: '#EDF2EF',
      color: '#3B4842',
      icon: 'shield' as const,
    },
    {
      key: 'form',
      label: detail.badge,
      background: '#FDF8EA',
      color: '#855B0C',
    },
  ];
}

/** The note under the badges of a prescription medicine. */
export const rxNotice =
  'Rx means this is a prescription-only medicine. By law the pharmacist can dispense it only against a valid prescription from a registered doctor, and checks it before your order leaves the store. Use it only as your doctor directs.';

/** The block above the tabs of a prescription medicine. */
export const rxBlockTitle = 'Prescription required';

export const rxBlockBody =
  'Upload your prescription at checkout, or place the order and talk to a registered doctor. The doctor decides independently whether a prescription is right for you.';

/** The returns and refunds copy. */
export const returnPoints = [
  'Cancel at no charge until the pharmacy starts packing.',
  'Full refund if an item is out of stock or the pharmacist cannot dispense it.',
  'Check the seal, batch and expiry when the order reaches you. If something is wrong, tell us from Help.',
];

/** The line at the bottom of the page. */
export const disclaimer =
  'Information here is for reference and does not replace your doctor’s or pharmacist’s advice. Consult your doctor before starting, stopping or switching any medicine. In an emergency call 112.';

/** The note under the store list. */
export const pricingNote =
  'Prices are each pharmacy’s own, at or below MRP. A ₹5 handling fee applies to every order.';

/** The note under the seller card. */
export const pharmacistNote =
  'The registered pharmacist checks every order before it leaves the store. Pharmacy details are sample listings until the store joins MedMate.';

/** The note under the seller card of a prescription medicine. */
export const pharmacistNoteRx =
  'The registered pharmacist checks every order and your prescription before it leaves the store. Pharmacy details are sample listings until the store joins MedMate.';
