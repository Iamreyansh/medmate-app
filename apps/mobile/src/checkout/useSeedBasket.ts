import { useEffect } from 'react';

import { catalogue } from '../data/catalogue';
import { useCart } from '../state/cart';

/**
 * The basket the checkout screens are drawn with.
 *
 * The Figma `03 Checkout` frames are drawn with a full basket: two Moov
 * gels, a Dettol and a prescription medicine. The mock catalogue has no
 * backend, so the screens open with that basket so they can be seen as
 * designed. Once the shopper empties it the flag stays set and the screens
 * show an empty basket instead.
 */
const SAMPLE_BASKET = [
  { id: 'moov-gel', quantity: 2 },
  { id: 'dettol-liquid', quantity: 1 },
  { id: 'DRS_TELMAR', quantity: 1 },
];

/** The basket is seeded once per session. */
let seeded = false;

/**
 * Put the sample basket in the cart the first time a checkout screen opens.
 */
export function useSeedBasket() {
  const cart = useCart();

  useEffect(() => {
    if (seeded) return;
    seeded = true;
    if (cart.lines.length > 0) return;

    for (const entry of SAMPLE_BASKET) {
      const product = catalogue.find((item) => item.id === entry.id);
      if (!product) continue;
      cart.add({
        id: product.id,
        name: product.name,
        sub: product.sub,
        price: product.price,
        mrp: product.mrp,
        off: product.off,
        rx: product.rx,
        quantity: entry.quantity,
      });
    }
    // The basket is only seeded once, so this never runs again.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
