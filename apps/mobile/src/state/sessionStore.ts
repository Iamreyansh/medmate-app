import { Platform } from 'react-native';
import { File, Paths } from 'expo-file-system';

/**
 * Where the session is kept between launches.
 *
 * The onboarding is a first-run flow, so without this the shopper would be
 * asked to sign in every time the app opens. The file holds the phone number,
 * the consents, the permissions and the saved addresses - nothing that
 * matters more than the account itself.
 *
 * The native build keeps it in a file. The web build keeps it in local
 * storage, because the file system is not there.
 */

const WEB_KEY = 'medmate-session';

/* -------------------------------------------------------------------------- */
/*  The shapes                                                                 */
/* -------------------------------------------------------------------------- */

/** What the shopper has agreed to. */
export type Consents = {
  /** They confirmed they are 18 or older. Required. */
  adult: boolean;
  /** They asked for offers and refill reminders. Off unless they tick it. */
  offers: boolean;
};

/** Where a permission has got to. */
export type PermissionState = 'allowed' | 'ask-me' | 'denied';

/** The permissions the app asks for. */
export type Permissions = {
  location: PermissionState;
  notifications: PermissionState;
  camera: PermissionState;
  contacts: PermissionState;
};

/** A saved address the order can go to. */
export type SavedAddress = {
  id: string;
  /** The name of the place: Home, Work. */
  label: string;
  /** The address as it is written. */
  line: string;
  /** Who takes it. */
  receiver: string;
  /** The number the rider calls. */
  phone: string;
};

/** What is kept on the device. */
export type StoredSession = {
  signedIn: boolean;
  onboarded: boolean;
  phone: string;
  consents: Consents;
  permissions: Permissions;
  addresses: SavedAddress[];
  addressId: string;
};

/** The permissions as they are when nothing has been asked yet. */
export const defaultPermissions: Permissions = {
  location: 'ask-me',
  notifications: 'ask-me',
  camera: 'ask-me',
  contacts: 'ask-me',
};

/* -------------------------------------------------------------------------- */
/*  Checking what comes back                                                   */
/* -------------------------------------------------------------------------- */

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isString = (value: unknown): value is string => typeof value === 'string';

const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean';

const isPermissionState = (value: unknown): value is PermissionState =>
  value === 'allowed' || value === 'ask-me' || value === 'denied';

function parseAddress(value: unknown): SavedAddress | null {
  if (!isRecord(value)) return null;
  const { id, label, line, receiver, phone } = value;
  if (!isString(id) || !isString(label) || !isString(line)) return null;
  return {
    id,
    label,
    line,
    receiver: isString(receiver) ? receiver : '',
    phone: isString(phone) ? phone : '',
  };
}

/**
 * Check that what came off the disk is a session.
 *
 * The file can be truncated, written by an older version of the app, or
 * changed by hand. Anything that does not fit is dropped rather than passed
 * on, so a bad file cannot take the app down.
 */
function parseSession(raw: string): Partial<StoredSession> | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!isRecord(parsed)) return null;

  const session: Partial<StoredSession> = {};

  if (isBoolean(parsed.signedIn)) session.signedIn = parsed.signedIn;
  if (isBoolean(parsed.onboarded)) session.onboarded = parsed.onboarded;
  if (isString(parsed.phone)) session.phone = parsed.phone;
  if (isString(parsed.addressId)) session.addressId = parsed.addressId;

  if (isRecord(parsed.consents)) {
    session.consents = {
      adult: isBoolean(parsed.consents.adult) ? parsed.consents.adult : false,
      offers: isBoolean(parsed.consents.offers) ? parsed.consents.offers : false,
    };
  }

  if (isRecord(parsed.permissions)) {
    const permissions: Permissions = { ...defaultPermissions };
    for (const key of Object.keys(defaultPermissions) as (keyof Permissions)[]) {
      const value = parsed.permissions[key];
      if (isPermissionState(value)) permissions[key] = value;
    }
    session.permissions = permissions;
  }

  if (Array.isArray(parsed.addresses)) {
    session.addresses = parsed.addresses
      .map(parseAddress)
      .filter((address): address is SavedAddress => address !== null);
  }

  return session;
}

/* -------------------------------------------------------------------------- */
/*  Reading and writing                                                       */
/* -------------------------------------------------------------------------- */

/** The file, on the platforms that have one. */
function sessionFile(): File | null {
  if (Platform.OS === 'web') return null;
  try {
    return new File(Paths.document, 'medmate-session.json');
  } catch {
    return null;
  }
}

/**
 * Read the session back.
 *
 * A file that cannot be read is treated as no session, so a bad write never
 * stops the app from opening.
 */
export function readStoredSession(): Partial<StoredSession> | null {
  try {
    if (Platform.OS === 'web') {
      if (typeof localStorage === 'undefined') return null;
      const raw = localStorage.getItem(WEB_KEY);
      return raw ? parseSession(raw) : null;
    }
    const file = sessionFile();
    if (!file || !file.exists) return null;
    return parseSession(file.textSync());
  } catch {
    return null;
  }
}

/**
 * Write the session down.
 *
 * The write is synchronous on purpose: an async write cannot be caught by the
 * error handling around it, and two of them in flight can interleave and
 * leave the file holding half of each.
 */
export function writeStoredSession(session: StoredSession): void {
  try {
    const raw = JSON.stringify(session);
    if (Platform.OS === 'web') {
      if (typeof localStorage !== 'undefined') localStorage.setItem(WEB_KEY, raw);
      return;
    }
    const file = sessionFile();
    if (!file) return;
    file.create({ overwrite: true, intermediates: true });
    file.writeSync(raw);
  } catch {
    // A device that cannot write the file still works; the shopper signs in
    // again next time.
  }
}

/** Forget the session, for signing out. */
export function clearStoredSession(): void {
  try {
    if (Platform.OS === 'web') {
      if (typeof localStorage !== 'undefined') localStorage.removeItem(WEB_KEY);
      return;
    }
    const file = sessionFile();
    if (file?.exists) file.delete();
  } catch {
    // Nothing to do.
  }
}
