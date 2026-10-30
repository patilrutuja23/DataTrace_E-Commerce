import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, subtotal, shippingFee, total } = useCart();
  const navigate = useNavigate();
  const [pincode, setPincode] = useState('411001');
  const [pinChecked, setPinChecked] = useState(true);

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900">Your Cart is Empty</h2>
        <p className="text-sm text-slate-500 max-w-sm mx-auto">
          Explore our collection of authentic Indian products and start adding items to trigger realistic orders.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 shadow-md transition-all"
        >
          <span>Browse Products</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Shopping Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review your items before proceeding to secure checkout
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs divide-y divide-slate-100">
            {cart.map((item) => {
              const itemTotal = item.product.price * item.quantity;
              return (
                <div key={item.product.product_id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                  {/* Thumbnail & Info */}
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.product.image}
                      alt={item.product.product_name}
                      className="w-20 h-20 object-cover rounded-xl bg-slate-50 border border-slate-100 shrink-0"
                    />
                    <div>
                      <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                        {item.product.brand}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
                        <Link to={`/products/${item.product.product_id}`} className="hover:text-blue-600">
                          {item.product.product_name}
                        </Link>
                      </h3>
                      <div className="text-xs text-slate-400 mt-0.5">
                        Category: {item.product.category}
                      </div>
                      <div className="text-sm font-bold text-slate-900 sm:hidden mt-2">
                        ₹{item.product.price.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  {/* Quantity and Subtotal Actions */}
                  <div className="flex items-center justify-between sm:justify-end space-x-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <div className="hidden sm:block text-right">
                      <div className="text-sm font-bold text-slate-900">
                        ₹{itemTotal.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        ₹{item.product.price} each
                      </div>
                    </div>

                    {/* Qty controls */}
                    <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
                      <button
                        onClick={() => updateQuantity(item.product.product_id, item.quantity - 1)}
                        className="px-3 py-1 text-slate-600 hover:bg-slate-100 font-bold text-sm"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-xs font-bold text-slate-900">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.product_id, item.quantity + 1)}
                        className="px-3 py-1 text-slate-600 hover:bg-slate-100 font-bold text-sm"
                      >
                        +
                      </button>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => removeFromCart(item.product.product_id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Delivery Pincode Checker */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-2 text-xs text-slate-700">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>Deliver to: <strong>Pune, Maharashtra - 411001</strong></span>
            </div>
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                maxLength={6}
                className="w-28 px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-mono focus:outline-hidden"
              />
              <button
                onClick={() => setPinChecked(true)}
                className="px-3 py-1.5 text-xs font-bold bg-slate-900 text-white rounded-lg hover:bg-slate-800"
              >
                Change
              </button>
            </div>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6 sticky top-24">
            <h2 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
              Price Details
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Price ({cart.length} items)</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Delivery Charges</span>
                {shippingFee === 0 ? (
                  <span className="text-emerald-600 font-semibold">FREE</span>
                ) : (
                  <span>₹{shippingFee}</span>
                )}
              </div>

              <div className="flex justify-between text-slate-600 text-xs">
                <span>Applicable Taxes (GST 18%)</span>
                <span className="text-slate-400">Included in MRP</span>
              </div>

              {shippingFee > 0 && (
                <div className="p-2.5 bg-blue-50 text-blue-700 rounded-xl text-xs">
                  Add ₹{(999 - subtotal).toLocaleString('en-IN')} more to qualify for <strong>FREE Delivery</strong>!
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 flex justify-between text-base font-bold text-slate-900">
                <span>Total Amount</span>
                <span className="text-blue-600">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center space-x-2 transition-all hover:scale-102 active:scale-98"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center space-x-2 text-xs text-slate-400 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Safe and Secure Payments • 256-bit SSL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

