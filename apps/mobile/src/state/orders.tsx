import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

import {
  notifications as seedNotifications,
  orders as seedOrders,
  type AppNotification,
  type Order,
} from '../orders/data';

/**
 * The orders.
 *
 * The checkout writes an order here when the shopper places it, and the
 * tracking and notifications screens read it back. The mock catalogue has no
 * backend, so the orders live in memory for the session, like the cart.
 */

export type OrdersContextValue = {
  /** Every order the shopper has. */
  orders: Order[];
  /** The order being looked at, if any. */
  selectedOrderId?: string;
  /** Look at an order. */
  selectOrder: (id: string) => void;
  /** Put an order on the list. Called when the checkout places one. */
  placeOrder: (order: Order) => void;
  /** Cancel an order. */
  cancelOrder: (id: string) => void;
  /** The notifications. */
  notifications: AppNotification[];
  /** Mark every notification as read. */
  markAllRead: () => void;
  /** Whether the shopper wants alerts about their orders. */
  alertsOn: boolean;
  /** Turn the alerts on or off. */
  setAlertsOn: (value: boolean) => void;
};

const OrdersContext = createContext<OrdersContextValue | null>(null);

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(seedOrders);
  const [selectedOrderId, setSelectedOrderId] = useState<string | undefined>(undefined);
  const [notifications, setNotifications] = useState<AppNotification[]>(seedNotifications);
  const [alertsOn, setAlertsOn] = useState(false);

  const selectOrder = useCallback((id: string) => setSelectedOrderId(id), []);

  const placeOrder = useCallback((order: Order) => {
    setOrders((current) => [order, ...current.filter((entry) => entry.id !== order.id)]);
    setSelectedOrderId(order.id);
  }, []);

  const cancelOrder = useCallback((id: string) => {
    setOrders((current) =>
      current.map((order) => (order.id === id ? { ...order, stage: 'cancelled' } : order)),
    );
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((current) => current.map((item) => ({ ...item, unread: false })));
  }, []);

  const value = useMemo<OrdersContextValue>(
    () => ({
      orders,
      selectedOrderId,
      selectOrder,
      placeOrder,
      cancelOrder,
      notifications,
      markAllRead,
      alertsOn,
      setAlertsOn,
    }),
    [
      orders,
      selectedOrderId,
      selectOrder,
      placeOrder,
      cancelOrder,
      notifications,
      markAllRead,
      alertsOn,
    ],
  );

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

/** The orders store. */
export function useOrders(): OrdersContextValue {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used inside an OrdersProvider');
  }
  return context;
}
