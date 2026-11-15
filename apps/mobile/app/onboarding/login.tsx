import React from 'react';
import { useRouter } from 'expo-router';

import { LoginScreen } from '../../src/onboarding/LoginScreen';
import { useNotice } from '../../src/state/notice';
import { useSession } from '../../src/state/session';

/**
 * Log in or sign up.
 */
export default function LoginRoute() {
  const router = useRouter();
  const notice = useNotice();
  const session = useSession();

  return (
    <LoginScreen
      onBack={() => router.back()}
      onHelp={() => notice.notify('Help and support is one tap away')}
      onGetCode={(phone) => {
        session.signIn(phone);
        router.push({ pathname: '/onboarding/otp', params: { phone } });
      }}
    />
  );
}
