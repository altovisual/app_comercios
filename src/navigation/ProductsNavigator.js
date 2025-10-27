import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProductsScreen from '../screens/products/ProductsScreen';
import AddProductScreen from '../screens/products/AddProductScreen';

const Stack = createStackNavigator();

export default function ProductsNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ProductsList" component={ProductsScreen} />
      <Stack.Screen name="AddProduct" component={AddProductScreen} />
      <Stack.Screen name="EditProduct" component={AddProductScreen} />
    </Stack.Navigator>
  );
}
