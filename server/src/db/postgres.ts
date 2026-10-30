import pg from 'pg';
import { Order } from '../types.js';

const { Pool } = pg;

export const pgPool = new Pool({
  host: process.env.PG_HOST || 'localhost',
  port: parseInt(process.env.PG_PORT || '5432', 10),
  database: process.env.PG_DATABASE || 'datatrace',
  user: process.env.PG_USER || 'datatrace',
  password: process.env.PG_PASSWORD || 'datatrace_dev',
  connectionTimeoutMillis: 3000,
});

let isPgConnected = false;

export async function initPostgres() {
  try {
    const client = await pgPool.connect();
    isPgConnected = true;
    console.log('[PostgreSQL] Connected to datatrace database on port 5432');

    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        order_id VARCHAR(50) PRIMARY KEY,
        customer_id VARCHAR(50) NOT NULL,
        customer_name VARCHAR(100) NOT NULL,
        customer_email VARCHAR(150) NOT NULL,
        product_id VARCHAR(50) NOT NULL,
        product_name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        quantity INTEGER NOT NULL,
        unit_price NUMERIC(10,2) NOT NULL,
        total_amount NUMERIC(10,2) NOT NULL,
        order_status VARCHAR(50) NOT NULL,
        payment_method VARCHAR(50) NOT NULL,
        payment_status VARCHAR(50) NOT NULL,
        shipping_address TEXT NOT NULL,
        city VARCHAR(100) NOT NULL,
        state VARCHAR(100) NOT NULL,
        country VARCHAR(50) NOT NULL,
        postal_code VARCHAR(20) NOT NULL,
        order_timestamp TIMESTAMPTZ NOT NULL,
        source VARCHAR(50) DEFAULT 'simulator'
      );
    `);

    client.release();
    console.log('[PostgreSQL] Orders table ready for DataTrace monitoring');
  } catch (err: any) {
    isPgConnected = false;
    console.warn('[PostgreSQL] Could not connect to PostgreSQL (mock/sqlite fallback active):', err.message);
  }
}

export async function saveOrderToPostgres(order: Order) {
  if (!isPgConnected) return;

  try {
    const query = `
      INSERT INTO orders (
        order_id, customer_id, customer_name, customer_email,
        product_id, product_name, category, quantity, unit_price, total_amount,
        order_status, payment_method, payment_status, shipping_address,
        city, state, country, postal_code, order_timestamp, source
      ) VALUES (
        $1, $2, $3, $4,
        $5, $6, $7, $8, $9, $10,
        $11, $12, $13, $14,
        $15, $16, $17, $18, $19, $20
      )
      ON CONFLICT (order_id) DO NOTHING;
    `;

    await pgPool.query(query, [
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
    ]);
  } catch (err: any) {
    console.warn('[PostgreSQL] Error writing order to PostgreSQL:', err.message);
  }
}

