import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, ORDER_STATUS } from '../../constants';
import { getDeviceType } from '../../utils/responsive';
import { Card, StatCard } from '../../components';
import { useOrders } from '../../context/OrderContext';
import { useNavigation } from '@react-navigation/native';
import { startOfDay, startOfMonth, subDays } from 'date-fns';

export default function StatsScreen() {
  const navigation = useNavigation();
  const { orders } = useOrders();
  const [deviceType, setDeviceType] = useState(getDeviceType());
  const [period, setPeriod] = useState('today');

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', () => {
      setDeviceType(getDeviceType());
    });
    return () => subscription?.remove();
  }, []);

  const isDesktop = deviceType === 'desktop';
  const isTablet = deviceType === 'tablet';

  const formatMoney = (amount) => `Bs. ${(amount || 0).toFixed(2)}`;
  const getOrderDate = (createdAt) => {
    if (!createdAt) return null;
    if (typeof createdAt?.toDate === 'function') return createdAt.toDate();
    if (typeof createdAt?.seconds === 'number') return new Date(createdAt.seconds * 1000);
    const d = new Date(createdAt);
    return Number.isNaN(d.getTime()) ? null : d;
  };

  const now = new Date();
  const periodLabel = period === 'today'
    ? 'Hoy'
    : period === 'week'
      ? 'Semana'
      : period === 'month'
        ? 'Mes'
        : 'Total';

  const periodRange = useMemo(() => {
    if (period === 'today') {
      const start = startOfDay(now);
      return { start, end: now };
    }
    if (period === 'week') {
      const start = startOfDay(subDays(now, 6));
      return { start, end: now };
    }
    if (period === 'month') {
      const start = startOfMonth(now);
      return { start, end: now };
    }
    return { start: null, end: null };
  }, [period]);

  const ordersByPeriod = useMemo(() => {
    if (period === 'all') return orders;
    return orders.filter((o) => {
      const d = getOrderDate(o.createdAt);
      if (!d) return false;
      if (!periodRange.start) return true;
      return d >= periodRange.start && d <= periodRange.end;
    });
  }, [orders, period, periodRange]);

  const deliveredOrdersByPeriod = useMemo(
    () => ordersByPeriod.filter((o) => o.status === ORDER_STATUS.DELIVERED),
    [ordersByPeriod]
  );

  const sumTotals = (list) =>
    list.reduce((sum, o) => sum + (typeof o.total === 'number' ? o.total : Number(o.total || 0)), 0);

  const periodSales = useMemo(() => sumTotals(deliveredOrdersByPeriod), [deliveredOrdersByPeriod]);
  const COMMISSION_RATE = 0.02;
  const periodCommission = useMemo(() => periodSales * COMMISSION_RATE, [periodSales]);
  const periodNet = useMemo(() => periodSales - periodCommission, [periodSales, periodCommission]);

  const todaySales = useMemo(() => {
    const start = startOfDay(now);
    const todayDelivered = orders.filter((o) => {
      const d = getOrderDate(o.createdAt);
      return d && d >= start && o.status === ORDER_STATUS.DELIVERED;
    });
    return sumTotals(todayDelivered);
  }, [orders]);

  const weekSales = useMemo(() => {
    const start = startOfDay(subDays(now, 6));
    const weekDelivered = orders.filter((o) => {
      const d = getOrderDate(o.createdAt);
      return d && d >= start && o.status === ORDER_STATUS.DELIVERED;
    });
    return sumTotals(weekDelivered);
  }, [orders]);

  const totalSales = useMemo(() => {
    const allDelivered = orders.filter((o) => o.status === ORDER_STATUS.DELIVERED);
    return sumTotals(allDelivered);
  }, [orders]);

  const stats = [
    { 
      label: 'Ventas Hoy', 
      value: formatMoney(todaySales), 
      icon: 'cash-outline', 
      color: COLORS.success,
      trend: todaySales > 0 ? 'up' : null,
      trendValue: todaySales > 0 ? '+12%' : null,
      onPress: () => setPeriod('today'),
    },
    { 
      label: 'Ventas Semana', 
      value: formatMoney(weekSales), 
      icon: 'trending-up-outline', 
      color: COLORS.primary,
      trend: weekSales > 0 ? 'up' : null,
      trendValue: weekSales > 0 ? '+8%' : null,
      onPress: () => setPeriod('week'),
    },
    { 
      label: 'Ventas Total', 
      value: formatMoney(totalSales), 
      icon: 'stats-chart-outline', 
      color: COLORS.secondary,
      trend: totalSales > 0 ? 'up' : null,
      trendValue: totalSales > 0 ? '+15%' : null,
      onPress: () => setPeriod('all'),
    },
    { 
      label: 'Pedidos Total', 
      value: orders.length.toString(), 
      icon: 'receipt-outline', 
      color: COLORS.info,
      trend: orders.length > 0 ? 'up' : null,
      trendValue: orders.length > 0 ? '+20%' : null,
      onPress: () => navigation.navigate('Orders', { screen: 'OrdersList', params: { initialFilter: 'all' } }),
    },
  ];

  const topProducts = useMemo(() => {
    const byProduct = new Map();
    deliveredOrdersByPeriod.forEach((order) => {
      (order.items || []).forEach((item) => {
        const name = item?.name || 'Producto';
        const qty = typeof item?.quantity === 'number' ? item.quantity : Number(item?.quantity || 1);
        const price = typeof item?.price === 'number' ? item.price : Number(item?.price || 0);
        const revenue = price * qty;
        const current = byProduct.get(name) || { name, sales: 0, revenue: 0 };
        current.sales += qty;
        current.revenue += revenue;
        byProduct.set(name, current);
      });
    });

    return Array.from(byProduct.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
      .map((p) => ({ ...p, icon: '🛒' }));
  }, [deliveredOrdersByPeriod]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={[styles.scrollContent, isDesktop && styles.scrollContentDesktop]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Estadísticas</Text>
            <Text style={styles.subtitle}>Resumen de tu negocio</Text>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsSection}>
          <View style={[styles.statsGrid, isDesktop && styles.statsGridDesktop]}>
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                icon={stat.icon}
                label={stat.label}
                value={stat.value}
                color={stat.color}
                trend={stat.trend}
                trendValue={stat.trendValue}
                onPress={stat.onPress}
                style={[styles.statCard, isDesktop && styles.statCardDesktop]}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Filtro</Text>
          <View style={styles.periodRow}>
            {[
              { key: 'today', label: 'Día' },
              { key: 'week', label: 'Semana' },
              { key: 'month', label: 'Mes' },
              { key: 'all', label: 'Todo' },
            ].map((p) => (
              <TouchableOpacity
                key={p.key}
                activeOpacity={0.7}
                onPress={() => setPeriod(p.key)}
                style={[styles.periodButton, period === p.key && styles.periodButtonActive]}
              >
                <Text style={[styles.periodButtonText, period === p.key && styles.periodButtonTextActive]}>
                  {p.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cierre {periodLabel}</Text>
          <Card>
            <View style={styles.closeRow}>
              <Text style={styles.closeLabel}>Total facturado</Text>
              <Text style={styles.closeValue}>{formatMoney(periodSales)}</Text>
            </View>
            <View style={styles.closeRow}>
              <Text style={styles.closeLabel}>Comisión (2%)</Text>
              <Text style={styles.closeValue}>{formatMoney(periodCommission)}</Text>
            </View>
            <View style={styles.closeRow}>
              <Text style={styles.closeLabel}>Neto para el local</Text>
              <Text style={[styles.closeValue, { color: COLORS.success }]}>{formatMoney(periodNet)}</Text>
            </View>
            <View style={[styles.closeRow, styles.closeRowMuted]}>
              <Text style={styles.closeMeta}>Pedidos del período</Text>
              <Text style={styles.closeMeta}>{ordersByPeriod.length}</Text>
            </View>
            <View style={[styles.closeRow, styles.closeRowMuted]}>
              <Text style={styles.closeMeta}>Pedidos entregados</Text>
              <Text style={styles.closeMeta}>{deliveredOrdersByPeriod.length}</Text>
            </View>
          </Card>
        </View>

        {/* Top Products */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Productos Más Vendidos</Text>
          <Card noPadding>
            {topProducts.length > 0 ? (
              topProducts.map((product, index) => (
                <View
                  key={index}
                  style={[
                    styles.productItem,
                    index < topProducts.length - 1 && styles.productItemBorder
                  ]}
                >
                  <View style={styles.productRank}>
                    <Text style={styles.productRankText}>#{index + 1}</Text>
                  </View>
                  <Text style={styles.productIcon}>{product.icon}</Text>
                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.productSales}>{product.sales} ventas</Text>
                  </View>
                  <View style={styles.productRevenue}>
                    <Text style={styles.productRevenueValue}>{formatMoney(product.revenue)}</Text>
                    <View style={styles.trendBadge}>
                      <Ionicons name="trending-up" size={12} color={COLORS.success} />
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyTopProducts}>
                <Ionicons name="basket-outline" size={32} color={COLORS.textLight} />
                <Text style={styles.emptyTopProductsText}>No hay ventas en este período</Text>
              </View>
            )}
          </Card>
        </View>

        {/* Performance Chart Placeholder */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rendimiento Semanal</Text>
          <Card style={styles.chartCard}>
            <View style={styles.chartPlaceholder}>
              <Ionicons name="bar-chart-outline" size={64} color={COLORS.textLight} />
              <Text style={styles.chartPlaceholderText}>Gráfico próximamente</Text>
            </View>
          </Card>
        </View>
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
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
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
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
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  periodRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  periodButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  periodButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  periodButtonTextActive: {
    color: COLORS.white,
  },
  closeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  closeRowMuted: {
    paddingTop: 2,
    paddingBottom: 2,
  },
  closeLabel: {
    fontSize: 14,
    color: COLORS.textLight,
    fontWeight: '600',
  },
  closeValue: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '700',
  },
  closeMeta: {
    fontSize: 13,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  emptyTopProducts: {
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyTopProductsText: {
    fontSize: 14,
    color: COLORS.textLight,
    fontWeight: '600',
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  productItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  productRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  productRankText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  productIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  productSales: {
    fontSize: 13,
    color: COLORS.textLight,
  },
  productRevenue: {
    alignItems: 'flex-end',
  },
  productRevenueValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.success,
    marginBottom: 4,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.success + '15',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  chartCard: {
    minHeight: 200,
  },
  chartPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  chartPlaceholderText: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 12,
  },
});
