import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, ORDER_STATUS } from '../../constants';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../context/OrderContext';
import { getDeviceType } from '../../utils/responsive';
import { Card, StatCard, Badge } from '../../components';

export default function HomeScreen({ navigation }) {
  const { store } = useAuth();
  const { orders, activeOrders, pendingCount } = useOrders();
  const [deviceType, setDeviceType] = useState(getDeviceType());

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', () => {
      setDeviceType(getDeviceType());
    });
    return () => subscription?.remove();
  }, []);

  const isDesktop = deviceType === 'desktop';
  const isTablet = deviceType === 'tablet';

  const todayOrders = orders.filter(o => {
    const orderDate = new Date(o.createdAt);
    const today = new Date();
    return orderDate.toDateString() === today.toDateString();
  });

  const todaySales = todayOrders
    .filter(o => o.status === ORDER_STATUS.DELIVERED)
    .reduce((sum, order) => sum + order.total, 0);

  const completedToday = todayOrders.filter(o => o.status === ORDER_STATUS.DELIVERED).length;

  const quickActions = [
    { 
      icon: 'receipt', 
      label: 'Pedidos', 
      color: COLORS.primary,
      screen: 'Orders',
      badge: activeOrders.length > 0 ? activeOrders.length : null
    },
    { 
      icon: 'restaurant', 
      label: 'Menú', 
      color: COLORS.success,
      screen: 'Menu'
    },
    { 
      icon: 'stats-chart', 
      label: 'Estadísticas', 
      color: COLORS.info,
      screen: 'Stats'
    },
    { 
      icon: 'settings', 
      label: 'Ajustes', 
      color: COLORS.textLight,
      screen: 'Settings'
    },
  ];

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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, isDesktop && styles.scrollContentDesktop]}
      >
        {/* Header con gradiente */}
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>Hola 👋</Text>
              <Text style={styles.storeName}>{store?.name || 'Mi Comercio'}</Text>
            </View>
            <TouchableOpacity style={styles.storeStatusBadge}>
              <View style={[styles.statusDot, { 
                backgroundColor: store?.isOpen ? COLORS.success : COLORS.danger 
              }]} />
              <Text style={styles.statusText}>
                {store?.isOpen ? 'Abierto' : 'Cerrado'}
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Stats Cards */}
        <View style={styles.statsSection}>
          <View style={[styles.statsGrid, isDesktop && styles.statsGridDesktop]}>
            <StatCard
              icon="receipt-outline"
              label="Pedidos Activos"
              value={activeOrders.length.toString()}
              color={COLORS.primary}
              trend={activeOrders.length > 5 ? 'up' : null}
              trendValue="+12%"
              style={[styles.statCard, isDesktop && styles.statCardDesktop]}
            />
            <StatCard
              icon="time-outline"
              label="Pendientes"
              value={pendingCount.toString()}
              color={COLORS.warning}
              style={[styles.statCard, isDesktop && styles.statCardDesktop]}
            />
            <StatCard
              icon="checkmark-done-outline"
              label="Completados Hoy"
              value={completedToday.toString()}
              color={COLORS.success}
              trend="up"
              trendValue="+8%"
              style={[styles.statCard, isDesktop && styles.statCardDesktop]}
            />
            <StatCard
              icon="cash-outline"
              label="Ventas del Día"
              value={`$${todaySales.toFixed(2)}`}
              color={COLORS.secondary}
              trend="up"
              trendValue="+15%"
              style={[styles.statCard, isDesktop && styles.statCardDesktop]}
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          <View style={[styles.actionsGrid, isDesktop && styles.actionsGridDesktop]}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.actionCard,
                  isDesktop && styles.actionCardDesktop,
                  !isDesktop && styles.actionCardMobile
                ]}
                onPress={() => action.screen && navigation.navigate(action.screen)}
                activeOpacity={0.7}
              >
                <View style={styles.actionContent}>
                  <View style={[styles.actionIconContainer, { backgroundColor: action.color + '15' }]}>
                    <Ionicons name={action.icon} size={isDesktop ? 28 : 24} color={action.color} />
                    {action.badge && (
                      <View style={styles.actionBadge}>
                        <Text style={styles.actionBadgeText}>{action.badge}</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.actionTextContainer}>
                    <Text style={[styles.actionLabel, !isDesktop && styles.actionLabelMobile]}>{action.label}</Text>
                    {!isDesktop && action.badge && (
                      <Text style={styles.actionSubtext}>{action.badge} nuevo{action.badge > 1 ? 's' : ''}</Text>
                    )}
                  </View>
                </View>
                {!isDesktop && <Ionicons name="chevron-forward" size={18} color={COLORS.textLight} style={styles.chevron} />}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Active Orders */}
        {activeOrders.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Pedidos Activos</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Orders')}>
                <Text style={styles.seeAllText}>Ver todos</Text>
              </TouchableOpacity>
            </View>
            {activeOrders.slice(0, 3).map((order) => (
              <Card key={order.id} style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <View style={styles.orderHeaderLeft}>
                    <Text style={styles.orderId}>#{order.id.slice(-6)}</Text>
                    <Badge 
                      label={order.status} 
                      variant={getStatusVariant(order.status)}
                      size="small"
                    />
                  </View>
                  <Text style={styles.orderTime}>
                    {new Date(order.createdAt).toLocaleTimeString('es-ES', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </Text>
                </View>
                <View style={styles.orderBody}>
                  <View style={styles.orderCustomer}>
                    <Ionicons name="person-circle-outline" size={20} color={COLORS.textLight} />
                    <Text style={styles.customerName}>{order.user.name}</Text>
                  </View>
                  <Text style={styles.orderItems}>
                    {order.items.length} producto{order.items.length > 1 ? 's' : ''}
                  </Text>
                </View>
                <View style={styles.orderFooter}>
                  <Text style={styles.orderTotal}>${order.total.toFixed(2)}</Text>
                  <TouchableOpacity style={styles.viewOrderButton}>
                    <Text style={styles.viewOrderButtonText}>Ver detalles</Text>
                    <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>
              </Card>
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
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  scrollContentDesktop: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 1200,
  },
  headerGradient: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 80,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 16,
    color: COLORS.white,
    opacity: 0.9,
    marginBottom: 4,
  },
  storeName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  storeStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
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
    color: COLORS.white,
  },
  statsSection: {
    marginTop: -60,
    paddingHorizontal: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  statsGridDesktop: {
    flexWrap: 'nowrap',
  },
  statCard: {
    width: '48%',
    margin: 6,
  },
  statCardDesktop: {
    width: '23%',
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  seeAllText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.primary,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 0,
    marginTop: 12,
  },
  actionsGridDesktop: {
    flexWrap: 'nowrap',
  },
  actionCard: {
    width: '48%',
    margin: 8,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  actionCardMobile: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 6,
    marginHorizontal: 0,
  },
  actionCardDesktop: {
    width: '23%',
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  actionTextContainer: {
    marginLeft: 14,
    flex: 1,
  },
  actionBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: COLORS.danger,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  actionBadgeText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: 'bold',
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
  actionLabelMobile: {
    fontSize: 15,
    textAlign: 'left',
  },
  actionSubtext: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 2,
  },
  chevron: {
    marginLeft: 8,
    opacity: 0.5,
  },
  orderCard: {
    marginBottom: 12,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  orderId: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  orderTime: {
    fontSize: 13,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  orderBody: {
    marginBottom: 12,
  },
  orderCustomer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  customerName: {
    fontSize: 15,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  orderItems: {
    fontSize: 13,
    color: COLORS.textLight,
    marginLeft: 28,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  orderTotal: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  viewOrderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewOrderButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
});
