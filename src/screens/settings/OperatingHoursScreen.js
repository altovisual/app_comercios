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

const DAYS = [
  { key: 'monday', label: 'Lunes' },
  { key: 'tuesday', label: 'Martes' },
  { key: 'wednesday', label: 'Miércoles' },
  { key: 'thursday', label: 'Jueves' },
  { key: 'friday', label: 'Viernes' },
  { key: 'saturday', label: 'Sábado' },
  { key: 'sunday', label: 'Domingo' },
];

export default function OperatingHoursScreen({ navigation }) {
  const { store, updateStore } = useAuth();
  const [loading, setLoading] = useState(false);
  const [hours, setHours] = useState(
    store?.operatingHours || {
      monday: { open: true, start: '09:00', end: '22:00' },
      tuesday: { open: true, start: '09:00', end: '22:00' },
      wednesday: { open: true, start: '09:00', end: '22:00' },
      thursday: { open: true, start: '09:00', end: '22:00' },
      friday: { open: true, start: '09:00', end: '22:00' },
      saturday: { open: true, start: '10:00', end: '23:00' },
      sunday: { open: true, start: '10:00', end: '20:00' },
    }
  );

  const toggleDay = (day) => {
    setHours({
      ...hours,
      [day]: { ...hours[day], open: !hours[day].open },
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateStore({ operatingHours: hours });
      Alert.alert('Éxito', 'Horarios actualizados correctamente');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudieron actualizar los horarios');
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
        <Text style={styles.headerTitle}>Horarios de Operación</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.description}>
          Configura los días y horarios en que tu comercio estará disponible
        </Text>

        {DAYS.map((day) => (
          <View key={day.key} style={styles.dayCard}>
            <View style={styles.dayHeader}>
              <Text style={styles.dayLabel}>{day.label}</Text>
              <Switch
                value={hours[day.key]?.open}
                onValueChange={() => toggleDay(day.key)}
                trackColor={{ false: COLORS.border, true: COLORS.success }}
                thumbColor={COLORS.white}
              />
            </View>
            {hours[day.key]?.open && (
              <View style={styles.timeContainer}>
                <View style={styles.timeBox}>
                  <Text style={styles.timeLabel}>Apertura</Text>
                  <Text style={styles.timeValue}>{hours[day.key].start}</Text>
                </View>
                <Ionicons name="arrow-forward" size={20} color={COLORS.textLight} />
                <View style={styles.timeBox}>
                  <Text style={styles.timeLabel}>Cierre</Text>
                  <Text style={styles.timeValue}>{hours[day.key].end}</Text>
                </View>
              </View>
            )}
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
    paddingBottom: 100,
  },
  description: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 20,
    lineHeight: 20,
  },
  dayCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  timeBox: {
    flex: 1,
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  timeValue: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary,
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
