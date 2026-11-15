import React from 'react';
import { useRouter } from 'expo-router';

import { ProfileScreen } from '../../src/account/ProfileScreen';
import { useNotice } from '../../src/state/notice';

/**
 * Edit the profile.
 */
export default function ProfileRoute() {
  const router = useRouter();
  const notice = useNotice();

  return (
    <ProfileScreen
      onBack={() => router.back()}
      onHelp={() => notice.notify('Help and support is one tap away')}
      onSave={() => router.back()}
    />
  );
}
