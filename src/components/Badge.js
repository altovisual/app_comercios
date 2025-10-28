import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants';

export default function Badge({ 
  label, 
  variant = 'primary', 
  size = 'medium',
  style 
}) {
  // Validar variant
  const validVariant = styles[variant] ? variant : 'neutral';
  const validSize = styles[size] ? size : 'medium';
  
  return (
    <View style={[
      styles.badge,
      styles[validVariant],
      styles[validSize],
      style,
    ]}>
      <Text style={[
        styles.text,
        styles[`${validVariant}Text`],
        styles[`${validSize}Text`],
      ]}>
        {label || ''}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  // Variants
  primary: {
    backgroundColor: COLORS.primary + '20',
  },
  success: {
    backgroundColor: COLORS.success + '20',
  },
  warning: {
    backgroundColor: COLORS.warning + '20',
  },
  danger: {
    backgroundColor: COLORS.danger + '20',
  },
  info: {
    backgroundColor: COLORS.info + '20',
  },
  neutral: {
    backgroundColor: COLORS.border,
  },
  // Sizes
  small: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  medium: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  large: {
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  // Text styles
  text: {
    fontWeight: '600',
  },
  primaryText: {
    color: COLORS.primary,
  },
  successText: {
    color: COLORS.success,
  },
  warningText: {
    color: COLORS.warning,
  },
  dangerText: {
    color: COLORS.danger,
  },
  infoText: {
    color: COLORS.info,
  },
  neutralText: {
    color: COLORS.textLight,
  },
  smallText: {
    fontSize: 11,
  },
  mediumText: {
    fontSize: 12,
  },
  largeText: {
    fontSize: 14,
  },
});
