import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, ORDER_STATUS } from '../../constants';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../context/OrderContext';

export default function HomeScreen({ navigation }) {
  const { store } = useAuth();
  const { orders, activeOrders, pendingCount } = useOrders();

  const todayOrders = orders.filter(o => {
    const orderDate = new Date(o.createdAt);
    const today = new Date();
    return orderDate.toDateString() === today.toDateString();
  });

  const todaySales = todayOrders
    .filter(o => o.status === ORDER_STATUS.DELIVERED)
    .reduce((sum, order) => sum + order.total, 0);

  const completedToday = todayOrders.filter(o => o.status === ORDER_STATUS.DELIVERED).length;

  const stats = [
    {
      icon: 'receipt-outline',
      label: 'Pedidos Activos',
      value: activeOrders.length,
      color: COLORS.primary,
    },
    {
      icon: 'time-outline',
      label: 'Pendientes',
      value: pendingCount,
      color: COLORS.warning,
    },
    {
      icon: 'checkmark-done-outline',
      label: 'Completados Hoy',
      value: completedToday,
      color: COLORS.success,
    },
    {
      icon: 'cash-outline',
      label: 'Ventas del Día',
      value: `$${todaySales.toFixed(2)}`,
      color: COLORS.secondary,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hola 👋</Text>
            <Text style={styles.storeName}>{store?.name || 'Mi Comercio'}</Text>
          </View>
          <TouchableOpacity style={styles.storeStatus}>
            <View style={[styles.statusDot, { backgroundColor: store?.isOpen ? COLORS.success : COLORS.danger }]} />
            <Text style={styles.statusText}>{store?.isOpen ? 'Abierto' : 'Cerrado'}</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
                <Ionicons name={stat.icon} size={24} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => navigation.navigate('Orders')}
            >
              <Ionicons name="receipt" size={32} color={COLORS.primary} />
              <Text style={styles.actionText}>Ver Pedidos</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => navigation.navigate('Menu')}
            >
              <Ionicons name="restaurant" size={32} color={COLORS.success} />
              <Text style={styles.actionText}>Gestionar Menú</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <Ionicons name="stats-chart" size={32} color={COLORS.secondary} />
              <Text style={styles.actionText}>Estadísticas</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <Ionicons name="settings" size={32} color={COLORS.textLight} />
              <Text style={styles.actionText}>Configuración</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Orders */}
        {activeOrders.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Pedidos Activos</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Orders')}>
                <Text style={styles.seeAll}>Ver todos</Text>
              </TouchableOpacity>
            </View>
            {activeOrders.slice(0, 3).map((order) => (
              <TouchableOpacity key={order.id} style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <Text style={styles.orderId}>#{order.id.slice(-6)}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: COLORS[order.status] + '20' }]}>
                    <Text style={[styles.statusText, { color: COLORS[order.status] }]}>
                      {order.status}
                    </Text>
                  </View>
                </View>
                <Text style={styles.customerName}>{order.user.name}</Text>
                <Text style={styles.orderItems}>
                  {order.items.length} producto{order.items.length > 1 ? 's' : ''}
                </Text>
                <Text style={styles.orderTotal}>${order.total.toFixed(2)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  greeting: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  storeName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 4,
  },
  storeStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
  },
  statCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    margin: '1%',
    alignItems: 'center',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  seeAll: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  actionCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    margin: '1%',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 14,
    color: COLORS.text,
    marginTop: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  orderCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  customerName: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 4,
  },
  orderItems: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 8,
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
});
