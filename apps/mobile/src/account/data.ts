import type { IconName } from '../icons/Icon';

/**
 * The data behind the account screens.
 *
 * The Figma `07 Account` frames are drawn with one shopper, one order and
 * one prescription. The mock catalogue has no backend, so these live here in
 * the same shape the screens read them.
 */

/** The shopper. */
export const account = {
  name: 'Priya Sharma',
  initials: 'PS',
  phone: '+91 98450 12345',
  age: '34 years',
  /** How much of the profile is filled in. */
  profilePercent: 67,
  /** What is still missing. */
  profileMissing: 'Add your blood group and emergency contact',
  /** The wallet. */
  money: '₹15',
  /** The referral code. */
  referralCode: 'MM4K7QZ',
};

/** The counts on the account screen. */
export const accountStats = [
  { value: '1', label: 'Orders' },
  { value: '0', label: 'Delivered' },
  { value: '1', label: 'Prescriptions' },
];

/** A row in one of the account lists. */
export type AccountLink = {
  id: string;
  /** The name of the screen it opens. */
  title: string;
  /** The line under it. */
  subtitle?: string;
  /** The glyph in the tile. */
  icon?: IconName;
  /** It is a destructive action. */
  danger?: boolean;
  /** It is coming soon. */
  soon?: boolean;
};

/** The groups on the account screen. */
export const accountGroups: { label: string; links: AccountLink[] }[] = [
  {
    label: 'Orders and savings',
    links: [
      { id: 'orders', title: 'My orders', subtitle: '1 order · 1 in progress', icon: 'bag' },
      { id: 'offers', title: 'Offers and coupons', subtitle: 'Coupons you can use today', icon: 'percent' },
      { id: 'refer', title: 'Refer and earn', subtitle: 'You both get ₹100 off', icon: 'gift' },
    ],
  },
  {
    label: 'Health',
    links: [
      { id: 'prescriptions', title: 'My prescriptions', subtitle: '1 on file · latest under review', icon: 'rx-doc' },
      { id: 'requests', title: 'My medicine requests', subtitle: 'Can’t find a medicine nearby? Ask us to get it', icon: 'bag' },
      { id: 'schedule', title: 'Medicine dosage reminder', subtitle: 'Reminders and refills for the family', icon: 'clock' },
      { id: 'family', title: 'Family members', subtitle: 'Add parents, spouse or children', icon: 'user' },
      { id: 'abha', title: 'ABHA health ID', subtitle: 'Coming soon', icon: 'id' },
      { id: 'consult', title: 'Need a consultation?', subtitle: 'Talk to a registered doctor', icon: 'steth' },
    ],
  },
  {
    label: 'Addresses',
    links: [
      { id: 'addresses', title: 'Saved addresses', subtitle: 'Delivering to Home · 2 saved', icon: 'pin' },
    ],
  },
  {
    label: 'Settings',
    links: [
      { id: 'notifications', title: 'Notifications', subtitle: 'Not set · tap to allow dose reminders', icon: 'bell' },
      { id: 'privacy', title: 'Privacy and permissions', subtitle: 'Permissions, consents, download or delete your data', icon: 'shield' },
      { id: 'language', title: 'Language', subtitle: 'English. More Indian languages are planned.', icon: 'chat' },
    ],
  },
  {
    label: 'Help and legal',
    links: [
      { id: 'help', title: 'Help and support', subtitle: 'FAQs and order help', icon: 'help' },
      { id: 'privacy-policy', title: 'Privacy Policy', icon: 'info' },
      { id: 'terms', title: 'Terms and Conditions', icon: 'info' },
      { id: 'refunds', title: 'Payments and Refunds', icon: 'card' },
      { id: 'partner', title: 'Partner with us', subtitle: 'List your pharmacy on MedMate', icon: 'store' },
    ],
  },
  {
    label: 'Account',
    links: [
      { id: 'logout', title: 'Log out', subtitle: 'On this device or all devices', danger: true },
      { id: 'delete', title: 'Delete my account', subtitle: 'Erase your account and personal data', danger: true },
    ],
  },
];

/** The blood groups. */
export const bloodGroups = ['A+', 'A−', 'B+', 'B−', 'AB+', 'AB−', 'O+', 'O−'];

/** The medicines somebody reacts to. */
export const allergyOptions = ['Penicillin', 'Sulfa drugs', 'Aspirin', 'Painkillers', 'None known'];

/** The permissions on the privacy screen. */
export const devicePermissions: {
  id: string;
  title: string;
  body: string;
  icon: IconName;
  state: 'Allowed' | 'Ask me';
}[] = [
  { id: 'location', title: 'Location', body: 'Finds pharmacies near you. Only while the app is open.', icon: 'pin', state: 'Allowed' },
  { id: 'notifications', title: 'Notifications', body: 'Dose reminders and order updates while the app is open', icon: 'bell', state: 'Ask me' },
  { id: 'camera', title: 'Camera', body: 'Only when you photograph a prescription', icon: 'camera', state: 'Ask me' },
  { id: 'microphone', title: 'Microphone', body: 'Only during a doctor call you start', icon: 'mic', state: 'Ask me' },
  { id: 'contacts', title: 'Contacts', body: 'Only the friends you pick to invite. Never uploaded.', icon: 'user', state: 'Ask me' },
];

/** The consents on the privacy screen. */
export const consents: { id: string; title: string; body: string; icon: IconName }[] = [
  { id: 'health', title: 'Health information', body: 'Prescriptions, medicines, schedule and family health details. Used to fill orders, never for ads.', icon: 'heart' },
  { id: 'usage', title: 'Usage and activity', body: 'Screens opened, searches and crash reports. Helps us fix and improve the app.', icon: 'info' },
  { id: 'offers', title: 'Offers and reminders', body: 'Deals and refill nudges. Order updates come either way.', icon: 'gift' },
  { id: 'payments', title: 'Payments', body: 'Cash on Delivery for now. MedMate never stores card numbers, CVV or UPI PIN.', icon: 'card' },
];

/** What the account holds. */
export const heldData: { label: string; value: string }[] = [
  { label: 'Mobile number', value: '+91 98450 12345' },
  { label: 'Profile details', value: '4 of 6 filled' },
  { label: 'Addresses', value: '2 addresses' },
  { label: 'Orders', value: '1 order' },
  { label: 'Prescription', value: '1 on file' },
  { label: 'Family members', value: '2 added' },
  { label: 'Medicine schedule', value: '3 medicines' },
  { label: 'Consents', value: 'Given 1 Oct 2026' },
];

/** What the shopper can do with their data. */
export const dataActions: AccountLink[] = [
  { id: 'download', title: 'Download my data', subtitle: 'A copy of everything in your account, as a JSON file', icon: 'image' },
  { id: 'correct', title: 'Correct my details', subtitle: 'Edit your name, birthday and health details', icon: 'edit' },
  { id: 'privacy-policy', title: 'Privacy Policy', icon: 'info' },
  { id: 'terms', title: 'Terms and Conditions', icon: 'info' },
  { id: 'delete', title: 'Delete my account', subtitle: 'Erase your account and personal data', icon: 'trash', danger: true },
];

/** Why link an ABHA health ID. */
export const abhaReasons = [
  { title: 'Records in one place', body: 'Prescriptions, lab reports and pharmacy bills can be saved to your ABHA.' },
  { title: 'Share only with consent', body: 'You approve every request to see your records, and can withdraw it.' },
  { title: 'Carry your health history', body: 'Doctors and hospitals that use ABHA can see what you choose to share.' },
];

/** How the ABHA link is planned to work. */
export const abhaSteps = [
  'You enter your ABHA number or ABHA address, and confirm with an OTP from ABDM.',
  'You choose which MedMate records to link: prescriptions you uploaded and pharmacy bills.',
  'You can unlink at any time from this screen.',
];

/** What MedMate will never do with an ABHA. */
export const abhaNever = [
  'We will not create an ABHA for you or link one without your OTP.',
  'We will not share your records with anyone without your consent.',
];

/** The topics on the help screen. */
export const helpTopics = ['Orders', 'Delivery', 'Prescriptions', 'Payments & refunds', 'Offers', 'Account & privacy'];

/** The questions on the help screen. */
export const helpQuestions = [
  {
    q: 'How fast is delivery?',
    a: 'Most orders from a nearby pharmacy arrive in 12–30 minutes, depending on distance and stock.',
  },
  { q: 'What are the delivery charges?', a: '' },
  { q: 'Can I order from two pharmacies at once?', a: '' },
  { q: 'Can I cancel an order?', a: '' },
  { q: 'What if a medicine needs a prescription?', a: '' },
  { q: 'How does the doctor call work?', a: '' },
  { q: 'Which payment methods can I use?', a: '' },
];

/** The sections of the terms. */
export const legalSections = [
  {
    number: '01',
    title: 'What MedMate is',
    body: 'MedMate is a technology platform. Medicines and health products are sold and dispensed by independent licensed pharmacies. Each pharmacy is responsible for what it dispenses; MedMate is responsible for the platform, delivery coordination and support.',
  },
  {
    number: '02',
    title: 'Who can use it',
    body: 'You must be 18 or older and provide a working mobile number. Keep your login code private.',
  },
  {
    number: '05',
    title: 'Prescriptions',
    body: 'Prescription-only medicines are dispensed only against a valid prescription checked by a registered pharmacist. We do not supply medicines that the law bans from online sale. Giving a false or altered prescription is an offence and may lead to account closure.',
  },
  {
    number: '06',
    title: 'Doctor consults',
    body: 'Consults are with registered medical practitioners and follow the Telemedicine Practice Guidelines [to be confirmed]. They are not for emergencies. In an emergency call 112 or go to the nearest hospital.',
  },
];

/** The sections on the account screen that are a plain list. */
export const otherPolicies: AccountLink[] = [
  { id: 'privacy-policy', title: 'Privacy Policy', icon: 'info' },
  { id: 'refunds', title: 'Payments and Refunds', icon: 'card' },
  { id: 'delete', title: 'Delete my account', icon: 'trash', danger: true },
];
