import React from 'react';
import { useRouter } from 'expo-router';

import { DosageReminderScreen } from '../../src/health/DosageReminderScreen';
import { useNotice } from '../../src/state/notice';

/**
 * The medicine dosage reminder.
 */
export default function ScheduleRoute() {
  const router = useRouter();
  const notice = useNotice();

  return (
    <DosageReminderScreen
      onBack={() => router.back()}
      onHelp={() => notice.notify('Help and support is one tap away')}
      onFamily={() => router.push({ pathname: '/health/family' })}
      onAddMedicine={() => router.push({ pathname: '/health/medicine' })}
      onRefill={() => router.push({ pathname: '/' })}
    />
  );
}
