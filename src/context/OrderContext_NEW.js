import React, { createContext, useState, useEffect, useContext } from 'react';
import { ORDER_STATUS } from '../constants';
import { useAuth } from './AuthContext';
import { 
  subscribeToStoreOrders,
  acceptOrder as acceptOrderService,
  startPreparing as startPreparingService,
  markOrderReady as markOrderReadyService,
  rejectOrder as rejectOrderService,
} from '../services/orderService';

const OrderContext = createContext({});

export const OrderProvider = ({ children }) => {
  const { store } = useAuth();
  const [orders, setOrders] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (!store?.id) return;

    console.log('🔄 Escuchando pedidos del comercio:', store.id);
    
    const unsubscribe = subscribeToStoreOrders(store.id, (newOrders) => {
      console.log('📦 Pedidos recibidos:', newOrders.length);
      setOrders(newOrders);
    });

    return () => {
      console.log('🛑 Deteniendo listener de pedidos');
      unsubscribe();
    };
  }, [store?.id]);

  useEffect(() => {
    const pending = orders.filter(o => o.status === 'pending').length;
    setPendingCount(pending);
    
    const active = orders.filter(o => 
      ['pending', 'accepted', 'preparing', 'ready'].includes(o.status)
    );
    setActiveOrders(active);
  }, [orders]);

  const acceptOrder = async (orderId) => {
    const result = await acceptOrderService(orderId);
    if (!result.success) {
      console.error('Error aceptando pedido:', result.error);
    }
    return result;
  };

  const startPreparing = async (orderId) => {
    const result = await startPreparingService(orderId);
    if (!result.success) {
      console.error('Error iniciando preparación:', result.error);
    }
    return result;
  };

  const markReady = async (orderId) => {
    const result = await markOrderReadyService(orderId);
    if (!result.success) {
      console.error('Error marcando como listo:', result.error);
    }
    return result;
  };

  const cancelOrder = async (orderId, rejectInfo) => {
    const result = await rejectOrderService(orderId, rejectInfo);
    if (!result.success) {
      console.error('Error cancelando pedido:', result.error);
    }
    return result;
  };

  const handOverToDriver = (orderId) => {
    console.log('handOverToDriver:', orderId);
  };

  const markDelivered = (orderId) => {
    console.log('markDelivered:', orderId);
  };

  const updateDriverStatus = (orderId, driverStatus) => {
    console.log('updateDriverStatus:', orderId, driverStatus);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        activeOrders,
        pendingCount,
        acceptOrder,
        startPreparing,
        markReady,
        cancelOrder,
        handOverToDriver,
        markDelivered,
        updateDriverStatus,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);
