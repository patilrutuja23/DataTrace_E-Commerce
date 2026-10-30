import { Order, OrderStatus, PaymentMethod, PaymentStatus } from '../types.js';
import { getAllProducts, saveOrder, getOrderStats } from '../db/database.js';
import { saveOrderToPostgres } from '../db/postgres.js';
import { INDIAN_LOCATIONS, INDIAN_NAMES, EMAIL_DOMAINS } from '../data/customers.js';
import { sendOrderToDataTrace } from './datatrace.js';

type OrderListener = (order: Order) => void;

class OrderSimulator {
  private timer: NodeJS.Timeout | null = null;
  private isRunning: boolean = false;
  private intervalMs: number = 5000; // Default 5 seconds
  private listeners: Set<OrderListener> = new Set();
  private orderSequence: number = 1000;
  private recentOrderTimestamps: number[] = [];

  constructor() {
    this.orderSequence = Math.floor(Math.random() * 80000) + 10000;
  }

  public subscribe(listener: OrderListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(order: Order) {
    for (const listener of this.listeners) {
      try {
        listener(order);
      } catch (err) {
        console.error('Error notifying order listener:', err);
      }
    }
  }

  public start(intervalMs?: number): { success: boolean; message: string; isRunning: boolean } {
    if (intervalMs && intervalMs >= 1000) {
      this.intervalMs = intervalMs;
    }

    if (this.isRunning && this.timer !== null) {
      return {
        success: true,
        message: `Simulator is already running at ${this.intervalMs / 1000}s interval. Single timer preserved.`,
        isRunning: true
      };
    }

    // Stop existing timer if any to guarantee ONLY ONE timer exists
    this.stop();

    this.isRunning = true;
    console.log(`[Order Simulator] Started. Generating 1 order every ${this.intervalMs}ms (${this.intervalMs / 1000}s).`);

    // Schedule next run
    this.scheduleNext();

    return {
      success: true,
      message: `Simulator started. Generating 1 order every ${this.intervalMs / 1000} seconds.`,
      isRunning: true
    };
  }

  public stop(): { success: boolean; message: string; isRunning: boolean } {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.isRunning = false;
    console.log('[Order Simulator] Stopped.');

    return {
      success: true,
      message: 'Simulator stopped immediately.',
      isRunning: false
    };
  }

  public setInterval(ms: number): { success: boolean; intervalMs: number } {
    const validMs = Math.max(1000, Math.min(60000, ms));
    this.intervalMs = validMs;

    if (this.isRunning) {
      // Restart with new interval
      if (this.timer) clearTimeout(this.timer);
      this.scheduleNext();
    }

    return { success: true, intervalMs: this.intervalMs };
  }

  public getStatus() {
    const now = Date.now();
    // Keep timestamps from the last 60 seconds
    this.recentOrderTimestamps = this.recentOrderTimestamps.filter(t => now - t <= 60000);
    const opm = this.recentOrderTimestamps.length;

    const stats = getOrderStats();

    return {
      isRunning: this.isRunning,
      intervalMs: this.intervalMs,
      intervalSec: this.intervalMs / 1000,
      ordersPerMinute: opm,
      totalOrders: stats.totalOrders,
      totalRevenue: stats.totalRevenue,
      averageOrderValue: stats.averageOrderValue,
      successfulPayments: stats.successfulPayments,
      cancelledOrders: stats.cancelledOrders,
      lastOrder: stats.lastOrder
    };
  }

  private scheduleNext() {
    if (!this.isRunning) return;

    this.timer = setTimeout(async () => {
      try {
        await this.generateAndProcessOrder();
      } catch (err) {
        console.error('[Order Simulator] Error generating automatic order:', err);
      } finally {
        if (this.isRunning) {
          this.scheduleNext();
        }
      }
    }, this.intervalMs);
  }

  public async generateNow(): Promise<Order> {
    return this.generateAndProcessOrder();
  }

  /**
   * Generates a realistic random Indian e-commerce order
   */
  public generateOrderObject(): Order {
    const products = getAllProducts();
    const product = products[Math.floor(Math.random() * products.length)];

    // Realistic customer
    const nameObj = INDIAN_NAMES[Math.floor(Math.random() * INDIAN_NAMES.length)];
    const loc = INDIAN_LOCATIONS[Math.floor(Math.random() * INDIAN_LOCATIONS.length)];
    const locality = loc.localities[Math.floor(Math.random() * loc.localities.length)];
    const postal = loc.postal_codes[Math.floor(Math.random() * loc.postal_codes.length)];
    const emailDomain = EMAIL_DOMAINS[Math.floor(Math.random() * EMAIL_DOMAINS.length)];
    const customerName = `${nameObj.first} ${nameObj.last}`;
    const customerEmail = `${nameObj.first.toLowerCase()}.${nameObj.last.toLowerCase()}${Math.floor(Math.random() * 90 + 10)}@${emailDomain}`;
    const customerId = `CUS-${Math.floor(Math.random() * 90000 + 10000)}`;

    // Quantity (1: 70%, 2: 20%, 3: 7%, 4: 3%)
    const qRoll = Math.random();
    let quantity = 1;
    if (qRoll > 0.97) quantity = 4;
    else if (qRoll > 0.90) quantity = 3;
    else if (qRoll > 0.70) quantity = 2;

    const unitPrice = product.price;
    const totalAmount = unitPrice * quantity;

    // Payment method distribution
    const payRoll = Math.random();
    let paymentMethod: PaymentMethod = 'UPI';
    if (payRoll > 0.90) paymentMethod = 'Cash on Delivery';
    else if (payRoll > 0.78) paymentMethod = 'Credit Card';
    else if (payRoll > 0.65) paymentMethod = 'Debit Card';
    else if (payRoll > 0.55) paymentMethod = 'Net Banking';
    else paymentMethod = 'UPI';

    // Status distributions
    let paymentStatus: PaymentStatus = 'paid';
    let orderStatus: OrderStatus = 'confirmed';

    if (paymentMethod === 'Cash on Delivery') {
      paymentStatus = 'pending';
      const statusRoll = Math.random();
      if (statusRoll > 0.92) {
        orderStatus = 'cancelled';
      } else if (statusRoll > 0.70) {
        orderStatus = 'processing';
      } else {
        orderStatus = 'confirmed';
      }
    } else {
      const outcomeRoll = Math.random();
      if (outcomeRoll > 0.95) {
        // Payment failed
        paymentStatus = 'failed';
        orderStatus = 'cancelled';
      } else if (outcomeRoll > 0.90) {
        // Refunded
        paymentStatus = 'refunded';
        orderStatus = 'cancelled';
      } else if (outcomeRoll > 0.85) {
        // Pending
        paymentStatus = 'pending';
        orderStatus = 'pending';
      } else {
        // Successful
        paymentStatus = 'paid';
        const progRoll = Math.random();
        if (progRoll > 0.80) orderStatus = 'shipped';
        else if (progRoll > 0.55) orderStatus = 'processing';
        else orderStatus = 'confirmed';
      }
    }

    // ID formatting: ORD-YYYYMMDD-XXXXXX
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    this.orderSequence = (this.orderSequence % 999999) + 1;
    const seqStr = String(this.orderSequence).padStart(6, '0');
    const orderId = `ORD-${dateStr}-${seqStr}`;

    const houseNo = Math.floor(Math.random() * 900 + 100);
    const shippingAddress = `Flat ${houseNo}, ${locality}`;

    return {
      order_id: orderId,
      customer_id: customerId,
      customer_name: customerName,
      customer_email: customerEmail,
      product_id: product.product_id,
      product_name: product.product_name,
      category: product.category,
      quantity,
      unit_price: unitPrice,
      total_amount: totalAmount,
      order_status: orderStatus,
      payment_method: paymentMethod,
      payment_status: paymentStatus,
      shipping_address: shippingAddress,
      city: loc.city,
      state: loc.state,
      country: 'India',
      postal_code: postal,
      order_timestamp: now.toISOString(),
      source: 'simulator'
    };
  }

  public async generateAndProcessOrder(customOrder?: Partial<Order>): Promise<Order> {
    const rawOrder = customOrder ? { ...this.generateOrderObject(), ...customOrder } : this.generateOrderObject();

    // 1. Save to persistent SQLite storage
    const savedOrder = saveOrder(rawOrder);

    // 1b. Save to PostgreSQL for live DataTrace monitoring
    await saveOrderToPostgres(savedOrder);

    // 2. Track timestamp for OPM
    this.recentOrderTimestamps.push(Date.now());

    // 3. Forward to external DataTrace backend / mock connector
    await sendOrderToDataTrace(savedOrder);

    // 4. Notify live dashboard subscribers
    this.notify(savedOrder);

    return savedOrder;
  }
}

export const simulator = new OrderSimulator();

