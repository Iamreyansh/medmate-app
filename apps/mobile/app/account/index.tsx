import React from 'react';
import { useRouter } from 'expo-router';

import { AccountScreen } from '../../src/account/AccountScreen';
import { useNotice } from '../../src/state/notice';

/**
 * My account.
 *
 * The bottom chrome on the home screen leads here, and so do the links in
 * the account list.
 */
export default function AccountRoute() {
  const router = useRouter();
  const notice = useNotice();

  const open = (id: string) => {
    switch (id) {
      case 'orders':
        router.push({ pathname: '/orders' });
        break;
      case 'prescriptions':
        router.push({ pathname: '/care' });
        break;
      case 'requests':
        router.push({ pathname: '/care/requests' });
        break;
      case 'schedule':
        router.push({ pathname: '/health/schedule' });
        break;
      case 'family':
        router.push({ pathname: '/health/family' });
        break;
      case 'abha':
        router.push({ pathname: '/account/abha' });
        break;
      case 'consult':
        router.push({ pathname: '/care/consultation' });
        break;
      case 'addresses':
        router.push({ pathname: '/address' });
        break;
      case 'notifications':
        router.push({ pathname: '/notifications' });
        break;
      case 'privacy':
        router.push({ pathname: '/account/privacy' });
        break;
      case 'help':
        router.push({ pathname: '/account/help' });
        break;
      case 'privacy-policy':
      case 'terms':
        router.push({ pathname: '/account/legal' });
        break;
      case 'refunds':
        router.push({ pathname: '/account/legal' });
        break;
      case 'refer':
        router.push({ pathname: '/account/refer' });
        break;
      case 'partner':
        router.push({ pathname: '/account/partner' });
        break;
      case 'offers':
        router.push({ pathname: '/offers' });
        break;
      default:
        notice.notify('That part of the account is not built yet');
        break;
    }
  };

  return (
    <AccountScreen
      onBack={() => router.back()}
      onHelp={() => notice.notify('Help and support is one tap away')}
      onLink={open}
      onEdit={() => router.push({ pathname: '/account/profile' })}
      onTabPress={(id) =>
        router.push(id === 'pharmacy' ? { pathname: '/pharmacies' } : { pathname: '/' })
      }
    />
  );
}
