import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { AuthProvider } from './src/context/AuthContext';
import { OrderProvider } from './src/context/OrderContext';
import { StoreProvider } from './src/context/StoreContext';
import AppNavigator from './src/navigation/AppNavigator';
import ErrorBoundary from './src/components/ErrorBoundary';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

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

  useEffect(() => {
    const setupNotifications = async () => {
      try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (finalStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('orders', {
            name: 'Pedidos',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 500, 200, 500],
            sound: 'default',
            enableVibrate: true,
            enableLights: true,
          });
        }

        if (finalStatus !== 'granted') {
          console.warn('Permiso de notificaciones no concedido');
        }
      } catch (error) {
        console.error('Error configurando notificaciones:', error);
      }
    };

    setupNotifications();
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
