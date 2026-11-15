import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { OtpScreen } from '../../src/onboarding/OtpScreen';
import { useNotice } from '../../src/state/notice';
import { demoCode } from '../../src/onboarding/data';
import { useSession } from '../../src/state/session';

/**
 * Enter the code.
 *
 * The demo build takes the code 1234.
 */
export default function OtpRoute() {
  const router = useRouter();
  const notice = useNotice();
  const session = useSession();
  const { phone } = useLocalSearchParams<{ phone?: string }>();
  const number = phone ?? session.phone;

  return (
    <OtpScreen
      phone={number}
      onBack={() => router.back()}
      onHelp={() => notice.notify('Help and support is one tap away')}
      onChangeNumber={() => router.replace({ pathname: '/onboarding/login' })}
      onVerify={(code) => {
        if (code !== demoCode) return;
        session.signIn(number);
        router.replace({ pathname: '/onboarding/consent' });
      }}
    />
  );
}
