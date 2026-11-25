# MedMate — iOS vs Android design comparison

**Figma file:** `TjAXwq0Xh0ifEDWM6ZqxIA` — *MedMate — Native iOS & Android* (version `2421003658120417352`)
**Pages compared:** `1:4 iOS` (8 sections) and `1:5 Android` (8 sections), plus the `0:1 Design system` page
**Date:** 15 November 2026

---

## 1. Method

The file was pulled through the Figma REST API and every node was extracted as JSON — geometry, fills, strokes, corner radii, auto-layout properties, and every text node with its family, weight, size, line height, letter spacing, case and alignment.

Frames were paired by their path after the platform prefix (`iOS / 02 Shop / Home` ↔ `Android / 02 Shop / Home`). All **57 frames pair one-to-one**: there is no screen on one platform that the other lacks. Vectors were matched by their parent path and ordinal within that parent; text nodes by parent path plus node name and text content. Counts below are node counts across the whole file unless stated otherwise.

The file itself documents the intent on the `Design system` page, under a "Platform rules" table: *"Brand is identical on both platforms; each platform gets its own system chrome, navigation patterns, controls and sizes so engineers can build natively."* Everything recorded below is what the frames actually draw.

---

## 2. Frame inventory and canvas

| | iOS | Android |
|---|---|---|
| Page | `1:4 iOS` | `1:5 Android` |
| Sections | 8 (`01 Onboarding` … `08 Overlays`) | 8 (same names) |
| Frames | 57 | 57 |
| Device frame | iPhone 15 / 16 — **393 × 852 pt** | Pixel 8 / compact — **412 × 915 dp** |
| Status bar | 54 pt, Dynamic Island | 24 dp, left clock, camera cutout |
| Top bar | Nav bar: 96 pt large / 44 pt inline | Top app bar (M3): 152 dp large / 64 dp small |
| Bottom nav | Tab bar 49 pt + 34 pt home indicator | Navigation bar 80 dp + 24 dp gesture handle |
| Side margin | 16 pt | 16 dp |
| Touch target | 44 × 44 pt | 48 × 48 dp |
| Font | Outfit | Outfit (M3 scale) |
| Brand | identical tokens, identical photos | identical tokens, identical photos |

Frame heights differ on 56 of the 57 pairs (only `02 Shop / Home` is identical in height at 7 944). The largest divergences: `01 Onboarding / Address add/edit` −210 dp, `06 Health & family / Add medicine` −144 dp, `07 Account / Partner` −139 dp, `07 Account / Account` **+135 dp**, `05 Prescriptions & care / Consultation info` −122 dp, `07 Account / Profile` −116 dp, `05 Prescriptions & care / My prescriptions` −110 dp, `05 Prescriptions & care / Request a medicine` −102 dp.

---

## 3. Typography

### 3.1 Font family

Both platforms use **Outfit** exclusively. No text node on either platform uses another family. Weights available on both: 400, 500, 600, 700, 800.

Weight distribution differs because of the scales, not the family:

| Weight | iOS nodes | Android nodes |
|---|---|---|
| 400 | 478 | 368 |
| 500 | 665 | 795 |
| 600 | 1700 | 1605 |
| 700 | 273 | 314 |
| 800 | 413 | 405 |

### 3.2 The two type scales (from the `Design system` page)

**iOS scale — "iOS type scale · Outfit" (22 tokens)**

| Token | Spec |
|---|---|
| Large Title | 34 / 41, w700, ls −0.34 |
| Title 1 | 28 / 34, w700, ls −0.42 |
| Large Title Heavy | 34 / 41, w800, ls −0.68 |
| Title 2 | 22 / 28, w700, ls −0.22 |
| Title 3 | 20 / 25, w600, ls −0.1 |
| Headline | 17 / 22, w600, ls −0.085 |
| Body | 17 / 22, w400 |
| Callout Emphasized | 16 / 21, w600 |
| Subheadline | 15 / 20, w400 |
| Subheadline Emphasized | 15 / 20, w600 |
| Footnote | 13 / 18, w400 |
| Footnote Emphasized | 13 / 18, w600 |
| Caption 1 | 12 / 16, w500 |
| Caption 2 | 11 / 13, w600 |
| Eyebrow | 11 / 13, w700, ls 0.66, UPPER |
| Price | 17 / 22, w800 |
| Amount | 20 / 25, w800, ls −0.1 |
| Button | 17 / 22, w600 |
| Button Small | 15 / 20, w600 |
| Tab Label | 10 / 12, w500 |
| Tag | 10 / 13, w800 |
| Status Bar Time | 17 / 22, w600 |

**Android scale — "Android M3 type scale · Outfit" (22 tokens)**

| Token | Spec |
|---|---|
| Display S | 36 / 44, w800, ls −0.72 |
| Headline M | 28 / 36, w700, ls −0.28 |
| Headline S | 24 / 32, w700, ls −0.24 |
| Title L | 22 / 28, w700, ls −0.11 |
| Title L Medium | 20 / 28, w600 |
| Title M | 16 / 24, w600 |
| Body L | 16 / 24, w400 |
| Body L Emphasized | 16 / 24, w500 |
| Body M | 14 / 20, w400 |
| Body S | 12 / 16, w400 |
| Body S Medium | 12 / 16, w500 |
| Label L | 14 / 20, w600 |
| Label M | 12 / 16, w600 |
| Label S | 11 / 16, w600 |
| Overline | 11 / 16, w700, ls 0.88, UPPER |
| Price | 16 / 24, w800 |
| Amount | 20 / 28, w800 |
| Label L Button | 14 / 20, w600, ls 0.14 |
| Label M Button | 12 / 16, w600, ls 0.12 |
| Label M Nav | 12 / 16, w600 |
| Tag | 10 / 14, w800 |
| Status Bar Time | 14 / 20, w500 |

The token vocabularies do not map one-to-one: iOS has *Callout Emphasized*, *Subheadline*, *Subheadline Emphasized*, *Footnote*, *Footnote Emphasized*, *Caption 1/2*, *Button Small*, *Tab Label*; Android has *Display S*, *Headline S*, *Title L Medium*, *Body L Emphasized*, *Body S Medium*, *Label M*, *Label L Button*, *Label M Button*, *Label M Nav*. Both have *Title L/Title 2*, *Price*, *Amount*, *Tag*, *Status Bar Time*, an uppercase eyebrow token and a 20 pt amount. Both scales carry 22 tokens.

### 3.3 Measured typography differences on the 57 paired screens

Text nodes whose style differs between platforms, grouped by the attributes that changed:

| Nodes | Attributes that differ | Most common value change |
|---|---|---|
| 640 | lineHeight + size | 13/18 → 12/16 (558×) |
| 342 | size only | 15 → 14 |
| 270 | lineHeight only | 13 → 16 (183×), 13 → 14 (87×) |
| 228 | letterSpacing + lineHeight + size | 17/22 ls −0.085 → 16/24 ls 0 (121×) |
| 113 | lineHeight + size + weight | 17/22 400 → 14/20 600 (35×); 13/18 400 → 14/20 600 (30×); 13/18 600 → 12/16 500 (29×); 10/12 500 → 12/16 600 (18×) |
| 92 | letterSpacing + lineHeight | ls 0.66 → 0.88 (73×, eyebrow); ls −0.1 → 0 with lh 25 → 28 (19×) |
| 62 | lineHeight + weight | 16/21 600 → 16/24 500 |
| 56 | align + lineHeight + size + weight | CENTER → LEFT, 17/22 600 → 14/20 500 |
| 53 | letterSpacing | −0.22 → −0.11 |
| 32 | align + letterSpacing + lineHeight + size + weight | CENTER → LEFT, 17/22 600 → 22/28 700 |
| 3 | letterSpacing + lineHeight + maxLines + size | 34/41 700 maxLines 1 → 28/36 700 maxLines 2 |
| 3 | letterSpacing + lineHeight + size + weight | 17/22 600 → 22/28 700 (2×); 17/22 → 24/32 (1×) |
| 1 | align + lineHeight + size | CENTER → LEFT, 13/18 → 14/20 |

### 3.4 Alignment, case and wrapping

- **Text alignment: 89 nodes go from CENTER on iOS to LEFT on Android** (56 + 32 + 1). These are screen headers and titles, e.g. `01 Onboarding / Splash`, `01 Onboarding / Login`, `02 Shop / Home`, `02 Shop / Category`.
- **Uppercase eyebrow tracking**: iOS ls 0.66 → Android ls 0.88 on 73 nodes; the eyebrow token also changes weight pairing (iOS 11/13 w700 → Android 11/16 w700).
- **Negative tracking on display type** is looser on iOS: −0.34 → −0.11 (53 nodes), −0.42 → −0.24 (30 nodes), −0.68 → −0.72 on the 34/41 token in 2 nodes.
- **Line height is looser on Android for small text** (13 → 16, 13 → 14) and tighter for medium text (22 → 20).
- **Wrapping**: 3 nodes allow 2 lines on Android where iOS allows 1 (`04 Orders / My orders`, `04 Orders / Notifications`, `07 Account / Account`).
- **Status bar time**: iOS 17/22 w600 centred (54 × 22) vs Android 14/20 w500 left-aligned (25 × 20).

---

## 4. Iconography

### 4.1 Volume and shared set

| | iOS | Android |
|---|---|---|
| VECTOR nodes | 2 938 | 2 658 |

The file's design-system page states: *"52 line icons from `src/lib/icons.ts` as components. Screens use instances; swap with the Icon property."* The icon vocabulary is shared; the difference in vector count comes from platform chrome (status bar, top bar, bottom bar) and from component substitutions (section 5).

### 4.2 Scale and stroke weight

Of the matched vectors, **1 985 keep an identical width**. About 250 are enlarged on Android:

| Android / iOS width ratio | Vectors |
|---|---|
| 1.000 | 1 985 |
| 1.048 | 25 (frame-width driven: map areas, full-bleed blocks) |
| 1.222 | 64 |
| 1.223 | 15 |
| 1.250 | 41 |
| 1.251 | 6 |
| 1.286 | 24 |
| 1.333 | 64 |
| 1.334 | 8 |

Stroke weights are mostly identical, but a consistent subset is heavier on Android:

| iOS stroke | Android stroke | Vectors |
|---|---|---|
| 1.35 | 1.65 | 84 |
| 1.20 | 1.50 | 57 |
| 1.05 | 1.35 | 24 |
| 1.35 | 1.80 | 16 |

Examples of the enlarged/heavier set: the disclosure chevron in `07 Account / Account` rows (13.5 × 15 → 16.5 × 18.33), the leading icon in `07 Account / Account` and `07 Account / Legal` rows (12 × 15 → 14.67 × 18.33), the pharmacy badge in `03 Checkout / Compare pharmacies` (4 × 8 → 5 × 10), the search glyph (12 × 12 → 16 × 16) and the clear/search glyph (8 × 17 → 16 × 0).

### 4.3 Platform status bar glyphs

| | iOS | Android |
|---|---|---|
| Container | `Status bar` instance, 393 × 54 | `Status bar` instance, 412 × 24 |
| Vector count | 10 | 4 |
| Time | 54 × 22, centred | 25 × 20, left |
| Icons | Cellular 18 × 12, Wi-Fi 16 × 12, Battery 27 × 13 | Wi-Fi 17 × 14, Cellular 16 × 16, Battery 9 × 15 |
| Cutout | Dynamic Island rectangle 126 × 37, r20 | Camera cutout ellipse 12 × 12 |
| Padding | padL 50, padR 26, padT 4 | padL 16, padR 16 |

iOS battery glyph 22 × 12 → Android 25 × 4 (different shapes); iOS cellular 3 × 4 → Android 17 × 13.4.

### 4.4 Icon colour differences

- Search-bar glyph stroke: `#65726B` (neutral/muted) → `#3B4842` (neutral/ink-2), 16 nodes.
- `02 Shop / Search no results` clear glyph stroke: `#9AA59F` → `#3B4842`, 3 nodes.
- Status-bar vectors on dark brand zones: iOS `#000000` → Android `#14201A` (16 nodes); iOS `#FFFFFF` fill → no fill on Android (96 nodes).

---

## 5. Component architecture

### 5.1 System chrome

| Concern | iOS | Android | Screens affected |
|---|---|---|---|
| Top bar component | `Nav bar` instance | `Top app bar` instance | 35 each |
| Back affordance | Chevron 12 × 21 **plus the previous screen's title** ("Account", "Home", "Product", "Location"…) | Circular 48 × 48 touch target, r999, containing a 24 × 24 `Arrow back` (16 × 0 + 6 × 12 vectors) — **no title** | 35 |
| Title placement | Centred, `Title` 200 × 22, 17/22 w600, ls −0.085, CENTER | Left-aligned next to the back button, 300 × 28, 22/28 w700, ls −0.11, LEFT | all bars |
| Trailing action | Text "Help" 17/22 w400 **and** a 32 × 32 bell icon (18 × 18 glyph) | 48 × 48 action slot with text "Help" 14/20 w600 — **no bell icon** | all bars |
| Bottom bar component | `Tab bar` instance (102 pt: 68 footer + 34 home indicator) | `Navigation bar` instance (92 dp: 68 footer + 24 gesture handle) | 6 each |
| Floating footer | Bar 301 × 56 r22 + Chat tile 60 × 56 r20 | Bar 320 × 56 r22 + Chat tile 60 × 56 r20 | 6 |
| System gesture element | `Home indicator` 393 × 34, bar 134 × 5 r3 | `Gesture handle` 412 × 24, handle 108 × 4 r2 | 58 each |
| Status bar | 54 pt | 24 dp | 56 each |

### 5.2 Buttons

| | iOS | Android |
|---|---|---|
| Component caption | "Large 50 pt (rounded 14) and small capsule 34 pt" | "M3: filled, outlined, tonal and text. 48 dp large and 40 dp small; full radius" |
| Large button height | 50 | 48 |
| Small button | 34, capsule | 40, full radius |
| Corner radius | 14 (rounded rectangle) | 999 (pill) — 49 buttons matched |
| Horizontal padding | 20 | 24 |
| Width (action bar) | 359 × 50 | 378 × 48 |
| Width (paired button) | 156.5 × 50 ("Take photo") | 166.5 × 48 |

The radius inversion is the single largest shape difference: **iOS buttons are rounded rectangles (r14) while Android buttons are fully rounded pills (r999)**, while the reverse happens on filter pills (§5.3).

### 5.3 Inputs and selection controls

| Control | iOS | Android |
|---|---|---|
| Text input | `Text field` (8 on Address add/edit) | `Filled text field` + `Input row` (8 pairs) |
| Checkbox | `Selected` / `Unselected`, 22 × 22, r999, gold `icon/check` | `Checkbox on` / `Checkbox off`, 18 × 18, r2 |
| Radio | `Selected` + `icon/check` 14 × 14 | `Radio on` / `Radio off` + `Dot` |
| Filter chip | `Filter · …` capsule, r999, 34 pt tall, gap 6, padding 14/14 | M3 `Chip`, r8, 32 dp tall, gap 8, padding 16/16 |
| Quantity stepper | 81 × 32, r9 | 81 × 36, r999 |
| Switch | 51 × 31 | 52 × 32 (Material 3, check on the handle) |
| Icon tile | 44 × 44, r10 | 44 × 44, r12 (32 × 32 variant becomes 40 × 40) |
| Segmented control | `Segmented control`, 32 pt tall, `Segment · …` | `Segmented buttons`, 40 dp tall (Category, Add medicine, Family member, Schedule) |
| Tabs | `Segmented control` on the product pages | `Tabs` 47 dp with 4 `Indicator` nodes (Product OTC/Rx, My orders, Notifications) |

Filter chips invert the button rule: **iOS filter pills are capsules (r999, 118 matched nodes) while Android M3 chips are 8 dp rounded rectangles (r8)**.

### 5.4 Sheets, dialogs and alerts

| | iOS | Android |
|---|---|---|
| Component | `System alert · …` (UIAlertController) | `Permission dialog · …` (M3 basic dialog) |
| Size | 270 × 161, r14 | 312 × 324, r28 |
| Structure | Centred Title 17/22 w600 + Message 13/18 w400, 1 px divider, two 134 × 44 action cells side by side (`Secondary` "Don't Allow" / `Primary` "Allow", 1 px rule between) | Optional 28 × 28 icon, headline 22/28 w700 ls −0.11, three 264 × 48 option rows (r999) stacked |
| Actions | 2 (side by side) | 3 (stacked text options) |
| Bottom sheet | `Sheet · …`, grabber, 393 wide, top corners (16, 16, 0, 0) | `Sheet · …`, drag handle, 412 wide, top corners (28, 28, 0, 0) |
| Sheet height (Sort) | 347 | 394 |
| Cancel-order dialog | `Cancel Order` / `Keep Order`, Title/Confirm/Dismiss naming | `Cancel order` / `Keep order` |
| Snackbar | Not present — iOS uses top banners for toasts | `Snackbar`: bottom, inset 16 dp, forest inverse surface with a gold action, 380 × 48 |

### 5.5 Keyboard (OTP)

| | iOS | Android |
|---|---|---|
| Component | `Keyboard` instance 393 × 289 | `Gboard number pad` 198 × 310 |
| Suggestion | `Suggestion bar` 393 × 44 with `From Messages` + code `1234` (15/20 w600) | `Autofill strip` 182 × 30 with a 18 × 18 chat icon, `From Messages` (12/16 w500) and a pill `Autofill chip` (r999) holding `1234` (14/20 w600) |
| Keys | 12 keys 123 × 46, r5, digits 25/28 w700 ls −0.375, letter groups (ABC…WXYZ) 10/13 w800 | 9 keys 55 × 52, r999, digits 22/28 w700 ls −0.11, no letter groups |
| Bottom row | `Blank` + `Key 0` + `Delete` (24 × 18 `Delete glyph`) | `Key ⌫` (text glyph) |
| System gesture | `Home indicator` 393 × 34 | `Gesture handle` 182 × 24 |

### 5.6 Screen-by-screen structural deltas

Only the elements that exist on one platform only:

| Screen | iOS only | Android only |
|---|---|---|
| `01 Onboarding / Address add/edit` | Dynamic Island, Home indicator, `Nav bar`, `Text field` ×8, `Selected` | Camera cutout, Gesture handle, `Top app bar`, `Filled text field` ×8, `Input row` ×8, `Checkbox on`, `Arrow back` |
| `01 Onboarding / Consent` | `Selected`, `Unselected` | `Checkbox on`, `Checkbox off` |
| `01 Onboarding / Location` | `Selected`, `Unselected`, `icon/check` | `Radio on`, `Radio off`, `Dot` |
| `01 Onboarding / Login` | `Text field` | `Filled text field`, `Input row` |
| `01 Onboarding / OTP` | `Keyboard`, `Suggestion bar`, `From Messages`, `Delete`, `Delete glyph`, `Key`/`Letters`/`Digit` | `Gboard number pad`, `Autofill strip`, `Autofill chip`, `Key ⌫`, `Arrow back`, `Top app bar` |
| `01 Onboarding / Splash` | Dynamic Island, Home indicator | Camera cutout, Gesture handle |
| `02 Shop / Category` | `Segmented control`, `Chevron` | `Segmented buttons`, `Divider`, `Arrow back` |
| `02 Shop / Health store` | `Nav bar`, `Chevron` | `Top app bar`, `Arrow back` |
| `02 Shop / Home` | `Tab bar` | `Navigation bar` |
| `02 Shop / Home · hero banners` | Dynamic Island | Camera cutout |
| `02 Shop / New arrivals` | `Nav bar`, `Tab bar`, `Chevron` | `Top app bar`, `Navigation bar`, `Arrow back` |
| `02 Shop / Offers` | `Nav bar`, `Text field` | `Top app bar`, `Filled text field`, `Input row` |
| `02 Shop / Pharmacies` | `Tab bar` | `Navigation bar` |
| `02 Shop / Pharmacy storefront` | `Nav bar`, `Chevron` | `Top app bar`, `Arrow back` |
| `02 Shop / Product (OTC)` and `(Rx)` | `Segmented control`, `Segment · Overview/How to use/Safety/FAQs` | `Tabs`, `Tab · Overview/How to use/Safety/FAQs`, `Indicator` ×4 |
| `02 Shop / Search no results`, `Search results` | Dynamic Island, Home indicator | Camera cutout, Gesture handle |
| `03 Checkout / Cart` | `Selected`, `Unselected` | `Radio on`, `Radio off`, `Dot` |
| `03 Checkout / Compare pharmacies` | `Nav bar` | `Top app bar` |
| `03 Checkout / Payment success` | Dynamic Island, Home indicator | Camera cutout, Gesture handle |
| `04 Orders / My orders` | `Segmented control`, `Segment · All 1/Active 1/Cancelled 0/Delivered 0` | `Tabs`, `Tab · All 1/…`, `Indicator` ×4 |
| `04 Orders / Notifications` | `Segmented control`, `Knob`, `Segment · All 2/Health/Offers/Orders 2` | `Tabs`, `Tab · …`, `Indicator` ×4, `Handle` ×2 |
| `04 Orders / Track · *` (4 frames) | Dynamic Island, Home indicator | Camera cutout, Gesture handle |
| `05 Prescriptions & care / *` (8 frames) | `Nav bar`, `Text field` (Request a medicine ×3), `Selected`/`Unselected`, `icon/check` | `Top app bar`, `Filled text field` + `Input row` (×3), `Radio on/off` + `Dot`, `Checkbox on` |
| `06 Health & family / Add medicine` | `Date button` ×2, `Text field` ×4, `Segmented control` | `Field · ` ×2, `Filled text field` ×6, `Input row` ×6, `icon/clock` ×2, `Divider` ×2, `Segmented buttons` |
| `06 Health & family / Family` | `Nav bar` | `Top app bar` |
| `06 Health & family / Family member` | `Text field` ×3, `Selected`, `Sep` | `Filled text field` + `Input row` ×3, `Checkbox on`, `Divider` |
| `06 Health & family / Medicine dosage reminder` | `Nav bar` | `Top app bar` |
| `06 Health & family / Schedule from prescription` | `Text field` ×3, `Selected` | `Filled text field` + `Input row` ×3, `Checkbox on` |
| `07 Account / *` (8 frames) | `Nav bar`, `Tab bar` (Account) | `Top app bar`, `Navigation bar`, `Arrow back` |
| `08 Overlays / *` (8 frames) | `System alert · …` ×4, `Cancel order` buttons | `Permission dialog · …` ×4, `Cancel order`/`Keep order` |
| `08 Overlays / Sort sheet` | iOS selected-row fill `#E7ECE9` | no selected fill |

---

## 6. Layout and spacing

### 6.1 Content column

Both platforms use a **16 pt / 16 dp side margin**, so the content column is simply the canvas minus 32:

| | iOS | Android |
|---|---|---|
| Canvas | 393 | 412 |
| Content column | 361 | 380 |
| Card inner width | 327 | 346 |
| Separator inset | 301 | 320 |
| Row inner width | 275 | 294 |

Two screens use a different column on Android: `03 Checkout / Compare pharmacies` separators are 361 → 378 (17 dp margins), and `04 Orders / Track · late` stepper lines 26.33 → 32.67.

### 6.2 Padding and gaps (matched containers)

| Containers | iOS | Android | Count |
|---|---|---|---|
| Cards | pad 14 / 14 | pad 16 / 16 | 145 (radius) / 26 (padding) |
| Action-bar buttons | padL 20 / padR 20 | padL 24 / padR 24 | 49 |
| Filter pills | pad 14 / 14, gap 6 | pad 16 / 16, gap 8 | 94 |
| Fields | gap 6 | gap 4 | 32 |
| Compare/track pharmacy rows | gap 12, pad 11/11 | gap 16, pad 12/12 | 31 |
| Row separators | padL 60 | padL 72 | 37 |
| Section groups | gap 6 | gap 8 | 14 |
| Category grid | gap 19 | gap 25 | 6 |
| Search bar | pad 12 / 12, gap 8 | pad 16 / 8, gap 12 | 8 |
| Privacy rows | pad 11/11 | pad 12/12 | 8 |
| Action bars | no bottom padding | padB 4 | 23 |
| Form rows | — | `Divider` added | Address, Add medicine, Family member |

### 6.3 Corner radii

| Element | iOS | Android | Count |
|---|---|---|---|
| Card | 14 | 16 | 145 |
| Filter pill / chip | 999 | 8 | 118 |
| Button | 14 | 999 | 49 |
| Cart bar | 18 | 16 | 38 |
| Row container / show-leading | 8 | 12 | 31 |
| Care corner | 18 | 20 | 25 |
| Rows (compare, track) | 12 | 16 | 17 |
| Icon tile | 10 | 12 | 9 |
| Search bar | 12 | 28 | 8 |
| Quantity stepper | 9 | 999 | 7 |
| Cart button | 12 | 999 | 4 |
| Order card / drop zone | 20 | 22 | 3 |
| Sheet top corners | 16, 16, 0, 0 | 28, 28, 0, 0 | 3 |
| Cart bar (alt) | 18 | 16 | 4 |

### 6.4 Component sizing

| Component | iOS | Android |
|---|---|---|
| Card | 361 wide | 380 wide |
| Action button | 359 × 50 | 378 × 48 |
| Search bar | 361 × 44 (297 × 44 in-screen) | 380 × 56 (308 × 56) |
| Cart bar | 361 × 68 | 380 × 70 |
| Cart button | 112 × 44 | 109 × 48 |
| Health store tile | 174 × 156 | 184 × 156 |
| Product card (3-column) | 106 × 252 / 114 × 260 | 112 × 258 / 120 × 266 |
| Product card (rail) | name column 88 / 92 / 96 / 100 | name column 94 / 98 / 102 / 106 (+6 dp) |
| Drop zone | 361 × 285 | 380 × 279 |
| Icon tile | 44 × 44 | 44 × 44 |
| Switch | 51 × 31 | 52 × 32 |
| Avatar | 36 × 36 | 36 × 36 |
| Quantity stepper | 81 × 32 | 81 × 36 |
| Sheet (Sort) | 393 × 347 | 412 × 394 |
| Alert / dialog | 270 × 161 | 312 × 324 |
| Keyboard | 393 × 289 | 198 × 310 |
| Map area | 393 × 426 | 412 × 458 |

---

## 7. Visual hierarchy and colour

### 7.1 Palette

The palette is **identical** — 43 distinct colours on each platform, the same hex values, and the same token names on the design-system page: `brand/forest #1B3D29`, `brand/green #2F7D52`, `brand/green-700 #256B46`, `brand/gold #D9A648`, `brand/mint #8FD4A8`, `mint/300 #BDE5CB`, `mint/200 #D9F0E1`, `mint/100 #E9F6EE`, `mint/50 #F4FBF6`, `gold/ink #855B0C`, `neutral/ink #14201A`, `neutral/ink-2 #3B4842`, `neutral/muted #65726B`, `neutral/faint #9AA59F`, `neutral/line-2 #D5DDD8`, `neutral/line #E7ECE9`, `neutral/surface #FFFFFF`, `neutral/surface-2 #F5F8F6`, `neutral/surface-3 #EDF2EF`, `neutral/page #F4F8F5`, `status/red #C2392D`, `status/red-bg #FCECE9`, plus the four gradients (brand zone, art tint, mint tint, gold card).

### 7.2 Colour differences at node level

| Difference | iOS | Android | Count | Where |
|---|---|---|---|---|
| Section group headers | `#65726B` | `#256B46` | 12 | `03 Checkout / Compare pharmacies`, `07 Account / Account` (Health, Addresses, Settings, …), `07 Account / Legal`, `07 Account / Privacy & data` |
| Outline/secondary button border | `#2F7D52` | `#D5DDD8` | 16 | `02 Shop / Offers` "Order history", `02 Shop / Search no results` "Upload prescription", `04 Orders / My orders` "Cancel" |
| Search glyph stroke | `#65726B` | `#3B4842` | 16 | `02 Shop / Home`, `02 Shop / Pharmacies`, `02 Shop / Pharmacy storefront` |
| Search clear glyph stroke | `#9AA59F` | `#3B4842` | 3 | Search results, Sort sheet background |
| Row container border | none | `#D5DDD8` | 17 | `03 Checkout / Compare pharmacies` rows, `04 Orders / Track` rows |
| Selected sort row | fill `#E7ECE9` | no fill | 3 | `08 Overlays / Sort sheet` |
| Switch track | no stroke | `#65726B` | 2 | `04 Orders / Notifications`, `07 Account / Privacy & data` |
| Sheet surface | `#FFFFFF` | `#F4FBF6` | 2 | `08 Overlays / Coupon sheet`, `08 Overlays / Sort sheet` |
| Status bar glyphs on dark zones | `#000000` | `#14201A` | 16 | Product OTC/Rx, Track frames |
| Status bar glyphs (surface) | `#FFFFFF` fill | no fill | 96 | All 56 status bars |

### 7.3 Hierarchy shifts produced by the differences above

- Section headers move from a muted grey on iOS to brand green on Android — the strongest colour-level hierarchy change, affecting 12 group headers across 3 screens.
- Android's 3-column product cards are wider (106 → 112 pt, 114 → 120 pt) and their name columns are wider (88 → 94 pt, 96 → 102 pt), but the product title keeps the same 13/18 w600 type on both platforms — the extra room is taken by the card, not by larger text.
- Android's secondary buttons lose the green border and gain a neutral hairline, so the green action on Android is the only green-outlined element in the group.
- Android's row containers carry a `#D5DDD8` hairline where iOS separates rows by whitespace alone, making Android lists denser and more explicitly bounded.
- Because Android type is 1 pt smaller for body, footnote and caption roles in most screens (558 + 342 nodes), and because the eyebrow and display tracking are looser on Android, the visual rank order of headline → body → caption is compressed on Android while the gap between the largest display type (28/24) and body (12) is wider.
- Weight is redistributed on Android: 400 usage drops from 478 to 368 nodes while 500 rises from 665 to 795, and 29 nodes move from 600 → 500 and 35 from 400 → 600. Emphasised roles that are 600 on iOS are frequently 500 on Android (e.g. card titles 17/22 600 → 14/20 500), and button labels move to 700 (32 nodes).

---

## 8. Copy differences

| Element | iOS | Android |
|---|---|---|
| Camera permission title | "MedMate" Would Like to Access the Camera | Allow MedMate to take pictures and record video? |
| Camera permission actions | Don't Allow / Allow | While using the app / Only this time / Don't allow |
| Location permission title | Allow "MedMate" to use your location? | Allow MedMate to access this device's location? |
| Location actions | Allow While Using App / Don't Allow / Allow Once | While using the app / Only this time / Don't allow |
| Notification permission title | "MedMate" Would Like to Send You Notifications | Allow MedMate to send you notifications? |
| Contacts permission title | "MedMate" Would Like to Access Your Contacts | Allow MedMate to access your contacts? |
| Contacts message | You pick who to invite. Your address book… | — (Android adds a "Pick from my contacts" label instead) |
| Cancel-order dialog | Cancel Order / Keep Order | Cancel order / Keep order |
| Back button | Chevron + previous screen title ("Account" ×12, "Home" ×9, "Product" ×2, "Schedule" ×2, "Location", "Pharmacies", "Checkout", "Track", "Search", "Family", "Login", "Back") ×3 | Arrow icon only, no title |
| Phone field prefix | Separate `+91` text node | `+91␣␣` text node (trailing spaces for the caret gap) |
| OTP value | `Code` node labelled "1234" | `1234` node |
| Date / value fields | Node named "30 Oct 2026" / "Not set" | Node named `Value` holding "30 Oct 2026" / "Not set" |
| Section heading | "iOS · 08 Overlays" | "Android · 08 Overlays" |

Text node counts differ by exactly one on 35 screens (iOS has one more) — the missing node is the iOS back-title label, replaced by the Android arrow glyph. `01 Onboarding / OTP` differs by seven (the two different keyboards); the other 21 screens have identical text counts.

---

## 9. Consolidated discrepancy index

| # | Category | Difference | Scale |
|---|---|---|---|
| 1 | Typography | Two separate scales in one file: 22 Apple-style tokens (iOS) vs 22 M3 tokens (Android), different names, sizes, line heights, tracking and weight assignments | Whole file |
| 2 | Typography | Body/footnote role shrinks 13 → 12 pt with 18 → 16 line height | 558 nodes |
| 3 | Typography | Subheadline role shrinks 15 → 14 pt | 342 nodes |
| 4 | Typography | Headline role 17/22 → 16/24, tracking −0.085 → 0 | 121 nodes |
| 5 | Typography | Titles 17 → 14 pt in 56 header nodes, with weight 600 → 500 | 56 nodes |
| 6 | Typography | Titles 17 → 22 pt in 32 nodes, weight 600 → 700 | 32 nodes |
| 7 | Typography | Text alignment CENTER → LEFT on headers | 89 nodes |
| 8 | Typography | Eyebrow tracking 0.66 → 0.88 | 73 nodes |
| 9 | Typography | Display tracking −0.42 → −0.24, −0.34 → −0.11 | 83 nodes |
| 10 | Typography | Line height 13 → 16 on small text | 183 nodes |
| 11 | Typography | Max lines 1 → 2 | 3 nodes |
| 12 | Typography | Status bar time 17/22 600 centred → 14/20 500 left | 56 bars |
| 13 | Iconography | ~250 vectors enlarged 1.22–1.33× on Android | 250 vectors |
| 14 | Iconography | Stroke weights 1.35 → 1.65, 1.2 → 1.5, 1.05 → 1.35, 1.35 → 1.8 | 181 vectors |
| 15 | Iconography | Status bar: 10 vectors (Dynamic Island) vs 4 (camera cutout) | 56 screens |
| 16 | Iconography | Search glyph 12 → 16 px, stroke `#65726B` → `#3B4842` | 16 nodes |
| 17 | Component | `Nav bar` (44/96 pt) vs `Top app bar` (64/152 dp) | 35 screens |
| 18 | Component | Back = chevron + previous title vs arrow only | 35 screens |
| 19 | Component | Bell icon in the top bar on iOS only | all bars |
| 20 | Component | `Tab bar` (49 + 34) vs `Navigation bar` (80 + 24) | 6 screens |
| 21 | Component | Buttons r14 (50 pt) vs pill r999 (48 dp), padding 20 → 24 | 49 buttons |
| 22 | Component | Filter pills r999 vs M3 chips r8, height 34 vs 32, gap 6 → 8 | 118 chips |
| 23 | Component | `Segmented control` (32) vs `Segmented buttons` (40) / `Tabs` (47 with 4 indicators) | 8 screens |
| 24 | Component | iOS checkboxes r999 (22 × 22) vs Android r2 (18 × 18); radios differ (check vs dot) | 9 screens |
| 25 | Component | iOS `System alert` 270 × 161 (2 actions) vs Android `Permission dialog` 312 × 324 (3 options, icon) | 4 dialogs + cancel dialog |
| 26 | Component | iOS keyboard 393 × 289 with letter groups vs Gboard 198 × 310 with autofill strip and ⌫ | 1 screen |
| 27 | Component | iOS top-banner toast vs Android snackbar 380 × 48 with gold action | design system |
| 28 | Component | `Text field` vs `Filled text field` + `Input row` | 14 screens |
| 29 | Layout | Canvas 393 × 852 vs 412 × 915; content column 361 vs 380 | all |
| 30 | Layout | Card radius 14 → 16 | 145 |
| 31 | Layout | Card padding 14 → 16 | 26 containers |
| 32 | Layout | Sheet top radius 16 → 28 | 3 |
| 33 | Layout | Search bar radius 12 → 28, height 44 → 56 | 8 |
| 34 | Layout | Quantity stepper r9 → r999, height 32 → 36 | 7 |
| 35 | Layout | Row separator inset 60 → 72; compare-row gap 12 → 16 | 37 + 31 |
| 36 | Layout | Category grid gap 19 → 25 | 6 |
| 37 | Layout | Form gap 6 → 4; action bars gain 4 dp bottom padding | 32 + 23 |
| 38 | Layout | Search bar padding 12/12 → 16/8, gap 8 → 12 | 8 |
| 39 | Layout | 56 of 57 frames differ in height; largest −210 dp (Address add/edit) and +135 dp (Account) | 56 screens |
| 40 | Colour | Group headers `#65726B` → `#256B46` | 12 nodes |
| 41 | Colour | Outline button border `#2F7D52` → `#D5DDD8` | 16 nodes |
| 42 | Colour | Android rows gain a `#D5DDD8` hairline | 17 nodes |
| 43 | Colour | Sort sheet selected row fill `#E7ECE9` removed on Android | 3 nodes |
| 44 | Colour | Sheet surface `#FFFFFF` → `#F4FBF6` | 2 nodes |
| 45 | Colour | Status bar glyph fills `#FFFFFF` / `#000000` → none / `#14201A` | 112 nodes |
| 46 | Colour | Switch track gains a `#65726B` stroke | 2 nodes |
| 47 | Copy | Permission dialog titles and action labels entirely reworded | 4 dialogs |
| 48 | Copy | "Cancel Order"/"Keep Order" → "Cancel order"/"Keep order" | 1 dialog |
| 49 | Copy | iOS back titles absent on Android | 35 screens |
| 50 | Copy | "Pick from my contacts" label exists on Android only | 2 nodes |

---

*Extraction scripts and the raw JSON dump used for this report are in `/tmp/kilo/figma/` (`extract.py`, `cmp_typography.py`, `cmp_scale.py`, `cmp_vectors2.py`, `cmp_layout.py`, `cmp_colors.py`, `cmp_structure.py`, `cmp_components.py`). No repository files were modified.*
