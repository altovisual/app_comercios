import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../constants';
import { Input } from './';

const REJECT_REASONS = [
  {
    id: 'out_of_stock',
    label: 'Producto agotado',
    icon: 'close-circle',
    color: COLORS.danger,
  },
  {
    id: 'too_busy',
    label: 'Demasiados pedidos',
    icon: 'time',
    color: COLORS.warning,
  },
  {
    id: 'closing_soon',
    label: 'Próximo a cerrar',
    icon: 'moon',
    color: COLORS.info,
  },
  {
    id: 'technical_issue',
    label: 'Problema técnico',
    icon: 'construct',
    color: COLORS.textLight,
  },
  {
    id: 'delivery_area',
    label: 'Fuera de zona de entrega',
    icon: 'location',
    color: COLORS.secondary,
  },
  {
    id: 'other',
    label: 'Otra razón',
    icon: 'ellipsis-horizontal',
    color: COLORS.textSecondary,
  },
];

export default function RejectOrderModal({ visible, onClose, onReject, orderInfo }) {
  const insets = useSafeAreaInsets();
  const [selectedReason, setSelectedReason] = useState(null);
  const [customReason, setCustomReason] = useState('');

  const handleReject = () => {
    if (!selectedReason) {
      Alert.alert('Error', 'Por favor selecciona una razón');
      return;
    }

    if (selectedReason.id === 'other' && !customReason.trim()) {
      Alert.alert('Error', 'Por favor especifica la razón');
      return;
    }

    const reason = selectedReason.id === 'other' 
      ? customReason 
      : selectedReason.label;

    Alert.alert(
      'Confirmar Rechazo',
      `¿Estás seguro que deseas rechazar este pedido?\n\nRazón: ${reason}\n\nEl cliente y el repartidor serán notificados.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Rechazar Pedido',
          style: 'destructive',
          onPress: () => {
            onReject({
              reasonId: selectedReason.id,
              reasonLabel: reason,
              timestamp: new Date().toISOString(),
            });
            setSelectedReason(null);
            setCustomReason('');
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
              <Text style={styles.title}>Rechazar Pedido</Text>
              <Text style={styles.subtitle}>
                Selecciona la razón por la que no puedes aceptar este pedido
              </Text>
            </View>
          </View>

          {/* Order Info */}
          {orderInfo && (
            <View style={styles.orderInfo}>
              <View style={styles.orderInfoRow}>
                <Ionicons name="receipt" size={18} color={COLORS.danger} />
                <Text style={styles.orderInfoText}>
                  Pedido #{orderInfo.orderId}
                </Text>
              </View>
              <View style={styles.orderInfoRow}>
                <Ionicons name="cash" size={18} color={COLORS.danger} />
                <Text style={styles.orderInfoText}>
                  ${orderInfo.total.toFixed(2)}
                </Text>
              </View>
            </View>
          )}

          {/* Reasons List */}
          <ScrollView 
            style={styles.content} 
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.sectionLabel}>RAZÓN DEL RECHAZO</Text>
            {REJECT_REASONS.map((reason) => (
              <TouchableOpacity
                key={reason.id}
                style={[
                  styles.reasonCard,
                  selectedReason?.id === reason.id && styles.reasonCardSelected
                ]}
                onPress={() => setSelectedReason(reason)}
                activeOpacity={0.7}
              >
                <View style={[styles.reasonIcon, { backgroundColor: reason.color + '15' }]}>
                  <Ionicons 
                    name={reason.icon} 
                    size={24} 
                    color={reason.color} 
                  />
                </View>
                <Text style={styles.reasonLabel}>{reason.label}</Text>
                {selectedReason?.id === reason.id && (
                  <Ionicons name="checkmark-circle" size={24} color={COLORS.danger} />
                )}
              </TouchableOpacity>
            ))}

            {/* Custom Reason Input */}
            {selectedReason?.id === 'other' && (
              <View style={styles.customReasonContainer}>
                <Input
                  value={customReason}
                  onChangeText={setCustomReason}
                  placeholder="Escribe la razón del rechazo..."
                  multiline
                  numberOfLines={3}
                  icon="create-outline"
                />
              </View>
            )}

            {/* Warning Message */}
            <View style={styles.warningBox}>
              <Ionicons name="warning" size={20} color={COLORS.warning} />
              <Text style={styles.warningText}>
                Al rechazar este pedido, el cliente y el repartidor serán notificados inmediatamente.
              </Text>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={[
            styles.footer,
            { paddingBottom: Math.max(insets.bottom, 20) }
          ]}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.rejectButton,
                !selectedReason && styles.rejectButtonDisabled
              ]}
              onPress={handleReject}
              activeOpacity={0.7}
              disabled={!selectedReason}
            >
              <Ionicons name="close-circle" size={20} color={COLORS.white} />
              <Text style={styles.rejectButtonText}>Rechazar Pedido</Text>
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
    backgroundColor: COLORS.danger + '08',
    marginHorizontal: 24,
    padding: 16,
    borderRadius: 12,
    gap: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.danger + '20',
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
  },
  content: {
    paddingHorizontal: 24,
    maxHeight: 400,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textLight,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  reasonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  reasonCardSelected: {
    borderColor: COLORS.danger,
    backgroundColor: COLORS.danger + '08',
  },
  reasonIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  reasonLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  customReasonContainer: {
    marginBottom: 16,
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: COLORS.warning + '10',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    marginTop: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.warning + '30',
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingTop: 20,
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
  rejectButton: {
    flex: 2,
    flexDirection: 'row',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: COLORS.danger,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: COLORS.danger,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  rejectButtonDisabled: {
    backgroundColor: COLORS.border,
    shadowOpacity: 0,
  },
  rejectButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
  },
});
