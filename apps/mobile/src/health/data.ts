/**
 * The data behind the health and family screens.
 *
 * The Figma `06 Health & family` frames are drawn with one person's
 * schedule, one medicine being added and the family list. The mock catalogue
 * has no backend, so these live here in the same shape the screens read them.
 */

/** Somebody the reminders can be set for. */
export type Person = {
  id: string;
  /** The name, or "Everyone" for everybody. */
  label: string;
  /** The one or two letters on the avatar. */
  initials: string;
  /** The relation, for family members. */
  relation?: string;
  /** How old they are. */
  age?: string;
};

/** The people the reminders can be set for. */
export const people: Person[] = [
  { id: 'everyone', label: 'Everyone', initials: 'E' },
  { id: 'priya', label: 'Priya', initials: 'P' },
  { id: 'amma', label: 'Amma', initials: 'A' },
  { id: 'appa', label: 'Appa', initials: 'A' },
];

/** The family members on the family screen. */
export const familyMembers = [
  {
    id: 'priya',
    name: 'Priya Sharma',
    initials: 'PS',
    isYou: true,
    summary: '34 yrs · 3 medicines · 3/5 doses today · 1 running low',
    conditions: [] as string[],
    medicines: '3 medicines',
  },
  {
    id: 'amma',
    name: 'Amma',
    initials: 'A',
    relation: 'Mother',
    age: '62 yrs',
    summary: 'No medicines yet',
    conditions: ['Diabetes', 'High BP'],
    medicines: '',
  },
  {
    id: 'appa',
    name: 'Appa',
    initials: 'A',
    relation: 'Father',
    age: '66 yrs',
    summary: 'No medicines yet',
    conditions: ['Diabetes'],
    medicines: '',
  },
];

/** How far through today the shopper is. */
export const todayProgress = {
  taken: 3,
  total: 5,
  /** The percentage the ring shows. */
  percent: 60,
  /** The next dose. */
  next: 'Next: Dr Morepen Calcium + Advanced · 8:00 pm',
};

/** One day in the week strip. */
export type WeekDay = {
  /** The short name, e.g. "Fri". */
  label: string;
  /** The date, e.g. "24". */
  date: string;
  /** The doses were all taken. */
  done?: boolean;
  /** The day has not happened yet. */
  upcoming?: boolean;
  /** The day is today. */
  today?: boolean;
  /** The percentage taken today. */
  percent?: number;
};

/** The week the schedule covers. */
export const week: WeekDay[] = [
  { label: 'Fri', date: '24', done: true },
  { label: 'Sat', date: '25', done: true },
  { label: 'Sun', date: '26' },
  { label: 'Mon', date: '27', done: true },
  { label: 'Tue', date: '28', upcoming: true },
  { label: 'Wed', date: '29', done: true },
  { label: 'Today', date: '30', today: true, percent: 60 },
];

/** A medicine that is running low. */
export const lowStock = {
  name: 'Telma-R 5 Tablet',
  left: 4,
  about: 'About 4 days of supply',
};

/** A single dose in the day's schedule. */
export type Dose = {
  id: string;
  /** The medicine. */
  name: string;
  /** How much and when to take it. */
  detail: string;
  /** The time it is due. */
  time: string;
  /** It has been taken. */
  taken?: boolean;
  /** It is due now. */
  dueNow?: boolean;
};

/** The parts of the day and the doses in each. */
export const doseParts: {
  id: string;
  label: string;
  icon: 'bolt' | 'clock' | 'star';
  taken: number;
  total: number;
  doses: Dose[];
}[] = [
  {
    id: 'morning',
    label: 'Morning',
    icon: 'bolt',
    taken: 2,
    total: 2,
    doses: [
      {
        id: 'd1',
        name: 'Telma-R 5 Tablet',
        detail: '1 tablet · after food',
        time: '8:00 am',
        taken: true,
      },
      {
        id: 'd2',
        name: 'Dr Morepen Calcium + Advanced Tablet',
        detail: '1 tablet · after food',
        time: '8:30 am',
        taken: true,
      },
    ],
  },
  {
    id: 'afternoon',
    label: 'Afternoon',
    icon: 'clock',
    taken: 1,
    total: 1,
    doses: [
      {
        id: 'd3',
        name: 'Carbamide Forte Chelated Iron with Folic Acid, Zinc, Vitamin C & B12 for Blood Building & Energy',
        detail: '1 tablet · after food',
        time: '1:00 pm',
        taken: true,
      },
    ],
  },
  {
    id: 'evening',
    label: 'Evening',
    icon: 'star',
    taken: 0,
    total: 2,
    doses: [
      {
        id: 'd4',
        name: 'Dr Morepen Calcium + Advanced Tablet',
        detail: '1 tablet · after food',
        time: '8:00 pm',
        dueNow: true,
      },
      {
        id: 'd5',
        name: 'Carbamide Forte Chelated Iron with Folic Acid, Zinc, Vitamin C & B12 for Blood Building & Energy',
        detail: '1 tablet · any time',
        time: '9:00 pm',
      },
    ],
  },
];

/** A medicine on the schedule. */
export type ScheduledMedicine = {
  id: string;
  name: string;
  /** The dose, the times and how often. */
  schedule: string;
  /** How many are left and how long that is. */
  left: string;
  /** It is running low. */
  low?: boolean;
};

/** The medicines on the schedule. */
export const scheduledMedicines: ScheduledMedicine[] = [
  {
    id: 'DRS_TELMAR',
    name: 'Telma-R 5 Tablet',
    schedule: '1 tablet · 8:00 am · Every day',
    left: '4 left · about 4 days · refill soon',
    low: true,
  },
  {
    id: 'DRS_MOREPAN',
    name: 'Dr Morepen Calcium + Advanced Tablet',
    schedule: '1 tablet · 8:30 am, 8:00 pm · Every day',
    left: '28 left · about 14 days',
  },
  {
    id: 'DRS_CARBAMIDE',
    name: 'Carbamide Forte Chelated Iron with Folic Acid, Zinc, Vitamin C & B12 for Blood Building & Energy',
    schedule: '1 tablet · 1:00 pm · Mon, Wed, Fri',
    left: '12 left · about 28 days',
  },
];

/** How much of a medicine to take. */
export const doseOptions = ['1 tablet', '2 tablets', '½ tablet', '1 capsule', '5 ml', '10 ml'];

/** When a medicine is taken. */
export const timeOptions = [
  'Morning 8:00 am',
  'Afternoon 1:00 pm',
  'Evening 8:00 pm',
  'Night 9:00 pm',
];

/** When a medicine is taken relative to food. */
export const foodOptions = ['Before food', 'After food', 'Any time'];

/** The relation a family member is. */
export const relations = [
  'Mother',
  'Father',
  'Spouse',
  'Son',
  'Daughter',
  'Brother',
  'Sister',
  'Grandmother',
  'Grandfather',
  'Someone else',
];

/** The ongoing conditions a family member has. */
export const conditions = [
  'Diabetes',
  'High BP',
  'Thyroid',
  'Asthma',
  'Heart disease',
  'Cholesterol',
  'Arthritis',
];

/** The medicines a family member reacts to. */
export const allergies = ['Penicillin', 'Sulfa drugs', 'Aspirin', 'Painkillers'];

/** The note about reminders. */
export const reminderNote =
  'Tap the circle when you take a dose. Reminders show in the app at dose time while MedMate is open, with a phone notification too if you allow it. They can’t reach you when the app is closed. Your schedule is saved to your account, so it is on every device you sign in on.';

/** The note under the reminder. */
export const reminderDisclaimer =
  'This schedule is a reminder you set yourself. Always follow your doctor’s or pharmacist’s instructions, and ask them before you change a dose.';

/** The note about the week strip. */
export const weekNote = 'Tap an earlier day to see it and mark doses you took.';

/** The note under the schedule from a prescription. */
export const scheduleNote =
  'Nothing starts until you tap Confirm. You can change or stop any reminder later in Medicine schedule.';

/** The consent line when adding a family member. */
export const consentLine =
  'My mother knows I am adding their health details and is okay with it.';

/** The note about where a family member's details are kept. */
export const familyPrivacyNote =
  'Saved to your account only. Shared with a pharmacy or doctor only for an order or consult you start. They can ask you to remove it at any time.';
