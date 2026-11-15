import React from 'react';
import { useRouter } from 'expo-router';

import { FamilyScreen } from '../../src/health/FamilyScreen';
import { useNotice } from '../../src/state/notice';

/**
 * The family members.
 */
export default function FamilyRoute() {
  const router = useRouter();
  const notice = useNotice();

  return (
    <FamilyScreen
      onBack={() => router.back()}
      onHelp={() => notice.notify('Help and support is one tap away')}
      onAddMember={() => router.push({ pathname: '/health/member' })}
      onSchedule={() => router.push({ pathname: '/health/schedule' })}
    />
  );
}
