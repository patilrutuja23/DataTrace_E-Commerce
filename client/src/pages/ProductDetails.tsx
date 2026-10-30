import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  ChevronRight,
  Zap,
  ArrowLeft
} from 'lucide-react';
import { Product } from '../types';
import { fetchProductById, fetchProducts } from '../services/api';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/ProductCard';

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    async function load() {
      if (!id) return;
      setLoading(true);
      try {
        const prod = await fetchProductById(id);
        setProduct(prod);

        // Fetch related products in same category
        const allInCategory = await fetchProducts({ category: prod.category });
        setRelatedProducts(allInCategory.filter((p) => p.product_id !== prod.product_id).slice(0, 4));
      } catch (err) {
        console.error('Failed to load product details:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
    setQuantity(1);
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-square bg-slate-100 rounded-3xl animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 bg-slate-100 rounded-lg w-3/4 animate-pulse" />
            <div className="h-6 bg-slate-100 rounded-lg w-1/4 animate-pulse" />
            <div className="h-24 bg-slate-100 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Product Not Found</h2>
        <p className="text-slate-500 mt-2">The product you are looking for does not exist or has been removed.</p>
        <Link to="/products" className="mt-6 inline-block px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold">
          Back to Products
        </Link>
      </div>
    );
  }

  const originalPrice = Math.round(product.price * 1.33);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-blue-600">
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 font-medium truncate max-w-xs">{product.product_name}</span>
      </nav>

      {/* Product Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Product Image */}
        <div className="lg:col-span-6">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-slate-50 border border-slate-200 shadow-sm">
            <img
              src={product.image}
              alt={product.product_name}
              className="w-full h-full object-cover"
            />
            <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-bold text-slate-800 shadow-sm border border-slate-100">
              {product.brand}
            </span>
            <span className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-md text-xs font-mono text-cyan-300">
              ID: {product.product_id}
            </span>
          </div>
        </div>

        {/* Right: Product Details & Purchase Form */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="inline-block px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-700 uppercase tracking-wider mb-2">
              {product.category}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {product.product_name}
            </h1>

            {/* Rating */}
            <div className="flex items-center space-x-3 mt-3">
              <div className="flex items-center bg-emerald-50 text-emerald-700 text-sm font-bold px-2 py-0.5 rounded-md border border-emerald-200">
                <span>{product.rating.toFixed(1)}</span>
                <Star className="w-4 h-4 ml-1 fill-emerald-600 text-emerald-600" />
              </div>
              <span className="text-xs text-slate-500">
                {Math.floor(product.rating * 140)} ratings & 34 verified buyer reviews
              </span>
            </div>
          </div>

          {/* Pricing */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <div className="flex items-baseline space-x-3">
              <span className="text-3xl font-black text-slate-900">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              <span className="text-base text-slate-400 line-through">
                ₹{originalPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-sm font-bold text-emerald-600">
                25% OFF
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Inclusive of all taxes. Free delivery on prepaid orders above ₹999.
            </p>
          </div>

          {/* Stock info */}
          <div className="flex items-center space-x-2 text-xs">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold text-emerald-700">In Stock</span>
            <span className="text-slate-400">• Ready for immediate dispatch ({product.stock} units available)</span>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">Description</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Quantity Selector and CTA Buttons */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-semibold text-slate-700">Quantity:</span>
              <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-1.5 text-slate-600 hover:bg-slate-100 font-bold"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-sm font-bold text-slate-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3.5 py-1.5 text-slate-600 hover:bg-slate-100 font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleAddToCart}
                disabled={added}
                className={`py-3.5 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-sm ${
                  added
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Added to Cart</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                className="py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/25 transition-all hover:scale-102 active:scale-98"
              >
                <Zap className="w-5 h-5" />
                <span>Buy Now</span>
              </button>
            </div>
          </div>

          {/* Trust Highlights */}
          <div className="pt-4 border-t border-slate-200 grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <Truck className="w-5 h-5 mx-auto text-blue-600" />
              <div className="text-xs font-semibold text-slate-900">Fast Shipping</div>
              <div className="text-[10px] text-slate-500">Pan-India delivery</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <ShieldCheck className="w-5 h-5 mx-auto text-emerald-600" />
              <div className="text-xs font-semibold text-slate-900">100% Genuine</div>
              <div className="text-[10px] text-slate-500">Direct brand warranty</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <RotateCcw className="w-5 h-5 mx-auto text-amber-600" />
              <div className="text-xs font-semibold text-slate-900">7-Day Return</div>
              <div className="text-[10px] text-slate-500">Hassle-free refunds</div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="pt-12 border-t border-slate-200 space-y-6">
          <h2 className="text-xl font-bold text-slate-900">
            Similar Products in {product.category}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.product_id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

