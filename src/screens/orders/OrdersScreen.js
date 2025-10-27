import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, ORDER_STATUS, ORDER_STATUS_LABELS } from '../../constants';
import { useOrders } from '../../context/OrderContext';
import { getDeviceType } from '../../utils/responsive';
import { Card, Badge, Button, EmptyState, RejectOrderModal } from '../../components';

export default function OrdersScreen({ navigation }) {
  const { orders, acceptOrder, startPreparing, markReady, cancelOrder } = useOrders();
  const [filter, setFilter] = useState('all');
  const [deviceType, setDeviceType] = useState(getDeviceType());
  const [refreshing, setRefreshing] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedOrderForReject, setSelectedOrderForReject] = useState(null);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', () => {
      setDeviceType(getDeviceType());
    });
    return () => subscription?.remove();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    // Los datos se actualizan automáticamente por el listener en tiempo real
    setTimeout(() => setRefreshing(false), 1000);
  };

  const isDesktop = deviceType === 'desktop';
  const numColumns = isDesktop ? 2 : 1;

  const filters = [
    { key: 'all', label: 'Todos', icon: 'apps' },
    { key: ORDER_STATUS.PENDING, label: 'Pendientes', icon: 'time' },
    { key: ORDER_STATUS.PREPARING, label: 'Preparando', icon: 'restaurant' },
    { key: ORDER_STATUS.READY, label: 'Listos', icon: 'checkmark-circle' },
  ];

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.status === filter);

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

  const handleRejectOrder = (rejectInfo) => {
    if (selectedOrderForReject) {
      cancelOrder(selectedOrderForReject.id, rejectInfo);
      setSelectedOrderForReject(null);
    }
  };

  const renderOrder = ({ item }) => (
    <TouchableOpacity 
      activeOpacity={0.7}
      onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })}
    >
    <Card style={[styles.orderCard, numColumns > 1 && styles.orderCardGrid]}>
      {/* Header */}
      <View style={styles.orderHeader}>
        <View style={styles.orderHeaderLeft}>
          <View style={styles.orderIdContainer}>
            <Ionicons name="receipt" size={18} color={COLORS.primary} />
            <Text style={styles.orderId}>#{item.id.slice(-6)}</Text>
          </View>
          <Badge 
            label={ORDER_STATUS_LABELS[item.status]} 
            variant={getStatusVariant(item.status)}
            size="small"
          />
        </View>
        <Text style={styles.orderTime}>
          {new Date(item.createdAt).toLocaleTimeString('es-ES', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </Text>
      </View>

      {/* Customer Info */}
      <View style={styles.customerSection}>
        <View style={styles.customerInfo}>
          <View style={styles.customerAvatar}>
            <Ionicons name="person" size={20} color={COLORS.primary} />
          </View>
          <View style={styles.customerDetails}>
            <Text style={styles.customerName}>{item.user.name}</Text>
            <Text style={styles.customerPhone}>{item.user.phone || 'Sin teléfono'}</Text>
          </View>
        </View>
      </View>

      {/* Items */}
      <View style={styles.itemsSection}>
        <Text style={styles.itemsLabel}>Productos:</Text>
        {item.items.slice(0, 3).map((product, index) => (
          <View key={index} style={styles.itemRow}>
            <Text style={styles.itemQuantity}>{product.quantity}x</Text>
            <Text style={styles.itemName}>{product.name}</Text>
            <Text style={styles.itemPrice}>${(product.price * product.quantity).toFixed(2)}</Text>
          </View>
        ))}
        {item.items.length > 3 && (
          <Text style={styles.moreItems}>+{item.items.length - 3} más...</Text>
        )}
      </View>

      {/* Footer */}
      <View style={styles.orderFooter}>
        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${item.total.toFixed(2)}</Text>
        </View>
        <View style={styles.actions}>
          {item.status === ORDER_STATUS.PENDING && (
            <>
              <Button
                title="Aceptar"
                variant="success"
                size="small"
                onPress={() => acceptOrder(item.id)}
                style={styles.actionButton}
              />
              <TouchableOpacity 
                style={styles.rejectButton}
                onPress={() => {
                  setSelectedOrderForReject(item);
                  setShowRejectModal(true);
                }}
              >
                <Ionicons name="close" size={20} color={COLORS.danger} />
              </TouchableOpacity>
            </>
          )}
          {item.status === ORDER_STATUS.ACCEPTED && (
            <Button
              title="Iniciar"
              variant="primary"
              size="small"
              icon="play"
              onPress={() => startPreparing(item.id)}
              style={styles.actionButton}
            />
          )}
          {item.status === ORDER_STATUS.PREPARING && (
            <Button
              title="Listo"
              variant="success"
              size="small"
              icon="checkmark"
              onPress={() => markReady(item.id)}
              style={styles.actionButton}
            />
          )}
          {item.status === ORDER_STATUS.READY && (
            <Button
              title="Ver detalles"
              variant="outline"
              size="small"
              icon="eye"
              onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })}
              style={styles.actionButton}
            />
          )}
        </View>
      </View>
    </Card>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.contentWrapper, isDesktop && styles.contentWrapperDesktop]}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Pedidos</Text>
            <Text style={styles.subtitle}>{filteredOrders.length} pedido{filteredOrders.length !== 1 ? 's' : ''}</Text>
          </View>
        </View>

        {/* Filters */}
        <View style={styles.filterContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            {filters.map((f) => (
              <TouchableOpacity
                key={f.key}
                style={[
                  styles.filterButton,
                  filter === f.key && styles.filterButtonActive,
                ]}
                onPress={() => setFilter(f.key)}
                activeOpacity={0.7}
              >
                <Ionicons 
                  name={f.icon} 
                  size={18} 
                  color={filter === f.key ? COLORS.white : COLORS.textSecondary}
                  style={styles.filterIcon}
                />
                <Text
                  style={[
                    styles.filterText,
                    filter === f.key && styles.filterTextActive,
                  ]}
                >
                  {f.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Orders List */}
        <FlatList
          data={filteredOrders}
          renderItem={renderOrder}
          keyExtractor={(item) => item.id}
          key={numColumns}
          numColumns={numColumns}
          contentContainerStyle={styles.list}
          columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : null}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
          ListEmptyComponent={
            <EmptyState
              icon="receipt-outline"
              title="No hay pedidos"
              description="Los pedidos aparecerán aquí cuando los clientes realicen compras"
            />
          }
        />
      </View>

      {/* Reject Order Modal */}
      {selectedOrderForReject && (
        <RejectOrderModal
          visible={showRejectModal}
          onClose={() => {
            setShowRejectModal(false);
            setSelectedOrderForReject(null);
          }}
          onReject={handleRejectOrder}
          orderInfo={{
            orderId: selectedOrderForReject.id.slice(-6),
            total: selectedOrderForReject.total,
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentWrapper: {
    flex: 1,
  },
  contentWrapperDesktop: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 1200,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  filterContainer: {
    paddingBottom: 16,
  },
  filterScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    marginRight: 8,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
  },
  filterIcon: {
    marginRight: 6,
  },
  filterText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  filterTextActive: {
    color: COLORS.white,
  },
  list: {
    padding: 20,
    paddingTop: 0,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    gap: 16,
  },
  orderCard: {
    marginBottom: 16,
  },
  orderCardGrid: {
    flex: 1,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  orderHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  orderIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  orderId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  orderTime: {
    fontSize: 13,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  customerSection: {
    marginBottom: 16,
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  customerDetails: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  customerPhone: {
    fontSize: 13,
    color: COLORS.textLight,
  },
  itemsSection: {
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  itemsLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textLight,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  itemQuantity: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    width: 30,
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  moreItems: {
    fontSize: 13,
    color: COLORS.textLight,
    fontStyle: 'italic',
    marginTop: 4,
  },
  orderFooter: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 14,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
  },
  rejectButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.danger + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
