import React, { createContext, useState, useEffect, useContext } from 'react';
import { ORDER_STATUS } from '../constants';

const OrderContext = createContext({});

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    // Simular datos de pedidos
    loadMockOrders();
  }, []);

  useEffect(() => {
    // Actualizar contadores
    const pending = orders.filter(o => o.status === ORDER_STATUS.PENDING).length;
    setPendingCount(pending);
    
    const active = orders.filter(o => 
      [ORDER_STATUS.PENDING, ORDER_STATUS.ACCEPTED, ORDER_STATUS.PREPARING, ORDER_STATUS.READY].includes(o.status)
    );
    setActiveOrders(active);
  }, [orders]);

  const loadMockOrders = () => {
    const mockOrders = [
      {
        id: 'order001',
        type: 'delivery',
        status: ORDER_STATUS.PENDING,
        user: {
          name: 'María González',
          phone: '+584149876543',
        },
        items: [
          { name: 'Hamburguesa Clásica', quantity: 2, price: 8.5, subtotal: 17.0 },
          { name: 'Papas Fritas', quantity: 1, price: 3.5, subtotal: 3.5 },
        ],
        subtotal: 20.5,
        deliveryFee: 2.0,
        total: 22.5,
        destination: {
          address: 'Av. Bolívar, Valencia',
        },
        paymentMethod: 'cash',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'order002',
        type: 'delivery',
        status: ORDER_STATUS.PREPARING,
        user: {
          name: 'Carlos Pérez',
          phone: '+584121234567',
        },
        items: [
          { name: 'Pizza Pepperoni', quantity: 1, price: 12.0, subtotal: 12.0 },
        ],
        subtotal: 12.0,
        deliveryFee: 2.0,
        total: 14.0,
        destination: {
          address: 'Centro, Valencia',
        },
        paymentMethod: 'mobile_payment',
        createdAt: new Date(Date.now() - 600000).toISOString(),
      },
    ];
    
    setOrders(mockOrders);
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? { ...order, status: newStatus }
          : order
      )
    );
  };

  const acceptOrder = (orderId) => {
    updateOrderStatus(orderId, ORDER_STATUS.ACCEPTED);
  };

  const startPreparing = (orderId) => {
    updateOrderStatus(orderId, ORDER_STATUS.PREPARING);
  };

  const markReady = (orderId) => {
    updateOrderStatus(orderId, ORDER_STATUS.READY);
  };

  const cancelOrder = (orderId) => {
    updateOrderStatus(orderId, ORDER_STATUS.CANCELLED);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        activeOrders,
        pendingCount,
        updateOrderStatus,
        acceptOrder,
        startPreparing,
        markReady,
        cancelOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);
