import type { IconName } from '../icons/Icon';

/**
 * The copy behind the onboarding flow.
 *
 * It is taken from the Figma `01 Onboarding` frames: Splash, Login, OTP,
 * Consent and Location.
 */

/** The line under the wordmark. */
export const tagline = 'Care · delivered in minutes';

/** The line at the foot of the splash. */
export const madeIn = 'Made in Bengaluru';

/** The three promises on the login zone. */
export const promises: { icon: IconName; title: string; body: string }[] = [
  { icon: 'bolt', title: 'Delivery', body: 'in minutes' },
  { icon: 'shield', title: 'Licensed', body: 'pharmacies' },
  { icon: 'steth', title: 'Talk to a', body: 'doctor' },
];

/** The three photos the login zone shows. */
export const packPhotos = [
  { id: 'diclofenac', name: 'Diclofam Gel', size: 117, x: 15, y: 26 },
  { id: 'doliprane', name: 'Doliprane 650', size: 117, x: 196, y: 12 },
  { id: 'acigon', name: 'Acigon New', size: 128, x: 92, y: 0 },
];

/** The heading on the login sheet. */
export const loginHeading = 'Medicines from your neighbourhood pharmacy';

/** The line under the login heading. */
export const loginBody =
  'Log in or sign up with your mobile number. New here? The same code creates your account.';

/** The line under the mobile field. */
export function codeNotice(phone: string): string {
  return `We’ll send a 4-digit code to ${phone}.`;
}

/** The note under the mobile field. */
export const numberNoteTitle = 'What happens to my number?';

/** The note under that. */
export const numberNoteBody =
  'You will review our Terms and Privacy Policy on the next step. MedMate is for people aged 18 and over.';

/** The link that lets the shopper look around first. */
export const browseFirst = 'Browse medicines first';

/** The code the demo build accepts. */
export const demoCode = '1234';

/** The heading on the OTP screen. */
export const otpHeading = 'Enter the 4-digit code';

/** The line under the OTP heading. */
export function otpSubheading(phone: string): string {
  return `Sent by SMS to ${phone}`;
}

/** The line under the OTP boxes. */
export const otpExpiry = 'Code expires in 4:59 · Didn’t get it? Resend in 0:30';

/** The note that says no SMS is sent in the demo build. */
export const otpDemoNote = 'Demo build, no SMS is sent. Your code is 1234';

/** The note under the OTP button. */
export const otpSafety =
  'MedMate will never call you to ask for this code. Don’t share it with anyone.';

/** The heading on the consent screen. */
export const consentHeading = 'Terms and Conditions';

/** The line under the consent heading. */
export const consentBody =
  'Here is what you agree to when you use MedMate, in plain words. You can change these later in Account.';

/** The label above the two consents. */
export const consentGroupLabel = 'Included in our Terms';

/** The two consents that are in the Terms. */
export const termConsents: { title: string; body: string }[] = [
  {
    title: 'Health information',
    body: 'Prescriptions, medicines you order and your schedule. Used to fill your orders. Never for ads.',
  },
  {
    title: 'Usage and activity',
    body: 'Screens opened, searches and crash reports. Used to fix and improve MedMate. Never sold.',
  },
];

/** The two lines that are always on. */
export const alwaysOn: { title: string; body: string }[] = [
  {
    title: 'Order updates',
    body: 'Order confirmed, packed, on the way, delivered. These come either way.',
  },
  {
    title: 'Your number and address',
    body: 'Shared with the pharmacy and rider only for an order you place.',
  },
];

/** The link under each consent. */
export const whatThisMeans = 'What this means';

/** The required tick. */
export const adultTick = 'I am 18 years or older';

/** The optional tick. */
export const offersTick = 'Send me offers and refill reminders';

/** The note under the ticks. */
export const consentNote =
  'By tapping Agree and continue you accept our Terms and Conditions, including the use of your health information and usage data described there, and confirm you have read our Privacy Policy.';

/** The line at the foot of the consent screen. */
export const consentVersion = 'Version 1 October 2026';

/** The heading on the location screen. */
export const locationHeading = 'Where should we deliver your order?';

/** The line under the location heading. */
export const locationBody = '6 partner pharmacies open now · fastest in 32–47 min';

/** The row that detects the current location. */
export const detectLocation = {
  title: 'Use my current location',
  body: 'Pins the exact spot for the rider. Only while the app is open.',
  action: 'Detect',
};

/** The label above the saved addresses. */
export function savedAddressesLabel(count: number): string {
  return `Saved addresses · ${count}`;
}

/** The row that adds an address. */
export const addAddress = 'Add new address';

/** The note at the foot of the location screen. */
export const locationNote =
  'We deliver across Bengaluru (pincodes starting 560) from licensed partner pharmacies nearby.';

/** The tag on the address the order goes to. */
export const deliveringHere = 'DELIVERING HERE';
