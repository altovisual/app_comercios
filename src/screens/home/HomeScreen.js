import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Animated,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, ORDER_STATUS } from '../../constants';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../context/OrderContext';
import { getDeviceType } from '../../utils/responsive';
import { Card, StatCard, Badge } from '../../components';

const HEADER_MAX_HEIGHT = 170;
const HEADER_MIN_HEIGHT = 80;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default function HomeScreen({ navigation }) {
  const { store, updateStore } = useAuth();
  const { orders, activeOrders, pendingCount } = useOrders();
  const [deviceType, setDeviceType] = useState(getDeviceType());
  const scrollY = useRef(new Animated.Value(0)).current;

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

  const handleToggleStoreStatus = async () => {
    const newStatus = !store?.isOpen;
    await updateStore({ isOpen: newStatus });
    Alert.alert(
      newStatus ? '¡Local Abierto!' : 'Local Cerrado',
      newStatus 
        ? 'Tu local ahora está abierto y puede recibir pedidos.'
        : 'Tu local está cerrado. No recibirás nuevos pedidos.',
      [{ text: 'OK' }]
    );
  };

  const handleNotifications = () => {
    navigation.navigate('Orders');
  };

  // Animaciones del header
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -(HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT)],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.7, 0],
    extrapolate: 'clamp',
  });

  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp',
  });

  const headerScale = scrollY.interpolate({
    inputRange: [-50, 0],
    outputRange: [1.05, 1],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <Animated.ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, isDesktop && styles.scrollContentDesktop]}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        bounces={true}
      >
        {/* Spacer para el header */}
        <View style={{ height: HEADER_MAX_HEIGHT + 10 }} />

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
                  <TouchableOpacity 
                    style={styles.viewOrderButton}
                    onPress={() => navigation.navigate('Orders', { 
                      screen: 'OrderDetail', 
                      params: { orderId: order.id } 
                    })}
                  >
                    <Text style={styles.viewOrderButtonText}>Ver detalles</Text>
                    <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>
              </Card>
            ))}
          </View>
        )}
      </Animated.ScrollView>

      {/* Header Animado */}
      <Animated.View
        style={[
          styles.headerAnimated,
          {
            transform: [
              { translateY: headerTranslateY },
              { scale: headerScale }
            ],
          },
        ]}
      >
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <SafeAreaView style={styles.headerSafeArea}>
            {/* Header expandido */}
            <Animated.View style={[styles.headerExpanded, { opacity: headerOpacity }]}>
              <View style={styles.headerTop}>
                <View style={styles.headerLeft}>
                  <View style={styles.storeIconContainer}>
                    <Ionicons name="storefront" size={24} color={COLORS.white} />
                  </View>
                  <View style={styles.storeInfo}>
                    <Text style={styles.greeting}>¡Hola!</Text>
                    <Text style={styles.storeName} numberOfLines={1}>{store?.name || 'Mi Comercio'}</Text>
                  </View>
                </View>
                <TouchableOpacity 
                  style={styles.notificationButton}
                  onPress={handleNotifications}
                  activeOpacity={0.7}
                >
                  <Ionicons name="notifications" size={22} color={COLORS.white} />
                  {pendingCount > 0 && (
                    <View style={styles.notificationBadge}>
                      <Text style={styles.notificationBadgeText}>{pendingCount}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
              
              {/* Status bar */}
              <TouchableOpacity 
                style={styles.statusBar}
                onPress={handleToggleStoreStatus}
                activeOpacity={0.7}
              >
                <View style={styles.statusItem}>
                  <View style={[styles.statusIndicator, { 
                    backgroundColor: store?.isOpen ? '#4CAF50' : '#F44336' 
                  }]} />
                  <Text style={styles.statusLabel}>
                    {store?.isOpen ? 'Abierto ahora' : 'Cerrado'}
                  </Text>
                </View>
                <View style={styles.statusDivider} />
                <View style={styles.statusItem}>
                  <Ionicons name="time-outline" size={16} color={COLORS.white} />
                  <Text style={styles.statusLabel}>9:00 - 22:00</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>

            {/* Header compacto */}
            <Animated.View style={[styles.headerCompact, { opacity: headerTitleOpacity }]}>
              <View style={styles.compactLeft}>
                <Ionicons name="storefront" size={22} color={COLORS.white} />
                <Text style={styles.compactTitle}>{store?.name || 'Mi Comercio'}</Text>
              </View>
              <View style={[styles.compactStatus, { 
                backgroundColor: store?.isOpen ? '#4CAF50' : '#F44336' 
              }]}>
                <View style={styles.compactStatusDot} />
              </View>
            </Animated.View>
          </SafeAreaView>
        </LinearGradient>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerAnimated: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_MAX_HEIGHT,
    overflow: 'hidden',
    zIndex: 10,
  },
  headerSafeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  scrollContentDesktop: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 1200,
  },
  headerGradient: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 35,
    justifyContent: 'flex-end',
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  headerExpanded: {
    paddingBottom: 28,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  storeInfo: {
    justifyContent: 'center',
  },
  notificationButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  notificationBadge: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: COLORS.danger,
    borderRadius: 11,
    minWidth: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    borderWidth: 2.5,
    borderColor: COLORS.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  notificationBadgeText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: 'bold',
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    backdropFilter: 'blur(10px)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: 0.1,
  },
  statusDivider: {
    width: 1,
    height: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 12,
  },
  headerCompact: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 1
  },
  compactLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  compactTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: 0.2,
  },
  compactStatus: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  compactStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.white,
  },
  greeting: {
    fontSize: 13,
    color: COLORS.white,
    opacity: 0.9,
    marginBottom: 2,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  storeName: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
    color: COLORS.white,
    maxWidth: 180,
  },
  statsSection: {
    marginTop: 0,
    paddingHorizontal: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  statsGridDesktop: {
    flexWrap: 'nowrap',
  },
  statCard: {
    width: '48%',
    margin: 8,
  },
  statCardDesktop: {
    width: '23%',
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 28,
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
