// Script para crear datos de prueba en Firestore
// Ejecutar: node scripts/seedFirestore.js

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB2QxXfIydx7N-mQJMcXWqxkMXRCDBzGp8",
  authDomain: "delivery-fbe87.firebaseapp.com",
  projectId: "delivery-fbe87",
  storageBucket: "delivery-fbe87.firebasestorage.app",
  messagingSenderId: "1082114516649",
  appId: "1:1082114516649:web:92da94eb33739d2efaabb8",
  measurementId: "G-C1N578LDR5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seedData() {
  console.log('🌱 Iniciando seed de datos...\n');

  try {
    // 1. Crear Usuario Comerciante
    console.log('👤 Creando usuario comerciante...');
    await setDoc(doc(db, 'users', 'user001'), {
      type: 'merchant',
      name: 'Pedro González',
      email: 'comercio@test.com',
      phone: '+584121234567',
      storeId: 'store001',
      createdAt: serverTimestamp()
    });
    console.log('✅ Usuario comerciante creado\n');

    // 2. Crear Usuario Cliente
    console.log('👤 Creando usuario cliente...');
    await setDoc(doc(db, 'users', 'user003'), {
      type: 'client',
      name: 'María González',
      email: 'cliente@test.com',
      phone: '+584149876543',
      createdAt: serverTimestamp()
    });
    console.log('✅ Usuario cliente creado\n');

    // 3. Crear Usuario Repartidor
    console.log('👤 Creando usuario repartidor...');
    await setDoc(doc(db, 'users', 'user002'), {
      type: 'driver',
      name: 'Juan Pérez',
      email: 'driver@test.com',
      phone: '+584129876543',
      createdAt: serverTimestamp()
    });
    console.log('✅ Usuario repartidor creado\n');

    // 4. Crear Local/Tienda
    console.log('🏪 Creando local...');
    await setDoc(doc(db, 'stores', 'store001'), {
      name: 'Burger House',
      category: 'restaurant',
      ownerId: 'user001',
      isOpen: true,
      phone: '+584121234567',
      location: {
        latitude: 10.4806,
        longitude: -66.9036,
        address: 'Av. Principal, Caracas, Venezuela'
      },
      rating: 4.5,
      image: '🍔',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    console.log('✅ Local creado\n');

    // 5. Crear Repartidor
    console.log('🏍️ Creando repartidor...');
    await setDoc(doc(db, 'drivers', 'driver001'), {
      userId: 'user002',
      name: 'Juan Pérez',
      phone: '+584129876543',
      vehicle: 'Moto',
      licensePlate: 'ABC123',
      status: 'available',
      rating: 4.8,
      totalDeliveries: 45,
      currentLocation: {
        latitude: 10.4806,
        longitude: -66.9036
      },
      currentOrderId: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    console.log('✅ Repartidor creado\n');

    // 6. Crear Pedido de Prueba
    console.log('📦 Creando pedido de prueba...');
    await setDoc(doc(db, 'orders', 'order001'), {
      storeId: 'store001',
      clientId: 'user003',
      driverId: null,
      status: 'PENDING',
      items: [
        {
          id: 'item001',
          name: 'Hamburguesa Clásica',
          price: 8.50,
          quantity: 2,
          notes: 'Sin cebolla'
        },
        {
          id: 'item002',
          name: 'Papas Fritas Grande',
          price: 3.50,
          quantity: 1
        }
      ],
      subtotal: 20.50,
      deliveryFee: 2.00,
      total: 22.50,
      paymentMethod: 'cash',
      destination: {
        latitude: 10.4906,
        longitude: -66.8936,
        address: 'Av. Bolívar, Valencia, Venezuela'
      },
      user: {
        name: 'María González',
        phone: '+584149876543'
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    console.log('✅ Pedido creado\n');

    console.log('🎉 ¡Seed completado exitosamente!\n');
    console.log('📊 Datos creados:');
    console.log('   - 3 usuarios (comerciante, cliente, repartidor)');
    console.log('   - 1 local (Burger House)');
    console.log('   - 1 repartidor disponible');
    console.log('   - 1 pedido pendiente\n');
    console.log('🔐 Credenciales de prueba:');
    console.log('   Comercio: comercio@test.com');
    console.log('   Cliente:  cliente@test.com');
    console.log('   Driver:   driver@test.com');
    console.log('   Password: test123 (debes crearlos en Authentication)\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creando datos:', error);
    process.exit(1);
  }
}

seedData();
