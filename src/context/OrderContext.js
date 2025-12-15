import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import { AppState, Vibration } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Haptics from 'expo-haptics';
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

  const didInitOrdersRef = useRef(false);
  const previousOrderIdsRef = useRef(new Set());

  const notifyNewOrder = async (order) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Nuevo pedido',
          body: 'Te llegó un pedido nuevo',
          data: { orderId: order?.id },
          sound: 'default',
          channelId: 'orders',
        },
        trigger: null,
      });

      if (AppState.currentState === 'active') {
        try {
          Vibration.vibrate([0, 500, 200, 500]);
        } catch (e) {
          console.error('Error vibrando:', e);
        }

        try {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch (e) {
          console.error('Error haptics:', e);
        }
      }
    } catch (error) {
      console.error('Error enviando notificación de pedido:', error);
    }
  };

  useEffect(() => {
    if (!store?.id) return;

    didInitOrdersRef.current = false;
    previousOrderIdsRef.current = new Set();

    console.log('🔄 Escuchando pedidos del comercio:', store.id);
    
    const unsubscribe = subscribeToStoreOrders(store.id, (newOrders) => {
      try {
        console.log('📦 Pedidos recibidos:', newOrders.length);
        if (newOrders.length > 0) {
          console.log('📋 Estructura del primer pedido:', JSON.stringify(newOrders[0], null, 2));
        }
        
        // Validar cada pedido
        const validOrders = newOrders.map((order, index) => {
          if (!order.id) {
            console.warn(`⚠️ Pedido ${index} sin ID`);
          }
          if (!order.status) {
            console.warn(`⚠️ Pedido ${index} sin status`);
          }
          return order;
        });
        
        const currentIds = new Set(validOrders.map(o => o.id).filter(Boolean));
        if (!didInitOrdersRef.current) {
          didInitOrdersRef.current = true;
        } else {
          const newPendingOrders = validOrders.filter(o =>
            o?.id &&
            !previousOrderIdsRef.current.has(o.id) &&
            o.status === 'pending'
          );
          if (newPendingOrders.length > 0) {
            notifyNewOrder(newPendingOrders[0]);
          }
        }
        previousOrderIdsRef.current = currentIds;

        console.log('✅ Llamando setOrders...');
        setOrders(validOrders);
        console.log('✅ setOrders completado');
      } catch (error) {
        console.error('❌ Error en callback de pedidos:', error);
        console.error('❌ Stack:', error.stack);
      }
    });

    return () => {
      console.log('🛑 Deteniendo listener de pedidos');
      unsubscribe();
    };
  }, [store?.id]);

  useEffect(() => {
    try {
      console.log('🔢 Calculando contadores para', orders.length, 'pedidos');
      const pending = orders.filter(o => o.status === 'pending').length;
      setPendingCount(pending);
      
      const active = orders.filter(o => 
        ['pending', 'accepted', 'preparing', 'ready'].includes(o.status)
      );
      setActiveOrders(active);
      console.log('✅ Contadores actualizados: pending=', pending, 'active=', active.length);
    } catch (error) {
      console.error('❌ Error calculando contadores:', error);
      console.error('❌ Stack:', error.stack);
    }
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
