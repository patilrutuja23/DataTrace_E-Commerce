import { Router, Request, Response } from 'express';
import { simulator } from '../services/simulator.js';
import { getDataTraceStatus, setDataTraceApiUrl } from '../services/datatrace.js';

export const simulatorRouter = Router();

// GET /api/simulator/status
simulatorRouter.get('/status', (_req: Request, res: Response) => {
  const status = simulator.getStatus();
  const datatrace = getDataTraceStatus();
  return res.json({
    success: true,
    status: {
      ...status,
      dataTraceStatus: datatrace
    }
  });
});

// POST /api/simulator/start
simulatorRouter.post('/start', (req: Request, res: Response) => {
  const intervalMs = req.body?.intervalMs ? parseInt(req.body.intervalMs) : 5000;
  const result = simulator.start(intervalMs);
  return res.json({
    success: result.success,
    message: result.message,
    status: simulator.getStatus()
  });
});

// POST /api/simulator/stop
simulatorRouter.post('/stop', (_req: Request, res: Response) => {
  const result = simulator.stop();
  return res.json({
    success: result.success,
    message: result.message,
    status: simulator.getStatus()
  });
});

// POST /api/simulator/generate
simulatorRouter.post('/generate', async (_req: Request, res: Response) => {
  try {
    const order = await simulator.generateNow();
    return res.json({
      success: true,
      message: 'New order generated immediately',
      order,
      status: simulator.getStatus()
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/simulator/interval
simulatorRouter.post('/interval', (req: Request, res: Response) => {
  const intervalMs = parseInt(req.body?.intervalMs);
  if (isNaN(intervalMs) || intervalMs < 1000) {
    return res.status(400).json({ success: false, message: 'Interval must be at least 1000ms' });
  }
  const result = simulator.setInterval(intervalMs);
  return res.json({
    success: result.success,
    intervalMs: result.intervalMs,
    status: simulator.getStatus()
  });
});

// GET /api/simulator/stream - Server-Sent Events (SSE) for real-time live dashboard updates
simulatorRouter.get('/stream', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  // Send initial connected event
  res.write(`data: ${JSON.stringify({ type: 'init', status: simulator.getStatus() })}\n\n`);

  // Subscribe to new orders
  const unsubscribe = simulator.subscribe((newOrder) => {
    try {
      const payload = {
        type: 'order',
        order: newOrder,
        status: simulator.getStatus()
      };
      res.write(`data: ${JSON.stringify(payload)}\n\n`);
    } catch (err) {
      console.error('SSE send error:', err);
    }
  });

  // Heartbeat ping every 10 seconds to keep connection alive
  const pingInterval = setInterval(() => {
    try {
      res.write(`data: ${JSON.stringify({ type: 'ping', status: simulator.getStatus() })}\n\n`);
    } catch {
      clearInterval(pingInterval);
    }
  }, 10000);

  req.on('close', () => {
    unsubscribe();
    clearInterval(pingInterval);
  });
});

// DataTrace Connector Routes
simulatorRouter.get('/datatrace/status', (_req: Request, res: Response) => {
  return res.json({
    success: true,
    datatrace: getDataTraceStatus()
  });
});

simulatorRouter.post('/datatrace/config', (req: Request, res: Response) => {
  const apiUrl = req.body?.apiUrl || '';
  setDataTraceApiUrl(apiUrl);
  return res.json({
    success: true,
    message: apiUrl ? `DataTrace target API updated to ${apiUrl}` : 'DataTrace mock mode activated',
    datatrace: getDataTraceStatus()
  });
});

