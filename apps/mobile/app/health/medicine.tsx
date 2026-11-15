import React from 'react';
import { useRouter } from 'expo-router';

import { AddMedicineScreen } from '../../src/health/AddMedicineScreen';
import { useNotice } from '../../src/state/notice';

/**
 * Add a medicine to the reminder schedule.
 */
export default function AddMedicineRoute() {
  const router = useRouter();
  const notice = useNotice();

  return (
    <AddMedicineScreen
      onBack={() => router.back()}
      onHelp={() => notice.notify('Help and support is one tap away')}
      onSave={() => router.replace({ pathname: '/health/schedule' })}
    />
  );
}
