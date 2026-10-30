import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  CreditCard,
  ShieldCheck,
  Zap,
  Lock,
  ArrowRight,
  CheckCircle2,
  Building,
  Smartphone
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/api';
import { PaymentMethod } from '../types';

interface AddressPreset {
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pin: string;
}

const PRESET_ADDRESSES: AddressPreset[] = [
  {
    name: 'Rahul Sharma',
    email: 'rahul.sharma@gmail.com',
    address: 'Flat 402, Shivajinagar FC Road',
    city: 'Pune',
    state: 'Maharashtra',
    pin: '411001'
  },
  {
    name: 'Priya Patel',
    email: 'priya.patel@yahoo.in',
    address: 'Flat 104, Greenfield Heights, Andheri West',
    city: 'Mumbai',
    state: 'Maharashtra',
    pin: '400053'
  },
  {
    name: 'Amit Verma',
    email: 'amit.verma@outlook.com',
    address: 'B-22 Palm Meadows, Whitefield ITPL Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    pin: '560066'
  },
  {
    name: 'Ananya Iyer',
    email: 'ananya.iyer@gmail.com',
    address: '74 Vasant Vihar Sector 5',
    city: 'Delhi',
    state: 'Delhi',
    pin: '110016'
  }
];

export const Checkout: React.FC = () => {
  const { cart, total, subtotal, shippingFee, clearCart } = useCart();
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState(PRESET_ADDRESSES[0].name);
  const [customerEmail, setCustomerEmail] = useState(PRESET_ADDRESSES[0].email);
  const [shippingAddress, setShippingAddress] = useState(PRESET_ADDRESSES[0].address);
  const [city, setCity] = useState(PRESET_ADDRESSES[0].city);
  const [state, setState] = useState(PRESET_ADDRESSES[0].state);
  const [postalCode, setPostalCode] = useState(PRESET_ADDRESSES[0].pin);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [upiId, setUpiId] = useState('rahul@okaxis');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const applyPreset = (preset: AddressPreset) => {
    setCustomerName(preset.name);
    setCustomerEmail(preset.email);
    setShippingAddress(preset.address);
    setCity(preset.city);
    setState(preset.state);
    setPostalCode(preset.pin);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsSubmitting(true);
    try {
      // Pick the primary item for representation or compile
      const primaryItem = cart[0];
      const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);

      const orderData = {
        customer_name: customerName,
        customer_email: customerEmail,
        product_id: primaryItem.product.product_id,
        product_name: primaryItem.product.product_name + (cart.length > 1 ? ` (+${cart.length - 1} more items)` : ''),
        category: primaryItem.product.category,
        quantity: totalQty,
        unit_price: primaryItem.product.price,
        total_amount: total,
        order_status: 'confirmed' as const,
        payment_method: paymentMethod,
        payment_status: paymentMethod === 'Cash on Delivery' ? ('pending' as const) : ('paid' as const),
        shipping_address: shippingAddress,
        city,
        state,
        country: 'India',
        postal_code: postalCode,
        source: 'storefront' as const
      };

      const placedOrder = await createOrder(orderData);

      // Trigger Confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      clearCart();
      navigate(`/order-confirmation/${placedOrder.order_id}`, { state: { order: placedOrder } });
    } catch (err) {
      console.error('Order placement failed:', err);
      alert('Failed to place order. Please check that the server is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800">Your cart is empty</h2>
        <button
          onClick={() => navigate('/products')}
          className="mt-4 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold"
        >
          Return to Store
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Secure Checkout
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Complete shipping and payment details. All orders are automatically ingested into DataTrace.
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Shipping Address & Payment Selection */}
        <div className="lg:col-span-8 space-y-6">
          {/* Quick Preset Selector */}
          <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4">
            <span className="text-xs font-bold text-blue-900 uppercase tracking-wider block mb-2">
              ⚡ Quick Fill Preset (Realistic Indian Customers):
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PRESET_ADDRESSES.map((p) => (
                <button
                  type="button"
                  key={p.name}
                  onClick={() => applyPreset(p)}
                  className={`px-3 py-2 text-xs rounded-xl border text-left transition-all ${
                    customerName === p.name
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-blue-400'
                  }`}
                >
                  <div className="font-semibold truncate">{p.name}</div>
                  <div className="text-[10px] opacity-80">{p.city}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Shipping Details */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center mr-2">1</span>
              Shipping & Customer Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Delivery Address</label>
                <input
                  type="text"
                  required
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">State</label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Postal Code (PIN)</label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Country</label>
                <input
                  type="text"
                  disabled
                  value="India"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-100 border border-slate-300 rounded-xl text-slate-500"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center mr-2">2</span>
              Payment Method
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'UPI', label: 'UPI (Instant)', desc: 'GPay, PhonePe, Paytm, BHIM', icon: Smartphone },
                { id: 'Credit Card', label: 'Credit Card', desc: 'Visa, Mastercard, RuPay', icon: CreditCard },
                { id: 'Debit Card', label: 'Debit Card', desc: 'All Indian Banks', icon: CreditCard },
                { id: 'Net Banking', label: 'Net Banking', desc: 'HDFC, SBI, ICICI, Axis', icon: Building },
                { id: 'Cash on Delivery', label: 'Cash on Delivery', desc: 'Pay cash upon delivery', icon: ShieldCheck }
              ].map((m) => {
                const Icon = m.icon;
                const isSelected = paymentMethod === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id as PaymentMethod)}
                    className={`p-4 rounded-xl border text-left flex items-start space-x-3 transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">{m.label}</div>
                      <div className="text-xs text-slate-500">{m.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Contextual Input depending on Payment Method */}
            {paymentMethod === 'UPI' && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 mt-4">
                <label className="block text-xs font-semibold text-slate-700">Enter Virtual Payment Address (VPA / UPI ID)</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="username@okhdfcbank"
                    className="flex-1 px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="px-3 py-2 text-xs bg-emerald-100 text-emerald-800 font-bold rounded-lg flex items-center">
                    Verified ✓
                  </span>
                </div>
              </div>
            )}

            {(paymentMethod === 'Credit Card' || paymentMethod === 'Debit Card') && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 mt-4">
                <label className="block text-xs font-semibold text-slate-700">Card Number (Simulated)</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg font-mono focus:outline-hidden"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Recap & Checkout Button */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6 sticky top-24">
            <h2 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
              Order Summary
            </h2>

            {/* Quick item list */}
            <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
              {cart.map((item) => (
                <div key={item.product.product_id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2 truncate pr-2">
                    <img
                      src={item.product.image}
                      alt={item.product.product_name}
                      className="w-10 h-10 object-cover rounded-lg bg-slate-50 shrink-0"
                    />
                    <div className="truncate">
                      <span className="font-semibold text-slate-900 block truncate">{item.product.product_name}</span>
                      <span className="text-slate-400">Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <span className="font-bold text-slate-800 shrink-0">
                    ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span className={shippingFee === 0 ? 'text-emerald-600 font-bold' : ''}>
                  {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Amount:</span>
                <span className="text-blue-600">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center space-x-2 transition-all hover:scale-102 active:scale-98 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Streaming Order to Pipeline...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Place Order (Pay ₹{total.toLocaleString('en-IN')})</span>
                </>
              )}
            </button>

            <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500 space-y-1">
              <div className="font-bold text-slate-700 flex items-center">
                <Zap className="w-3.5 h-3.5 text-blue-600 mr-1" />
                DataTrace Pipeline Ingestion
              </div>
              <div>
                Placing this order sends a real HTTP POST request to the API layer and SQLite storage.
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

