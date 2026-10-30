export interface Product {
  product_id: string;
  product_name: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
  description: string;
  image: string;
  brand: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentMethod = 'UPI' | 'Credit Card' | 'Debit Card' | 'Net Banking' | 'Cash on Delivery';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface Order {
  order_id: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  product_id: string;
  product_name: string;
  category: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  order_status: OrderStatus;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  shipping_address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  order_timestamp: string;
  source?: 'simulator' | 'storefront';
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface SimulatorStatus {
  isRunning: boolean;
  intervalMs: number;
  intervalSec: number;
  ordersPerMinute: number;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  successfulPayments: number;
  cancelledOrders: number;
  lastOrder: Order | null;
  dataTraceStatus?: {
    apiUrl: string | null;
    mode: 'live' | 'mock';
    lastForwarded: string | null;
    forwardCount: number;
    status: string;
    lastError: string | null;
  };
}

export interface CategoryStat {
  category: string;
  count: number;
  total: number;
}

export interface PaymentStat {
  payment_method: string;
  count: number;
  total: number;
}

export interface StatusStat {
  order_status: string;
  count: number;
}

export interface TimeStat {
  time_bucket: string;
  count: number;
  revenue: number;
}

export interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  successfulPayments: number;
  cancelledOrders: number;
  lastOrder: Order | null;
  categoryStats: CategoryStat[];
  paymentStats: PaymentStat[];
  statusStats: StatusStat[];
  timeStats: TimeStat[];
  ordersPerMinute: number;
  isSimulatorRunning: boolean;
  intervalMs: number;
}

