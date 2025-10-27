import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants';
import { useAuth } from '../../context/AuthContext';
import { getDeviceType } from '../../utils/responsive';
import { Card } from '../../components';

export default function SettingsScreen() {
  const { store, logout, updateStore } = useAuth();
  const [deviceType, setDeviceType] = useState(getDeviceType());

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', () => {
      setDeviceType(getDeviceType());
    });
    return () => subscription?.remove();
  }, []);

  const isDesktop = deviceType === 'desktop';

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Cerrar Sesión', onPress: logout, style: 'destructive' },
      ]
    );
  };

  const toggleStoreStatus = () => {
    updateStore({ isOpen: !store.isOpen });
  };

  const settingsSections = [
    {
      title: 'Comercio',
      items: [
        { icon: 'storefront-outline', label: 'Información del Comercio', onPress: () => {}, color: COLORS.primary },
        { icon: 'time-outline', label: 'Horarios de Operación', onPress: () => {}, color: COLORS.info },
        { icon: 'location-outline', label: 'Zona de Entrega', onPress: () => {}, color: COLORS.success },
      ],
    },
    {
      title: 'Configuración',
      items: [
        { icon: 'notifications-outline', label: 'Notificaciones', onPress: () => {}, color: COLORS.warning },
        { icon: 'card-outline', label: 'Métodos de Pago', onPress: () => {}, color: COLORS.secondary },
        { icon: 'receipt-outline', label: 'Facturación', onPress: () => {}, color: COLORS.info },
      ],
    },
    {
      title: 'Ayuda',
      items: [
        { icon: 'help-circle-outline', label: 'Centro de Ayuda', onPress: () => {}, color: COLORS.primary },
        { icon: 'call-outline', label: 'Contactar Soporte', onPress: () => {}, color: COLORS.success },
        { icon: 'document-text-outline', label: 'Términos y Condiciones', onPress: () => {}, color: COLORS.textLight },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={[styles.scrollContent, isDesktop && styles.scrollContentDesktop]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Configuración</Text>
        </View>

        {/* Store Status Card */}
        <Card style={styles.statusCard}>
          <View style={styles.statusContent}>
            <View style={styles.statusLeft}>
              <View style={[styles.statusIconContainer, { 
                backgroundColor: store?.isOpen ? COLORS.success + '15' : COLORS.danger + '15' 
              }]}>
                <Ionicons 
                  name="storefront" 
                  size={24} 
                  color={store?.isOpen ? COLORS.success : COLORS.danger} 
                />
              </View>
              <View style={styles.statusInfo}>
                <Text style={styles.statusLabel}>Estado del Comercio</Text>
                <Text style={[
                  styles.statusValue,
                  { color: store?.isOpen ? COLORS.success : COLORS.danger }
                ]}>
                  {store?.isOpen ? 'Abierto' : 'Cerrado'}
                </Text>
              </View>
            </View>
            <Switch
              value={store?.isOpen}
              onValueChange={toggleStoreStatus}
              trackColor={{ false: COLORS.border, true: COLORS.success }}
              thumbColor={COLORS.white}
              ios_backgroundColor={COLORS.border}
            />
          </View>
        </Card>

        {/* Settings Sections */}
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Card noPadding style={styles.sectionCard}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  style={[
                    styles.settingItem,
                    itemIndex < section.items.length - 1 && styles.settingItemBorder
                  ]}
                  onPress={item.onPress}
                  activeOpacity={0.7}
                >
                  <View style={styles.settingLeft}>
                    <View style={[styles.settingIconContainer, { backgroundColor: item.color + '15' }]}>
                      <Ionicons name={item.icon} size={20} color={item.color} />
                    </View>
                    <Text style={styles.settingLabel}>{item.label}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
                </TouchableOpacity>
              ))}
            </Card>
          </View>
        ))}

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color={COLORS.danger} />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Versión 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  scrollContentDesktop: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 800,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  statusCard: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  statusContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  statusInfo: {
    flex: 1,
  },
  statusLabel: {
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: 4,
    fontWeight: '500',
  },
  statusValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textLight,
    marginLeft: 20,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionCard: {
    marginHorizontal: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  settingItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    marginTop: 8,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.danger,
    shadowColor: COLORS.danger,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.danger,
    marginLeft: 8,
  },
  version: {
    textAlign: 'center',
    color: COLORS.textLight,
    fontSize: 12,
    marginTop: 24,
  },
});
