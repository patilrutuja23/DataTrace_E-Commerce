import { Router, Request, Response } from 'express';
import { getOrderStats } from '../db/database.js';
import { simulator } from '../services/simulator.js';

export const statsRouter = Router();

// GET /api/stats
statsRouter.get('/', (_req: Request, res: Response) => {
  try {
    const stats = getOrderStats();
    const simStatus = simulator.getStatus();

    return res.json({
      success: true,
      stats: {
        ...stats,
        ordersPerMinute: simStatus.ordersPerMinute,
        isSimulatorRunning: simStatus.isRunning,
        intervalMs: simStatus.intervalMs
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

