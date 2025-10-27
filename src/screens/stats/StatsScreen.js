import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, ORDER_STATUS } from '../../constants';
import { getDeviceType } from '../../utils/responsive';
import { Card, StatCard } from '../../components';
import { useOrders } from '../../context/OrderContext';

export default function StatsScreen() {
  const { orders } = useOrders();
  const [deviceType, setDeviceType] = useState(getDeviceType());

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', () => {
      setDeviceType(getDeviceType());
    });
    return () => subscription?.remove();
  }, []);

  const isDesktop = deviceType === 'desktop';
  const isTablet = deviceType === 'tablet';

  // Calcular estadísticas reales
  const today = new Date();
  const todayOrders = orders.filter(o => {
    const orderDate = new Date(o.createdAt);
    return orderDate.toDateString() === today.toDateString();
  });

  const weekOrders = orders.filter(o => {
    const orderDate = new Date(o.createdAt);
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    return orderDate >= weekAgo;
  });

  const todaySales = todayOrders
    .filter(o => o.status === ORDER_STATUS.DELIVERED)
    .reduce((sum, order) => sum + order.total, 0);

  const weekSales = weekOrders
    .filter(o => o.status === ORDER_STATUS.DELIVERED)
    .reduce((sum, order) => sum + order.total, 0);

  const totalSales = orders
    .filter(o => o.status === ORDER_STATUS.DELIVERED)
    .reduce((sum, order) => sum + order.total, 0);

  const stats = [
    { 
      label: 'Ventas Hoy', 
      value: `$${todaySales.toFixed(2)}`, 
      icon: 'cash-outline', 
      color: COLORS.success,
      trend: todaySales > 0 ? 'up' : null,
      trendValue: todaySales > 0 ? '+12%' : null
    },
    { 
      label: 'Ventas Semana', 
      value: `$${weekSales.toFixed(2)}`, 
      icon: 'trending-up-outline', 
      color: COLORS.primary,
      trend: weekSales > 0 ? 'up' : null,
      trendValue: weekSales > 0 ? '+8%' : null
    },
    { 
      label: 'Ventas Total', 
      value: `$${totalSales.toFixed(2)}`, 
      icon: 'stats-chart-outline', 
      color: COLORS.secondary,
      trend: totalSales > 0 ? 'up' : null,
      trendValue: totalSales > 0 ? '+15%' : null
    },
    { 
      label: 'Pedidos Total', 
      value: orders.length.toString(), 
      icon: 'receipt-outline', 
      color: COLORS.info,
      trend: orders.length > 0 ? 'up' : null,
      trendValue: orders.length > 0 ? '+20%' : null
    },
  ];

  const topProducts = [
    { name: 'Hamburguesa Clásica', sales: 145, revenue: 1450, icon: '🍔' },
    { name: 'Pizza Margarita', sales: 120, revenue: 1320, icon: '🍕' },
    { name: 'Tacos al Pastor', sales: 98, revenue: 980, icon: '🌮' },
    { name: 'Sushi Roll', sales: 87, revenue: 1305, icon: '🍱' },
    { name: 'Ensalada César', sales: 76, revenue: 760, icon: '🥗' },
  ];

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
                style={[styles.statCard, isDesktop && styles.statCardDesktop]}
              />
            ))}
          </View>
        </View>

        {/* Top Products */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Productos Más Vendidos</Text>
          <Card noPadding>
            {topProducts.map((product, index) => (
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
                  <Text style={styles.productRevenueValue}>${product.revenue}</Text>
                  <View style={styles.trendBadge}>
                    <Ionicons name="trending-up" size={12} color={COLORS.success} />
                  </View>
                </View>
              </View>
            ))}
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
