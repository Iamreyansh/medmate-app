import type { CartLine } from '../state/cart';
import { checkoutTotals, lineTotal, pharmacyOptions, savedAddress } from '../checkout/data';

/**
 * The orders.
 *
 * The Figma `04 Orders` section is drawn with one order, #MM-20341, waiting
 * for a prescription, plus the same order in three other states. The mock
 * catalogue has no backend, so the orders live here with the same shape the
 * checkout writes.
 *
 * Every amount is worked out from the lines, using the same functions the
 * checkout uses, so an order can never disagree with the basket that made it.
 */

/** Where an order has got to. */
export type OrderStage = 'waiting' | 'on-the-way' | 'late' | 'cancelled' | 'delivered';

/** The four steps an order moves through. */
export type OrderStep = 'placed' | 'packing' | 'on-the-way' | 'delivered';

/** The order the shopper placed. */
export type Order = {
  /** The number without the hash, e.g. `MM-20341`. */
  id: string;
  /** When it was placed, e.g. `Today, 4:12 pm`. */
  placedAt: string;
  /** The pharmacy filling it. */
  pharmacyId: string;
  /** What is in it. */
  lines: CartLine[];
  /** How it is paid for. */
  payment: string;
  /** The delivery speed. */
  speed: string;
  /** Where it has got to. */
  stage: OrderStage;
  /** A prescription medicine is in it and still has to be verified. */
  rxNeeded: boolean;
  /** Where it goes. */
  address: string;
  /** Who takes it. */
  receiver: string;
  /** The number the rider calls. */
  phone: string;
  /** The instructions left for the rider. */
  instructions: string;
};

/** The stage the order has reached, as a step on the stepper. */
export function orderStep(stage: OrderStage): OrderStep {
  if (stage === 'waiting') return 'placed';
  if (stage === 'on-the-way' || stage === 'late') return 'on-the-way';
  if (stage === 'delivered') return 'delivered';
  return 'placed';
}

/** The four steps, in order. */
export const orderSteps: { id: OrderStep; label: string; icon: 'check' | 'box' | 'scooter' | 'home' }[] = [
  { id: 'placed', label: 'Placed', icon: 'check' },
  { id: 'packing', label: 'Packing', icon: 'box' },
  { id: 'on-the-way', label: 'On the way', icon: 'scooter' },
  { id: 'delivered', label: 'Delivered', icon: 'home' },
];

/** The copy that goes with each stage. */
export type StageCopy = {
  /** The small line above the headline. */
  eyebrow: string;
  /** The big line. */
  headline: string;
  /** The line under it. */
  body: string;
  /** The card that says what is happening now. */
  status: {
    icon: 'scooter' | 'box' | 'home' | 'alert' | 'x';
    title: string;
    body: string;
    meta: string;
  };
};

export const stageCopy: Record<OrderStage, StageCopy> = {
  waiting: {
    eyebrow: 'Order placed',
    headline: 'Waiting to confirm',
    body: 'Order placed · waiting for HealthFirst Chemist to confirm. Usually a few minutes during store hours.',
    status: {
      icon: 'scooter',
      title: 'Waiting for HealthFirst Chemist to confirm',
      body: 'Usually within a few minutes during store hours.',
      meta: 'Standard · store estimate 32–47 min',
    },
  },
  'on-the-way': {
    eyebrow: 'Out for delivery',
    headline: 'Arriving in 9 min',
    body: 'Your rider is on the way to Home.',
    status: {
      icon: 'scooter',
      title: 'On the way to your door',
      body: 'Suresh is riding to Flat 302, Sri Sai Residency.',
      meta: 'Standard · 9 min away',
    },
  },
  late: {
    eyebrow: 'Running late',
    headline: 'About 18 min late',
    body: 'The pharmacy is packing more slowly than usual. We are sorry about it.',
    status: {
      icon: 'alert',
      title: 'Packing is taking longer than usual',
      body: 'The pharmacy has said it should be ready in about 18 minutes.',
      meta: 'Standard · now estimated 52–67 min',
    },
  },
  cancelled: {
    eyebrow: 'Order cancelled',
    headline: 'Cancelled by you',
    body: 'Cancelled at 4:26 pm. Nothing was charged and the MedMate Money was returned to your wallet.',
    status: {
      icon: 'x',
      title: 'This order was cancelled',
      body: 'No cancellation charge was made. Nothing was charged.',
      meta: 'Refund of ₹15 MedMate Money is on its way',
    },
  },
  delivered: {
    eyebrow: 'Delivered',
    headline: 'Delivered today',
    body: 'Delivered at 4:58 pm. Thanks for choosing MedMate.',
    status: {
      icon: 'home',
      title: 'Delivered to Home',
      body: 'Left with the security at the gate, as you asked.',
      meta: 'Standard · 46 min',
    },
  },
};

/** The lines the Figma order is built from. */
const FigmaLines: CartLine[] = [
  {
    id: 'moov-gel',
    name: 'Moov Cool Therapy Gel',
    sub: 'Tube of 10 gm Gel',
    price: 38,
    mrp: 44,
    off: 14,
    initials: 'MC',
    quantity: 2,
  },
  {
    id: 'dettol-liquid',
    name: 'Dettol Antiseptic Disinfectant Liquid',
    sub: 'Bottle of 60 ml Liquid',
    price: 32,
    mrp: 38,
    off: 16,
    initials: 'DA',
    quantity: 1,
  },
  {
    id: 'DRS_TELMAR',
    name: 'Telma-R 5 Tablet',
    sub: 'Strip of 10 tablets',
    price: 161,
    rx: true,
    initials: 'T5',
    quantity: 1,
  },
];

/** The orders on screen. */
export const orders: Order[] = [
  {
    id: 'MM-20341',
    placedAt: 'Today, 4:12 pm',
    pharmacyId: 'hf',
    lines: FigmaLines,
    payment: 'Cash on Delivery',
    speed: 'Standard',
    stage: 'waiting',
    rxNeeded: true,
    address: savedAddress.line,
    receiver: savedAddress.receiver,
    phone: savedAddress.phone,
    instructions: 'Leave at the door',
  },
  {
    id: 'MM-20318',
    placedAt: 'Today, 3:02 pm',
    pharmacyId: 'hf',
    lines: FigmaLines,
    payment: 'Cash on Delivery',
    speed: 'Standard',
    stage: 'on-the-way',
    rxNeeded: false,
    address: savedAddress.line,
    receiver: savedAddress.receiver,
    phone: savedAddress.phone,
    instructions: 'Leave at the door',
  },
  {
    id: 'MM-20277',
    placedAt: 'Today, 1:26 pm',
    pharmacyId: 'ss',
    lines: FigmaLines,
    payment: 'Cash on Delivery',
    speed: 'Standard',
    stage: 'late',
    rxNeeded: false,
    address: savedAddress.line,
    receiver: savedAddress.receiver,
    phone: savedAddress.phone,
    instructions: 'Call when you arrive',
  },
  {
    id: 'MM-20190',
    placedAt: '28 Oct, 6:41 pm',
    pharmacyId: 'lp',
    lines: FigmaLines,
    payment: 'Cash on Delivery',
    speed: 'Standard',
    stage: 'cancelled',
    rxNeeded: false,
    address: savedAddress.line,
    receiver: savedAddress.receiver,
    phone: savedAddress.phone,
    instructions: 'Leave at the door',
  },
  {
    id: 'MM-20140',
    placedAt: '26 Oct, 9:08 pm',
    pharmacyId: 'hf',
    lines: FigmaLines,
    payment: 'Cash on Delivery',
    speed: 'Standard',
    stage: 'delivered',
    rxNeeded: false,
    address: savedAddress.line,
    receiver: savedAddress.receiver,
    phone: savedAddress.phone,
    instructions: 'Leave with security',
  },
];

/** The pharmacy filling an order. */
export function orderPharmacy(order: Order) {
  return (
    pharmacyOptions.find((option) => option.id === order.pharmacyId) ?? pharmacyOptions[0]
  );
}

/** What the order comes to. */
export function orderTotal(order: Order): number {
  return checkoutTotals(order.lines, {
    deliveryFee: orderPharmacy(order).deliveryFee,
  }).total;
}

/** What the shopper saved on the order. */
export function orderSaving(order: Order): number {
  return checkoutTotals(order.lines).saving;
}

/** The price of one line. */
export { lineTotal };

/** The tabs on the orders screen. */
export const orderTabs = [
  { id: 'active', label: 'Active' },
  { id: 'delivered', label: 'Delivered' },
  { id: 'cancelled', label: 'Cancelled' },
  { id: 'all', label: 'All' },
] as const;

export type OrderTab = (typeof orderTabs)[number]['id'];

/** Which orders a tab shows. */
export function ordersInTab(list: Order[], tab: OrderTab): Order[] {
  if (tab === 'active') {
    return list.filter((order) => order.stage !== 'cancelled' && order.stage !== 'delivered');
  }
  if (tab === 'delivered') return list.filter((order) => order.stage === 'delivered');
  if (tab === 'cancelled') return list.filter((order) => order.stage === 'cancelled');
  return list;
}

/** The counts on the tabs. */
export function orderTabCounts(list: Order[]): Record<OrderTab, number> {
  return {
    active: list.filter((o) => o.stage !== 'cancelled' && o.stage !== 'delivered').length,
    delivered: list.filter((o) => o.stage === 'delivered').length,
    cancelled: list.filter((o) => o.stage === 'cancelled').length,
    all: list.length,
  };
}

/** A notification in the app. */
export type AppNotification = {
  id: string;
  title: string;
  /** The line under the title. */
  body: string;
  /** The small line on the right of the title. */
  time: string;
  /** What it is about. */
  kind: 'order' | 'prescription' | 'health' | 'offer';
  /** The glyph in the tile. */
  icon: 'rx-doc' | 'store' | 'bell' | 'gift';
  /** The action under it. */
  action?: string;
  /** The order it belongs to. */
  orderId?: string;
  /** It has not been read. */
  unread?: boolean;
};

/** The notifications on screen. */
export const notifications: AppNotification[] = [
  {
    id: 'n1',
    title: 'Your order is waiting for a prescription',
    body: 'HealthFirst Chemist · Order #MM-20341',
    time: 'Live',
    kind: 'prescription',
    icon: 'rx-doc',
    action: 'Verify prescription',
    orderId: 'MM-20341',
    unread: true,
  },
  {
    id: 'n2',
    title: 'Waiting for HealthFirst Chemist to confirm',
    body: 'HealthFirst Chemist · Order #MM-20341',
    time: '4:12 pm',
    kind: 'order',
    icon: 'store',
    action: 'Track order',
    orderId: 'MM-20341',
    unread: true,
  },
];

/** The tabs on the notifications screen. */
export const notificationTabs = [
  { id: 'all', label: 'All' },
  { id: 'orders', label: 'Orders' },
  { id: 'health', label: 'Health' },
  { id: 'offers', label: 'Offers' },
] as const;

export type NotificationTab = (typeof notificationTabs)[number]['id'];

/** Which notifications a tab shows. */
export function notificationsInTab(
  list: AppNotification[],
  tab: NotificationTab,
): AppNotification[] {
  if (tab === 'all') return list;
  if (tab === 'orders') return list.filter((item) => item.kind === 'order' || item.kind === 'prescription');
  return list.filter((item) => item.kind === tab);
}

/** The notifications a tab counts. */
export function notificationTabCounts(list: AppNotification[]): Record<NotificationTab, number> {
  return {
    all: list.length,
    orders: list.filter((item) => item.kind === 'order' || item.kind === 'prescription').length,
    health: list.filter((item) => item.kind === 'health').length,
    offers: list.filter((item) => item.kind === 'offer').length,
  };
}

/** The lines that tell the shopper what to check when the order arrives. */
export const whenItArrives = [
  'The pharmacy packs and seals your order. Check the seal is unbroken before you accept it.',
  'Match the medicines, strength and quantity with your bill, and check the expiry date on each pack.',
  'If the seal is broken or something is wrong, don’t accept or use it. Tell us.',
];

/** The note under the tracking screen. */
export const trackingNote =
  'Status updates come from the pharmacy as it confirms, packs and hands over to a rider. You can cancel at no charge until packing starts.';

/** The note under the orders list. */
export const ordersNote =
  'Every order is packed by a licensed pharmacy and checked by its registered pharmacist. Orders can be cancelled at no charge until packing starts.';

/** The note under the notifications list. */
export const notificationsNote =
  'Built from your own account: orders in progress, your prescriptions and your medicine schedule. Past orders are in My orders.';

/** The text on the cancel-order alert. */
export function cancelReason(order: Order, total: number): string {
  return `No cancellation charge: packing has not started. Nothing has been charged (${order.payment}). The ₹15 MedMate Money earned on this order is taken back.`;
}
