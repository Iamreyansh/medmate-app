import React from 'react';

import { ShopHomeScreen } from '../src/shop/ShopHomeScreen';

/**
 * The Shop section entry route.
 *
 * The bottom bar is part of the screen design (a floating pill rather than a
 * system tab bar), so the tab strip lives inside the screen and this route
 * simply renders it.
 */
export default function ShopRoute() {
  return <ShopHomeScreen />;
}
