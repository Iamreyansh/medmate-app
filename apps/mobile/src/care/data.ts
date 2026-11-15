/**
 * The data behind the prescriptions and care screens.
 *
 * The Figma `05 Prescriptions & care` frames are drawn with one prescription
 * under review, one doctor call waiting and one medicine request open. The
 * mock catalogue has no backend, so these live here in the same shape the
 * screens read them.
 */

/** Where a prescription is. */
export type PrescriptionStatus = 'under-review' | 'verified' | 'expired';

/** A prescription the shopper has sent. */
export type Prescription = {
  /** The number without the hash, e.g. `UP-482913`. */
  id: string;
  /** Where it came from. */
  source: 'Your upload' | 'MedMate doctor';
  /** When it was sent. */
  sent: string;
  status: PrescriptionStatus;
  /** The order it is being used for. */
  usedFor?: string;
  /** The tag on the order. */
  usedForTag?: string;
  /** The medicines it covers. */
  medicines: { id: string; name: string; initials: string; rx?: boolean }[];
};

/** The prescription the frames are drawn with. */
export const prescriptions: Prescription[] = [
  {
    id: 'UP-482913',
    source: 'Your upload',
    sent: 'Today, 10:42 am',
    status: 'under-review',
    usedFor: 'Order #MM-20341 · Today, 4:12 pm',
    usedForTag: 'On hold',
    medicines: [{ id: 'DRS_TELMAR', name: 'Telma-R 5 Tablet', initials: 'T5', rx: true }],
  },
];

/** The prescription a doctor issued on a call. */
export const ePrescription: Prescription = {
  id: 'TC-118204',
  source: 'MedMate doctor',
  sent: 'Today, 4:31 pm',
  status: 'verified',
  medicines: [{ id: 'DRS_TELMAR', name: 'Telma-R 5 Tablet', initials: 'T5', rx: true }],
};

/** The order waiting for a doctor to call. */
export const consultationOrder = {
  id: 'MM-20341',
  pharmacy: 'HealthFirst Chemist',
  /** What the shopper asked for. */
  reason: 'Request a doctor call',
  /** The order the call is about. */
  order: 'Order #MM-20341',
};

/** The three steps of sending a prescription. */
export const prescriptionSteps = [
  { id: 'upload', label: 'Upload', icon: 'rx-up' as const },
  { id: 'pharmacy', label: 'Find pharmacy', icon: 'store' as const },
  { id: 'confirm', label: 'Confirm', icon: 'check' as const },
];

/** What a valid prescription has to show. */
export const validPrescriptionLines: { icon: 'user' | 'id' | 'clock' | 'pill' | 'edit'; text: string }[] = [
  { icon: 'user', text: 'Doctor’s name, qualification and registration number' },
  { icon: 'id', text: 'Patient’s name and age' },
  { icon: 'clock', text: 'Date the prescription was written' },
  { icon: 'pill', text: 'Medicine name, strength, dose and duration' },
  { icon: 'edit', text: 'Doctor’s signature or stamp' },
];

/** How to take a clear photo of a prescription. */
export const clearPhotoLines: { icon: 'camera'; text: string }[] = [
  { icon: 'camera', text: 'Lay it flat in good light, without flash glare' },
  { icon: 'camera', text: 'Fit the whole page in, all four corners' },
  { icon: 'camera', text: 'Several pages? Send them as one PDF' },
  { icon: 'camera', text: 'Don’t crop out the doctor’s details or the date' },
];

/** How the three steps of a prescription work. */
export const prescriptionHowItWorks = [
  {
    icon: 'rx-up' as const,
    title: 'Upload, or ask for a doctor call',
    body: 'Add a photo or PDF. No prescription? Place the order and a registered doctor can call you to assess.',
  },
  {
    icon: 'shield' as const,
    title: 'A pharmacist checks it',
    body: 'A registered pharmacist reads it before anything prescription-only is packed.',
  },
  {
    icon: 'scooter' as const,
    title: 'Medicines delivered',
    body: 'Your nearby licensed pharmacy packs and sends the order.',
  },
];

/** How the doctor call works. */
export const callHowItWorks = [
  {
    icon: 'bag' as const,
    title: 'Add your medicine and order',
    body: 'At checkout, choose a doctor call instead of uploading a prescription.',
  },
  {
    icon: 'phone' as const,
    title: 'A registered doctor calls you',
    body: 'By phone or video, usually within 15 minutes during call hours.',
  },
  {
    icon: 'steth' as const,
    title: 'The doctor decides',
    body: 'They assess you independently. A prescription is issued only if it is medically appropriate.',
  },
  {
    icon: 'shield' as const,
    title: 'The pharmacy packs it',
    body: 'Once a prescription is verified, the pharmacist packs and sends your order.',
  },
];

/** What to have ready for the call. */
export const keepReady = [
  { icon: 'pill' as const, text: 'The medicines you take now, or their strips' },
  { icon: 'rx-doc' as const, text: 'Any old prescription or recent test reports' },
  {
    icon: 'alert' as const,
    text: 'Allergies and long-term conditions (diabetes, BP, thyroid)',
  },
  {
    icon: 'user' as const,
    text: 'The patient nearby, if the medicine is for someone else',
  },
  { icon: 'phone' as const, text: 'Your phone charged, in a quiet place' },
];

/** What the doctor promises on the call screen. */
export const callPromises = [
  { icon: 'clock' as const, value: '8 AM–11 PM', label: 'Call hours' },
  { icon: 'steth' as const, value: 'Registered', label: 'Doctor' },
  { icon: 'shield' as const, value: 'Private', label: 'Confidential' },
];

/** A medicine the shopper has asked the team to source. */
export type MedicineRequest = {
  /** The number without the hash, e.g. `RQ-50317`. */
  id: string;
  /** What was asked for. */
  name: string;
  /** How many. */
  quantity: number;
  /** When it was sent. */
  sent: string;
  /** Where the request has got to, out of five. */
  step: number;
  /** When it is wanted. */
  wanted: string;
  /** Whether it needs a prescription. */
  prescription: string;
};

/** The request the frames are drawn with. */
export const medicineRequests: MedicineRequest[] = [
  {
    id: 'RQ-50317',
    name: 'Thyronorm 50',
    quantity: 1,
    sent: 'sent just now',
    step: 1,
    wanted: 'As soon as it’s arranged',
    prescription: 'Not sure',
  },
];

/** The steps a medicine request goes through. */
export const requestSteps = 5;

/** The note on the request screen. */
export const requestNote =
  'The MedMate team checks with pharmacies and distributors and calls you back to confirm whether it can be arranged, usually within 4 hours (8 AM to 11 PM). Nothing is ordered or charged until you confirm the price.';

/** Whether a medicine needs a prescription. */
export const prescriptionChoices = [
  { id: 'yes', label: 'Yes, it needs a prescription' },
  { id: 'no', label: 'No, it’s sold without one' },
  { id: 'unsure', label: 'I’m not sure' },
];

/** When the shopper needs the medicine. */
export const requestTimingChoices = [
  {
    id: 'soon',
    icon: 'bolt' as const,
    title: 'As soon as it’s arranged',
    body: 'The team tells you the delivery time with the price',
  },
  {
    id: 'schedule',
    icon: 'clock' as const,
    title: 'Schedule a date and time',
    body: 'Pick when it should reach you',
  },
];

/** How the doctor can reach the shopper. */
export const reachChoices = [
  {
    id: 'phone',
    icon: 'phone' as const,
    title: 'Phone call',
    body: 'A normal phone call',
  },
  {
    id: 'video',
    icon: 'video' as const,
    title: 'Video call',
    body: 'On WhatsApp video',
  },
];

/** The number the doctor calls. */
export const doctorPhone = '+91 98450 12345';

/** The address the request goes to. */
export const requestAddress = {
  label: 'Home',
  line: 'Flat 302, Sri Sai Residency, 7th Cross, Jayanagar 4th Block',
  phone: doctorPhone,
};

/** The file types a prescription can be sent as. */
export const prescriptionFileTypes = 'JPG, PNG, WEBP, HEIC or PDF';

/** The note under the upload screen. */
export const uploadNote =
  'If something cannot be read, the pharmacist tells you why and you can send a clearer copy.';

/** The note under the prescription file. */
export const prescriptionFileNote =
  'Files can only be opened by the account that sent them.';
