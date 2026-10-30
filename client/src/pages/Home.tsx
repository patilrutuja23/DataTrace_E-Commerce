import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  TrendingUp,
  Sparkles,
  Zap,
  ShoppingBag,
  Laptop,
  Shirt,
  Footprints,
  Watch,
  Utensils,
  Heart,
  Dumbbell,
  ShieldCheck,
  CheckCircle2,
  Database
} from 'lucide-react';
import { Product } from '../types';
import { fetchProducts } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { useSimulator } from '../context/SimulatorContext';

const CATEGORIES = [
  { name: 'Electronics', icon: Laptop, color: 'from-blue-500 to-indigo-600', count: '6 items' },
  { name: 'Clothing', icon: Shirt, color: 'from-pink-500 to-rose-600', count: '5 items' },
  { name: 'Shoes', icon: Footprints, color: 'from-amber-500 to-orange-600', count: '5 items' },
  { name: 'Accessories', icon: Watch, color: 'from-emerald-500 to-teal-600', count: '5 items' },
  { name: 'Home & Kitchen', icon: Utensils, color: 'from-purple-500 to-violet-600', count: '5 items' },
  { name: 'Beauty', icon: Heart, color: 'from-rose-400 to-pink-600', count: '5 items' },
  { name: 'Sports', icon: Dumbbell, color: 'from-cyan-500 to-blue-600', count: '4 items' }
];

export const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { status } = useSimulator();

  useEffect(() => {
    async function loadData() {
      try {
        const products = await fetchProducts();
        // Pick 8 diverse products for the homepage
        setFeaturedProducts(products.slice(0, 8));
      } catch (err) {
        console.error('Error fetching homepage products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white py-16 sm:py-24">
        {/* Ambient background glow */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-cyan-300 text-xs font-medium">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Next-Gen Indian Commerce • Built for DataTrace Pipelines</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-tight">
                Authentic Indian Brands. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-300">
                  Continuous Live Data Streaming.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
                Experience realistic shopping across boAt, FabIndia, Puma, Titan, Prestige, Mamaearth and more. Backed by an automated order simulator generating realistic transactional events every 5 seconds for end-to-end data pipelines.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/products"
                  className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 flex items-center space-x-2 transition-all hover:scale-102 active:scale-98"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Explore 35+ Products</span>
                </Link>

                <Link
                  to="/admin"
                  className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 font-semibold text-sm flex items-center space-x-2 transition-all hover:scale-102 active:scale-98"
                >
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span>Open Simulator Dashboard</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>

              {/* Quick stats counter */}
              <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-6">
                <div>
                  <div className="text-2xl font-bold text-white">
                    {status?.totalOrders ? status.totalOrders.toLocaleString('en-IN') : '10+'}
                  </div>
                  <div className="text-xs text-slate-400">Orders Stored in DB</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-cyan-400">
                    ₹{status?.totalRevenue ? status.totalRevenue.toLocaleString('en-IN') : '25,000+'}
                  </div>
                  <div className="text-xs text-slate-400">Generated Revenue</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-emerald-400">
                    {status?.isRunning ? `${status.intervalSec}s` : '5s Default'}
                  </div>
                  <div className="text-xs text-slate-400">Simulation Interval</div>
                </div>
              </div>
            </div>

            {/* Hero Visual Card: Live Stream Feed Preview */}
            <div className="lg:col-span-5">
              <div className="bg-slate-800/90 backdrop-blur-md rounded-2xl border border-slate-700 p-6 shadow-2xl relative">
                <div className="flex items-center justify-between pb-4 border-b border-slate-700/80 mb-4">
                  <div className="flex items-center space-x-2.5">
                    <span className="relative flex h-3 w-3">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${status?.isRunning ? 'bg-emerald-400' : 'bg-slate-500'}`}></span>
                      <span className={`relative inline-flex rounded-full h-3 w-3 ${status?.isRunning ? 'bg-emerald-500' : 'bg-slate-500'}`}></span>
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-200">
                      {status?.isRunning ? 'LIVE ORDER GENERATOR RUNNING' : 'DATA GENERATOR STANDBY'}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 text-cyan-400 border border-slate-700">
                    every {status?.intervalSec || 5}s
                  </span>
                </div>

                {status?.lastOrder ? (
                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Latest Streamed Order:</span>
                      <span className="text-blue-400 font-bold">{status.lastOrder.order_id}</span>
                    </div>

                    <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Customer:</span>
                        <span className="text-white font-medium">{status.lastOrder.customer_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Location:</span>
                        <span className="text-slate-300">{status.lastOrder.city}, {status.lastOrder.state} ({status.lastOrder.postal_code})</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Product:</span>
                        <span className="text-slate-300 truncate max-w-[200px]">{status.lastOrder.product_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Amount:</span>
                        <span className="text-emerald-400 font-bold">₹{status.lastOrder.total_amount.toLocaleString('en-IN')} via {status.lastOrder.payment_method}</span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Pipeline Ingestion:</span>
                      <span className="text-cyan-400 flex items-center">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-cyan-400" />
                        Ready for Airflow / Spark / DB
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    <Database className="w-8 h-8 mx-auto mb-2 text-slate-500" />
                    Orders will display here in real time as the simulator runs.
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-slate-700/80 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Orders/min: <strong className="text-white">{status?.ordersPerMinute || 0}</strong></span>
                  <Link
                    to="/admin"
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center"
                  >
                    View Operational Telemetry →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Explore Popular Categories
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Curated essentials from top-rated Indian brands
            </p>
          </div>
          <Link
            to="/products"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                to={`/products?category=${encodeURIComponent(cat.name)}`}
                className="group p-4 bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 text-center flex flex-col items-center justify-center space-y-3"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${cat.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-xs text-slate-400">{cat.count}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Trending Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-flex items-center space-x-1 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Trending in India</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Best Selling Products
            </h2>
          </div>
          <Link
            to="/products"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
          >
            <span>See Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-80 bg-slate-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.product_id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* DataTrace Pipeline Architecture Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-xl overflow-hidden relative">
          <div className="max-w-3xl space-y-4 relative z-10">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-cyan-300 border border-blue-400/30">
              Data Engineering Architecture
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              From Storefront Click to Data Warehouse
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Every customer action and automated simulation passes through our dedicated API layer (<code className="text-cyan-300 bg-slate-800 px-1.5 py-0.5 rounded font-mono text-xs">POST /api/orders</code>) and is prepared for ingestion into Apache Airflow, Kafka, Apache Spark, and downstream data warehouses.
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                to="/admin"
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-md transition-all"
              >
                Control Simulator & Live Stream
              </Link>
              <a
                href="/api/orders/export/csv"
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition-all"
              >
                Download CSV Sample
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

