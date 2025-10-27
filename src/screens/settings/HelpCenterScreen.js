import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants';

export default function HelpCenterScreen({ navigation }) {
  const helpTopics = [
    {
      icon: 'rocket',
      title: 'Primeros Pasos',
      description: 'Cómo configurar tu comercio',
      color: COLORS.primary,
    },
    {
      icon: 'basket',
      title: 'Gestión de Productos',
      description: 'Agregar y editar productos',
      color: COLORS.success,
    },
    {
      icon: 'receipt',
      title: 'Gestión de Pedidos',
      description: 'Cómo procesar pedidos',
      color: COLORS.info,
    },
    {
      icon: 'card',
      title: 'Pagos y Facturación',
      description: 'Cobros y retiros',
      color: COLORS.warning,
    },
    {
      icon: 'notifications',
      title: 'Notificaciones',
      description: 'Configurar alertas',
      color: COLORS.secondary,
    },
    {
      icon: 'people',
      title: 'Clientes',
      description: 'Gestionar clientes',
      color: COLORS.primary,
    },
  ];

  const contactOptions = [
    {
      icon: 'mail',
      title: 'Email',
      value: 'soporte@delivery.com',
      action: () => Linking.openURL('mailto:soporte@delivery.com'),
    },
    {
      icon: 'call',
      title: 'Teléfono',
      value: '+58 412 1234567',
      action: () => Linking.openURL('tel:+584121234567'),
    },
    {
      icon: 'logo-whatsapp',
      title: 'WhatsApp',
      value: '+58 412 1234567',
      action: () => Linking.openURL('https://wa.me/584121234567'),
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
        <Text style={styles.headerTitle}>Centro de Ayuda</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.sectionTitle}>TEMAS DE AYUDA</Text>
        {helpTopics.map((topic, index) => (
          <TouchableOpacity
            key={index}
            style={styles.topicCard}
            activeOpacity={0.7}
          >
            <View
              style={[styles.topicIcon, { backgroundColor: topic.color + '15' }]}
            >
              <Ionicons name={topic.icon} size={24} color={topic.color} />
            </View>
            <View style={styles.topicInfo}>
              <Text style={styles.topicTitle}>{topic.title}</Text>
              <Text style={styles.topicDescription}>{topic.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
          </TouchableOpacity>
        ))}

        <Text style={styles.sectionTitle}>CONTACTAR SOPORTE</Text>
        {contactOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.contactCard}
            onPress={option.action}
            activeOpacity={0.7}
          >
            <View style={styles.contactLeft}>
              <View style={styles.contactIcon}>
                <Ionicons name={option.icon} size={24} color={COLORS.primary} />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactTitle}>{option.title}</Text>
                <Text style={styles.contactValue}>{option.value}</Text>
              </View>
            </View>
            <Ionicons name="open-outline" size={20} color={COLORS.textLight} />
          </TouchableOpacity>
        ))}
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
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textLight,
    marginBottom: 12,
    marginTop: 8,
    letterSpacing: 0.5,
  },
  topicCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  topicIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  topicInfo: {
    flex: 1,
  },
  topicTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  topicDescription: {
    fontSize: 13,
    color: COLORS.textLight,
  },
  contactCard: {
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
  contactLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },
});
