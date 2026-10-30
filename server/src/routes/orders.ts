import { Router, Request, Response } from 'express';
import { getOrders, getAllOrders, getOrderById, clearOrders } from '../db/database.js';
import { simulator } from '../services/simulator.js';
import { Order } from '../types.js';

export const ordersRouter = Router();

// POST /api/orders - Receive and process a new order
ordersRouter.post('/', async (req: Request, res: Response) => {
  try {
    const orderData: Partial<Order> = req.body;

    // Validate required fields if supplied manually
    if (!orderData.product_id && !orderData.product_name) {
      // If no product provided, generate a realistic order
      const generated = await simulator.generateNow();
      return res.status(201).json({
        success: true,
        message: 'Order generated and processed',
        order: generated
      });
    }

    // If coming from storefront or custom client:
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randomSeq = Math.floor(Math.random() * 900000 + 100000);
    const orderId = orderData.order_id || `ORD-${dateStr}-${randomSeq}`;

    const unitPrice = orderData.unit_price || 0;
    const quantity = orderData.quantity || 1;
    const totalAmount = orderData.total_amount || (unitPrice * quantity);

    const fullOrder: Order = {
      order_id: orderId,
      customer_id: orderData.customer_id || `CUS-${Math.floor(Math.random() * 90000 + 10000)}`,
      customer_name: orderData.customer_name || 'Rahul Sharma',
      customer_email: orderData.customer_email || 'customer@example.in',
      product_id: orderData.product_id || 'PROD-1001',
      product_name: orderData.product_name || 'boAt Headphones',
      category: orderData.category || 'Electronics',
      quantity,
      unit_price: unitPrice,
      total_amount: totalAmount,
      order_status: orderData.order_status || 'confirmed',
      payment_method: orderData.payment_method || 'UPI',
      payment_status: orderData.payment_status || 'paid',
      shipping_address: orderData.shipping_address || 'Flat 101, FC Road',
      city: orderData.city || 'Pune',
      state: orderData.state || 'Maharashtra',
      country: orderData.country || 'India',
      postal_code: orderData.postal_code || '411001',
      order_timestamp: orderData.order_timestamp || now.toISOString(),
      source: orderData.source || 'storefront'
    };

    const savedOrder = await simulator.generateAndProcessOrder(fullOrder);

    return res.status(201).json({
      success: true,
      message: 'Order created, saved to database, and sent to DataTrace pipeline',
      order: savedOrder
    });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/orders - List orders with pagination and search
ordersRouter.get('/', (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 100;
    const offset = parseInt(req.query.offset as string) || 0;
    const search = (req.query.search as string) || '';

    const orders = getOrders(limit, offset, search);
    return res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/orders/export/csv - Export all orders in DataTrace pipeline-ready CSV format
ordersRouter.get('/export/csv', (_req: Request, res: Response) => {
  try {
    const orders = getAllOrders();

    const headers = [
      'order_id',
      'customer_id',
      'customer_name',
      'customer_email',
      'product_id',
      'product_name',
      'category',
      'quantity',
      'unit_price',
      'total_amount',
      'order_status',
      'payment_method',
      'payment_status',
      'shipping_address',
      'city',
      'state',
      'country',
      'postal_code',
      'order_timestamp'
    ];

    const escapeCsv = (val: any) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = orders.map(o => [
      escapeCsv(o.order_id),
      escapeCsv(o.customer_id),
      escapeCsv(o.customer_name),
      escapeCsv(o.customer_email),
      escapeCsv(o.product_id),
      escapeCsv(o.product_name),
      escapeCsv(o.category),
      o.quantity,
      o.unit_price,
      o.total_amount,
      escapeCsv(o.order_status),
      escapeCsv(o.payment_method),
      escapeCsv(o.payment_status),
      escapeCsv(o.shipping_address),
      escapeCsv(o.city),
      escapeCsv(o.state),
      escapeCsv(o.country),
      escapeCsv(o.postal_code),
      escapeCsv(o.order_timestamp)
    ].join(','));

    const csvContent = [headers.join(','), ...rows].join('\r\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=datatrace_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    return res.send(csvContent);
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/orders/export/json - Export all orders as JSON
ordersRouter.get('/export/json', (_req: Request, res: Response) => {
  try {
    const orders = getAllOrders();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=datatrace_orders_${new Date().toISOString().slice(0, 10)}.json`);
    return res.send(JSON.stringify(orders, null, 2));
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/orders/:id - Get single order
ordersRouter.get('/:id', (req: Request, res: Response) => {
  try {
    const order = getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    return res.json({ success: true, order });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/orders - Reset orders
ordersRouter.delete('/', (_req: Request, res: Response) => {
  try {
    clearOrders();
    return res.json({ success: true, message: 'All orders cleared' });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

