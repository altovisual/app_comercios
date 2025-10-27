import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Configuración de Firebase
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

// Exportar servicios
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
