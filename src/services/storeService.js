import { db } from '../config/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';

// Actualizar estado del local (abierto/cerrado)
export const updateStoreStatus = async (storeId, isOpen) => {
  try {
    const storeRef = doc(db, 'stores', storeId);
    await updateDoc(storeRef, {
      isOpen,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating store status:', error);
    return { success: false, error: error.message };
  }
};

// Actualizar información del local
export const updateStoreInfo = async (storeId, updates) => {
  try {
    const storeRef = doc(db, 'stores', storeId);
    await updateDoc(storeRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating store info:', error);
    return { success: false, error: error.message };
  }
};
