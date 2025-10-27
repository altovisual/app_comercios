import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants';
import { useStore } from '../../context/StoreContext';
import { getDeviceType } from '../../utils/responsive';
import { Card, Button, EmptyState } from '../../components';

export default function MenuScreen() {
  const { products, loadMockProducts, toggleProductAvailability } = useStore();
  const [deviceType, setDeviceType] = useState(getDeviceType());

  useEffect(() => {
    if (products.length === 0) {
      loadMockProducts();
    }
  }, []);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', () => {
      setDeviceType(getDeviceType());
    });
    return () => subscription?.remove();
  }, []);

  const isDesktop = deviceType === 'desktop';
  const numColumns = isDesktop ? 2 : 1;

  const renderProduct = ({ item }) => (
    <Card style={[styles.productCard, numColumns > 1 && styles.productCardGrid]}>
      <View style={styles.productContent}>
        {/* Product Image/Emoji */}
        <View style={styles.productImageContainer}>
          <Text style={styles.productEmoji}>{item.image}</Text>
          {!item.isAvailable && (
            <View style={styles.unavailableBadge}>
              <Text style={styles.unavailableText}>No disponible</Text>
            </View>
          )}
        </View>

        {/* Product Info */}
        <View style={styles.productInfo}>
          <View style={styles.productHeader}>
            <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
            <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
          </View>
          <Text style={styles.productDescription} numberOfLines={2}>
            {item.description}
          </Text>
          
          {/* Product Footer */}
          <View style={styles.productFooter}>
            <View style={styles.availabilityToggle}>
              <Text style={styles.availabilityLabel}>
                {item.isAvailable ? 'Disponible' : 'No disponible'}
              </Text>
              <Switch
                value={item.isAvailable}
                onValueChange={() => toggleProductAvailability(item.id)}
                trackColor={{ false: COLORS.border, true: COLORS.success }}
                thumbColor={COLORS.white}
                ios_backgroundColor={COLORS.border}
              />
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Ionicons name="create-outline" size={20} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.contentWrapper, isDesktop && styles.contentWrapperDesktop]}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Menú</Text>
            <Text style={styles.subtitle}>{products.length} producto{products.length !== 1 ? 's' : ''}</Text>
          </View>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {/* Products List */}
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          key={numColumns}
          numColumns={numColumns}
          contentContainerStyle={styles.list}
          columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : null}
          ListEmptyComponent={
            <EmptyState
              icon="restaurant-outline"
              title="No hay productos"
              description="Agrega productos a tu menú para que los clientes puedan hacer pedidos"
              actionLabel="Agregar Producto"
              onAction={() => {}}
            />
          }
        />
      </View>
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
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  list: {
    padding: 20,
    paddingTop: 0,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    gap: 16,
  },
  productCard: {
    marginBottom: 16,
    overflow: 'hidden',
  },
  productCardGrid: {
    flex: 1,
  },
  productContent: {
    flexDirection: 'row',
  },
  productImageContainer: {
    width: 100,
    height: 100,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    position: 'relative',
  },
  productEmoji: {
    fontSize: 48,
  },
  unavailableBadge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.danger,
    paddingVertical: 4,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  unavailableText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.white,
    textAlign: 'center',
  },
  productInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productHeader: {
    marginBottom: 8,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  productDescription: {
    fontSize: 13,
    color: COLORS.textLight,
    lineHeight: 18,
    marginBottom: 12,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  availabilityToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  availabilityLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
