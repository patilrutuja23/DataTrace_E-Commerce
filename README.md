# DataTrace Store & Automatic Order Data Generator

**DataTrace Store** is a high-performance modern e-commerce storefront and continuous transaction generator engineered specifically for the **DataTrace** data engineering pipeline. It simulates realistic high-cadence Indian e-commerce order events every **5 seconds** and persists them into SQLite storage while streaming them live to the Admin Telemetry Dashboard and forwarder service.

---

## 🏛 Architecture & Data Flow

```text
┌────────────────────────┐      ┌─────────────────────────┐
│   DataTrace Store UI   │      │ 5-Second Order Engine   │
│ (React + TS + Tailwind)│      │ (Realistic Indian Data) │
└───────────┬────────────┘      └────────────┬────────────┘
            │                                │
            │      POST /api/orders          │
            └───────────────┬────────────────┘
                            ▼
               ┌─────────────────────────┐
               │  Orders Service Layer   │
               │      (Express API)      │
               └────────────┬────────────┘
                            │
            ┌───────────────┴───────────────┐
            ▼                               ▼
 ┌─────────────────────┐        ┌───────────────────────┐
 │ Persistent Database │        │  sendOrderToDataTrace │
 │  (SQLite Storage)   │        │   (Pipeline Forward)  │
 └──────────┬──────────┘        └───────────┬───────────┘
            │                               │
            ▼                               ▼
 ┌─────────────────────┐        ┌───────────────────────┐
 │ CSV / JSON Export   │        │ DataTrace Ingestion   │
 │ (Pandas / PySpark)  │        │ (Airflow, Kafka, DWH) │
 └─────────────────────┘        └───────────────────────┘
```

---

## 🚀 Quick Start (Run Locally)

### Prerequisites
- **Node.js**: v18.0.0 or higher (Tested with Node v22)
- **npm**: v9.0.0 or higher

### Installation
From the root directory:
```bash
# Install root, backend, and frontend dependencies in one step:
npm run install:all
```

*(Alternatively, you can run `npm install` in the root, `server/`, and `client/` directories individually).*

### Running in Development Mode
To start both the **Express Backend Server** (Port `5000`) and the **Vite React Frontend** (Port `3000` default) with live reload and proxy:
```bash
npm run dev
```

Once started:
- **Storefront Website**: [http://localhost:3000](http://localhost:3000)
- **Admin / Simulator Dashboard**: [http://localhost:3000/admin](http://localhost:3000/admin)
- **Backend API & Health**: [http://localhost:5000/api/health](http://localhost:5000/api/health)
- **Live SSE Event Stream**: [http://localhost:5000/api/simulator/stream](http://localhost:5000/api/simulator/stream)

*(To use any custom port, set `CLIENT_PORT=xxxx` or pass `--port xxxx`).*

### Running in Single-Port Production Mode
You can also build both the client and server and run them from a single port (`5000`):
```bash
npm run build
npm start
```
Then open [http://localhost:5000](http://localhost:5000) in your browser.

---

## ⚙️ Environment Variables

Create or modify `.env` in `server/` (or copy from `server/.env.example`):

| Variable | Default | Description |
| :--- | :--- | :--- |
| `PORT` | `5000` | Port for Express API server |
| `DATATRACE_API_URL` | *empty* | Target HTTP endpoint for your external DataTrace pipeline. When empty, runs in mock buffer mode. |

Example:
```env
PORT=5000
DATATRACE_API_URL=https://api.datatrace.internal/v1/orders/ingest
```

---

## 🔌 API Endpoints Reference

### Orders API
- `POST /api/orders`: Ingest and process a new order. Accepts custom order payload or auto-generates realistic defaults.
- `GET /api/orders`: Query orders with pagination (`limit`, `offset`) and search query (`search`).
- `GET /api/orders/:id`: Fetch single order by its ID.
- `GET /api/orders/export/csv`: Export all orders as pipeline-ready CSV (`datatrace_orders_YYYY-MM-DD.csv`).
- `GET /api/orders/export/json`: Export all orders as formatted JSON.
- `DELETE /api/orders`: Reset orders table (for clean pipeline demos).

### Simulator Engine API
- `GET /api/simulator/status`: Returns current state (`isRunning`, `intervalMs`, `totalOrders`, `ordersPerMinute`, `totalRevenue`, `lastOrder`).
- `POST /api/simulator/start`: Starts the simulator. Accepts optional `{ "intervalMs": 5000 }`. Guarantees single-timer execution.
- `POST /api/simulator/stop`: Stops the simulator immediately.
- `POST /api/simulator/generate`: Instantly triggers and returns one generated order on-demand.
- `POST /api/simulator/interval`: Updates interval cadence (e.g. 1s, 2s, 5s, 10s).
- `GET /api/simulator/stream`: Server-Sent Events (SSE) stream pushing `{ type: 'order', order: ... }` live to clients.

### Telemetry & Stats API
- `GET /api/stats`: Real-time aggregated metrics (category breakdowns, Indian payment method distribution, order statuses, velocity over time).
- `GET /api/products`: 35+ realistic Indian products catalog with category and price filters.
- `GET /api/health`: Health status.

---

## 🗄️ Database Schema (SQLite)

Database file location: `server/data/datatrace_store.db` (auto-created on startup).

### `orders` Table
```sql
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
  order_status TEXT NOT NULL,       -- 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'
  payment_method TEXT NOT NULL,     -- 'UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Cash on Delivery'
  payment_status TEXT NOT NULL,     -- 'pending', 'paid', 'failed', 'refunded'
  shipping_address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  country TEXT NOT NULL,            -- 'India'
  postal_code TEXT NOT NULL,        -- '411001', '400050', '560001', etc.
  order_timestamp TEXT NOT NULL,    -- ISO 8601 (e.g. '2026-10-29T10:30:05Z')
  source TEXT DEFAULT 'simulator'
);
```

### `products` Table
35+ pre-seeded Indian retail items across 7 categories:
- **Electronics**: boAt, Noise, OnePlus, Portronics, Xiaomi, Logitech
- **Clothing**: FabIndia, Raymond, W for Woman, Allen Solly, Biba
- **Shoes**: Puma, Red Tape, Bata, Campus, Woodland
- **Accessories**: Titan, Fastrack, Wildcraft, Hidesign, Caprese
- **Home & Kitchen**: Prestige, Pigeon, Borosil, Philips, Solimo
- **Beauty**: Mamaearth, The Derma Co, Forest Essentials, Biotique, Plum
- **Sports**: Yonex, Nivia, Strauss, Kobo

---

## ⏱️ How the 5-Second Order Generator Works

1. **Deterministic Single-Timer Architecture**:
   The generator is implemented as a singleton service (`server/src/services/simulator.ts`). When `START` is clicked, it clears any active timer before initiating a new one, strictly preventing duplicate intervals.
2. **Realistic Indian E-Commerce Distributions**:
   - **Payment Methods**: UPI (55%), Credit Card (20%), Debit Card (10%), Net Banking (8%), Cash on Delivery (7%).
   - **Cities & PIN Codes**: Realistic mappings for Mumbai (400001), Pune (411001), Nashik (422001), Nagpur (440001), Ahmednagar (414001), Bengaluru (560001), Hyderabad (500081), Delhi (110016), Chennai (600001), Kolkata (700001), Ahmedabad (380001), Jaipur (302001).
   - **Customer Names**: Authentic Indian names (e.g. *Rahul Sharma, Priya Patel, Amit Verma, Ananya Iyer, Vikram Malhotra, Sneha Kulkarni*).
   - **Order ID Format**: `ORD-YYYYMMDD-XXXXXX` (e.g. `ORD-20261029-059560`).
3. **Continuous Execution**:
   The simulator runs continuously on the Node.js backend. Even if you navigate between Storefront pages (Home, Cart, Checkout) or refresh the browser, the backend continues generating orders every 5 seconds without interruption.

---

## 🔗 Connecting to Your External DataTrace Backend

The code is pre-wired for seamless integration with your DataTrace pipeline.

### Step 1: Provide the Backend Endpoint
Set the target URL in your `server/.env` file:
```env
DATATRACE_API_URL=https://your-datatrace-service.com/api/v1/orders
```
*Or configure it directly from the Admin Dashboard UI under the "DataTrace Backend Configuration" panel.*

### Step 2: Implementation Details
In [`server/src/services/datatrace.ts`](server/src/services/datatrace.ts), the function:
```typescript
export async function sendOrderToDataTrace(order: Order): Promise<DataTraceForwardResult>
```
automatically checks if `DATATRACE_API_URL` is set:
- **When set**: Performs an HTTP `POST` request with a 3.5s timeout and standard headers:
  ```json
  {
    "Content-Type": "application/json",
    "X-Source": "DataTrace-Storefront-Simulator",
    "X-Event-Type": "order.created"
  }
  ```
- **When empty / mock mode**: Records the order into an in-memory ingestion buffer and logs details to the console without breaking execution.

### Step 3: Example Apache Airflow DAG Ingestion
In your Airflow DAG or Kafka consumer, you can either:
1. Stream orders in real-time from the SSE endpoint: `GET /api/simulator/stream`.
2. Schedule a periodic Airflow task to pull batch orders using the CSV/JSON endpoint:
   ```python
   import pandas as pd

   # Load streaming batches into Pandas / PySpark
   df = pd.read_csv("http://localhost:5000/api/orders/export/csv")
   print(f"Ingested {len(df)} orders into DataTrace warehouse")
   ```

---

## 📂 Project Directory Structure

```text
Datatrace_DataGeneration/
├── client/                     # React + TypeScript + Tailwind CSS Frontend
│   ├── src/
│   │   ├── components/         # Navbar, Footer, ProductCard, StatusBadge
│   │   ├── context/            # CartContext, SimulatorContext (SSE live hook)
│   │   ├── pages/              # 8 Required Pages:
│   │   │   ├── Home.tsx
│   │   │   ├── Products.tsx
│   │   │   ├── ProductDetails.tsx
│   │   │   ├── Cart.tsx
│   │   │   ├── Checkout.tsx
│   │   │   ├── OrderConfirmation.tsx
│   │   │   ├── OrderHistory.tsx
│   │   │   └── AdminDashboard.tsx  # Sleek Telemetry Console with Recharts
│   │   ├── services/           # api.ts (REST client & export links)
│   │   ├── types.ts            # Shared domain types
│   │   ├── App.tsx             # Routes & layout
│   │   └── index.css           # Tailwind CSS
│   ├── index.html
│   └── vite.config.ts          # Vite config with /api proxy to port 5000
│
├── server/                     # Express Node.js Backend & Order Simulator
│   ├── data/                   # SQLite database persistent storage
│   ├── src/
│   │   ├── data/
│   │   │   ├── products.ts     # 35+ realistic Indian retail products
│   │   │   └── customers.ts    # Indian cities, postal codes, and names
│   │   ├── db/
│   │   │   └── database.ts     # SQLite database wrapper with node:sqlite
│   │   ├── routes/
│   │   │   ├── orders.ts       # POST/GET orders, CSV & JSON export
│   │   │   ├── products.ts     # Catalog & category filtering
│   │   │   ├── simulator.ts    # start, stop, generate, interval, SSE stream
│   │   │   └── stats.ts        # Chart aggregations
│   │   ├── services/
│   │   │   ├── datatrace.ts    # sendOrderToDataTrace forwarder & mock
│   │   │   └── simulator.ts    # 5-second generator engine with single-timer guarantee
│   │   ├── index.ts            # Express server entry point
│   │   └── types.ts            # Server data models
│   ├── .env.example
│   └── package.json
│
├── package.json                # Root orchestration (concurrently dev & build)
└── README.md                   # Complete documentation
```

