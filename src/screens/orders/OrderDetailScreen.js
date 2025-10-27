import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, ORDER_STATUS, ORDER_STATUS_LABELS } from '../../constants';
import { useOrders } from '../../context/OrderContext';
import { Card, Badge, RejectOrderModal } from '../../components';

export default function OrderDetailScreen({ route, navigation }) {
  const { orderId } = route.params;
  const insets = useSafeAreaInsets();
  const { orders, acceptOrder, startPreparing, markReady, cancelOrder, handOverToDriver, markDelivered, updateDriverStatus } = useOrders();
  const [showRejectModal, setShowRejectModal] = useState(false);
  
  const order = orders.find(o => o.id === orderId);

  if (!order) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={COLORS.textLight} />
          <Text style={styles.errorText}>Pedido no encontrado</Text>
          <Button title="Volver" onPress={() => navigation.goBack()} />
        </View>
      </SafeAreaView>
    );
  }

  const getStatusVariant = (status) => {
    const variants = {
      [ORDER_STATUS.PENDING]: 'warning',
      [ORDER_STATUS.ACCEPTED]: 'info',
      [ORDER_STATUS.PREPARING]: 'warning',
      [ORDER_STATUS.READY]: 'success',
      [ORDER_STATUS.DELIVERED]: 'success',
      [ORDER_STATUS.CANCELLED]: 'danger',
    };
    return variants[status] || 'neutral';
  };

  const getPaymentMethodLabel = (method) => {
    const labels = {
      cash: 'Efectivo',
      card: 'Tarjeta',
      mobile_payment: 'Pago Móvil',
    };
    return labels[method] || method;
  };

  const handleAction = (action) => {
    switch (action) {
      case 'accept':
        acceptOrder(order.id);
        break;
      case 'start':
        startPreparing(order.id);
        break;
      case 'ready':
        markReady(order.id);
        break;
      case 'reject':
        setShowRejectModal(true);
        break;
      case 'handover':
        Alert.alert(
          'Entregar Pedido',
          `¿Entregar el pedido a ${order.driver?.name}?`,
          [
            { text: 'Cancelar', style: 'cancel' },
            {
              text: 'Entregar',
              onPress: () => {
                handOverToDriver(order.id);
                Alert.alert(
                  '¡Pedido Entregado al Repartidor!',
                  `${order.driver?.name} está en camino a entregar el pedido.`,
                  [{ text: 'OK' }]
                );
              },
            },
          ]
        );
        break;
    }
  };

  const handleRejectOrder = (rejectInfo) => {
    cancelOrder(order.id, rejectInfo);
    Alert.alert(
      'Pedido Rechazado',
      `El pedido ha sido rechazado.\n\nEl cliente y ${order.driver?.name || 'el repartidor'} han sido notificados.`,
      [
        { 
          text: 'OK', 
          onPress: () => navigation.goBack() 
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={28} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalles del Pedido</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Order ID and Status Card */}
        <View style={styles.orderHeaderCard}>
          <View style={styles.orderIdSection}>
            <Text style={styles.orderIdLabel}>Pedido</Text>
            <Text style={styles.orderIdValue}>#{order.id.slice(-6)}</Text>
          </View>
          <Badge 
            label={ORDER_STATUS_LABELS[order.status]} 
            variant={getStatusVariant(order.status)}
            size="large"
          />
        </View>
        {/* Driver Info - Show if driver is assigned */}
        {order.driver && (
          <Card style={[styles.section, styles.driverCard]}>
            <View style={styles.sectionHeader}>
              <Ionicons name="bicycle" size={24} color={COLORS.primary} />
              <Text style={styles.sectionTitle}>Repartidor Asignado</Text>
            </View>
            <View style={styles.driverInfoContent}>
              <View style={styles.driverAvatar}>
                <Ionicons name="person" size={32} color={COLORS.primary} />
              </View>
              <View style={styles.driverDetails}>
                <Text style={styles.driverName}>{order.driver.name}</Text>
                <View style={styles.driverMeta}>
                  <View style={styles.driverMetaItem}>
                    <Ionicons name="call" size={14} color={COLORS.textLight} />
                    <Text style={styles.driverMetaText}>{order.driver.phone}</Text>
                  </View>
                  <View style={styles.driverMetaItem}>
                    <Ionicons name="bicycle" size={14} color={COLORS.textLight} />
                    <Text style={styles.driverMetaText}>{order.driver.vehicle}</Text>
                  </View>
                  <View style={styles.driverMetaItem}>
                    <Ionicons name="star" size={14} color={COLORS.warning} />
                    <Text style={styles.driverMetaText}>{order.driver.rating}</Text>
                  </View>
                </View>
                {order.driver.status === 'assigned' && (
                  <View style={styles.driverStatusBadge}>
                    <Text style={styles.driverStatusText}>Esperando pedido</Text>
                  </View>
                )}
                {order.driver.status === 'on_way' && (
                  <View style={[styles.driverStatusBadge, styles.driverStatusOnWay]}>
                    <Text style={styles.driverStatusText}>En camino al cliente</Text>
                  </View>
                )}
              </View>
            </View>
          </Card>
        )}

        {/* Customer Info */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person-circle" size={24} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Cliente</Text>
          </View>
          <View style={styles.customerInfo}>
            <View style={styles.infoRow}>
              <Ionicons name="person-outline" size={20} color={COLORS.textLight} />
              <Text style={styles.infoText}>{order.user.name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={20} color={COLORS.textLight} />
              <Text style={styles.infoText}>{order.user.phone}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={20} color={COLORS.textLight} />
              <Text style={styles.infoText}>{order.destination.address}</Text>
            </View>
          </View>
        </Card>

        {/* Order Items */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>PRODUCTOS ({order.items.length})</Text>
          <Card noPadding style={styles.section}>
            {order.items.map((item, index) => (
              <View 
                key={index} 
                style={[
                  styles.itemRow,
                  index < order.items.length - 1 && styles.itemRowBorder
                ]}
              >
                <View style={styles.itemQuantity}>
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                </View>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>${item.price.toFixed(2)} c/u</Text>
                </View>
                <Text style={styles.itemTotal}>${item.subtotal.toFixed(2)}</Text>
              </View>
            ))}
          </Card>
        </View>

        {/* Order Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>${order.subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery</Text>
            <Text style={styles.summaryValue}>${order.deliveryFee.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${order.total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Payment & Delivery Info */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>INFORMACIÓN ADICIONAL</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoCard}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="card-outline" size={20} color={COLORS.primary} />
              </View>
              <View style={styles.infoCardContent}>
                <Text style={styles.infoCardLabel}>Método de Pago</Text>
                <Text style={styles.infoCardValue}>{getPaymentMethodLabel(order.paymentMethod)}</Text>
              </View>
            </View>
            <View style={styles.infoCard}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="bicycle-outline" size={20} color={COLORS.success} />
              </View>
              <View style={styles.infoCardContent}>
                <Text style={styles.infoCardLabel}>Tipo de Pedido</Text>
                <Text style={styles.infoCardValue}>Delivery</Text>
              </View>
            </View>
            <View style={styles.infoCard}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="time-outline" size={20} color={COLORS.info} />
              </View>
              <View style={styles.infoCardContent}>
                <Text style={styles.infoCardLabel}>Hora del Pedido</Text>
                <Text style={styles.infoCardValue}>
                  {new Date(order.createdAt).toLocaleTimeString('es-ES', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      {order.status !== ORDER_STATUS.DELIVERED && order.status !== ORDER_STATUS.CANCELLED && (
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom + 16, 28) }]}>
          {order.status === ORDER_STATUS.PENDING && (
            <>
              <TouchableOpacity 
                style={styles.rejectButton}
                onPress={() => handleAction('reject')}
                activeOpacity={0.7}
              >
                <Ionicons name="close-circle" size={22} color={COLORS.danger} />
                <Text style={styles.rejectButtonText}>Rechazar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.acceptButton}
                onPress={() => handleAction('accept')}
                activeOpacity={0.7}
              >
                <Ionicons name="checkmark-circle" size={22} color={COLORS.white} />
                <Text style={styles.acceptButtonText}>Aceptar Pedido</Text>
              </TouchableOpacity>
            </>
          )}
          {order.status === ORDER_STATUS.ACCEPTED && (
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => handleAction('start')}
              activeOpacity={0.7}
            >
              <Ionicons name="play-circle" size={22} color={COLORS.white} />
              <Text style={styles.primaryButtonText}>Iniciar Preparación</Text>
            </TouchableOpacity>
          )}
          {order.status === ORDER_STATUS.PREPARING && (
            <TouchableOpacity 
              style={styles.successButton}
              onPress={() => handleAction('ready')}
              activeOpacity={0.7}
            >
              <Ionicons name="checkmark-done-circle" size={22} color={COLORS.white} />
              <Text style={styles.successButtonText}>Marcar como Listo</Text>
            </TouchableOpacity>
          )}
          {order.status === ORDER_STATUS.READY && order.driver && (
            <TouchableOpacity 
              style={styles.successButton}
              onPress={() => handleAction('handover')}
              activeOpacity={0.7}
            >
              <Ionicons name="hand-right" size={22} color={COLORS.white} />
              <Text style={styles.successButtonText}>Entregar a {order.driver.name}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Driver Info for PICKED_UP status */}
      {order.status === ORDER_STATUS.PICKED_UP && order.driver && (
        <View style={[styles.driverInfoFooter, { paddingBottom: Math.max(insets.bottom + 16, 28) }]}>
          <View style={styles.driverInfoContent}>
            <Ionicons name="bicycle" size={24} color={COLORS.success} />
            <View style={styles.driverInfoText}>
              <Text style={styles.driverInfoLabel}>Pedido en camino</Text>
              <Text style={styles.driverInfoName}>{order.driver.name} está entregando</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.callButton}>
            <Ionicons name="call" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      )}

      {/* Reject Order Modal */}
      <RejectOrderModal
        visible={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onReject={handleRejectOrder}
        orderInfo={{
          orderId: order.id.slice(-6),
          total: order.total,
        }}
      />
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
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 44,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  orderHeaderCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  orderIdSection: {
    gap: 4,
  },
  orderIdLabel: {
    fontSize: 13,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  orderIdValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textLight,
    marginBottom: 12,
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  driverCard: {
    backgroundColor: COLORS.primary + '08',
    borderWidth: 1,
    borderColor: COLORS.primary + '20',
  },
  driverInfoContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  driverMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 8,
  },
  driverMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  driverMetaText: {
    fontSize: 13,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  driverStatusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.warning + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  driverStatusOnWay: {
    backgroundColor: COLORS.success + '20',
  },
  driverStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
  },
  customerInfo: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    flex: 1,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  itemRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  itemQuantity: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  quantityText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 13,
    color: COLORS.textLight,
  },
  itemTotal: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  summaryCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  summaryLabel: {
    fontSize: 15,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    marginTop: 12,
    paddingTop: 16,
  },
  totalLabel: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  totalValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  infoGrid: {
    gap: 12,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoCardContent: {
    flex: 1,
  },
  infoCardLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.textLight,
    marginBottom: 4,
  },
  infoCardValue: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
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
  },
  rejectButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.danger,
    borderRadius: 14,
    paddingVertical: 16,
    gap: 8,
  },
  rejectButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.danger,
  },
  acceptButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.success,
    borderRadius: 14,
    paddingVertical: 16,
    gap: 8,
    shadowColor: COLORS.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  acceptButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 16,
    gap: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  successButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.success,
    borderRadius: 14,
    paddingVertical: 16,
    gap: 8,
    shadowColor: COLORS.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  successButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  driverInfoFooter: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.primary + '10',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.primary + '20',
  },
  driverInfoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  driverInfoText: {
    marginLeft: 12,
  },
  driverInfoLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 2,
  },
  driverInfoName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  callButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 18,
    color: COLORS.textLight,
    marginTop: 16,
    marginBottom: 24,
  },
});
