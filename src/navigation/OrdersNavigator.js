import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import OrdersScreen from '../screens/orders/OrdersScreen';
import OrderDetailScreen from '../screens/orders/OrderDetailScreen';

const Stack = createStackNavigator();

function OrdersStackNavigator() {
  return (
    <Stack.Navigator 
      screenOptions={{ headerShown: false }}
      initialRouteName="OrdersList"
    >
      <Stack.Screen name="OrdersList" component={OrdersScreen} />
      <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
    </Stack.Navigator>
  );
}

export default function OrdersNavigator({ route }) {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  React.useEffect(() => {
    if (isFocused) {
      // Resetear el stack al volver al tab
      navigation.reset({
        index: 0,
        routes: [{ name: 'OrdersList', params: route?.params }],
      });
    }
  }, [isFocused, navigation, route?.params]);

  return <OrdersStackNavigator />;
}
