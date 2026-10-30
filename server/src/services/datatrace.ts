import { Order } from '../types.js';

let dataTraceApiUrl = process.env.DATATRACE_API_URL || '';
let forwardCount = 0;
let lastForwardedTime: string | null = null;
let lastStatus: 'idle' | 'success' | 'failed' | 'mock' = 'mock';
let lastError: string | null = null;

export interface DataTraceForwardResult {
  success: boolean;
  mode: 'live' | 'mock';
  targetUrl: string | null;
  message: string;
  timestamp: string;
}

/**
 * Sends a generated e-commerce order to the external DataTrace backend.
 * If DATATRACE_API_URL is configured, performs a real HTTP POST.
 * Otherwise, records in mock pipeline ingestion buffer.
 */
export async function sendOrderToDataTrace(order: Order): Promise<DataTraceForwardResult> {
  const currentUrl = dataTraceApiUrl || process.env.DATATRACE_API_URL;

  if (currentUrl && currentUrl.trim() !== '') {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const response = await fetch(currentUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Source': 'DataTrace-Storefront-Simulator',
          'X-Event-Type': 'order.created'
        },
        body: JSON.stringify(order),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`DataTrace responded with status ${response.status} ${response.statusText}`);
      }

      forwardCount++;
      lastForwardedTime = new Date().toISOString();
      lastStatus = 'success';
      lastError = null;

      console.log(`[DataTrace Pipeline] Successfully forwarded ${order.order_id} to ${currentUrl}`);
      return {
        success: true,
        mode: 'live',
        targetUrl: currentUrl,
        message: `Order forwarded to ${currentUrl}`,
        timestamp: lastForwardedTime
      };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      lastStatus = 'failed';
      lastError = errorMsg;
      console.warn(`[DataTrace Pipeline Warning] Could not forward to ${currentUrl}: ${errorMsg}. Pipeline buffer active.`);

      return {
        success: false,
        mode: 'live',
        targetUrl: currentUrl,
        message: `Forwarding failed: ${errorMsg}. Order stored safely in local database.`,
        timestamp: new Date().toISOString()
      };
    }
  } else {
    // Mock Mode
    forwardCount++;
    lastForwardedTime = new Date().toISOString();
    lastStatus = 'mock';
    lastError = null;

    console.log(`[DataTrace Connector Mock] Ingestion buffer ready for ${order.order_id} (Customer: ${order.customer_name}, Amount: Rs.${order.total_amount}). Set DATATRACE_API_URL to stream to live Kafka/Airflow pipeline.`);

    return {
      success: true,
      mode: 'mock',
      targetUrl: null,
      message: 'Order queued in DataTrace mock buffer. Set DATATRACE_API_URL in .env to stream live.',
      timestamp: lastForwardedTime
    };
  }
}

export function getDataTraceStatus() {
  const currentUrl = dataTraceApiUrl || process.env.DATATRACE_API_URL || null;
  return {
    apiUrl: currentUrl,
    mode: currentUrl ? 'live' as const : 'mock' as const,
    lastForwarded: lastForwardedTime,
    forwardCount,
    status: lastStatus,
    lastError
  };
}

export function setDataTraceApiUrl(url: string) {
  dataTraceApiUrl = url.trim();
  console.log(`[DataTrace Pipeline] Updated target URL to: ${dataTraceApiUrl || '(none/mock)'}`);
}

