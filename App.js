import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { OrderProvider } from './src/context/OrderContext';
import { StoreProvider } from './src/context/StoreContext';
import AppNavigator from './src/navigation/AppNavigator';
import ErrorBoundary from './src/components/ErrorBoundary';

export default function App() {
  useEffect(() => {
    // Capturar TODOS los errores no manejados
    const errorHandler = (error, isFatal) => {
      console.error('🔴🔴🔴 ERROR GLOBAL CAPTURADO 🔴🔴🔴');
      console.error('Error:', error);
      console.error('Stack:', error.stack);
      console.error('Is Fatal:', isFatal);
    };

    // Solo funciona en desarrollo
    if (__DEV__) {
      global.ErrorUtils?.setGlobalHandler?.(errorHandler);
    }
  }, []);

  return (
    <ErrorBoundary>
    <SafeAreaProvider>
      <AuthProvider>
        <StoreProvider>
          <OrderProvider>
            <NavigationContainer>
              <StatusBar style="auto" />
              <AppNavigator />
            </NavigationContainer>
          </OrderProvider>
        </StoreProvider>
      </AuthProvider>
    </SafeAreaProvider>
    </ErrorBoundary>
  );
}
