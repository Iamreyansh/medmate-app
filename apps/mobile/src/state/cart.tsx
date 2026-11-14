import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

/**
 * The cart.
 *
 * The mock catalogue has no backend, so the cart lives in memory for the
 * session. Both screens read the same store, which is what makes the count on
 * the cart bar agree with the ADD buttons on the home screen.
 */

export type CartLine = {
  id: string;
  name: string;
  price: number;
};

export type CartContextValue = {
  /** How many items are in the cart. */
  count: number;
  /** The lines in the cart. */
  lines: CartLine[];
  /** Add a product to the cart. */
  add: (line: CartLine) => void;
  /** Remove a product from the cart. */
  remove: (id: string) => void;
  /** Empty the cart. */
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  const add = useCallback((line: CartLine) => {
    setLines((current) => {
      const existing = current.find((entry) => entry.id === line.id);
      // A product already in the cart is not added twice.
      return existing ? current : [...current, line];
    });
  }, []);

  const remove = useCallback((id: string) => {
    setLines((current) => current.filter((entry) => entry.id !== id));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartContextValue>(
    () => ({ count: lines.length, lines, add, remove, clear }),
    [lines, add, remove, clear],
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
