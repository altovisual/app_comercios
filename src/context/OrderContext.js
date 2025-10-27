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
        driver: {
          id: 'driver001',
          name: 'Juan Pérez',
          phone: '+584121234567',
          vehicle: 'Moto',
          rating: 4.8,
          status: 'assigned', // assigned, on_way, arrived
        },
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
        driver: {
          id: 'driver002',
          name: 'María González',
          phone: '+584149876543',
          vehicle: 'Moto',
          rating: 4.9,
          status: 'assigned',
        },
      },
      {
        id: 'order003',
        type: 'delivery',
        status: ORDER_STATUS.PENDING,
        user: {
          name: 'Ana Rodríguez',
          phone: '+584167891234',
        },
        items: [
          { name: 'Tacos al Pastor', quantity: 3, price: 5.0, subtotal: 15.0 },
          { name: 'Refresco', quantity: 2, price: 2.0, subtotal: 4.0 },
        ],
        subtotal: 19.0,
        deliveryFee: 2.0,
        total: 21.0,
        destination: {
          address: 'Urbanización Los Colorados',
        },
        paymentMethod: 'cash',
        createdAt: new Date(Date.now() - 300000).toISOString(),
        driver: {
          id: 'driver003',
          name: 'Carlos Rodríguez',
          phone: '+584167891234',
          vehicle: 'Bicicleta',
          rating: 4.7,
          status: 'assigned',
        },
      },
      {
        id: 'order004',
        type: 'delivery',
        status: ORDER_STATUS.READY,
        user: {
          name: 'Luis Martínez',
          phone: '+584145678901',
        },
        items: [
          { name: 'Sushi Roll', quantity: 2, price: 15.0, subtotal: 30.0 },
        ],
        subtotal: 30.0,
        deliveryFee: 3.0,
        total: 33.0,
        destination: {
          address: 'Naguanagua',
        },
        paymentMethod: 'card',
        createdAt: new Date(Date.now() - 900000).toISOString(),
      },
      {
        id: 'order005',
        type: 'delivery',
        status: ORDER_STATUS.DELIVERED,
        user: {
          name: 'Sofia Hernández',
          phone: '+584123456789',
        },
        items: [
          { name: 'Ensalada César', quantity: 1, price: 10.0, subtotal: 10.0 },
          { name: 'Jugo Natural', quantity: 1, price: 3.5, subtotal: 3.5 },
        ],
        subtotal: 13.5,
        deliveryFee: 2.0,
        total: 15.5,
        destination: {
          address: 'La Viña',
        },
        paymentMethod: 'mobile_payment',
        createdAt: new Date(Date.now() - 1800000).toISOString(),
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

  const handOverToDriver = (orderId) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? { 
              ...order, 
              status: ORDER_STATUS.PICKED_UP,
              pickedUpAt: new Date().toISOString(),
              driver: {
                ...order.driver,
                status: 'on_way', // Repartidor en camino
              }
            }
          : order
      )
    );
  };

  const markDelivered = (orderId) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? { 
              ...order, 
              status: ORDER_STATUS.DELIVERED,
              deliveredAt: new Date().toISOString(),
              driver: {
                ...order.driver,
                status: 'delivered',
              }
            }
          : order
      )
    );
  };

  const updateDriverStatus = (orderId, driverStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId && order.driver
          ? { 
              ...order, 
              driver: {
                ...order.driver,
                status: driverStatus,
              }
            }
          : order
      )
    );
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
