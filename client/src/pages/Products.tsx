import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, RefreshCw } from 'lucide-react';
import { Product } from '../types';
import { fetchProducts } from '../services/api';
import { ProductCard } from '../components/ProductCard';

const CATEGORIES = [
  'All',
  'Electronics',
  'Clothing',
  'Shoes',
  'Accessories',
  'Home & Kitchen',
  'Beauty',
  'Sports'
];

export const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const selectedCategory = searchParams.get('category') || 'All';
  const searchQuery = searchParams.get('search') || '';
  const sortOption = searchParams.get('sort') || 'featured';

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await fetchProducts({
          category: selectedCategory,
          search: searchQuery,
          sort: sortOption
        });
        setProducts(data);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [selectedCategory, searchQuery, sortOption]);

  const handleCategoryChange = (cat: string) => {
    const next = new URLSearchParams(searchParams);
    if (cat === 'All') next.delete('category');
    else next.set('category', cat);
    setSearchParams(next);
  };

  const handleSearchChange = (val: string) => {
    const next = new URLSearchParams(searchParams);
    if (!val) next.delete('search');
    else next.set('search', val);
    setSearchParams(next);
  };

  const handleSortChange = (sort: string) => {
    const next = new URLSearchParams(searchParams);
    next.set('sort', sort);
    setSearchParams(next);
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title & Breadcrumb */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Product Catalog
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Explore our collection of 35+ products used in continuous transactional data generation
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search by brand, name or category..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
            <span className="text-xs font-medium text-slate-500 hidden sm:inline flex items-center">
              <SlidersHorizontal className="w-3.5 h-3.5 mr-1" />
              Sort by:
            </span>
            <select
              value={sortOption}
              onChange={(e) => handleSortChange(e.target.value)}
              className="text-sm bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option value="featured">Featured</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating_desc">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat || (cat === 'All' && !searchParams.get('category'))
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex justify-between items-center text-sm text-slate-500">
        <span>Showing <strong className="text-slate-900">{products.length}</strong> products</span>
        {(selectedCategory !== 'All' || searchQuery) && (
          <button
            onClick={clearFilters}
            className="text-blue-600 hover:text-blue-700 font-medium text-xs flex items-center"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1" />
            Clear all filters
          </button>
        )}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-84 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
          <Filter className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">No products found</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            We couldn't find any products matching your search criteria. Try resetting filters or using different keywords.
          </p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.product_id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

