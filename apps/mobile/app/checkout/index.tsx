import React from 'react';
import { useRouter } from 'expo-router';

import { CheckoutScreen } from '../../src/checkout/CheckoutScreen';
import { useCart } from '../../src/state/cart';
import { useCheckout } from '../../src/state/checkout';
import { useNotice } from '../../src/state/notice';
import { useOrders } from '../../src/state/orders';
import { savedAddress } from '../../src/checkout/data';

/**
 * The checkout route.
 *
 * The cart is the first step of the checkout. The other steps live on their
 * own routes: the pharmacy comparison and the order confirmation.
 */
export default function CheckoutRoute() {
  const router = useRouter();
  const notice = useNotice();
  const cart = useCart();
  const checkout = useCheckout();
  const orders = useOrders();

  /** Put the basket on the orders list so it can be tracked. */
  const placeOrder = () => {
    const id = `MM-${20341 + orders.orders.length}`;
    orders.placeOrder({
      id,
      placedAt: 'Today, 4:12 pm',
      pharmacyId: checkout.pharmacyId,
      lines: cart.lines,
      payment:
        checkout.paymentId === 'cod'
          ? 'Cash on Delivery'
          : checkout.paymentId === 'upi'
            ? 'UPI'
            : 'Card',
      speed: checkout.speedId === 'standard' ? 'Standard' : checkout.speedId === 'express' ? 'Express' : 'Scheduled',
      stage: 'waiting',
      rxNeeded: cart.lines.some((line) => line.rx),
      address: checkout.address,
      receiver: savedAddress.receiver,
      phone: savedAddress.phone,
      instructions: checkout.instructions,
    });
    router.push({ pathname: '/checkout/success', params: { id } });
  };

  return (
    <CheckoutScreen
      onBack={() => router.back()}
      onHelp={() => notice.notify('Help and support is one tap away')}
      onComparePharmacies={() => router.push({ pathname: '/checkout/pharmacies' })}
      onChangeAddress={() => router.push({ pathname: '/address' })}
      onAddItems={() => router.push({ pathname: '/new-arrivals' })}
      onAddPrescription={() => notice.notify('Upload a prescription to unlock Rx medicines')}
      onInstructions={() => router.push({ pathname: '/address' })}
      onPlaceOrder={placeOrder}
    />
  );
}
