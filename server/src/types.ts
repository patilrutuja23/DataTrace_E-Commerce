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

export interface Customer {
  customer_id: string;
  customer_name: string;
  customer_email: string;
  shipping_address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
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

export interface SimulatorStatus {
  isRunning: boolean;
  intervalMs: number;
  totalOrders: number;
  ordersPerMinute: number;
  totalRevenue: number;
  averageOrderValue: number;
  lastOrder: Order | null;
  successfulPayments: number;
  cancelledOrders: number;
  dataTraceStatus: {
    apiUrl: string | null;
    mode: 'live' | 'mock';
    lastForwarded: string | null;
    forwardCount: number;
  };
}

