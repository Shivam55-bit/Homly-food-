import React from 'react';
import { OrderStatus, PaymentStatus, SubscriptionStatus } from '../../types';

interface Props {
  status: OrderStatus | PaymentStatus | SubscriptionStatus | 'in_stock' | 'low_stock' | 'out_of_stock' | string;
}

export const StatusBadge: React.FC<Props> = ({ status }) => {
  let bg = 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200';

  switch (status) {
    case 'delivered':
    case 'paid':
    case 'active':
    case 'in_stock':
      bg = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800';
      break;
    case 'out_for_delivery':
      bg = 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-300 dark:border-blue-800 animate-pulse';
      break;
    case 'preparing':
    case 'pending':
    case 'paused':
    case 'low_stock':
      bg = 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800';
      break;
    case 'cancelled':
    case 'failed':
    case 'expired':
    case 'out_of_stock':
      bg = 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800';
      break;
    case 'placed':
      bg = 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-300 dark:border-purple-800';
      break;
    default:
      bg = 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${bg}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
};
