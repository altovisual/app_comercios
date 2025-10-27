import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, ORDER_STATUS, ORDER_STATUS_LABELS } from '../../constants';
import { useOrders } from '../../context/OrderContext';

export default function OrdersScreen() {
  const { orders } = useOrders();
  const [filter, setFilter] = useState('all');

  const filters = [
    { key: 'all', label: 'Todos' },
    { key: ORDER_STATUS.PENDING, label: 'Pendientes' },
    { key: ORDER_STATUS.PREPARING, label: 'Preparando' },
    { key: ORDER_STATUS.READY, label: 'Listos' },
  ];

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.status === filter);

  const renderOrder = ({ item }) => (
    <TouchableOpacity style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderId}>Pedido #{item.id.slice(-6)}</Text>
          <Text style={styles.customerName}>{item.user.name}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: COLORS[item.status] + '20' }]}>
          <Text style={[styles.statusText, { color: COLORS[item.status] }]}>
            {ORDER_STATUS_LABELS[item.status]}
          </Text>
        </View>
      </View>

      <View style={styles.orderBody}>
        <Text style={styles.itemsLabel}>Productos:</Text>
        {item.items.map((product, index) => (
          <Text key={index} style={styles.itemText}>
            {product.quantity}x {product.name}
          </Text>
        ))}
      </View>

      <View style={styles.orderFooter}>
        <View>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${item.total.toFixed(2)}</Text>
        </View>
        <View style={styles.actions}>
          {item.status === ORDER_STATUS.PENDING && (
            <>
              <TouchableOpacity style={styles.acceptButton}>
                <Text style={styles.acceptButtonText}>Aceptar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.rejectButton}>
                <Ionicons name="close" size={20} color={COLORS.danger} />
              </TouchableOpacity>
            </>
          )}
          {item.status === ORDER_STATUS.ACCEPTED && (
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Iniciar Preparación</Text>
            </TouchableOpacity>
          )}
          {item.status === ORDER_STATUS.PREPARING && (
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Marcar Listo</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pedidos</Text>
      </View>

      <View style={styles.filterContainer}>
        {filters.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[
              styles.filterButton,
              filter === f.key && styles.filterButtonActive,
            ]}
            onPress={() => setFilter(f.key)}
          >
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
      </View>

      <FlatList
        data={filteredOrders}
        renderItem={renderOrder}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={64} color={COLORS.textLight} />
            <Text style={styles.emptyText}>No hay pedidos</Text>
          </View>
        }
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
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
  },
  filterText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '600',
  },
  filterTextActive: {
    color: COLORS.white,
  },
  list: {
    padding: 20,
    paddingTop: 0,
  },
  orderCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  orderId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  customerName: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  orderBody: {
    marginBottom: 16,
  },
  itemsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  itemText: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 16,
  },
  totalLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  actions: {
    flexDirection: 'row',
  },
  acceptButton: {
    backgroundColor: COLORS.success,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 8,
  },
  acceptButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  rejectButton: {
    backgroundColor: COLORS.danger + '20',
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  actionButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textLight,
    marginTop: 16,
  },
});
