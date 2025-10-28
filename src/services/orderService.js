import { db } from '../config/firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  onSnapshot, 
  query, 
  where,
  orderBy,
  serverTimestamp,
  getDoc
} from 'firebase/firestore';

// Escuchar pedidos del comercio en tiempo real
export const subscribeToStoreOrders = (storeId, callback) => {
  const ordersRef = collection(db, 'orders');
  const q = query(
    ordersRef,
    where('storeId', '==', storeId)
  );

  return onSnapshot(q, (snapshot) => {
    const orders = [];
    snapshot.forEach((doc) => {
      orders.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // Ordenar en el cliente por createdAt
    orders.sort((a, b) => {
      const timeA = a.createdAt?.seconds || 0;
      const timeB = b.createdAt?.seconds || 0;
      return timeB - timeA; // Más reciente primero
    });
    
    callback(orders);
  }, (error) => {
    console.error('Error listening to orders:', error);
  });
};

// Aceptar pedido
export const acceptOrder = async (orderId) => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      status: 'accepted',
      acceptedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    console.log('✅ Pedido aceptado:', orderId);
    return { success: true };
  } catch (error) {
    console.error('❌ Error accepting order:', error);
    return { success: false, error: error.message };
  }
};

// Iniciar preparación
export const startPreparing = async (orderId) => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      status: 'preparing',
      preparingAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    console.log('✅ Pedido en preparación:', orderId);
    return { success: true };
  } catch (error) {
    console.error('❌ Error starting preparation:', error);
    return { success: false, error: error.message };
  }
};

// Marcar como listo
export const markOrderReady = async (orderId) => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      status: 'ready',
      readyAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    console.log('✅ Pedido listo:', orderId);
    return { success: true };
  } catch (error) {
    console.error('❌ Error marking order ready:', error);
    return { success: false, error: error.message };
  }
};

// Entregar a repartidor
export const handOverToDriver = async (orderId) => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      status: 'PICKED_UP',
      'driver.status': 'on_way',
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error handing over to driver:', error);
    return { success: false, error: error.message };
  }
};

// Rechazar pedido
export const rejectOrder = async (orderId, rejectInfo) => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      status: 'CANCELLED',
      rejectInfo: {
        ...rejectInfo,
        timestamp: serverTimestamp()
      },
      'driver.status': 'freed',
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error rejecting order:', error);
    return { success: false, error: error.message };
  }
};

// Asignar repartidor
export const assignDriver = async (orderId, driverData) => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      driverId: driverData.id,
      driver: {
        name: driverData.name,
        phone: driverData.phone,
        vehicle: driverData.vehicle,
        rating: driverData.rating,
        status: 'assigned'
      },
      updatedAt: serverTimestamp()
    });

    // Actualizar estado del repartidor
    const driverRef = doc(db, 'drivers', driverData.id);
    await updateDoc(driverRef, {
      status: 'busy',
      currentOrderId: orderId,
      updatedAt: serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('Error assigning driver:', error);
    return { success: false, error: error.message };
  }
};

// Obtener repartidores disponibles
export const getAvailableDrivers = async () => {
  try {
    const driversRef = collection(db, 'drivers');
    const q = query(driversRef, where('status', '==', 'available'));
    
    const snapshot = await getDocs(q);
    const drivers = [];
    snapshot.forEach((doc) => {
      drivers.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { success: true, drivers };
  } catch (error) {
    console.error('Error getting drivers:', error);
    return { success: false, error: error.message, drivers: [] };
  }
};
