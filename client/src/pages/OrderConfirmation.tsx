import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import {
  CheckCircle,
  Copy,
  Check,
  Package,
  Truck,
  ArrowRight,
  Database,
  Calendar,
  CreditCard
} from 'lucide-react';
import { Order } from '../types';
import { fetchOrders } from '../services/api';
import { OrderStatusBadge, PaymentStatusBadge, PaymentMethodBadge } from '../components/StatusBadge';

export const OrderConfirmation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [order, setOrder] = useState<Order | null>(
    (location.state as { order?: Order })?.order || null
  );
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    async function load() {
      if (order || !id) return;
      try {
        const orders = await fetchOrders(100);
        const match = orders.find((o) => o.order_id === id);
        if (match) setOrder(match);
      } catch (err) {
        console.error('Failed to load order', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, order]);

  const copyOrderId = () => {
    if (order?.order_id) {
      navigator.clipboard.writeText(order.order_id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full animate-pulse mx-auto mb-4" />
        <div className="h-6 bg-slate-100 rounded w-48 mx-auto animate-pulse" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Order Information Unavailable</h2>
        <p className="text-slate-500">We could not find the details for this order ID.</p>
        <Link to="/products" className="inline-block px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Order Placed Successfully!
        </h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Thank you for shopping with DataTrace Store. Your order has been registered in the database and streamed to the data pipeline.
        </p>

        {/* Order ID Pill with Copy button */}
        <div className="inline-flex items-center space-x-2 bg-slate-100 border border-slate-300 px-4 py-2 rounded-xl text-sm font-mono mt-2">
          <span className="text-slate-500">Order ID:</span>
          <span className="font-bold text-slate-900">{order.order_id}</span>
          <button
            onClick={copyOrderId}
            className="p-1 hover:bg-slate-200 rounded text-slate-600 transition"
            title="Copy Order ID"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Pipeline Status Notice */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Database className="w-5 h-5 text-cyan-400 shrink-0" />
          <div className="text-xs">
            <span className="font-bold text-cyan-300 block">DataTrace Pipeline Ingested</span>
            <span className="text-slate-300">
              Payload ready for Airflow ingestion DAG • Source: {order.source || 'storefront'}
            </span>
          </div>
        </div>
        <Link
          to="/admin"
          className="text-xs bg-cyan-500 text-slate-950 font-bold px-3 py-1.5 rounded-lg hover:bg-cyan-400 transition shrink-0"
        >
          View in Dashboard →
        </Link>
      </div>

      {/* Simulated Order Progress Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Order Status Tracker
        </h3>
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          <div className="space-y-1">
            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto font-bold text-[10px]">
              ✓
            </div>
            <div className="font-bold text-slate-900">Order Placed</div>
            <div className="text-[10px] text-slate-400">{new Date(order.order_timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          </div>

          <div className="space-y-1">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto font-bold text-[10px]">
              2
            </div>
            <div className="font-bold text-slate-900">Confirmed</div>
            <div className="text-[10px] text-emerald-600 font-semibold">Payment Paid</div>
          </div>

          <div className="space-y-1">
            <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center mx-auto font-bold text-[10px]">
              3
            </div>
            <div className="text-slate-600 font-medium">Packing</div>
            <div className="text-[10px] text-slate-400">Warehouse</div>
          </div>

          <div className="space-y-1">
            <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center mx-auto font-bold text-[10px]">
              4
            </div>
            <div className="text-slate-600 font-medium">Delivery</div>
            <div className="text-[10px] text-slate-400">Est. 2-3 Days</div>
          </div>
        </div>
      </div>

      {/* Order Details Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <h2 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
          Order Summary & Details
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          {/* Customer & Shipping info */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
              Delivery Information
            </h4>
            <div className="text-slate-900 font-bold text-sm">{order.customer_name}</div>
            <div className="text-slate-600">{order.customer_email}</div>
            <div className="text-slate-600 leading-relaxed">
              {order.shipping_address}<br />
              {order.city}, {order.state} - {order.postal_code}<br />
              {order.country}
            </div>
          </div>

          {/* Payment & Status info */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
              Payment & Status
            </h4>
            <div className="flex items-center space-x-2">
              <span className="text-slate-500">Method:</span>
              <PaymentMethodBadge method={order.payment_method} />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-slate-500">Payment:</span>
              <PaymentStatusBadge status={order.payment_status} />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-slate-500">Order Status:</span>
              <OrderStatusBadge status={order.order_status} />
            </div>
            <div className="flex items-center space-x-2 text-slate-500 pt-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{new Date(order.order_timestamp).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Item Line */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex justify-between items-center py-2 text-sm">
            <div>
              <div className="font-bold text-slate-900">{order.product_name}</div>
              <div className="text-xs text-slate-400">
                Category: {order.category} • Qty: {order.quantity} × ₹{order.unit_price.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="font-extrabold text-slate-900 text-base">
              ₹{order.total_amount.toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
        <Link
          to="/products"
          className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50"
        >
          ← Continue Shopping
        </Link>

        <div className="flex space-x-3">
          <Link
            to="/order-history"
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800"
          >
            All Order History
          </Link>
          <Link
            to="/admin"
            className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 flex items-center space-x-1"
          >
            <span>Telemetry Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

