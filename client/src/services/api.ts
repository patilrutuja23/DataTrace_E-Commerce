import { Product, Order, SimulatorStatus, OrderStats } from '../types';

const API_BASE = '/api';

export async function fetchProducts(params?: {
  category?: string;
  search?: string;
  sort?: string;
}): Promise<Product[]> {
  const query = new URLSearchParams();
  if (params?.category && params.category !== 'All') query.set('category', params.category);
  if (params?.search) query.set('search', params.search);
  if (params?.sort) query.set('sort', params.sort);

  const res = await fetch(`${API_BASE}/products?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch products');
  const data = await res.json();
  return data.products;
}

export async function fetchProductById(id: string): Promise<Product> {
  const res = await fetch(`${API_BASE}/products/${id}`);
  if (!res.ok) throw new Error('Failed to fetch product details');
  const data = await res.json();
  return data.product;
}

export async function fetchCategories(): Promise<{ name: string; count: number }[]> {
  const res = await fetch(`${API_BASE}/products/categories`);
  if (!res.ok) throw new Error('Failed to fetch categories');
  const data = await res.json();
  return data.categories;
}

export async function fetchOrders(limit = 100, search = ''): Promise<Order[]> {
  const query = new URLSearchParams({ limit: String(limit) });
  if (search) query.set('search', search);

  const res = await fetch(`${API_BASE}/orders?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch orders');
  const data = await res.json();
  return data.orders;
}

export async function createOrder(orderData: Partial<Order>): Promise<Order> {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  });
  if (!res.ok) throw new Error('Failed to place order');
  const data = await res.json();
  return data.order;
}

export async function fetchSimulatorStatus(): Promise<SimulatorStatus> {
  const res = await fetch(`${API_BASE}/simulator/status`);
  if (!res.ok) throw new Error('Failed to fetch simulator status');
  const data = await res.json();
  return data.status;
}

export async function startSimulator(intervalMs = 5000): Promise<SimulatorStatus> {
  const res = await fetch(`${API_BASE}/simulator/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ intervalMs })
  });
  if (!res.ok) throw new Error('Failed to start simulator');
  const data = await res.json();
  return data.status;
}

export async function stopSimulator(): Promise<SimulatorStatus> {
  const res = await fetch(`${API_BASE}/simulator/stop`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error('Failed to stop simulator');
  const data = await res.json();
  return data.status;
}

export async function generateOrderNow(): Promise<Order> {
  const res = await fetch(`${API_BASE}/simulator/generate`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error('Failed to generate order');
  const data = await res.json();
  return data.order;
}

export async function setSimulatorInterval(intervalMs: number): Promise<SimulatorStatus> {
  const res = await fetch(`${API_BASE}/simulator/interval`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ intervalMs })
  });
  if (!res.ok) throw new Error('Failed to update interval');
  const data = await res.json();
  return data.status;
}

export async function fetchStats(): Promise<OrderStats> {
  const res = await fetch(`${API_BASE}/stats`);
  if (!res.ok) throw new Error('Failed to fetch stats');
  const data = await res.json();
  return data.stats;
}

export function getExportCsvUrl(): string {
  return `${API_BASE}/orders/export/csv`;
}

export function getExportJsonUrl(): string {
  return `${API_BASE}/orders/export/json`;
}

export async function updateDataTraceConfig(apiUrl: string) {
  const res = await fetch(`${API_BASE}/simulator/datatrace/config`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiUrl })
  });
  if (!res.ok) throw new Error('Failed to update DataTrace config');
  return res.json();
}

