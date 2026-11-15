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

/** The file, on the platforms that have one. */
function sessionFile(): File | null {
  if (Platform.OS === 'web') return null;
  try {
    return new File(Paths.document, 'medmate-session.json');
  } catch {
    return null;
  }
}

/** What is kept on the device. */
export type StoredSession = {
  signedIn: boolean;
  onboarded: boolean;
  phone: string;
  consents: { adult: boolean; offers: boolean };
  permissions: Record<string, string>;
  addresses: unknown[];
  addressId: string;
};

/**
 * Read the session back.
 *
 * A file that cannot be read is simply treated as no session, so a bad write
 * never stops the app from opening.
 */
export function readStoredSession(): Partial<StoredSession> | null {
  try {
    if (Platform.OS === 'web') {
      if (typeof localStorage === 'undefined') return null;
      const raw = localStorage.getItem(WEB_KEY);
      return raw ? (JSON.parse(raw) as Partial<StoredSession>) : null;
    }
    const file = sessionFile();
    if (!file || !file.exists) return null;
    const raw = file.textSync();
    return raw ? (JSON.parse(raw) as Partial<StoredSession>) : null;
  } catch {
    return null;
  }
}

/** Write the session down. */
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
    file.write(raw);
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
