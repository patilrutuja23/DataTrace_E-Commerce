import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Activity, Search, Menu, X, Package, Radio } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSimulator } from '../context/SimulatorContext';

export const Navbar: React.FC = () => {
  const { itemCount } = useCart();
  const { status } = useSimulator();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Banner: Simulator Status Notice */}
      <div className="bg-slate-900 text-white text-xs px-4 py-1.5 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {status?.isRunning ? (
            <span className="flex items-center text-emerald-400 font-medium">
              <span className="relative flex h-2 w-2 mr-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              DATA SIMULATOR ACTIVE: Generating order every {status?.intervalSec ?? 5}s
            </span>
          ) : (
            <span className="text-slate-400 flex items-center">
              <Radio className="w-3.5 h-3.5 mr-1 text-slate-500" />
              Data Simulator Idle • Click Dashboard to Start Stream
            </span>
          )}
        </div>
        <div className="hidden sm:flex items-center space-x-4 text-slate-300">
          <span>🇮🇳 Real Indian E-Commerce Data Generation</span>
          <Link
            to="/admin"
            className="text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-2 flex items-center"
          >
            Launch Simulator Controls →
          </Link>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-2.5 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900">
                DataTrace<span className="text-blue-600">Store</span>
              </span>
              <span className="hidden sm:block text-[10px] uppercase font-bold tracking-widest text-slate-400 -mt-1">
                Data Generation Engine
              </span>
            </div>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-lg hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search boAt, Puma, Titan, Kitchen, Beauty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-300 rounded-full focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </form>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/') ? 'text-blue-600 bg-blue-50' : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              Home
            </Link>
            <Link
              to="/products"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/products') ? 'text-blue-600 bg-blue-50' : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              Products
            </Link>
            <Link
              to="/order-history"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/order-history') ? 'text-blue-600 bg-blue-50' : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              Order History
            </Link>

            {/* Special Highlighted Admin / Simulator Link */}
            <Link
              to="/admin"
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                isActive('/admin')
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
              }`}
            >
              <Activity className="w-4 h-4 text-cyan-500" />
              <span>Simulator</span>
              {status?.isRunning && (
                <span className="flex h-2 w-2 relative ml-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              )}
            </Link>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-3">
            <Link
              to="/cart"
              className="relative p-2.5 rounded-full hover:bg-slate-100 text-slate-700 transition-colors"
              title="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <form onSubmit={handleSearch} className="mb-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </form>
          <div className="flex flex-col space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md text-base font-medium text-slate-800 hover:bg-slate-50"
            >
              Home
            </Link>
            <Link
              to="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md text-base font-medium text-slate-800 hover:bg-slate-50"
            >
              All Products
            </Link>
            <Link
              to="/order-history"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md text-base font-medium text-slate-800 hover:bg-slate-50"
            >
              Order History
            </Link>
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-md text-base font-semibold bg-slate-900 text-white"
            >
              <span className="flex items-center">
                <Activity className="w-4 h-4 mr-2 text-cyan-400" />
                Data Simulator Dashboard
              </span>
              {status?.isRunning && (
                <span className="bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                  LIVE
                </span>
              )}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

