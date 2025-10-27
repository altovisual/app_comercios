import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants';
import { getDeviceType } from '../../utils/responsive';
import { Input, Button } from '../../components';

export default function RegisterScreen({ navigation }) {
  const [formData, setFormData] = useState({
    storeName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [deviceType, setDeviceType] = useState(getDeviceType());

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', () => {
      setDeviceType(getDeviceType());
    });
    return () => subscription?.remove();
  }, []);

  const isDesktop = deviceType === 'desktop';
  const isTablet = deviceType === 'tablet';

  const handleRegister = () => {
    if (!formData.storeName || !formData.email || !formData.phone || !formData.password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    Alert.alert(
      'Registro Exitoso',
      'Tu cuenta ha sido creada. Por favor inicia sesión.',
      [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
    );
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={[styles.scrollContent, (isDesktop || isTablet) && styles.scrollContentCentered]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={[styles.formWrapper, (isDesktop || isTablet) && styles.formWrapperLarge]}>
        {/* Back Button */}
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoGradient}
          >
            <Text style={styles.logo}>🏪</Text>
          </LinearGradient>
          <Text style={styles.title}>Registra tu Comercio</Text>
          <Text style={styles.subtitle}>Comienza a recibir pedidos hoy</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Input
            label="Nombre del comercio"
            value={formData.storeName}
            onChangeText={(text) => setFormData({ ...formData, storeName: text })}
            placeholder="Mi Comercio"
            icon="storefront-outline"
          />

          <Input
            label="Correo electrónico"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            placeholder="tu@email.com"
            icon="mail-outline"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            label="Teléfono"
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
            placeholder="+1 234 567 8900"
            icon="call-outline"
            keyboardType="phone-pad"
          />

          <Input
            label="Contraseña"
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
            placeholder="••••••••"
            icon="lock-closed-outline"
            secureTextEntry
            autoCapitalize="none"
          />

          <Input
            label="Confirmar contraseña"
            value={formData.confirmPassword}
            onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
            placeholder="••••••••"
            icon="lock-closed-outline"
            secureTextEntry
            autoCapitalize="none"
          />

          <Button
            title="Registrarse"
            onPress={handleRegister}
            style={styles.registerButton}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>¿Ya tienes cuenta? </Text>
            <Button
              title="Inicia sesión"
              variant="ghost"
              size="small"
              onPress={() => navigation.navigate('Login')}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 40,
  },
  scrollContentCentered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  formWrapper: {
    width: '100%',
    paddingHorizontal: 24,
  },
  formWrapperLarge: {
    maxWidth: 480,
    backgroundColor: COLORS.white,
    padding: 40,
    borderRadius: 24,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoGradient: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  logo: {
    fontSize: 44,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  registerButton: {
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    color: COLORS.textLight,
  },
});
