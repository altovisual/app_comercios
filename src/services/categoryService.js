import { db } from '../config/firebase';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';

// Escuchar categorías del comercio en tiempo real
export const subscribeToStoreCategories = (storeId, callback) => {
  const categoriesRef = collection(db, 'categories');
  const q = query(
    categoriesRef,
    where('storeId', '==', storeId),
    orderBy('name', 'asc')
  );

  return onSnapshot(q, (snapshot) => {
    const categories = [];
    snapshot.forEach((doc) => {
      categories.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    callback(categories);
  }, (error) => {
    console.error('Error listening to categories:', error);
  });
};

// Agregar nueva categoría
export const addCategory = async (categoryData) => {
  try {
    const categoriesRef = collection(db, 'categories');
    await addDoc(categoriesRef, {
      ...categoryData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error adding category:', error);
    return { success: false, error: error.message };
  }
};

// Actualizar categoría
export const updateCategory = async (categoryId, updates) => {
  try {
    const categoryRef = doc(db, 'categories', categoryId);
    await updateDoc(categoryRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating category:', error);
    return { success: false, error: error.message };
  }
};

// Eliminar categoría
export const deleteCategory = async (categoryId) => {
  try {
    const categoryRef = doc(db, 'categories', categoryId);
    await deleteDoc(categoryRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting category:', error);
    return { success: false, error: error.message };
  }
};
