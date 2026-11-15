import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  clearStoredSession,
  defaultPermissions,
  readStoredSession,
  writeStoredSession,
  type Consents,
  type Permissions,
  type PermissionState,
  type SavedAddress,
} from './sessionStore';

export type { Consents, Permissions, PermissionState, SavedAddress };

/**
 * The session.
 *
 * The Figma `01 Onboarding` frames are a five-screen sign-in: splash, login,
 * OTP, consent and location. Until there is a session there is nobody for
 * the cart, the orders, the prescriptions or the wallet to belong to, so the
 * session is what the onboarding flow produces.
 *
 * The mock catalogue has no backend, so the session lives on the device for as
 * long as the shopper is signed in.
 */

/** The addresses the location screen offers. */
export const seedAddresses: SavedAddress[] = [
  {
    id: 'home',
    label: 'Home',
    line: 'Flat 302, Sri Sai Residency, 7th Cross, Jayanagar 4th Block, 560011',
    receiver: 'Priya',
    phone: '+91 98450 12345',
  },
  {
    id: 'work',
    label: 'Work',
    line: '4th Floor, 80 Feet Road, Koramangala 6th Block, 560095',
    receiver: 'Priya',
    phone: '+91 98450 12345',
  },
];

export type SessionContextValue = {
  /** The shopper has been through the sign-in. */
  signedIn: boolean;
  /** The shopper has finished the onboarding flow. */
  onboarded: boolean;
  /** Mark the onboarding as finished. */
  finishOnboarding: () => void;
  /** The mobile number they signed in with. */
  phone: string;
  /** Sign in with a mobile number. */
  signIn: (phone: string) => void;
  /** Hold the number while the code is being checked. */
  setPhone: (phone: string) => void;
  /** Sign out and clear everything the session held. */
  signOut: () => void;
  /** What they agreed to. */
  consents: Consents;
  /** Record what they agreed to. */
  setConsents: (consents: Consents) => void;
  /** The permissions they have been asked about. */
  permissions: Permissions;
  /** Record the answer to a permission. */
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

export function SessionProvider({ children }: { children: React.ReactNode }) {
  // The stored session is read before the first render, so the gate that
  // sends a shopper back to the sign-in never sees a session that has not
  // been read back yet.
  const [stored] = useState(() => readStoredSession());

  const [signedIn, setSignedIn] = useState(stored?.signedIn ?? false);
  const [onboarded, setOnboarded] = useState(stored?.onboarded ?? false);
  const [phone, setPhoneValue] = useState(stored?.phone ?? '');
  const [consents, setConsents] = useState<Consents>(
    stored?.consents ?? { adult: false, offers: false },
  );
  const [permissions, setPermissions] = useState<Permissions>(
    stored?.permissions ?? defaultPermissions,
  );
  const [addresses, setAddresses] = useState<SavedAddress[]>(
    stored?.addresses?.length ? stored.addresses : seedAddresses,
  );
  const [addressId, setAddressId] = useState(stored?.addressId ?? 'home');

  const signIn = useCallback((value: string) => {
    setPhoneValue(value);
    setSignedIn(true);
  }, []);

  const finishOnboarding = useCallback(() => setOnboarded(true), []);

  const setPhone = useCallback((value: string) => setPhoneValue(value), []);

  const signOut = useCallback(() => {
    setSignedIn(false);
    setOnboarded(false);
    setPhoneValue('');
    setConsents({ adult: false, offers: false });
    setPermissions(defaultPermissions);
    setAddresses(seedAddresses);
    setAddressId('home');
    clearStoredSession();
  }, []);

  const setPermission = useCallback((key: keyof Permissions, state: PermissionState) => {
    setPermissions((current) => ({ ...current, [key]: state }));
  }, []);

  const addAddress = useCallback((address: SavedAddress) => {
    setAddresses((current) => [...current, address]);
    setAddressId(address.id);
  }, []);

  // The session is written down whenever it changes. Nothing is written
  // while the shopper is signed out, so signing out really does leave the
  // device clean.
  useEffect(() => {
    if (!signedIn) return;
    writeStoredSession({
      signedIn,
      onboarded,
      phone,
      consents,
      permissions,
      addresses,
      addressId,
    });
  }, [signedIn, onboarded, phone, consents, permissions, addresses, addressId]);

  const value = useMemo<SessionContextValue>(
    () => ({
      signedIn,
      onboarded,
      finishOnboarding,
      phone,
      setPhone,
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
      setPhone,
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
