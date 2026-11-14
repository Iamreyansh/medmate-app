# MedMate — native app (Shop section)

React Native + Expo app for the MedMate D2C storefront, built screen by screen
against the Figma design system.

## What is in this build

| Screen | Status |
| --- | --- |
| **Shop › Home** (`app/index.tsx` → `src/shop/ShopHomeScreen.tsx`) | Implemented, iOS + Android variants |
| **Shop › Search results** (`app/search/index.tsx` → `src/shop/search/SearchScreen.tsx`) | Implemented, iOS + Android variants |
| **Shop › Search, no results** (`app/search/no-results.tsx` → `src/shop/search/SearchEmptyScreen.tsx`) | Implemented, iOS + Android variants |
| **Shop › Category** (`app/category/[slug].tsx` → `src/shop/category/CategoryScreen.tsx`) | Implemented, iOS + Android variants |
| **Shop › Health store** (`app/care/[slug].tsx` → `src/shop/care/HealthStoreScreen.tsx`) | Implemented, iOS + Android variants |
| **Shop › New arrivals** (`app/new-arrivals.tsx` → `src/shop/newarrivals/NewArrivalsScreen.tsx`) | Implemented, iOS + Android variants |
| **Shop › Product (OTC)** (`app/product/[id].tsx` → `src/shop/product/ProductScreen.tsx`) | Implemented, iOS + Android variants |
| **Shop › Product (Rx)** (`app/product/[id].tsx` → `src/shop/product/ProductScreen.tsx`) | Implemented, iOS + Android variants |
| **Shop › Pharmacies** (`app/pharmacies/index.tsx` → `src/shop/pharmacies/PharmaciesScreen.tsx`) | Implemented, iOS + Android variants |
| **Shop › Pharmacy storefront** (`app/pharmacies/[id].tsx` → `src/shop/pharmacies/PharmacyStorefrontScreen.tsx`) | Implemented, iOS + Android variants |
| **Shop › Offers** (`app/offers.tsx` → `src/shop/offers/OffersScreen.tsx`) | Implemented, iOS + Android variants |

The Shop home screen is the entry point of the Shop section: the brand zone
(delivery promise, health day, search, service tabs, hero carousel), then the
content sections (categories, order again, coupons, health stores, today's
deals, seasonal picks, pharmacies, care blocks, lab tests, care corners, best
offers, everyday essentials), then the partner block and the footer, with the
floating bottom chrome pinned to the viewport.

## Layout

```
packages/theme/src        design tokens (colour, type, spacing, elevation, platform)
apps/mobile/src/icons     icon set + the SVG renderer
apps/mobile/src/ui        typed text and the shared primitives
apps/mobile/src/shop      the Shop screens, one folder per screen
apps/mobile/src/data      catalogue.ts (the mock products) + the screen content
apps/mobile/src/state     the cart store and the notice store
apps/mobile/app           expo-router routes
```

### Routes

| Route | Screen |
| --- | --- |
| `/` | Shop home |
| `/search?q=paracetamol` | Search results (falls through to the empty state when nothing matches) |
| `/search/no-results` | The empty state on its own |
| `/category/fever-pain` | A category, with the prescription, price and brand filters |
| `/care/ortho-pain-care` | A health store - ortho, baby, women's, diabetes, heart, elderly |
| `/new-arrivals` | The newest products, with a filter per category |
| `/product/moov-gel` | A product page - the same screen serves OTC and Rx |
| `/pharmacies` | The stores that deliver, with the categories and the filters |
| `/pharmacies/healthfirst-chemist` | A single store and the products on its shelves |
| `/offers` | The rewards balance, the coupons and how the rules work |

### The mock data

`src/data/catalogue.ts` holds every product once. The home screen rails, the
search results and the filter counts all read from it, so a product added
there appears everywhere at once and the counts always describe the results
that are on screen.

The search screen runs a real query over the catalogue: typing `dolo` returns
Dolo 650, typing `cetaphil` returns the Cetaphil products, and a query that
matches nothing falls through to the empty state.

The category screen filters the same catalogue by prescription status, price
band and brand, and counts what is left, so the chips always agree with the
products below them.

The health stores are curated shelves of the same catalogue - ortho care, baby
care, women's health, diabetes, heart and elderly care - and the new arrivals
are the newest products on it.

Every value comes from `@medmate/theme`. A hex literal inside a screen is a
bug - the tokens mirror the Figma colour variables and type scales exactly.

## Run it locally

```bash
npm install                     # from the repository root
npm run ios                     # or: npm run android, npm run web
```

Metro serves on <http://localhost:8081>. Scan the QR code with Expo Go, or
press `i` / `a` for a simulator.

## Build for manual testing

```bash
cd apps/mobile

# iOS preview build (TestFlight or install on a device)
npx eas-cli build --platform ios --profile preview

# Android preview build (APK, install on a device)
npx eas-cli build --platform android --profile preview

# Local simulator build, no EAS account needed
npx expo run:ios
npx expo run:android
```

EAS needs `expo login` once and a project id. Add one with
`npx eas-cli init` (it writes `extra.eas.projectId` into `app.json`).

## Platform metrics

iOS and Android differ in field sizes, chip shapes and type scale. The tokens
live in `packages/theme/src/platform.ts` and switch on the running platform.
The web preview mirrors the iOS design; set `EXPO_PUBLIC_PLATFORM=android` to
check the Material metrics in a browser.

## Verify the design

```bash
npm run typecheck              # tsc --noEmit across the workspaces
npm run lint                   # eslint (flat config, eslint-config-expo)
npm run format:check           # prettier
```

## Notes and open items

- **Product photos** are placeholders for now. The art tile uses the mint
  gradient from the design and falls back to the product initials - the same
  treatment the Figma file uses when a photo is missing. Drop the real images
  into `apps/mobile/assets` and pass them to `ArtTile` as `photo`.
- **The system status bar** is drawn by the OS, not by the app, so the brand
  zone uses the real safe-area inset instead of the Figma's 54pt mock.
- **Prescription items** show the selling price only - never a struck MRP and
  never a discount. `PriceRow` in `src/shop/sections.tsx` enforces this, and
  the copy in the banners says so. On the product page the same rule holds:
  the Rx layout drops the discount tab, the savings tag and the struck price,
  and adds the red prescription notice and the "Prescription required" block
  instead.
- The bottom bar is part of the screen (a floating pill rather than a system
  tab bar), so it lives in `src/shop/BottomChrome.tsx`.
- The search results screen closes with a **cart bar** (free-delivery goal plus
  the cart button), which is a separate component from the tab bar.
- The sort sheet on the search screen is not drawn in the Figma file yet; it
  follows the surfaces used elsewhere in the app.
- The cart and the notice are in memory for the session - there is no backend
  yet. `src/state/cart.tsx` and `src/state/notice.tsx` are the seam to swap
  for the API.
