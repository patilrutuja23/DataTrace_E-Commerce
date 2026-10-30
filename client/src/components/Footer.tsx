import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ShieldCheck, Truck, RefreshCw, Zap, Database } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800">
      {/* Feature highlights bar */}
      <div className="border-b border-slate-800/80 bg-slate-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Express Delivery</h4>
                <p className="text-xs text-slate-400">Mumbai, Pune, Bengaluru & 500+ cities</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">100% Genuine Brands</h4>
                <p className="text-xs text-slate-400">Direct authentic Indian manufacturers</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Instant UPI & Cards</h4>
                <p className="text-xs text-slate-400">Google Pay, PhonePe, Paytm, BHIM</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">DataTrace Engine</h4>
                <p className="text-xs text-slate-400">Real-time pipeline data generator</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Activity className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                DataTrace<span className="text-blue-500">Store</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              The flagship demo and data generation e-commerce platform built for the DataTrace data engineering pipeline. Generates realistic Indian customer transactions every 5 seconds.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-800 text-cyan-400 border border-slate-700">
                Pipeline Mode: Active
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Categories</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/products?category=Electronics" className="hover:text-white transition">Electronics & Audio</Link></li>
              <li><Link to="/products?category=Clothing" className="hover:text-white transition">Men & Women Clothing</Link></li>
              <li><Link to="/products?category=Shoes" className="hover:text-white transition">Footwear & Sneakers</Link></li>
              <li><Link to="/products?category=Accessories" className="hover:text-white transition">Watches & Bags</Link></li>
              <li><Link to="/products?category=Home+%26+Kitchen" className="hover:text-white transition">Home & Kitchen</Link></li>
              <li><Link to="/products?category=Beauty" className="hover:text-white transition">Ayurveda & Skincare</Link></li>
              <li><Link to="/products?category=Sports" className="hover:text-white transition">Sports & Fitness</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Quick Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/" className="hover:text-white transition">Home Storefront</Link></li>
              <li><Link to="/products" className="hover:text-white transition">Product Catalog (35 Items)</Link></li>
              <li><Link to="/cart" className="hover:text-white transition">Shopping Cart</Link></li>
              <li><Link to="/order-history" className="hover:text-white transition">Live Order History</Link></li>
              <li><Link to="/admin" className="text-cyan-400 hover:text-cyan-300 font-semibold transition">Admin / Data Simulator</Link></li>
              <li><a href="/api/orders/export/csv" className="hover:text-white transition">Download Orders CSV</a></li>
              <li><a href="/api/orders/export/json" className="hover:text-white transition">Download Orders JSON</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">DataTrace Pipeline</h4>
            <p className="text-xs text-slate-400 mb-3">
              Orders automatically stream to external Airflow / Spark / Kafka consumers via the POST /api/orders endpoint.
            </p>
            <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-300 space-y-1">
              <div>Storefront / Sim (5s)</div>
              <div className="text-cyan-400 font-bold">↓ POST /api/orders</div>
              <div>DataTrace API Ingestion</div>
              <div className="text-emerald-400 font-bold">↓ Airflow / Spark / DB</div>
              <div>Analytics Dashboard</div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 gap-4">
          <p>© 2026 DataTrace Store. Engineered for Data Pipelines & Real-time Stream Analytics.</p>
          <div className="flex items-center space-x-6">
            <span>Currency: INR (₹)</span>
            <span>Default Interval: 5 Seconds</span>
            <span>Coverage: Pan-India</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

