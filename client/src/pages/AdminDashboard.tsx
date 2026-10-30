import React, { useState, useEffect } from 'react';
import {
  Play,
  Square,
  Zap,
  Clock,
  Download,
  Activity,
  DollarSign,
  TrendingUp,
  Database,
  ArrowUpRight,
  ShieldCheck,
  RefreshCw,
  Sliders,
  Send,
  Radio,
  FileSpreadsheet,
  FileCode,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';
import { useSimulator } from '../context/SimulatorContext';
import {
  getExportCsvUrl,
  getExportJsonUrl,
  fetchStats,
  updateDataTraceConfig
} from '../services/api';
import { OrderStats, Order } from '../types';
import { OrderStatusBadge, PaymentStatusBadge, PaymentMethodBadge } from '../components/StatusBadge';

const CATEGORY_COLORS = ['#3b82f6', '#ec4899', '#f59e0b', '#10b981', '#8b5cf6', '#06b6d4', '#6366f1'];
const PAYMENT_COLORS = ['#10b981', '#3b82f6', '#06b6d4', '#8b5cf6', '#f59e0b'];
const STATUS_COLORS = ['#3b82f6', '#6366f1', '#a855f7', '#10b981', '#f43f5e', '#f59e0b'];

export const AdminDashboard: React.FC = () => {
  const {
    status,
    orders,
    isLoading,
    isActionLoading,
    start,
    stop,
    generateNow,
    changeInterval
  } = useSimulator();

  const [stats, setStats] = useState<OrderStats | null>(null);
  const [selectedIntervalSec, setSelectedIntervalSec] = useState<number>(5);
  const [searchTable, setSearchTable] = useState('');
  const [dataTraceUrlInput, setDataTraceUrlInput] = useState('');
  const [dataTraceSaved, setDataTraceSaved] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);

  // Sync selected interval with status
  useEffect(() => {
    if (status?.intervalSec) {
      setSelectedIntervalSec(status.intervalSec);
    }
  }, [status?.intervalSec]);

  // Load / update chart stats
  const loadStats = async () => {
    try {
      const data = await fetchStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load chart stats', err);
    }
  };

  useEffect(() => {
    loadStats();
    // Update charts whenever new orders arrive
  }, [orders.length]);

  const handleStart = async () => {
    await start(selectedIntervalSec * 1000);
    await loadStats();
  };

  const handleStop = async () => {
    await stop();
    await loadStats();
  };

  const handleGenerateNow = async () => {
    await generateNow();
    await loadStats();
  };

  const handleIntervalSelect = async (sec: number) => {
    setSelectedIntervalSec(sec);
    await changeInterval(sec);
  };

  const handleSaveDataTraceUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateDataTraceConfig(dataTraceUrlInput);
      setDataTraceSaved(true);
      setTimeout(() => setDataTraceSaved(false), 3000);
    } catch (err) {
      console.error('Failed to update DataTrace API URL', err);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (!searchTable) return true;
    const q = searchTable.toLowerCase();
    return (
      o.order_id.toLowerCase().includes(q) ||
      o.customer_name.toLowerCase().includes(q) ||
      o.product_name.toLowerCase().includes(q) ||
      o.city.toLowerCase().includes(q) ||
      o.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      {/* Telemetry Header */}
      <div className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Activity className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl font-black tracking-tight text-white font-mono">
                    DATATRACE // ORDER SIMULATOR TELEMETRY
                  </h1>
                  {status?.isRunning ? (
                    <span className="flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      <span className="relative flex h-2 w-2 mr-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      LIVE STREAMING
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                      STOPPED
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  High-Frequency Indian E-Commerce Transaction Data Generator
                </p>
              </div>
            </div>

            {/* Quick Export Actions */}
            <div className="flex items-center space-x-2">
              <a
                href={getExportCsvUrl()}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-slate-200 border border-slate-700 flex items-center space-x-1.5 transition"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-blue-400" />
                <span>Export CSV</span>
              </a>
              <a
                href={getExportJsonUrl()}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-slate-200 border border-slate-700 flex items-center space-x-1.5 transition"
              >
                <FileCode className="w-3.5 h-3.5 text-emerald-400" />
                <span>Export JSON</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Simulator Command & Control Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            {/* Simulator Status & Interval Display */}
            <div className="space-y-2">
              <div className="text-xs font-mono text-cyan-400 font-bold tracking-wider uppercase flex items-center">
                <Radio className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
                GENERATOR ENGINE STATUS
              </div>
              <div className="flex items-center space-x-3">
                <span className={`text-3xl font-black font-mono ${status?.isRunning ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {status?.isRunning ? 'RUNNING' : 'STOPPED'}
                </span>
                <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                  Cadence: Every <strong className="text-cyan-400">{status?.intervalSec || 5}s</strong>
                </span>
              </div>
              <p className="text-xs text-slate-400 max-w-md leading-relaxed">
                {status?.isRunning
                  ? `Order engine is automatically pushing 1 realistic transaction every ${status.intervalSec} seconds to the persistent store.`
                  : 'Order generator is paused. Click START to begin continuous 5-second order generation.'}
              </p>
            </div>

            {/* Cadence Selector */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400 font-semibold block">
                Interval Setting (Default: 5s):
              </label>
              <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
                {[1, 2, 5, 10, 15].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => handleIntervalSelect(sec)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition ${
                      selectedIntervalSec === sec
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {sec}s {sec === 5 ? '★' : ''}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons: START, STOP, GENERATE NOW */}
            <div className="flex flex-wrap items-center gap-3">
              {/* START SIMULATOR */}
              <button
                onClick={handleStart}
                disabled={status?.isRunning || isActionLoading}
                className={`px-5 py-3 rounded-xl font-mono font-bold text-xs uppercase tracking-wider flex items-center space-x-2 transition-all shadow-lg ${
                  status?.isRunning
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/25 active:scale-95'
                }`}
                title="Start 5-second continuous order generation"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>START SIMULATOR</span>
              </button>

              {/* STOP SIMULATOR */}
              <button
                onClick={handleStop}
                disabled={!status?.isRunning || isActionLoading}
                className={`px-5 py-3 rounded-xl font-mono font-bold text-xs uppercase tracking-wider flex items-center space-x-2 transition-all shadow-lg ${
                  !status?.isRunning
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-500/25 active:scale-95'
                }`}
                title="Stop generation immediately"
              >
                <Square className="w-4 h-4 fill-current" />
                <span>STOP SIMULATOR</span>
              </button>

              {/* GENERATE ORDER NOW */}
              <button
                onClick={handleGenerateNow}
                disabled={isActionLoading}
                className="px-5 py-3 rounded-xl font-mono font-bold text-xs uppercase tracking-wider bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-500/25 flex items-center space-x-2 transition-all active:scale-95"
                title="Instantly generate and store one order"
              >
                <Zap className="w-4 h-4" />
                <span>GENERATE ORDER NOW</span>
              </button>
            </div>
          </div>
        </div>

        {/* Real-time KPI Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Total Orders */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
            <span className="text-[11px] font-mono text-slate-400 uppercase">Orders Generated</span>
            <div className="text-2xl font-black font-mono text-white">
              {status?.totalOrders ? status.totalOrders.toLocaleString('en-IN') : '0'}
            </div>
            <div className="text-[10px] text-cyan-400 font-mono">SQLite DB Persisted</div>
          </div>

          {/* Orders Per Minute */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
            <span className="text-[11px] font-mono text-slate-400 uppercase">Orders / Minute</span>
            <div className="text-2xl font-black font-mono text-emerald-400">
              {status?.ordersPerMinute || 0} <span className="text-xs font-normal text-slate-400">OPM</span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono">Rolling 60s Window</div>
          </div>

          {/* Total Revenue */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
            <span className="text-[11px] font-mono text-slate-400 uppercase">Total Revenue</span>
            <div className="text-2xl font-black font-mono text-cyan-400">
              ₹{status?.totalRevenue ? status.totalRevenue.toLocaleString('en-IN') : '0'}
            </div>
            <div className="text-[10px] text-slate-500 font-mono">Gross Order Value</div>
          </div>

          {/* Average Order Value */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
            <span className="text-[11px] font-mono text-slate-400 uppercase">Avg Order Value</span>
            <div className="text-2xl font-black font-mono text-indigo-400">
              ₹{status?.averageOrderValue ? status.averageOrderValue.toLocaleString('en-IN') : '0'}
            </div>
            <div className="text-[10px] text-slate-500 font-mono">Per Transaction</div>
          </div>

          {/* Successful Payments */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
            <span className="text-[11px] font-mono text-slate-400 uppercase">Successful Paid</span>
            <div className="text-2xl font-black font-mono text-emerald-400">
              {status?.successfulPayments || 0}
            </div>
            <div className="text-[10px] text-slate-500 font-mono">Paid status orders</div>
          </div>

          {/* Cancelled / Failed */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
            <span className="text-[11px] font-mono text-slate-400 uppercase">Cancelled / Failed</span>
            <div className="text-2xl font-black font-mono text-rose-400">
              {status?.cancelledOrders || 0}
            </div>
            <div className="text-[10px] text-slate-500 font-mono">Error telemetry</div>
          </div>
        </div>

        {/* Last Generated Order Card */}
        {status?.lastOrder && (
          <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-cyan-500/30 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-mono font-bold text-sm shrink-0">
                #1
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold text-cyan-400">
                    LAST GENERATED ORDER:
                  </span>
                  <span className="font-mono text-sm font-bold text-white">
                    {status.lastOrder.order_id}
                  </span>
                  <span className="text-xs text-slate-400">
                    ({new Date(status.lastOrder.order_timestamp).toLocaleTimeString()})
                  </span>
                </div>
                <div className="text-xs text-slate-300">
                  <strong>{status.lastOrder.customer_name}</strong> in {status.lastOrder.city}, {status.lastOrder.state} purchased{' '}
                  <strong className="text-white">{status.lastOrder.product_name}</strong> (Qty: {status.lastOrder.quantity})
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4 self-end md:self-center">
              <div className="text-right">
                <div className="text-base font-mono font-bold text-emerald-400">
                  ₹{status.lastOrder.total_amount.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] font-mono text-slate-400">
                  via {status.lastOrder.payment_method}
                </div>
              </div>

              <button
                onClick={() => setSelectedOrderDetails(status.lastOrder)}
                className="px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg text-xs font-mono font-bold transition"
              >
                Inspect Payload
              </button>
            </div>
          </div>
        )}

        {/* Live Visual Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Revenue Over Time Chart */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2 text-cyan-400" />
                  Order Volume & Revenue Velocity
                </h3>
                <p className="text-xs text-slate-400">Time-bucketed transactional aggregation</p>
              </div>
              <button
                onClick={loadStats}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                title="Refresh Charts"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="h-64 w-full">
              {stats?.timeStats && stats.timeStats.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.timeStats}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time_bucket" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '12px' }}
                      itemStyle={{ color: '#e2e8f0', fontSize: '12px', fontFamily: 'monospace' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      name="Revenue (₹)"
                      stroke="#06b6d4"
                      fillOpacity={1}
                      fill="url(#colorRev)"
                    />
                    <Area
                      type="monotone"
                      dataKey="count"
                      name="Orders Count"
                      stroke="#3b82f6"
                      fillOpacity={1}
                      fill="url(#colorCount)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500 text-xs font-mono">
                  Generating initial data points...
                </div>
              )}
            </div>
          </div>

          {/* Payment Method Distribution */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center">
              <DollarSign className="w-4 h-4 mr-2 text-emerald-400" />
              Payment Methods (India)
            </h3>
            <p className="text-xs text-slate-400">UPI, Cards, NetBanking, COD</p>

            <div className="h-64 w-full">
              {stats?.paymentStats && stats.paymentStats.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.paymentStats}
                      dataKey="count"
                      nameKey="payment_method"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                    >
                      {stats.paymentStats.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={PAYMENT_COLORS[index % PAYMENT_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '12px' }}
                      itemStyle={{ color: '#e2e8f0', fontSize: '12px' }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(val) => <span className="text-slate-300 text-xs font-mono">{val}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500 text-xs font-mono">
                  Awaiting payment events...
                </div>
              )}
            </div>
          </div>

          {/* Category Distribution Bar Chart */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center">
              <Database className="w-4 h-4 mr-2 text-indigo-400" />
              Orders by Category
            </h3>
            <p className="text-xs text-slate-400">Volume across 7 retail categories</p>

            <div className="h-64 w-full">
              {stats?.categoryStats && stats.categoryStats.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.categoryStats} layout="vertical">
                    <XAxis type="number" stroke="#64748b" fontSize={11} />
                    <YAxis dataKey="category" type="category" stroke="#64748b" fontSize={11} width={95} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '12px' }}
                      itemStyle={{ color: '#e2e8f0', fontSize: '12px' }}
                    />
                    <Bar dataKey="count" name="Orders" radius={[0, 6, 6, 0]}>
                      {stats.categoryStats.map((_, index) => (
                        <Cell key={`cat-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500 text-xs font-mono">
                  Loading category metrics...
                </div>
              )}
            </div>
          </div>

          {/* Order Status Distribution */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center">
              <ShieldCheck className="w-4 h-4 mr-2 text-cyan-400" />
              Order Status Distribution
            </h3>
            <p className="text-xs text-slate-400">Confirmed, Shipped, Delivered, Cancelled</p>

            <div className="h-64 w-full">
              {stats?.statusStats && stats.statusStats.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.statusStats}>
                    <XAxis dataKey="order_status" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '12px' }}
                      itemStyle={{ color: '#e2e8f0', fontSize: '12px' }}
                    />
                    <Bar dataKey="count" name="Count" fill="#3b82f6" radius={[6, 6, 0, 0]}>
                      {stats.statusStats.map((_, index) => (
                        <Cell key={`st-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500 text-xs font-mono">
                  Calculating status breakdown...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Live Stream Table of Generated Orders */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-2">
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white font-mono uppercase tracking-wider">
                  Live Generated Orders Feed
                </h3>
                {status?.isRunning && (
                  <span className="flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-ping"></span>
                    LIVE STREAM
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Newest orders update automatically at top via Server-Sent Events (SSE)
              </p>
            </div>

            {/* Table Search Input */}
            <div className="w-full sm:w-72">
              <input
                type="text"
                placeholder="Filter by ID, Customer, City..."
                value={searchTable}
                onChange={(e) => setSearchTable(e.target.value)}
                className="w-full px-3.5 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-cyan-500 font-mono"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-left text-xs font-mono text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[11px] font-bold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Qty</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-900/60">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-8 text-center text-slate-500">
                      No matching orders. Click "START SIMULATOR" to generate orders.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.slice(0, 50).map((order) => (
                    <tr
                      key={order.order_id}
                      className="hover:bg-slate-800/50 transition-colors group"
                    >
                      <td className="py-3 px-4 font-bold text-cyan-400 whitespace-nowrap">
                        {order.order_id}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">{order.customer_name}</div>
                        <div className="text-[10px] text-slate-400">{order.city}, {order.state}</div>
                      </td>
                      <td className="py-3 px-4 max-w-[200px] truncate text-slate-200">
                        {order.product_name}
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        {order.category}
                      </td>
                      <td className="py-3 px-4 text-slate-200">
                        {order.quantity}
                      </td>
                      <td className="py-3 px-4 font-bold text-white whitespace-nowrap">
                        ₹{order.total_amount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-[11px] font-semibold text-slate-300">
                          {order.payment_method}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <OrderStatusBadge status={order.order_status} />
                      </td>
                      <td className="py-3 px-4 text-[11px] text-slate-400 whitespace-nowrap">
                        {new Date(order.order_timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedOrderDetails(order)}
                          className="px-2.5 py-1 rounded bg-slate-800 group-hover:bg-cyan-500/20 group-hover:text-cyan-300 text-slate-400 text-[10px] font-bold transition"
                        >
                          Payload
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* DataTrace Backend Integration & Architecture Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider block">
                EXTENSIBLE PIPELINE ADAPTER
              </span>
              <h3 className="text-lg font-bold text-white font-mono">
                DataTrace External Backend Configuration
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Configure your target pipeline ingestion API endpoint. The simulator forwards orders through{' '}
                <code className="text-cyan-400 bg-slate-950 px-1 py-0.5 rounded">sendOrderToDataTrace(order)</code>.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-slate-800 text-cyan-400 border border-slate-700">
                Mode: {status?.dataTraceStatus?.mode === 'live' ? 'Live Forwarding' : 'Mock Ingestion Buffer'}
              </span>
            </div>
          </div>

          {/* Architecture flow visual */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs">
            <div className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-2">
              Architecture Pipeline Topology:
            </div>
            <div className="flex flex-wrap items-center gap-2 text-slate-300 text-[11px]">
              <span className="px-2.5 py-1 bg-slate-800 rounded-lg text-white font-bold">DataTrace Store</span>
              <span className="text-cyan-400">→</span>
              <span className="px-2.5 py-1 bg-slate-800 rounded-lg text-cyan-300 font-bold">Order Generator (5s)</span>
              <span className="text-cyan-400">→</span>
              <span className="px-2.5 py-1 bg-blue-900/60 border border-blue-500/40 rounded-lg text-blue-200 font-bold">POST /api/orders</span>
              <span className="text-cyan-400">→</span>
              <span className="px-2.5 py-1 bg-indigo-900/60 border border-indigo-500/40 rounded-lg text-indigo-200 font-bold">DataTrace Connector</span>
              <span className="text-cyan-400">→</span>
              <span className="px-2.5 py-1 bg-emerald-900/60 border border-emerald-500/40 rounded-lg text-emerald-200 font-bold">Apache Airflow</span>
              <span className="text-cyan-400">→</span>
              <span className="px-2.5 py-1 bg-slate-800 rounded-lg text-slate-200">Data Warehouse</span>
              <span className="text-cyan-400">→</span>
              <span className="px-2.5 py-1 bg-slate-800 rounded-lg text-slate-200">Analytics</span>
            </div>
          </div>

          {/* Target URL config form */}
          <form onSubmit={handleSaveDataTraceUrl} className="space-y-3">
            <label className="block text-xs font-mono font-semibold text-slate-300">
              DATATRACE_API_URL Target Endpoint:
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="e.g. http://localhost:8000/api/v1/orders/ingest or leave blank for mock"
                value={dataTraceUrlInput}
                onChange={(e) => setDataTraceUrlInput(e.target.value)}
                className="flex-1 px-4 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl font-mono text-cyan-300 focus:outline-hidden focus:border-cyan-500"
              />
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs flex items-center justify-center space-x-1.5 transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Save Pipeline URL</span>
              </button>
            </div>
            {dataTraceSaved && (
              <div className="text-xs font-mono text-emerald-400 flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                Configuration saved! Forwarder updated.
              </div>
            )}
            <p className="text-[11px] text-slate-500 font-mono">
              You can also specify this in your root <code className="text-slate-400">.env</code> file as <code className="text-cyan-400">DATATRACE_API_URL=https://...</code>.
            </p>
          </form>
        </div>
      </div>

      {/* Inspect JSON Modal */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 font-mono text-xs">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <div>
                <span className="text-cyan-400 font-bold block">{selectedOrderDetails.order_id}</span>
                <span className="text-slate-400">Raw JSON Schema & DataTrace Ingestion Object</span>
              </div>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 max-h-80 overflow-y-auto text-emerald-400">
              <pre>{JSON.stringify(selectedOrderDetails, null, 2)}</pre>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-slate-400 text-[11px]">Ready for ingestion by Airflow / Kafka</span>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

