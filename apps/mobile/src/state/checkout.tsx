import React, { createContext, useContext, useMemo, useState } from 'react';

/**
 * The checkout choices.
 *
 * The cart, the compare screen and the order confirmation are three steps of
 * one flow, so the choices the shopper makes on one of them have to survive
 * the move to the next. They live in memory for the session, like the cart.
 */

export type CheckoutContextValue = {
  /** The pharmacy the order is filled by. */
  pharmacyId: string;
  /** Choose the pharmacy the order is filled by. */
  setPharmacyId: (id: string) => void;
  /** The delivery speed. */
  speedId: string;
  /** Choose the delivery speed. */
  setSpeedId: (id: string) => void;
  /** The payment method. */
  paymentId: string;
  /** Choose the payment method. */
  setPaymentId: (id: string) => void;
  /** The coupon that has been applied. */
  couponId?: string;
  /** Apply a coupon, or clear it with `undefined`. */
  setCouponId: (id?: string) => void;
  /** What to do when a pharmacy cannot supply an item. */
  unavailableId: string;
  /** Choose what happens when an item is unavailable. */
  setUnavailableId: (id: string) => void;
  /** How the prescription is handled. */
  prescriptionId: string;
  /** Choose how the prescription is handled. */
  setPrescriptionId: (id: string) => void;
  /** The instructions left for the rider. */
  instructions: string;
  /** Change the instructions left for the rider. */
  setInstructions: (value: string) => void;
  /** The address the order goes to. */
  address: string;
  /** Change the address the order goes to. */
  setAddress: (value: string) => void;
};

const CheckoutContext = createContext<CheckoutContextValue | null>(null);

export function CheckoutProvider({ children }: { children: React.ReactNode }) {
  const [pharmacyId, setPharmacyId] = useState('hf');
  const [speedId, setSpeedId] = useState('standard');
  const [paymentId, setPaymentId] = useState('cod');
  const [couponId, setCouponId] = useState<string | undefined>(undefined);
  const [unavailableId, setUnavailableId] = useState('call');
  const [prescriptionId, setPrescriptionId] = useState('consult');
  const [instructions, setInstructions] = useState('Leave at the door');
  const [address, setAddress] = useState(
    'Flat 302, Sri Sai Residency, 7th Cross, Jayanagar 4th Block · 560011',
  );

  const value = useMemo<CheckoutContextValue>(
    () => ({
      pharmacyId,
      setPharmacyId,
      speedId,
      setSpeedId,
      paymentId,
      setPaymentId,
      couponId,
      setCouponId,
      unavailableId,
      setUnavailableId,
      prescriptionId,
      setPrescriptionId,
      instructions,
      setInstructions,
      address,
      setAddress,
    }),
    [
      pharmacyId,
      speedId,
      paymentId,
      couponId,
      unavailableId,
      prescriptionId,
      instructions,
      address,
    ],
  );

  return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>;
}

/** The checkout choices. */
export function useCheckout(): CheckoutContextValue {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error('useCheckout must be used inside a CheckoutProvider');
  }
  return context;
}
