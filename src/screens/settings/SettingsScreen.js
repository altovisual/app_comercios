import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants';
import { useAuth } from '../../context/AuthContext';

export default function SettingsScreen() {
  const { store, logout, updateStore } = useAuth();

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
        { icon: 'storefront-outline', label: 'Información del Comercio', onPress: () => {} },
        { icon: 'time-outline', label: 'Horarios de Operación', onPress: () => {} },
        { icon: 'location-outline', label: 'Zona de Entrega', onPress: () => {} },
      ],
    },
    {
      title: 'Configuración',
      items: [
        { icon: 'notifications-outline', label: 'Notificaciones', onPress: () => {} },
        { icon: 'card-outline', label: 'Métodos de Pago', onPress: () => {} },
        { icon: 'receipt-outline', label: 'Facturación', onPress: () => {} },
      ],
    },
    {
      title: 'Ayuda',
      items: [
        { icon: 'help-circle-outline', label: 'Centro de Ayuda', onPress: () => {} },
        { icon: 'call-outline', label: 'Contactar Soporte', onPress: () => {} },
        { icon: 'document-text-outline', label: 'Términos y Condiciones', onPress: () => {} },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Configuración</Text>
        </View>

        {/* Store Status Toggle */}
        <View style={styles.statusCard}>
          <View style={styles.statusInfo}>
            <Ionicons name="storefront" size={24} color={COLORS.primary} />
            <View style={styles.statusText}>
              <Text style={styles.statusLabel}>Estado del Comercio</Text>
              <Text style={styles.statusValue}>
                {store?.isOpen ? 'Abierto' : 'Cerrado'}
              </Text>
            </View>
          </View>
          <Switch
            value={store?.isOpen}
            onValueChange={toggleStoreStatus}
            trackColor={{ false: COLORS.border, true: COLORS.success }}
            thumbColor={COLORS.white}
          />
        </View>

        {/* Settings Sections */}
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.items.map((item, itemIndex) => (
              <TouchableOpacity
                key={itemIndex}
                style={styles.settingItem}
                onPress={item.onPress}
              >
                <View style={styles.settingLeft}>
                  <Ionicons name={item.icon} size={24} color={COLORS.text} />
                  <Text style={styles.settingLabel}>{item.label}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color={COLORS.danger} />
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
  header: {
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  statusCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
  },
  statusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    marginLeft: 16,
  },
  statusLabel: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  statusValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textLight,
    marginLeft: 20,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.danger,
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
    marginBottom: 40,
  },
});
