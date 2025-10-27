import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants';
import { useAuth } from '../../context/AuthContext';

export default function PaymentMethodsScreen({ navigation }) {
  const { store, updateStore } = useAuth();
  const [loading, setLoading] = useState(false);
  const [methods, setMethods] = useState(
    store?.paymentMethods || {
      cash: true,
      card: false,
      mobilePay: false,
      bankTransfer: false,
    }
  );

  const toggleMethod = (key) => {
    const newMethods = { ...methods, [key]: !methods[key] };
    
    // Al menos un método debe estar activo
    const hasActiveMethod = Object.values(newMethods).some((v) => v);
    if (!hasActiveMethod) {
      Alert.alert('Error', 'Debe haber al menos un método de pago activo');
      return;
    }
    
    setMethods(newMethods);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateStore({ paymentMethods: methods });
      Alert.alert('Éxito', 'Métodos de pago actualizados');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudieron actualizar los métodos de pago');
    } finally {
      setLoading(false);
    }
  };

  const paymentOptions = [
    {
      key: 'cash',
      icon: 'cash',
      title: 'Efectivo',
      description: 'Pago en efectivo al recibir el pedido',
      color: COLORS.success,
    },
    {
      key: 'card',
      icon: 'card',
      title: 'Tarjeta de Crédito/Débito',
      description: 'Pagos con tarjeta a través de la app',
      color: COLORS.primary,
    },
    {
      key: 'mobilePay',
      icon: 'phone-portrait',
      title: 'Pago Móvil',
      description: 'Transferencias bancarias móviles',
      color: COLORS.info,
    },
    {
      key: 'bankTransfer',
      icon: 'business',
      title: 'Transferencia Bancaria',
      description: 'Transferencias bancarias tradicionales',
      color: COLORS.warning,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Métodos de Pago</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color={COLORS.info} />
          <Text style={styles.infoText}>
            Selecciona los métodos de pago que aceptarás en tu comercio
          </Text>
        </View>

        {paymentOptions.map((option) => (
          <View key={option.key} style={styles.methodCard}>
            <View style={styles.methodLeft}>
              <View
                style={[
                  styles.methodIcon,
                  { backgroundColor: option.color + '15' },
                ]}
              >
                <Ionicons name={option.icon} size={28} color={option.color} />
              </View>
              <View style={styles.methodInfo}>
                <Text style={styles.methodTitle}>{option.title}</Text>
                <Text style={styles.methodDescription}>
                  {option.description}
                </Text>
              </View>
            </View>
            <Switch
              value={methods[option.key]}
              onValueChange={() => toggleMethod(option.key)}
              trackColor={{ false: COLORS.border, true: COLORS.success }}
              thumbColor={COLORS.white}
            />
          </View>
        ))}

        <View style={styles.noteCard}>
          <Ionicons name="bulb" size={20} color={COLORS.warning} />
          <Text style={styles.noteText}>
            <Text style={styles.noteBold}>Nota:</Text> Para habilitar pagos con
            tarjeta, necesitas configurar tu cuenta de pagos en la sección de
            facturación.
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
    paddingBottom: 100,
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
  methodCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  methodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  methodIcon: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  methodInfo: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  methodDescription: {
    fontSize: 13,
    color: COLORS.textLight,
    lineHeight: 18,
  },
  noteCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.warning + '15',
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
    gap: 12,
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.warning,
    lineHeight: 18,
  },
  noteBold: {
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
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
