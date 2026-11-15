import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { clearStoredSession, readStoredSession, writeStoredSession } from './sessionStore';

/**
 * The session.
 *
 * The Figma `01 Onboarding` frames are a five-screen sign-in: splash, login,
 * OTP, consent and location. Until there is a session there is nobody for
 * the cart, the orders, the prescriptions or the wallet to belong to, so the
 * session is what the onboarding flow produces.
 *
 * The mock catalogue has no backend, so the session lives in memory for the
 * session.
 */

/** What the shopper has agreed to. */
export type Consents = {
  /** They confirmed they are 18 or older. Required. */
  adult: boolean;
  /** They asked for offers and refill reminders. Off unless they tick it. */
  offers: boolean;
};

/** The permissions the app asks for. */
export type PermissionState = 'allowed' | 'ask-me';

/** The permissions the shopper has been asked about. */
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
  /** Whether the order goes here by default. */
  deliveringHere?: boolean;
};

export type SessionContextValue = {
  /** There is a signed-in shopper. */
  signedIn: boolean;
  /** The shopper has finished the onboarding flow. */
  onboarded: boolean;
  /** Mark the onboarding as finished. */
  finishOnboarding: () => void;
  /** The mobile number they signed in with. */
  phone: string;
  /** Sign in with a mobile number. */
  signIn: (phone: string) => void;
  /** Sign out and clear everything the session held. */
  signOut: () => void;
  /** What they agreed to. */
  consents: Consents;
  /** Record what they agreed to. */
  setConsents: (consents: Consents) => void;
  /** The permissions they have been asked about. */
  permissions: Permissions;
  /** Record a permission. */
  setPermission: (key: keyof Permissions, state: PermissionState) => void;
  /** The saved addresses. */
  addresses: SavedAddress[];
  /** Add an address. */
  addAddress: (address: SavedAddress) => void;
  /** The address the order goes to. */
  addressId: string;
  /** Choose the address the order goes to. */
  setAddressId: (id: string) => void;
};

const SessionContext = createContext<SessionContextValue | null>(null);

/** The addresses the location screen offers. */
export const seedAddresses: SavedAddress[] = [
  {
    id: 'home',
    label: 'Home',
    line: 'Flat 302, Sri Sai Residency, 7th Cross, Jayanagar 4th Block, 560011',
    receiver: 'Priya',
    phone: '+91 98450 12345',
    deliveringHere: true,
  },
  {
    id: 'work',
    label: 'Work',
    line: '4th Floor, 80 Feet Road, Koramangala 6th Block, 560095',
    receiver: 'Priya',
    phone: '+91 98450 12345',
  },
];

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [signedIn, setSignedIn] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [restored, setRestored] = useState(false);
  const [phone, setPhone] = useState('+91 98450 12345');
  const [consents, setConsents] = useState<Consents>({ adult: false, offers: false });
  const [permissions, setPermissions] = useState<Permissions>({
    location: 'ask-me',
    notifications: 'ask-me',
    camera: 'ask-me',
    contacts: 'ask-me',
  });
  const [addresses, setAddresses] = useState<SavedAddress[]>(seedAddresses);
  const [addressId, setAddressId] = useState('home');

  // The session is read back on the first render, so a shopper who has been
  // through the flow is not asked for it again.
  useEffect(() => {
    const stored = readStoredSession();
    if (stored) {
      if (stored.signedIn) setSignedIn(true);
      if (stored.onboarded) setOnboarded(true);
      if (stored.phone) setPhone(stored.phone);
      if (stored.consents) setConsents(stored.consents);
      if (stored.addresses) setAddresses(stored.addresses as SavedAddress[]);
      if (stored.addressId) setAddressId(stored.addressId);
      if (stored.permissions) {
        setPermissions((current) => ({ ...current, ...stored.permissions }) as Permissions);
      }
    }
    setRestored(true);
  }, []);

  const signIn = useCallback((value: string) => {
    setPhone(value);
    setSignedIn(true);
  }, []);

  const finishOnboarding = useCallback(() => setOnboarded(true), []);

  const signOut = useCallback(() => {
    setSignedIn(false);
    setOnboarded(false);
    clearStoredSession();
    setConsents({ adult: false, offers: false });
    setPermissions({
      location: 'ask-me',
      notifications: 'ask-me',
      camera: 'ask-me',
      contacts: 'ask-me',
    });
  }, []);

  const setPermission = useCallback((key: keyof Permissions, state: PermissionState) => {
    setPermissions((current) => ({ ...current, [key]: state }));
  }, []);

  const addAddress = useCallback((address: SavedAddress) => {
    setAddresses((current) => [...current, address]);
    setAddressId(address.id);
  }, []);

  useEffect(() => {
    if (!restored) return;
    writeStoredSession({
      signedIn,
      onboarded,
      phone,
      consents,
      permissions: permissions as unknown as Record<string, string>,
      addresses,
      addressId,
    });
  }, [restored, signedIn, onboarded, phone, consents, permissions, addresses, addressId]);

  const value = useMemo<SessionContextValue>(
    () => ({
      signedIn,
      onboarded,
      finishOnboarding,
      phone,
      signIn,
      signOut,
      consents,
      setConsents,
      permissions,
      setPermission,
      addresses,
      addAddress,
      addressId,
      setAddressId,
    }),
    [
      signedIn,
      onboarded,
      finishOnboarding,
      phone,
      signIn,
      signOut,
      consents,
      permissions,
      setPermission,
      addresses,
      addAddress,
      addressId,
    ],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

/** The session. */
export function useSession(): SessionContextValue {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used inside a SessionProvider');
  }
  return context;
}
