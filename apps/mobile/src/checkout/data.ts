import type { CartLine } from '../state/cart';

/**
 * The data behind the checkout screens.
 *
 * The Figma frames for `03 Checkout` are drawn with a full basket and a
 * chosen pharmacy. The numbers here follow those frames exactly, and the
 * totals are worked out from the basket rather than hard-coded, so the bill
 * always agrees with what is in the cart.
 */

/** The charge every pharmacy adds to handle the order. */
export const handlingCharge = 5;

/** The delivery speed the shopper can pick. */
export type DeliverySpeed = {
  id: 'express' | 'standard' | 'scheduled';
  label: string;
  /** The time it takes, or a prompt to pick a slot. */
  eta: string;
  /** The extra charge for this speed. */
  fee: number;
  icon: 'bolt' | 'scooter' | 'clock';
};

export const deliverySpeeds: DeliverySpeed[] = [
  { id: 'express', label: 'Express', eta: '12 min', fee: 25, icon: 'bolt' },
  { id: 'standard', label: 'Standard', eta: '32–47 min', fee: 0, icon: 'scooter' },
  { id: 'scheduled', label: 'Scheduled', eta: 'Pick a slot', fee: 0, icon: 'clock' },
];

export const deliverySpeedNote =
  'Shares a rider with nearby orders. No extra charge. Times are estimates.';

/** What happens when a pharmacy cannot supply an item. */
export type UnavailableChoice = {
  id: 'call' | 'other' | 'leave';
  label: string;
  icon: 'phone' | 'pill' | 'x';
};

export const unavailableChoices: UnavailableChoice[] = [
  { id: 'call', label: 'Call me', icon: 'phone' },
  { id: 'other', label: 'Other brand', icon: 'pill' },
  { id: 'leave', label: 'Leave it out', icon: 'x' },
];

export const unavailableNote =
  'Call me first. The pharmacy calls you before making any change. A prescription medicine is never swapped for a different one.';

/** How the order is paid for. */
export type PaymentMethod = {
  id: 'cod' | 'upi' | 'card';
  label: string;
  icon: 'cash' | 'upi' | 'card';
  /** Shown as a small badge. */
  badge?: string;
};

export const paymentMethods: PaymentMethod[] = [
  { id: 'cod', label: 'Cash on delivery', icon: 'cash' },
  { id: 'upi', label: 'UPI', icon: 'upi', badge: 'Soon' },
  { id: 'card', label: 'Card', icon: 'card', badge: 'Soon' },
];

export const cashNote = (total: number) =>
  `Keep ₹${total} ready for the rider. Nothing is charged before it reaches you.`;

/** How the prescription for the Rx items in the basket is handled. */
export type PrescriptionChoice = {
  id: 'consult' | 'upload';
  eyebrow: string;
  title: string;
  body: string;
  icon: 'steth' | 'rx-up';
};

export const prescriptionChoices: PrescriptionChoice[] = [
  {
    id: 'consult',
    eyebrow: 'Need a consultation?',
    title: 'Talk to a registered doctor',
    body: 'A doctor calls you after you order',
    icon: 'steth',
  },
  {
    id: 'upload',
    eyebrow: 'Upload your own',
    title: 'prescription',
    body: 'A clear photo or PDF, signed by your doctor',
    icon: 'rx-up',
  },
];

export const prescriptionNote =
  'You’ll get a call at +91 98450 12345. The doctor decides independently whether a prescription is right for you. Until it is verified, the pharmacy holds your prescription medicines and nothing is charged for them.';

/** The address the order goes to. */
export const savedAddress = {
  id: 'home',
  label: 'Home',
  icon: 'home' as const,
  line: 'Flat 302, Sri Sai Residency, 7th Cross, Jayanagar 4th Block · 560011',
  receiver: 'You',
  phone: '+91 98450 12345',
  instructions: 'Leave at the door',
  unavailable: 'If unavailable: call me first',
};

/** The coupon that can be applied to this order. */
export type CheckoutCoupon = {
  id: string;
  code: string;
  /** The line under the code. */
  body: string;
  best?: boolean;
};

export const checkoutCoupons: CheckoutCoupon[] = [
  {
    id: 'medmate25',
    code: 'MEDMATE25',
    body: 'Save ₹27 · tap to apply',
    best: true,
  },
  {
    id: 'flat50',
    code: 'FLAT50',
    body: 'Add ₹291 more of health products. Prescription medicines don’t count.',
  },
];

export const couponFootnote =
  'One coupon per order. Coupons never apply to prescription medicines.';

/** A pharmacy the shopper can have the order filled by. */
export type PharmacyOption = {
  id: string;
  name: string;
  initials: string;
  /** The area the pharmacy is in. */
  area: string;
  /** The delivery window it promises. */
  eta: string;
  /** How far away it is. */
  distance: string;
  /** What it charges for delivery. */
  deliveryFee: number;
  /** What the basket is called out of stock for, if anything. */
  stockNote?: string;
  /** Whether it can supply every item. */
  inStock: boolean;
  /** A short badge above the name. */
  tag?: { label: string; tone: 'best' | 'warn' | 'savings' };
  /** A note under the option, used for the far-away pharmacy. */
  farNote?: string;
  /** The drug licence number shown on the receipt. */
  licence?: string;
  /** The pharmacist on duty. */
  pharmacist?: string;
};

/**
 * The pharmacies on the compare screen.
 *
 * The first three are on the cart, the rest only turn up on the compare
 * screen. `MedKart Chemists` is closed, so it is listed but not compared.
 */
export const pharmacyOptions: PharmacyOption[] = [
  {
    id: 'hf',
    name: 'HealthFirst Chemist',
    initials: 'HF',
    area: 'BTM Layout',
    eta: '32–47 min',
    distance: '0.8 km',
    deliveryFee: 0,
    inStock: true,
    stockNote: 'All 3 items in stock',
    tag: { label: 'Lowest price', tone: 'best' },
    licence: 'KA-BLR-20B/21B 118744',
    pharmacist: 'Meena Rao',
  },
  {
    id: 'ss',
    name: 'Sri Sai Medicals',
    initials: 'SS',
    area: 'Jayanagar 4th Block',
    eta: '36–51 min',
    distance: '1.2 km',
    deliveryFee: 0,
    inStock: true,
    stockNote: 'All 3 items in stock',
    tag: { label: '4 min slower', tone: 'warn' },
  },
  {
    id: 'lp',
    name: 'Lakshmi Pharma',
    initials: 'LP',
    area: 'JP Nagar 2nd Phase',
    eta: '38–53 min',
    distance: '2.1 km',
    deliveryFee: 25,
    inStock: true,
    stockNote: 'All 3 items in stock',
    tag: { label: '₹25 more', tone: 'savings' },
  },
  {
    id: 'jm',
    name: 'Janata Medical Store',
    initials: 'JM',
    area: 'Koramangala 6th Block',
    eta: '42–57 min',
    distance: '2.6 km',
    deliveryFee: 0,
    inStock: true,
    stockNote: 'All 3 items in stock',
  },
  {
    id: 'na',
    name: 'Namma Arogya Pharmacy',
    initials: 'NA',
    area: 'Banashankari',
    eta: '46–61 min',
    distance: '3.4 km',
    deliveryFee: 0,
    inStock: true,
    stockNote: 'All 3 items in stock',
  },
  {
    id: 'cc',
    name: 'CityCare Chemists',
    initials: 'CC',
    area: 'HSR Layout',
    eta: '55–70 min',
    distance: '6.2 km',
    deliveryFee: 35,
    inStock: true,
    stockNote: 'All 3 items in stock',
    farNote: 'Farther away. The rider may share this trip with another order, so the time can slip.',
  },
];

/** The pharmacy that is closed, so it cannot be compared. */
export const closedPharmacy = {
  name: 'MedKart Chemists',
  opens: 'opens 8 am',
};

/** The filters on the compare screen. */
export const compareFilters = [
  { id: 'recommended', label: 'Recommended' },
  { id: 'fastest', label: 'Fastest' },
  { id: 'lowest', label: 'Lowest total' },
  { id: 'stock', label: 'Most in stock' },
];

export const compareNote =
  'Tap an option to use it. Amounts are what you pay: items, delivery and the ₹5 handling charge.';

export const compareRxNote =
  'Your cart has prescription medicines. Whichever pharmacy you choose, its pharmacist dispenses them only against a valid prescription.';

export const licensedPharmacies = [
  'Every pharmacy on this list holds a current Karnataka drug licence.',
  'A registered pharmacist checks every prescription medicine before it is handed over.',
  'Prices are set by each pharmacy, so the same medicine can cost a little more or less.',
];

export const compareDisclaimer =
  'Each pharmacy sets its own prices and delivery charge. Demo build: stock, prices, charges and licence details are sample values.';

/** The line under the pharmacy name on the cart. */
export function pharmacyMeta(option: PharmacyOption): string {
  const delivery =
    option.deliveryFee === 0 ? 'No delivery fee' : `₹${option.deliveryFee} delivery`;
  return `${option.eta} · ${option.distance} · ${delivery}`;
}

/**
 * The bill.
 *
 * Everything the checkout shows in money is worked out here so the pharmacy
 * cards, the bill and the order bar can never disagree.
 */
export type CheckoutTotals = {
  /** What the packs cost. */
  items: number;
  /** The delivery charge of the chosen pharmacy and speed. */
  delivery: number;
  /** The charge every pharmacy adds. */
  handling: number;
  /** What the shopper pays. */
  total: number;
  /** What the shopper saves against the MRP. */
  saving: number;
  /** How many packs are in the basket. */
  packs: number;
  /** How many different products are in the basket. */
  products: number;
};

/** What one line of the basket costs. */
export function lineTotal(line: CartLine): number {
  return line.price * line.quantity;
}

/** What the shopper saves on one line against its MRP. */
export function lineSaving(line: CartLine): number {
  if (line.rx || !line.mrp) return 0;
  return (line.mrp - line.price) * line.quantity;
}

/**
 * Work out the bill for a basket.
 */
export function checkoutTotals(
  lines: CartLine[],
  options: {
    deliveryFee?: number;
    speedFee?: number;
  } = {},
): CheckoutTotals {
  const items = lines.reduce((total, line) => total + lineTotal(line), 0);
  const saving = lines.reduce((total, line) => total + lineSaving(line), 0);
  const delivery = (options.deliveryFee ?? 0) + (options.speedFee ?? 0);

  return {
    items,
    delivery,
    handling: handlingCharge,
    total: items + delivery + handlingCharge,
    saving,
    packs: lines.reduce((total, line) => total + line.quantity, 0),
    products: lines.length,
  };
}

/** The pharmacy that is filled by default. */
export const defaultPharmacy = pharmacyOptions[0];
