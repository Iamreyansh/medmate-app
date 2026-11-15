import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { initialsOf } from '../data/catalogue';

/**
 * The cart.
 *
 * The mock catalogue has no backend, so the cart lives in memory for the
 * session. Both screens read the same store, which is what makes the count on
 * the cart bar agree with the ADD buttons on the home screen.
 *
 * A line carries the quantity the shopper chose. The checkout screen shows
 * the line total next to the pack price and the saving against the MRP, so
 * the totals in the bill can be worked out from the cart alone.
 */

export type CartLine = {
  id: string;
  name: string;
  /** Pack size and composition. */
  sub: string;
  /** Selling price of one pack, in rupees. */
  price: number;
  /** Maximum retail price. Never set for prescription items. */
  mrp?: number;
  /** Discount percentage. Never set for prescription items. */
  off?: number;
  /** Prescription item: price only, no strike-through, no discount. */
  rx?: boolean;
  /** One or two letters for the photo tile. */
  initials: string;
  /** How many packs are in the basket. */
  quantity: number;
};

/**
 * What a caller hands over when it puts something in the cart.
 *
 * Everything the checkout needs is optional, so an ADD button only has to
 * know the product.
 */
export type CartDraft = {
  id: string;
  name: string;
  price: number;
  sub?: string;
  mrp?: number;
  off?: number;
  rx?: boolean;
  initials?: string;
  quantity?: number;
};

export type CartContextValue = {
  /** How many packs are in the cart. */
  count: number;
  /** The lines in the cart. */
  lines: CartLine[];
  /** Add a product to the cart. */
  add: (line: CartDraft) => void;
  /** Remove a product from the cart. */
  remove: (id: string) => void;
  /** Set how many packs of a product are in the cart. */
  setQuantity: (id: string, quantity: number) => void;
  /** Empty the cart. */
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  const add = useCallback((draft: CartDraft) => {
    setLines((current) => {
      const existing = current.find((entry) => entry.id === draft.id);
      // A product already in the cart is not added twice.
      if (existing) return current;
      return [
        ...current,
        {
          id: draft.id,
          name: draft.name,
          sub: draft.sub ?? '',
          price: draft.price,
          mrp: draft.mrp,
          off: draft.off,
          rx: draft.rx,
          initials: draft.initials ?? initialsOf(draft.name),
          quantity: draft.quantity ?? 1,
        },
      ];
    });
  }, []);

  const remove = useCallback((id: string) => {
    setLines((current) => current.filter((entry) => entry.id !== id));
  }, []);

  const setQuantity = useCallback((id: string, quantity: number) => {
    setLines((current) =>
      current
        .map((entry) =>
          entry.id === id ? { ...entry, quantity: Math.max(0, Math.round(quantity)) } : entry,
        )
        // A line taken down to zero leaves the basket.
        .filter((entry) => entry.quantity > 0),
    );
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartContextValue>(
    () => ({
      count: lines.reduce((total, line) => total + line.quantity, 0),
      lines,
      add,
      remove,
      setQuantity,
      clear,
    }),
    [lines, add, remove, setQuantity, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/** The cart store. */
export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used inside a CartProvider');
  }
  return context;
}
