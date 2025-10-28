// Script para limpiar todas las órdenes de Firebase
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, deleteDoc, doc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyB2QxXfIydx7N-mQJMcXWqxkMXRCDBzGp8",
  authDomain: "delivery-fbe87.firebaseapp.com",
  projectId: "delivery-fbe87",
  storageBucket: "delivery-fbe87.firebasestorage.app",
  messagingSenderId: "1082114516649",
  appId: "1:1082114516649:web:92da94eb33739d2efaabb8",
  measurementId: "G-C1N578LDR5"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function clearAllOrders() {
  try {
    console.log('🔄 Obteniendo todas las órdenes...');
    
    const ordersRef = collection(db, 'orders');
    const snapshot = await getDocs(ordersRef);
    
    console.log(`📦 Encontradas ${snapshot.size} órdenes`);
    
    if (snapshot.size === 0) {
      console.log('✅ No hay órdenes para eliminar');
      process.exit(0);
    }
    
    console.log('🗑️  Eliminando órdenes...');
    
    let deleted = 0;
    const deletePromises = [];
    
    snapshot.forEach((document) => {
      deletePromises.push(
        deleteDoc(doc(db, 'orders', document.id))
          .then(() => {
            deleted++;
            console.log(`✅ Eliminada orden ${deleted}/${snapshot.size}: ${document.id}`);
          })
      );
    });
    
    await Promise.all(deletePromises);
    
    console.log('');
    console.log('🎉 ¡Todas las órdenes han sido eliminadas!');
    console.log(`✅ Total eliminadas: ${deleted}`);
    console.log('');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error eliminando órdenes:', error);
    process.exit(1);
  }
}

// Ejecutar
clearAllOrders();
