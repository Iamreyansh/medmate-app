import React from 'react';
import { useRouter } from 'expo-router';

import { NotificationsScreen } from '../src/orders/NotificationsScreen';
import { useNotice } from '../src/state/notice';

/**
 * The notifications route.
 *
 * The bell in the brand zone opens it.
 */
export default function NotificationsRoute() {
  const router = useRouter();
  const notice = useNotice();

  return (
    <NotificationsScreen
      onBack={() => router.back()}
      onMarkAllRead={() => notice.notify('All caught up')}
      onOpen={(orderId) =>
        router.push({ pathname: '/orders/track', params: { id: orderId } })
      }
    />
  );
}
