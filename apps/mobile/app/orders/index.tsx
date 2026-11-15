import React from 'react';
import { useRouter } from 'expo-router';

import { MyOrdersScreen } from '../../src/orders/MyOrdersScreen';
import { useNotice } from '../../src/state/notice';

/**
 * The orders route.
 *
 * The account screen links here. The orders themselves live in the orders
 * store, so the list is the same on every device the shopper opens the app
 * on.
 */
export default function OrdersRoute() {
  const router = useRouter();
  const notice = useNotice();

  return (
    <MyOrdersScreen
      onBack={() => router.back()}
      onHelp={() => notice.notify('Help and support is one tap away')}
      onTrack={(orderId) =>
        router.push({ pathname: '/orders/track', params: { id: orderId } })
      }
      onCancel={(orderId) =>
        router.push({ pathname: '/orders/track', params: { id: orderId, cancel: '1' } })
      }
      onVerify={(orderId) =>
        router.push({ pathname: '/orders/track', params: { id: orderId } })
      }
      onTabPress={(id) =>
        router.push(id === 'pharmacy' ? { pathname: '/pharmacies' } : { pathname: '/' })
      }
    />
  );
}
