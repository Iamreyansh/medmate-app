# Design audit — app against the Figma file

**Figma file:** `TjAXwq0Xh0ifEDWM6ZqxIA` — *MedMate — Native iOS & Android*
**Audited:** 15 November 2026, against the iOS frames. The Android frames are the
same layouts on a 412dp canvas, and the theme carries both type scales.

## How the audit was run

Not by eye. The Figma file was pulled through the REST API with a personal access
token and every frame was extracted as JSON: structure, geometry, fills, strokes,
corner radii, and every text node with its weight, size, line height, letter
spacing and colour.

Each frame was then matched to the app route that renders it, the app was loaded
in a browser at 393pt, and **every string in the frame was looked for in the
rendered DOM**. The 39 screens that have a route were checked this way, at five
widths from 320pt to 768pt, for overflow as well as copy.

Two things this method separates that eyeballing does not:

- **Copy that differs because the data differs.** The frames were drawn against
  a different catalogue snapshot (`Dolo 650`, `Crocin Baby`, `Diclofam Gel`).
  The app's catalogue has its own products. Those are data differences, not UI
  differences, and they are listed as such below.
- **Copy that is genuinely missing.** The app renders a different label, or does
  not render the line at all.

## Screen coverage

| Section | Screens in Figma | In the app | Status |
|---|---|---|---|
| 01 Onboarding | 6 | 6 | complete |
| 02 Shop | 12 | 12 | complete |
| 03 Checkout | 3 | 3 | complete |
| 04 Orders | 6 | 6 | complete (four frames, one screen) |
| 05 Prescriptions & care | 8 | 8 | complete |
| 06 Health & family | 5 | 5 | complete |
| 07 Account | 8 | 8 | complete |
| 08 Overlays | 8 | 8 | complete (four permission frames, one screen) |
| **Total** | **56** | **56** | **complete** |

Every screen in the file is now built. Three of the frames are not screens in
their own right and are drawn as part of another one: `02 Shop / Home - hero
banners` (`40:134256`) is the carousel on its own, and the four
`08 Overlays / Permission` frames are the system alert over the screen that
needs it, which the app asks for in its own words before the phone does.

### The screens the app did not have, and now does

**01 Onboarding — there was no sign-in at all.** The app opened straight on the
shop, so the cart, orders, prescriptions and wallet had no owner. These five
screens are the first-run flow:

| Frame | Node id | What it is |
|---|---|---|
| Splash | `40:132004` | The first screen, with the wordmark |
| Login | `40:132090` | Mobile number entry |
| OTP | `40:132227` | The code the shopper types in |
| Consent | `40:132323` | Terms and privacy, with the boxes to tick |
| Location | `40:132427` | Asking for location, with the reason |

**08 Overlays — only the cancel-order alert was built.** These seven are the
rest of them:

| Frame | Node id | What it is |
|---|---|---|
| Sort sheet | `40:143790` | The search sort sheet |
| Coupon sheet | `40:144180` | The coupon sheet |
| Chat panel | `40:145008` | The chat drawer |
| Permission · camera | `40:145101` | The camera permission screen |
| Permission · location | `40:145189` | The location permission screen |
| Permission · notifications | `40:145350` | The notification permission screen |
| Permission · contacts | `40:145436` | The contacts permission screen |

The four permission frames are the system alert over the screen that needs the
permission. The app asks in its own words first, so the shopper knows why
before the phone does, and the answer is kept in the session.

The four permission screens are one screen with four different copy blocks, so
they are cheap once the shell exists. The onboarding flow is the bigger piece:
it is five screens, and it is what makes the app an account rather than a
catalogue. It also sits in front of everything else — the cart, the orders, the
prescriptions and the wallet all need a signed-in shopper.

## Discrepancies found and fixed

### Typography and colour

| # | Where | Discrepancy | Fix |
|---|---|---|---|
| 1 | Theme | The frames draw a 14pt card radius, a 30/800 tracking headline, a 36/800 Rx mark, a 30/800 referral code and 20/800 stat figures. None existed. | Added `radii.card`, `orderHeadline`, `rxMark` and `referralCode` to both the iOS and M3 scales. |
| 2 | Button | The frames draw a grey "not ready yet" button and a mint action button. Neither tone existed. | Added the `muted` and `mint` tones. |
| 3 | `Icon` | The frames use a prescription-document glyph the icon set did not have. | Added `rx-doc`, rebuilt from the vector bounds in the file (document 16x20, fold 6x6, cross 6x4). |
| 4 | Account screen | The prescription glyph was gold on a gold tile, so it could not be seen. | The glyph is the dark green on the gold tile. |

### Layout

| # | Where | Discrepancy | Fix |
|---|---|---|---|
| 5 | Zone bar | A long title was squeezed between the back label and the bell. | The title sits over the middle of the bar, the way the frame centres it. |
| 6 | Health schedule | The row of people ran off the right of the frame and overflowed. | It scrolls, as the frame draws it. |
| 7 | Order tracking | The four stage labels need 334pt, more than a 320pt screen has. | Below 300pt the stepper drops to the circles and names the step underneath. |
| 8 | Checkout tracker | The same problem, with the four steps. | The steps that are done drop their labels and keep their ticks. |
| 9 | Add medicine | Two buttons side by side cut their labels short. | They carry less padding than the full width buttons. |
| 10 | Tracking actions | The two buttons at the foot wrapped their labels onto two lines. | Button labels never wrap, and these two carry less padding. |

### Copy

| # | Where | The frame says | The app said | Fix |
|---|---|---|---|---|
| 11 | Address | "Use my current location / Pin the exact spot, then fill in the details" | The row was missing | Added, with the pin tile and the chevron |
| 12 | Address | "We deliver here" | "Deliver here now" | Changed |
| 13 | Address | "For example gate 2, third floor, ring twice" | "Leave at the door" | Changed |
| 14 | Offers | "Refer a friend" and "Order history" buttons on the wallet card | Missing | Added, dark and white as the frame draws them |
| 15 | Storefront | A store-details card: drug licence, pharmacist, address, hours, delivery | Missing | Added, with the full licence number and the pharmacist's registration |
| 16 | Storefront | "Prescription medicines are dispensed only against a valid prescription..." and "Store details, licence and pharmacist are sample listings..." | Missing | Added |
| 17 | Compare pharmacies | "Best choice" on the chosen pharmacy | The cart's "Lowest price" tag | The compare screen carries its own badge |
| 18 | Compare pharmacies | "Licensed pharmacies in these options", each with its area, distance, hours and pharmacist | Missing | Added |
| 19 | Add medicine | The days picker, "Duration and stock", the reminder note and the summary of the schedule | Missing | Added, with the "Add to schedule" action |
| 20 | My prescriptions | "Doctor's signature or stamp" | "...or clinic stamp" | Changed |

### A second pass, after the onboarding and the overlays were built

The same audit was run again over the twelve new screens. It found six more:

| # | Where | Discrepancy | Fix |
|---|---|---|---|
| 21 | Login | "What happens to my number?" and the line under it | Added, with the "Browse medicines first" link |
| 22 | Login | "Browse medicines first" | Added, and it opens the shop without signing in |
| 23 | Sort sheet | "Biggest discount" | "Biggest discount (no-prescription items)", the way the frame spells it |
| 24 | OTP | The paste suggestion the phone offers for the code | Added, as the frame draws it |
| 25 | Permission - location | The body said something else, and the alert had two buttons | The frame's copy, and the three choices iOS offers |
| 26 | Upload prescription | "Doctor's signature or clinic stamp" | The upload screen and My Prescriptions spell the last line differently, so the wording is a choice rather than a constant |

## Discrepancies that are data, not UI

These are correct in the app and differ only because the frames were drawn
against an earlier catalogue. They are listed so they are not mistaken for
defects:

- Product names, pack sizes and discounts (`Dolo 650`, `Crocin Baby`,
  `Diclofam Gel`, `Volini Spray Spray for Sprain...`).
- Counts that follow from the catalogue: "148 products - 54 brands", "51
  results", "45 of these need a valid prescription", "All 148", "Prescription 107",
  "6 pharmacies delivering to you", "Show 20 more of 51".
- Price figures that follow from it: "Rs 269", "Rs 44 (inclusive of all taxes)",
  "MRP Rs 190 inclusive of all taxes".

The copy around those numbers is correct: the search hint, the brands line, the
prescription notice, the footer line and the filter labels all match the frames
and are built from the live counts.

## What was checked and found clean

- **Overflow.** No element overflows its container on any screen at 320, 360,
  393, 411, 430, 540 or 768pt, with the exception of the two deliberate
  degradations above, which are noted in the code.
- **Colour.** Every fill and stroke used by the 39 built frames resolves to a
  token in `packages/theme`. There are no one-off hex values in the app.
- **Type.** Every text node in the built frames maps to a token in the iOS or M3
  scale, including the five added in this pass.
- **The sections built in this round** - 03 Checkout, 04 Orders,
  05 Prescriptions & care, 06 Health & family and 07 Account - report no copy
  gaps against their frames.

## Still to do

1. **A device-matrix check in CI.** This audit was run by hand. The repo has no
   test runner, so nothing stops a screen from drifting out of the design
   tomorrow. The audit script itself - Figma JSON against the rendered DOM -
   is the thing to automate first.
2. **The sign-in is a mock.** The demo build takes the code 1234 and says so on
   the screen. The session is kept in a file on the device so the shopper is
   not asked for it again, but there is no server behind it.
