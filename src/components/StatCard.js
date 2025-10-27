import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants';
import Card from './Card';

export default function StatCard({ 
  icon, 
  label, 
  value, 
  color = COLORS.primary,
  trend,
  trendValue,
  style 
}) {
  return (
    <Card style={[styles.card, style]}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
          <Ionicons name={icon} size={24} color={color} />
        </View>
        {trend && (
          <View style={styles.trendContainer}>
            <Ionicons 
              name={trend === 'up' ? 'trending-up' : 'trending-down'} 
              size={16} 
              color={trend === 'up' ? COLORS.success : COLORS.danger}
            />
            <Text style={[
              styles.trendText,
              { color: trend === 'up' ? COLORS.success : COLORS.danger }
            ]}>
              {trendValue}
            </Text>
          </View>
        )}
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 150,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
  },
  value: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  label: {
    fontSize: 13,
    color: COLORS.textLight,
    fontWeight: '500',
  },
});
