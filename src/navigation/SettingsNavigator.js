import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import SettingsScreen from '../screens/settings/SettingsScreen';
import StoreInfoScreen from '../screens/settings/StoreInfoScreen';
import OperatingHoursScreen from '../screens/settings/OperatingHoursScreen';
import DeliveryZoneScreen from '../screens/settings/DeliveryZoneScreen';
import NotificationsScreen from '../screens/settings/NotificationsScreen';
import PaymentMethodsScreen from '../screens/settings/PaymentMethodsScreen';
import HelpCenterScreen from '../screens/settings/HelpCenterScreen';

const Stack = createStackNavigator();

function SettingsStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="SettingsMain"
    >
      <Stack.Screen name="SettingsMain" component={SettingsScreen} />
      <Stack.Screen name="StoreInfo" component={StoreInfoScreen} />
      <Stack.Screen name="OperatingHours" component={OperatingHoursScreen} />
      <Stack.Screen name="DeliveryZone" component={DeliveryZoneScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
      <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
    </Stack.Navigator>
  );
}

export default function SettingsNavigator() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  React.useEffect(() => {
    if (isFocused) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'SettingsMain' }],
      });
    }
  }, [isFocused]);

  return <SettingsStackNavigator />;
}
