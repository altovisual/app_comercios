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
import { uploadImageToCloudinary } from './cloudinaryService';

// Subir imagen de producto a Cloudinary
export const uploadProductImage = async (imageUri, storeId) => {
  try {
    const result = await uploadImageToCloudinary(imageUri);
    return result;
  } catch (error) {
    console.error('Error uploading image:', error);
    return { success: false, error: error.message };
  }
};

// Escuchar productos del comercio en tiempo real
export const subscribeToStoreProducts = (storeId, callback) => {
  const productsRef = collection(db, 'products');
  const q = query(
    productsRef,
    where('storeId', '==', storeId),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const products = [];
    snapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    callback(products);
  }, (error) => {
    console.error('Error listening to products:', error);
  });
};

// Agregar nuevo producto
export const addProduct = async (productData) => {
  try {
    const productsRef = collection(db, 'products');
    await addDoc(productsRef, {
      ...productData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error adding product:', error);
    return { success: false, error: error.message };
  }
};

// Actualizar producto
export const updateProduct = async (productId, updates) => {
  try {
    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating product:', error);
    return { success: false, error: error.message };
  }
};

// Eliminar producto
export const deleteProduct = async (productId) => {
  try {
    const productRef = doc(db, 'products', productId);
    await deleteDoc(productRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting product:', error);
    return { success: false, error: error.message };
  }
};

// Cambiar disponibilidad del producto
export const toggleProductAvailability = async (productId, available) => {
  try {
    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, {
      available,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error toggling availability:', error);
    return { success: false, error: error.message };
  }
};
