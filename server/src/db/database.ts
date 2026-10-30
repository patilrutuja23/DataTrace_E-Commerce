import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { Product, Customer, Order } from '../types.js';
import { INITIAL_PRODUCTS } from '../data/products.js';
import { INITIAL_CUSTOMERS } from '../data/customers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'datatrace_store.db');

export const db = new DatabaseSync(DB_PATH);

export function initializeDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      product_id TEXT PRIMARY KEY,
      product_name TEXT NOT NULL,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      stock INTEGER NOT NULL,
      rating REAL NOT NULL,
      description TEXT NOT NULL,
      image TEXT NOT NULL,
      brand TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS customers (
      customer_id TEXT PRIMARY KEY,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      shipping_address TEXT NOT NULL,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      country TEXT NOT NULL,
      postal_code TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS orders (
      order_id TEXT PRIMARY KEY,
      customer_id TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      product_id TEXT NOT NULL,
      product_name TEXT NOT NULL,
      category TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      unit_price REAL NOT NULL,
      total_amount REAL NOT NULL,
      order_status TEXT NOT NULL,
      payment_method TEXT NOT NULL,
      payment_status TEXT NOT NULL,
      shipping_address TEXT NOT NULL,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      country TEXT NOT NULL,
      postal_code TEXT NOT NULL,
      order_timestamp TEXT NOT NULL,
      source TEXT DEFAULT 'simulator'
    );

    CREATE INDEX IF NOT EXISTS idx_orders_timestamp ON orders(order_timestamp DESC);
    CREATE INDEX IF NOT EXISTS idx_orders_category ON orders(category);
    CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);
    CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);

    CREATE TABLE IF NOT EXISTS simulator_state (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  // Seed products if empty
  const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
  if (productCount.count === 0) {
    const insertProduct = db.prepare(`
      INSERT INTO products (product_id, product_name, category, price, stock, rating, description, image, brand)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const p of INITIAL_PRODUCTS) {
      insertProduct.run(p.product_id, p.product_name, p.category, p.price, p.stock, p.rating, p.description, p.image, p.brand);
    }
  }

  // Seed customers if empty
  const customerCount = db.prepare('SELECT COUNT(*) as count FROM customers').get() as { count: number };
  if (customerCount.count === 0) {
    const insertCustomer = db.prepare(`
      INSERT INTO customers (customer_id, customer_name, customer_email, shipping_address, city, state, country, postal_code)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const c of INITIAL_CUSTOMERS) {
      insertCustomer.run(c.customer_id, c.customer_name, c.customer_email, c.shipping_address, c.city, c.state, c.country, c.postal_code);
    }
  }

  // If orders are empty, seed 8 initial realistic orders
  const orderCount = db.prepare('SELECT COUNT(*) as count FROM orders').get() as { count: number };
  if (orderCount.count === 0) {
    seedInitialOrders();
  }
}

function seedInitialOrders() {
  const insertOrder = db.prepare(`
    INSERT INTO orders (
      order_id, customer_id, customer_name, customer_email,
      product_id, product_name, category, quantity, unit_price, total_amount,
      order_status, payment_method, payment_status, shipping_address,
      city, state, country, postal_code, order_timestamp, source
    ) VALUES (
      ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?
    )
  `);

  const initialOrders: Order[] = [
    {
      order_id: 'ORD-20261029-000001',
      customer_id: 'CUS-10001',
      customer_name: 'Rahul Sharma',
      customer_email: 'rahul.sharma@gmail.com',
      product_id: 'PROD-1001',
      product_name: 'boAt Rockerz 450 Bluetooth On-Ear Headphones',
      category: 'Electronics',
      quantity: 1,
      unit_price: 1499,
      total_amount: 1499,
      order_status: 'confirmed',
      payment_method: 'UPI',
      payment_status: 'paid',
      shipping_address: 'Flat 101, FC Road, Shivajinagar',
      city: 'Pune',
      state: 'Maharashtra',
      country: 'India',
      postal_code: '411001',
      order_timestamp: new Date(Date.now() - 360000).toISOString(),
      source: 'simulator'
    },
    {
      order_id: 'ORD-20261029-000002',
      customer_id: 'CUS-10002',
      customer_name: 'Priya Patel',
      customer_email: 'priya.patel@yahoo.in',
      product_id: 'PROD-1007',
      product_name: 'FabIndia Pure Cotton Printed Kurta',
      category: 'Clothing',
      quantity: 2,
      unit_price: 2490,
      total_amount: 4980,
      order_status: 'processing',
      payment_method: 'Credit Card',
      payment_status: 'paid',
      shipping_address: 'Flat 204, Linking Road, Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      postal_code: '400050',
      order_timestamp: new Date(Date.now() - 300000).toISOString(),
      source: 'simulator'
    },
    {
      order_id: 'ORD-20261029-000003',
      customer_id: 'CUS-10003',
      customer_name: 'Amit Verma',
      customer_email: 'amit.verma@outlook.com',
      product_id: 'PROD-1012',
      product_name: 'Puma Men Comet 2 Alt Running Shoes',
      category: 'Shoes',
      quantity: 1,
      unit_price: 2799,
      total_amount: 2799,
      order_status: 'shipped',
      payment_method: 'UPI',
      payment_status: 'paid',
      shipping_address: 'Plot 35, Gangapur Road, Anandwalli',
      city: 'Nashik',
      state: 'Maharashtra',
      country: 'India',
      postal_code: '422005',
      order_timestamp: new Date(Date.now() - 240000).toISOString(),
      source: 'simulator'
    },
    {
      order_id: 'ORD-20261029-000004',
      customer_id: 'CUS-10004',
      customer_name: 'Ananya Iyer',
      customer_email: 'ananya.iyer@gmail.com',
      product_id: 'PROD-1017',
      product_name: 'Titan Karishma Analog Watch with Champagne Dial',
      category: 'Accessories',
      quantity: 1,
      unit_price: 2395,
      total_amount: 2395,
      order_status: 'delivered',
      payment_method: 'Net Banking',
      payment_status: 'paid',
      shipping_address: 'Flat 502, Indiranagar 100 Feet Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      country: 'India',
      postal_code: '560038',
      order_timestamp: new Date(Date.now() - 180000).toISOString(),
      source: 'simulator'
    },
    {
      order_id: 'ORD-20261029-000005',
      customer_id: 'CUS-10005',
      customer_name: 'Vikram Malhotra',
      customer_email: 'vikram.malhotra@gmail.com',
      product_id: 'PROD-1022',
      product_name: 'Prestige Deluxe Alpha Stainless Steel Pressure Cooker 3L',
      category: 'Home & Kitchen',
      quantity: 1,
      unit_price: 2250,
      total_amount: 2250,
      order_status: 'confirmed',
      payment_method: 'Cash on Delivery',
      payment_status: 'pending',
      shipping_address: 'House 88, Civil Lines, Wardha Road',
      city: 'Nagpur',
      state: 'Maharashtra',
      country: 'India',
      postal_code: '440001',
      order_timestamp: new Date(Date.now() - 120000).toISOString(),
      source: 'simulator'
    },
    {
      order_id: 'ORD-20261029-000006',
      customer_id: 'CUS-10006',
      customer_name: 'Sneha Kulkarni',
      customer_email: 'sneha.kulkarni@yahoo.in',
      product_id: 'PROD-1028',
      product_name: 'The Derma Co 1% Hyaluronic Sunscreen Aqua Gel SPF 50',
      category: 'Beauty',
      quantity: 2,
      unit_price: 499,
      total_amount: 998,
      order_status: 'confirmed',
      payment_method: 'UPI',
      payment_status: 'paid',
      shipping_address: 'Flat 304, Savedi, Pipeline Road',
      city: 'Ahmednagar',
      state: 'Maharashtra',
      country: 'India',
      postal_code: '414003',
      order_timestamp: new Date(Date.now() - 60000).toISOString(),
      source: 'simulator'
    }
  ];

  for (const o of initialOrders) {
    insertOrder.run(
      o.order_id, o.customer_id, o.customer_name, o.customer_email,
      o.product_id, o.product_name, o.category, o.quantity, o.unit_price, o.total_amount,
      o.order_status, o.payment_method, o.payment_status, o.shipping_address,
      o.city, o.state, o.country, o.postal_code, o.order_timestamp, o.source ?? 'simulator'
    );
  }
}

// Database helper functions
export function getAllProducts(): Product[] {
  return db.prepare('SELECT * FROM products ORDER BY category, product_name').all() as unknown as Product[];
}

export function getProductById(productId: string): Product | null {
  const row = db.prepare('SELECT * FROM products WHERE product_id = ?').get(productId);
  return (row as unknown as Product) || null;
}

export function getAllCustomers(): Customer[] {
  return db.prepare('SELECT * FROM customers ORDER BY customer_id').all() as unknown as Customer[];
}

export function saveOrder(order: Order): Order {
  const stmt = db.prepare(`
    INSERT INTO orders (
      order_id, customer_id, customer_name, customer_email,
      product_id, product_name, category, quantity, unit_price, total_amount,
      order_status, payment_method, payment_status, shipping_address,
      city, state, country, postal_code, order_timestamp, source
    ) VALUES (
      ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?
    )
  `);

  stmt.run(
    order.order_id,
    order.customer_id,
    order.customer_name,
    order.customer_email,
    order.product_id,
    order.product_name,
    order.category,
    order.quantity,
    order.unit_price,
    order.total_amount,
    order.order_status,
    order.payment_method,
    order.payment_status,
    order.shipping_address,
    order.city,
    order.state,
    order.country,
    order.postal_code,
    order.order_timestamp,
    order.source || 'simulator'
  );

  return order;
}

export function getOrders(limit = 100, offset = 0, search = ''): Order[] {
  if (search) {
    const s = `%${search}%`;
    return db.prepare(`
      SELECT * FROM orders
      WHERE order_id LIKE ? OR customer_name LIKE ? OR product_name LIKE ? OR city LIKE ?
      ORDER BY order_timestamp DESC
      LIMIT ? OFFSET ?
    `).all(s, s, s, s, limit, offset) as unknown as Order[];
  }
  return db.prepare(`
    SELECT * FROM orders
    ORDER BY order_timestamp DESC
    LIMIT ? OFFSET ?
  `).all(limit, offset) as unknown as Order[];
}

export function getAllOrders(): Order[] {
  return db.prepare('SELECT * FROM orders ORDER BY order_timestamp DESC').all() as unknown as Order[];
}

export function getOrderById(orderId: string): Order | null {
  const row = db.prepare('SELECT * FROM orders WHERE order_id = ?').get(orderId);
  return (row as unknown as Order) || null;
}

export function getOrderStats() {
  const totalOrdersRow = db.prepare('SELECT COUNT(*) as count, SUM(total_amount) as total_rev FROM orders').get() as { count: number; total_rev: number | null };
  const successfulPaymentsRow = db.prepare("SELECT COUNT(*) as count FROM orders WHERE payment_status = 'paid'").get() as { count: number };
  const cancelledOrdersRow = db.prepare("SELECT COUNT(*) as count FROM orders WHERE order_status = 'cancelled'").get() as { count: number };
  const lastOrderRow = db.prepare('SELECT * FROM orders ORDER BY order_timestamp DESC LIMIT 1').get() as unknown as Order | undefined;

  const totalOrders = totalOrdersRow?.count || 0;
  const totalRevenue = totalOrdersRow?.total_rev || 0;
  const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  // Breakdown by category
  const categoryStats = db.prepare(`
    SELECT category, COUNT(*) as count, SUM(total_amount) as total
    FROM orders
    GROUP BY category
    ORDER BY count DESC
  `).all() as { category: string; count: number; total: number }[];

  // Breakdown by payment method
  const paymentStats = db.prepare(`
    SELECT payment_method, COUNT(*) as count, SUM(total_amount) as total
    FROM orders
    GROUP BY payment_method
    ORDER BY count DESC
  `).all() as { payment_method: string; count: number; total: number }[];

  // Breakdown by order status
  const statusStats = db.prepare(`
    SELECT order_status, COUNT(*) as count
    FROM orders
    GROUP BY order_status
    ORDER BY count DESC
  `).all() as { order_status: string; count: number }[];

  // Orders over time (grouped by 1-minute buckets for latest 20 minutes)
  const timeStats = db.prepare(`
    SELECT
      strftime('%H:%M', order_timestamp) as time_bucket,
      COUNT(*) as count,
      SUM(total_amount) as revenue
    FROM orders
    GROUP BY time_bucket
    ORDER BY time_bucket ASC
    LIMIT 20
  `).all() as { time_bucket: string; count: number; revenue: number }[];

  return {
    totalOrders,
    totalRevenue,
    averageOrderValue,
    successfulPayments: successfulPaymentsRow?.count || 0,
    cancelledOrders: cancelledOrdersRow?.count || 0,
    lastOrder: lastOrderRow || null,
    categoryStats,
    paymentStats,
    statusStats,
    timeStats
  };
}

export function clearOrders() {
  db.exec('DELETE FROM orders');
}

