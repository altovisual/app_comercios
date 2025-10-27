import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants';
import { useAuth } from '../../context/AuthContext';

export default function DeliveryZoneScreen({ navigation }) {
  const { store, updateStore } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    deliveryRadius: store?.deliveryRadius || 5,
    deliveryFee: store?.deliveryFee || 2,
    minOrderAmount: store?.minOrderAmount || 5,
    freeDeliveryFrom: store?.freeDeliveryFrom || 20,
  });

  const handleSave = async () => {
    if (formData.deliveryRadius <= 0) {
      Alert.alert('Error', 'El radio de entrega debe ser mayor a 0');
      return;
    }

    setLoading(true);
    try {
      await updateStore({
        deliveryRadius: parseFloat(formData.deliveryRadius),
        deliveryFee: parseFloat(formData.deliveryFee),
        minOrderAmount: parseFloat(formData.minOrderAmount),
        freeDeliveryFrom: parseFloat(formData.freeDeliveryFrom),
      });
      Alert.alert('Éxito', 'Zona de entrega actualizada');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar la zona de entrega');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Zona de Entrega</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color={COLORS.info} />
          <Text style={styles.infoText}>
            Configura el área de cobertura y las tarifas de entrega
          </Text>
        </View>

        {/* Radio de Entrega */}
        <View style={styles.section}>
          <Text style={styles.label}>Radio de Entrega (km)</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="5"
              value={formData.deliveryRadius.toString()}
              onChangeText={(text) =>
                setFormData({ ...formData, deliveryRadius: text })
              }
              keyboardType="decimal-pad"
            />
            <Text style={styles.inputSuffix}>km</Text>
          </View>
          <Text style={styles.hint}>
            Distancia máxima desde tu comercio para hacer entregas
          </Text>
        </View>

        {/* Tarifa de Entrega */}
        <View style={styles.section}>
          <Text style={styles.label}>Tarifa de Entrega</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputPrefix}>$</Text>
            <TextInput
              style={styles.input}
              placeholder="2.00"
              value={formData.deliveryFee.toString()}
              onChangeText={(text) =>
                setFormData({ ...formData, deliveryFee: text })
              }
              keyboardType="decimal-pad"
            />
          </View>
          <Text style={styles.hint}>Costo de envío por pedido</Text>
        </View>

        {/* Pedido Mínimo */}
        <View style={styles.section}>
          <Text style={styles.label}>Pedido Mínimo</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputPrefix}>$</Text>
            <TextInput
              style={styles.input}
              placeholder="5.00"
              value={formData.minOrderAmount.toString()}
              onChangeText={(text) =>
                setFormData({ ...formData, minOrderAmount: text })
              }
              keyboardType="decimal-pad"
            />
          </View>
          <Text style={styles.hint}>Monto mínimo para aceptar pedidos</Text>
        </View>

        {/* Envío Gratis Desde */}
        <View style={styles.section}>
          <Text style={styles.label}>Envío Gratis Desde</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputPrefix}>$</Text>
            <TextInput
              style={styles.input}
              placeholder="20.00"
              value={formData.freeDeliveryFrom.toString()}
              onChangeText={(text) =>
                setFormData({ ...formData, freeDeliveryFrom: text })
              }
              keyboardType="decimal-pad"
            />
          </View>
          <Text style={styles.hint}>
            Monto a partir del cual el envío es gratis
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? 'Guardando...' : 'Guardar'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  headerRight: {
    width: 44,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 180,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.info + '15',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.info,
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  inputPrefix: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginRight: 8,
  },
  inputSuffix: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textLight,
    marginLeft: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    paddingVertical: 12,
  },
  hint: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 6,
  },
  footer: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  saveButton: {
    flex: 2,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
  },
});
