import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { TrackScreen } from '../../src/orders/TrackScreen';
import { useNotice } from '../../src/state/notice';
import { useOrders } from '../../src/state/orders';

/**
 * The track-order route.
 *
 * `id` names the order. The screen shows where that order has got to, which
 * is the same screen whatever the stage - the Figma draws it four times.
 */
export default function TrackOrderRoute() {
  const router = useRouter();
  const notice = useNotice();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const store = useOrders();

  return (
    <TrackScreen
      orderId={id}
      onBack={() => router.back()}
      onHelp={() => notice.notify('Help and support is one tap away')}
      onCancel={(orderId) => store.cancelOrder(orderId)}
      onConfirmCancel={(orderId) =>
        notice.notify(`Order #${orderId} cancelled. Nothing was charged.`)
      }
      onItems={() => router.push({ pathname: '/orders' })}
      onHome={() => router.push({ pathname: '/' })}
    />
  );
}
