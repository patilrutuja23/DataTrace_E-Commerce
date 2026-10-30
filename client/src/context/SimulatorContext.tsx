import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Order, SimulatorStatus } from '../types';
import {
  fetchSimulatorStatus,
  startSimulator,
  stopSimulator,
  generateOrderNow,
  setSimulatorInterval,
  fetchOrders
} from '../services/api';

interface SimulatorContextType {
  status: SimulatorStatus | null;
  orders: Order[];
  isLoading: boolean;
  isActionLoading: boolean;
  start: (intervalMs?: number) => Promise<void>;
  stop: () => Promise<void>;
  generateNow: () => Promise<Order | null>;
  changeInterval: (intervalSec: number) => Promise<void>;
  refreshOrders: () => Promise<void>;
}

const SimulatorContext = createContext<SimulatorContextType | undefined>(undefined);

export const SimulatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<SimulatorStatus | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isActionLoading, setIsActionLoading] = useState<boolean>(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  const refreshOrders = useCallback(async () => {
    try {
      const data = await fetchOrders(50);
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders', err);
    }
  }, []);

  const refreshStatus = useCallback(async () => {
    try {
      const data = await fetchSimulatorStatus();
      setStatus(data);
    } catch (err) {
      console.error('Failed to load simulator status', err);
    }
  }, []);

  // Connect to SSE stream
  useEffect(() => {
    let isMounted = true;

    async function init() {
      setIsLoading(true);
      await Promise.all([refreshStatus(), refreshOrders()]);
      if (isMounted) setIsLoading(false);
    }

    init();

    // Setup SSE
    const es = new EventSource('/api/simulator/stream');
    eventSourceRef.current = es;

    es.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.status) {
          setStatus(payload.status);
        }
        if (payload.type === 'order' && payload.order) {
          const newOrder: Order = payload.order;
          setOrders((prev) => {
            // Avoid duplicate orders by id
            if (prev.some((o) => o.order_id === newOrder.order_id)) {
              return prev;
            }
            return [newOrder, ...prev.slice(0, 99)];
          });
        }
      } catch (err) {
        console.error('Error parsing SSE event:', err);
      }
    };

    es.onerror = (err) => {
      console.warn('SSE connection error, will retry automatically', err);
    };

    return () => {
      isMounted = false;
      es.close();
    };
  }, [refreshStatus, refreshOrders]);

  const start = async (intervalMs = 5000) => {
    try {
      setIsActionLoading(true);
      const newStatus = await startSimulator(intervalMs);
      setStatus(newStatus);
    } catch (err) {
      console.error('Failed to start simulator', err);
    } finally {
      setIsActionLoading(false);
    }
  };

  const stop = async () => {
    try {
      setIsActionLoading(true);
      const newStatus = await stopSimulator();
      setStatus(newStatus);
    } catch (err) {
      console.error('Failed to stop simulator', err);
    } finally {
      setIsActionLoading(false);
    }
  };

  const generateNow = async (): Promise<Order | null> => {
    try {
      setIsActionLoading(true);
      const newOrder = await generateOrderNow();
      setOrders((prev) => [newOrder, ...prev.filter((o) => o.order_id !== newOrder.order_id)]);
      await refreshStatus();
      return newOrder;
    } catch (err) {
      console.error('Failed to trigger manual generation', err);
      return null;
    } finally {
      setIsActionLoading(false);
    }
  };

  const changeInterval = async (intervalSec: number) => {
    try {
      setIsActionLoading(true);
      const newStatus = await setSimulatorInterval(intervalSec * 1000);
      setStatus(newStatus);
    } catch (err) {
      console.error('Failed to change interval', err);
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <SimulatorContext.Provider
      value={{
        status,
        orders,
        isLoading,
        isActionLoading,
        start,
        stop,
        generateNow,
        changeInterval,
        refreshOrders
      }}
    >
      {children}
    </SimulatorContext.Provider>
  );
};

export const useSimulator = () => {
  const context = useContext(SimulatorContext);
  if (!context) {
    throw new Error('useSimulator must be used within a SimulatorProvider');
  }
  return context;
};

