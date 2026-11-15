import React from 'react';
import { useRouter } from 'expo-router';

import { FamilyMemberScreen } from '../../src/health/FamilyMemberScreen';
import { useNotice } from '../../src/state/notice';

/**
 * Add a family member.
 */
export default function FamilyMemberRoute() {
  const router = useRouter();
  const notice = useNotice();

  return (
    <FamilyMemberScreen
      onBack={() => router.back()}
      onHelp={() => notice.notify('Help and support is one tap away')}
      onSave={() => router.replace({ pathname: '/health/family' })}
    />
  );
}
