import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, Check } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  // Realistic MRP calculation (showing ~25% off)
  const originalPrice = Math.round(product.price * 1.33);

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Product Image & Badges */}
      <Link to={`/products/${product.product_id}`} className="relative block aspect-square bg-slate-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.product_name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Brand Tag */}
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-slate-800 text-xs font-semibold px-2.5 py-1 rounded-md shadow-xs border border-slate-100">
          {product.brand}
        </span>

        {/* Category Pill */}
        <span className="absolute bottom-3 left-3 bg-slate-900/75 backdrop-blur-xs text-white text-[11px] font-medium px-2 py-0.5 rounded-full">
          {product.category}
        </span>
      </Link>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating */}
          <div className="flex items-center space-x-1.5 mb-1.5">
            <div className="flex items-center bg-emerald-50 text-emerald-700 text-xs font-bold px-1.5 py-0.5 rounded">
              <span>{product.rating.toFixed(1)}</span>
              <Star className="w-3 h-3 ml-1 fill-emerald-600 text-emerald-600" />
            </div>
            <span className="text-xs text-slate-400">({Math.floor(product.rating * 140)} reviews)</span>
          </div>

          {/* Title */}
          <Link to={`/products/${product.product_id}`}>
            <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 hover:text-blue-600 transition-colors">
              {product.product_name}
            </h3>
          </Link>

          {/* Short description */}
          <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Pricing & Add to Cart Action */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-lg font-bold text-slate-900">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-slate-400 line-through">
                ₹{originalPrice.toLocaleString('en-IN')}
              </span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-600">
              Save 25%
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={added}
            className={`p-2.5 rounded-xl font-medium text-xs flex items-center space-x-1.5 transition-all shadow-xs ${
              added
                ? 'bg-emerald-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-md hover:shadow-blue-500/20 active:scale-95'
            }`}
            title="Add to Cart"
          >
            {added ? (
              <>
                <Check className="w-4 h-4" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

