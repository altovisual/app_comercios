import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import ProductsScreen from '../screens/products/ProductsScreen';
import AddProductScreen from '../screens/products/AddProductScreen';
import EditProductScreen from '../screens/products/EditProductScreen';
import CategoriesScreen from '../screens/categories/CategoriesScreen';

const Stack = createStackNavigator();

function ProductsStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="ProductsList"
    >
      <Stack.Screen name="ProductsList" component={ProductsScreen} />
      <Stack.Screen name="AddProduct" component={AddProductScreen} />
      <Stack.Screen name="EditProduct" component={EditProductScreen} />
      <Stack.Screen name="Categories" component={CategoriesScreen} />
    </Stack.Navigator>
  );
}

export default function ProductsNavigator() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  React.useEffect(() => {
    if (isFocused) {
      // Resetear el stack al volver al tab
      navigation.reset({
        index: 0,
        routes: [{ name: 'ProductsList' }],
      });
    }
  }, [isFocused]);

  return <ProductsStackNavigator />;
}
