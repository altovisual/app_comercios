import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants';
import { Input } from './';

// Repartidores mock disponibles
const AVAILABLE_DRIVERS = [
  {
    id: 'driver001',
    name: 'Juan Pérez',
    phone: '+584121234567',
    vehicle: 'Moto',
    rating: 4.8,
    deliveries: 156,
    available: true,
  },
  {
    id: 'driver002',
    name: 'María González',
    phone: '+584149876543',
    vehicle: 'Moto',
    rating: 4.9,
    deliveries: 203,
    available: true,
  },
  {
    id: 'driver003',
    name: 'Carlos Rodríguez',
    phone: '+584167891234',
    vehicle: 'Bicicleta',
    rating: 4.7,
    deliveries: 98,
    available: true,
  },
];

export default function DriverAssignModal({ visible, onClose, onAssign, orderInfo }) {
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDrivers = AVAILABLE_DRIVERS.filter(driver =>
    driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    driver.phone.includes(searchQuery)
  );

  const handleAssign = () => {
    if (!selectedDriver) {
      Alert.alert('Error', 'Por favor selecciona un repartidor');
      return;
    }

    Alert.alert(
      'Confirmar Asignación',
      `¿Asignar el pedido a ${selectedDriver.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Asignar',
          onPress: () => {
            onAssign(selectedDriver);
            setSelectedDriver(null);
            setSearchQuery('');
            onClose();
          },
        },
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Drag Handle */}
          <View style={styles.dragHandle} />

          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Asignar Repartidor</Text>
              <Text style={styles.subtitle}>
                Selecciona un repartidor disponible para este pedido
              </Text>
            </View>
          </View>

          {/* Order Info */}
          {orderInfo && (
            <View style={styles.orderInfo}>
              <View style={styles.orderInfoRow}>
                <Ionicons name="location" size={18} color={COLORS.primary} />
                <Text style={styles.orderInfoText} numberOfLines={1}>
                  {orderInfo.address}
                </Text>
              </View>
              <View style={styles.orderInfoRow}>
                <Ionicons name="cash" size={18} color={COLORS.success} />
                <Text style={styles.orderInfoText}>
                  ${orderInfo.total.toFixed(2)}
                </Text>
              </View>
            </View>
          )}

          {/* Search */}
          <View style={styles.searchContainer}>
            <Input
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Buscar repartidor..."
              icon="search-outline"
            />
          </View>

          {/* Drivers List */}
          <ScrollView 
            style={styles.content} 
            showsVerticalScrollIndicator={false}
          >
            {filteredDrivers.map((driver) => (
              <TouchableOpacity
                key={driver.id}
                style={[
                  styles.driverCard,
                  selectedDriver?.id === driver.id && styles.driverCardSelected
                ]}
                onPress={() => setSelectedDriver(driver)}
                activeOpacity={0.7}
              >
                <View style={styles.driverAvatar}>
                  <Ionicons 
                    name="person" 
                    size={28} 
                    color={selectedDriver?.id === driver.id ? COLORS.primary : COLORS.textLight} 
                  />
                </View>
                <View style={styles.driverInfo}>
                  <Text style={styles.driverName}>{driver.name}</Text>
                  <View style={styles.driverDetails}>
                    <View style={styles.driverDetailItem}>
                      <Ionicons name="call-outline" size={14} color={COLORS.textLight} />
                      <Text style={styles.driverDetailText}>{driver.phone}</Text>
                    </View>
                    <View style={styles.driverDetailItem}>
                      <Ionicons name="bicycle-outline" size={14} color={COLORS.textLight} />
                      <Text style={styles.driverDetailText}>{driver.vehicle}</Text>
                    </View>
                  </View>
                  <View style={styles.driverStats}>
                    <View style={styles.statItem}>
                      <Ionicons name="star" size={14} color={COLORS.warning} />
                      <Text style={styles.statText}>{driver.rating}</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Ionicons name="checkmark-circle" size={14} color={COLORS.success} />
                      <Text style={styles.statText}>{driver.deliveries} entregas</Text>
                    </View>
                  </View>
                </View>
                {selectedDriver?.id === driver.id && (
                  <Ionicons name="checkmark-circle" size={28} color={COLORS.primary} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.assignButton,
                !selectedDriver && styles.assignButtonDisabled
              ]}
              onPress={handleAssign}
              activeOpacity={0.7}
              disabled={!selectedDriver}
            >
              <Ionicons name="checkmark-circle" size={20} color={COLORS.white} />
              <Text style={styles.assignButtonText}>Asignar Repartidor</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '90%',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 20,
  },
  orderInfo: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    marginHorizontal: 24,
    padding: 16,
    borderRadius: 12,
    gap: 16,
    marginBottom: 16,
  },
  orderInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  orderInfoText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  content: {
    paddingHorizontal: 24,
    maxHeight: 400,
  },
  driverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  driverCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  driverAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 6,
  },
  driverDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 6,
  },
  driverDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  driverDetailText: {
    fontSize: 13,
    color: COLORS.textLight,
  },
  driverStats: {
    flexDirection: 'row',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 20,
    paddingBottom: 28,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  assignButton: {
    flex: 2,
    flexDirection: 'row',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  assignButtonDisabled: {
    backgroundColor: COLORS.border,
    shadowOpacity: 0,
  },
  assignButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
  },
});
