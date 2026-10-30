import React from 'react';
import { OrderStatus, PaymentStatus, PaymentMethod } from '../types';

export const OrderStatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
  const styles: Record<OrderStatus, string> = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
    processing: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    shipped: 'bg-purple-50 text-purple-700 border-purple-200',
    delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    cancelled: 'bg-rose-50 text-rose-700 border-rose-200'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export const PaymentStatusBadge: React.FC<{ status: PaymentStatus }> = ({ status }) => {
  const styles: Record<PaymentStatus, string> = {
    paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    failed: 'bg-rose-50 text-rose-700 border-rose-200',
    refunded: 'bg-slate-50 text-slate-700 border-slate-200'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
      <span className={`w-1.5 h-1.5 mr-1.5 rounded-full ${status === 'paid' ? 'bg-emerald-500' : status === 'failed' ? 'bg-rose-500' : 'bg-amber-500'}`}></span>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export const PaymentMethodBadge: React.FC<{ method: PaymentMethod }> = ({ method }) => {
  const colors: Record<PaymentMethod, string> = {
    UPI: 'bg-emerald-100 text-emerald-800',
    'Credit Card': 'bg-blue-100 text-blue-800',
    'Debit Card': 'bg-cyan-100 text-cyan-800',
    'Net Banking': 'bg-violet-100 text-violet-800',
    'Cash on Delivery': 'bg-amber-100 text-amber-800'
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${colors[method] || 'bg-gray-100 text-gray-800'}`}>
      {method}
    </span>
  );
};

