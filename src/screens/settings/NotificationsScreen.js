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

export default function NotificationsScreen({ navigation }) {
  const { store, updateStore } = useAuth();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState(
    store?.notificationSettings || {
      newOrders: true,
      orderUpdates: true,
      messages: true,
      promotions: false,
      sound: true,
      vibration: true,
    }
  );

  const toggleSetting = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateStore({ notificationSettings: settings });
      Alert.alert('Éxito', 'Preferencias de notificaciones actualizadas');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudieron actualizar las preferencias');
    } finally {
      setLoading(false);
    }
  };

  const notificationOptions = [
    {
      key: 'newOrders',
      icon: 'notifications',
      title: 'Nuevos Pedidos',
      description: 'Recibir notificaciones de nuevos pedidos',
      color: COLORS.primary,
    },
    {
      key: 'orderUpdates',
      icon: 'sync',
      title: 'Actualizaciones de Pedidos',
      description: 'Cambios en el estado de los pedidos',
      color: COLORS.info,
    },
    {
      key: 'messages',
      icon: 'chatbubble',
      title: 'Mensajes',
      description: 'Mensajes de clientes y repartidores',
      color: COLORS.success,
    },
    {
      key: 'promotions',
      icon: 'megaphone',
      title: 'Promociones',
      description: 'Ofertas y novedades de la plataforma',
      color: COLORS.warning,
    },
  ];

  const soundOptions = [
    {
      key: 'sound',
      icon: 'volume-high',
      title: 'Sonido',
      description: 'Reproducir sonido con las notificaciones',
    },
    {
      key: 'vibration',
      icon: 'phone-portrait',
      title: 'Vibración',
      description: 'Vibrar al recibir notificaciones',
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
        <Text style={styles.headerTitle}>Notificaciones</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.sectionTitle}>TIPOS DE NOTIFICACIONES</Text>
        {notificationOptions.map((option) => (
          <View key={option.key} style={styles.optionCard}>
            <View style={styles.optionLeft}>
              <View
                style={[
                  styles.optionIcon,
                  { backgroundColor: option.color + '15' },
                ]}
              >
                <Ionicons name={option.icon} size={24} color={option.color} />
              </View>
              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>{option.title}</Text>
                <Text style={styles.optionDescription}>
                  {option.description}
                </Text>
              </View>
            </View>
            <Switch
              value={settings[option.key]}
              onValueChange={() => toggleSetting(option.key)}
              trackColor={{ false: COLORS.border, true: COLORS.success }}
              thumbColor={COLORS.white}
            />
          </View>
        ))}

        <Text style={styles.sectionTitle}>PREFERENCIAS</Text>
        {soundOptions.map((option) => (
          <View key={option.key} style={styles.optionCard}>
            <View style={styles.optionLeft}>
              <View
                style={[
                  styles.optionIcon,
                  { backgroundColor: COLORS.textLight + '15' },
                ]}
              >
                <Ionicons
                  name={option.icon}
                  size={24}
                  color={COLORS.textLight}
                />
              </View>
              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>{option.title}</Text>
                <Text style={styles.optionDescription}>
                  {option.description}
                </Text>
              </View>
            </View>
            <Switch
              value={settings[option.key]}
              onValueChange={() => toggleSetting(option.key)}
              trackColor={{ false: COLORS.border, true: COLORS.success }}
              thumbColor={COLORS.white}
            />
          </View>
        ))}
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
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textLight,
    marginBottom: 12,
    marginTop: 8,
    letterSpacing: 0.5,
  },
  optionCard: {
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
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 13,
    color: COLORS.textLight,
    lineHeight: 18,
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
