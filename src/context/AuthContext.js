import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from '../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const userData = await AsyncStorage.getItem('merchantUser');
      const storeData = await AsyncStorage.getItem('merchantStore');
      
      if (userData && storeData) {
        setUser(JSON.parse(userData));
        setStore(JSON.parse(storeData));
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      // Aquí implementarías la lógica de login con Firebase Auth
      // Por ahora usamos datos mock
      const mockUser = {
        id: 'store001',
        email: email,
      };
      
      const mockStore = {
        id: 'store001',
        name: 'Burger House',
        category: 'restaurant',
        email: email,
        phone: '+584121234567',
        image: '🍔',
        isOpen: true,
        rating: 4.5,
      };

      await AsyncStorage.setItem('merchantUser', JSON.stringify(mockUser));
      await AsyncStorage.setItem('merchantStore', JSON.stringify(mockStore));
      
      setUser(mockUser);
      setStore(mockStore);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('merchantUser');
      await AsyncStorage.removeItem('merchantStore');
      setUser(null);
      setStore(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateStore = async (updates) => {
    try {
      const updatedStore = { ...store, ...updates };
      
      // Actualizar en Firebase
      const storeRef = doc(db, 'stores', store.id);
      await updateDoc(storeRef, updates);
      
      console.log('✅ Comercio actualizado en Firebase:', updates);
      
      // Actualizar en AsyncStorage local
      await AsyncStorage.setItem('merchantStore', JSON.stringify(updatedStore));
      setStore(updatedStore);
      
      return { success: true };
    } catch (error) {
      console.error('❌ Error actualizando comercio:', error);
      return { success: false, error: error.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        store,
        loading,
        login,
        logout,
        updateStore,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
