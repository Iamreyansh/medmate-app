import React from 'react';
import { useRouter } from 'expo-router';

import { ScheduleFromPrescriptionScreen } from '../../src/health/ScheduleFromPrescriptionScreen';
import { useNotice } from '../../src/state/notice';

/**
 * Turn an e-prescription into a reminder schedule.
 */
export default function FromPrescriptionRoute() {
  const router = useRouter();
  const notice = useNotice();

  return (
    <ScheduleFromPrescriptionScreen
      onBack={() => router.back()}
      onHelp={() => notice.notify('Help and support is one tap away')}
      onConfirm={() => router.replace({ pathname: '/health/schedule' })}
    />
  );
}
