import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants';
import { useOrders } from '../context/OrderContext';

import HomeScreen from '../screens/home/HomeScreen';
import OrdersNavigator from './OrdersNavigator';
import ProductsNavigator from './ProductsNavigator';
import StatsScreen from '../screens/stats/StatsScreen';
import SettingsNavigator from './SettingsNavigator';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const { pendingCount } = useOrders();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        unmountOnBlur: true,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Orders') {
            iconName = focused ? 'receipt' : 'receipt-outline';
          } else if (route.name === 'Products') {
            iconName = focused ? 'basket' : 'basket-outline';
          } else if (route.name === 'Stats') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return (
            <View style={styles.iconContainer}>
              <Ionicons name={iconName} size={size} color={color} />
              {route.name === 'Orders' && pendingCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{pendingCount}</Text>
                </View>
              )}
            </View>
          );
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          position: 'absolute',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ tabBarLabel: 'Inicio' }}
      />
      <Tab.Screen 
        name="Orders" 
        component={OrdersNavigator}
        options={{ tabBarLabel: 'Pedidos' }}
      />
      <Tab.Screen 
        name="Products" 
        component={ProductsNavigator}
        options={{ tabBarLabel: 'Productos' }}
      />
      <Tab.Screen 
        name="Stats" 
        component={StatsScreen}
        options={{ tabBarLabel: 'Estadísticas' }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsNavigator}
        options={{ tabBarLabel: 'Ajustes' }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    right: -8,
    top: -4,
    backgroundColor: COLORS.danger,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
});
